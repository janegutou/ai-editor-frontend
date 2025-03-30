import { useState, useEffect, useCallback, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin"; 
import { HeadingNode } from "@lexical/rich-text"; 
import { ListItemNode, ListNode } from "@lexical/list"; 
import Toolbar from "./Toolbar";
import { debounce, last, set } from "lodash";


const apiUrl = import.meta.env.VITE_API_URL;

const theme = {
  heading: {
    h1: "editor-h1",
    h2: "editor-h2",
    h3: "editor-h3",
  },
  text: {
    bold: "editor-bold",
    italic: "editor-italic",
    underline: "editor-underline",
    strikethrough: "editor-strikethrough",
  },
  list: {
    ol: "editor-list-ol",
    ul: "editor-list-ul",
  },
  paragraph: "editor-paragraph",
};

function onError(error) {
  console.error(error);
}

const initialConfig = {
  namespace: "MyEditor",
  theme,
  onError,
  nodes: [HeadingNode, ListNode, ListItemNode], 
};


const EditorContainer = ({userOptions, toggleCustomize}) => {

  const LOCAL_STORAGE_KEY = "editorContent"; // temporary storage key

  const [editor] = useLexicalComposerContext();
  const [editorContent, setEditorContent] = useState("");
  const [messageStatus, setMessageStatus] = useState({ type: "info", text: "" });  // 初始化有一个空白占位\u00A0

  const lastSavedRef = useRef(0); // use ref to keep the latest value in memory
  const isLoadedRef = useRef(false); // use ref to keep the latest value in memory


  const messageTypeToColor = { // define the message type mapping to colors
    loading: "text-blue-700 bg-blue-100",
    success: "text-green-700 bg-green-100",
    error: "text-red-700 bg-red-100",
    warning: "text-yellow-700 bg-yellow-100",
    info: "text-gray-700 bg-gray-100",
  };

  const animationClass = (type) => { // define the animation class for message show up
    if (type === "loading") {
      return "animate-pulse";
    } else {
      return "animate-fade-in animate-duration-300";
    }
  };


  let timer = null; // use a timer to clear prev message
  const showMessage = (type, text="", duration = 4000) => {
    // clear prev timeout
    clearTimeout(timer);
    
    // set new message
    setMessageStatus({ type, text });
    //console.log(messageStatus)

    if (duration) {
      timer = setTimeout(() => {
        setMessageStatus({ type: "info", text: "" });
      }, duration);
    }
  };
    
  const onChange = useCallback(debounce((editorState) => { //shorttime storage: save editor state (WIP version) to local storage every 1s
    editorState.read(() => {
      const content = JSON.stringify(editorState) // convert editor state type (ob) to string for local storage
      setEditorContent(content);
      localStorage.setItem(LOCAL_STORAGE_KEY, content); // save to local storage
    });
  }, 1000), [editor]);
  
  const loadDocument = async () => { // load document from DB and set it into editor, also save it to local storage
    let savedContent = null;
    showMessage("loading", "Loading document...", 0);
    const token = localStorage.getItem("supabaseToken");
  
    try {
      const response = await fetch(`${apiUrl}/get_document`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }

      const data = await response.json();
      savedContent = data.content;
      showMessage("success", "Document loaded");
      localStorage.setItem(LOCAL_STORAGE_KEY, savedContent); // 同步本地缓存
    } catch (error) {
      showMessage("error", "Could not load document from server");
      //savedContent = localStorage.getItem(LOCAL_STORAGE_KEY); // 不再尝试加载本地缓存
      throw error;
    }
  
    if (savedContent) { // if there is content retrieved from server, load it into editor
      const parsedContent = editor.parseEditorState(JSON.parse(savedContent)); // convert back to editor state
      editor.update(() => {
        editor.setEditorState(parsedContent);
      });
    } else {
      console.log("no content")
    }
  };

  const saveDocument = async (content) => {  // save document (the local storaged one??) to DB

    const token = localStorage.getItem("supabaseToken");
    if (!token || content.length === 0) return; // if no token or content is empty, do nothing

    //console.log("sending content:", content);
    //console.log("sending content type:", typeof content);
    try {
      const response = await fetch(`${apiUrl}/save_document`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          "content": content}),
      });
      
      if (response.ok) {
        console.log("Document saved to server.");
        lastSavedRef.current = content.length; // update last saved content
        return true;
      }
      throw new Error("Save failed");
    } catch (error) {
      showMessage("error", "Could not save document to server");
    }
  };

  const loadAndSetFlag = async () => {
    try {
      await loadDocument();  // if here throw any error, won't execute the following code
      isLoadedRef.current = true;
      //console.log("Document is loaded, isloaded flag is true.");
    } catch (error) {
      //console.error("Document is not loaded, isloaded flag is false:", error);
      isLoadedRef.current = false;
    }
  };
  
  const debouncedLoad = useRef(debounce(loadAndSetFlag, 5000)).current // debounce to prevent too many loading requests; use ref to keep the latest function in memory

  const handleSave = () => {
    if (isLoadedRef.current) {
      const content = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (content.length !== lastSavedRef.current) { // compare with last saved content to avoid unnecessary save
        saveDocument(content);
      } 
      //else {
      //  console.log("Document is already saved. Do not need to save again.");
      //}      
    }
  };

  useEffect(() => { // define when to load and save document

    const handleOffline = () => {
      isLoadedRef.current = false;
      showMessage("warning", "Network connection lost");
    };

    //console.log("first load");
    debouncedLoad(); // first load

    // network listerers
    window.addEventListener("online", () => {
      //console.log("reloading document as network is back");
      debouncedLoad;
    }); // if network is back, reload document
    window.addEventListener("offline", handleOffline); // if network offline, set isloaded flag to false:

    // event listeners
    window.addEventListener("beforeunload", () => {
      //console.log("beforeunload, save triggered");
      handleSave(); 
    }); 
    window.addEventListener("visibilitychange", () => { 
      if (document.visibilityState === "hidden") {
        //console.log("tab change, save triggered");
        handleSave();
      }
    }); 
    const autoSaveInterval = setInterval(() => {
      //console.log("5 minutes auto save triggered");
      handleSave();
    }, 5 * 60 * 1000); 
    
    return () => {
      handleSave(); // save document on unmount
      // clear
      window.removeEventListener("online", debouncedLoad);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeunload", handleSave);
      window.removeEventListener("visibilitychange", handleSave);
      clearInterval(autoSaveInterval);
      debouncedLoad.cancel(); // must cancel debounced function to prevent memory leak
    };
  }, [editor]); 


  return (    
    <div className="max-w-5xl mx-auto bg-white p-2 pt-8 h-[calc(100vh-6rem)] flex flex-col">      
      <Toolbar userOptions={userOptions} toggleCustomize={toggleCustomize} showMessage={showMessage}/>
      <ListPlugin /> 
      
      {/* 状态显示区 */}
      <div className={`flex items-center justify-center w-full p-2 transition-opacity text-semibold text-sm ${animationClass(messageStatus.type)}`}>
        { messageStatus.text ? <span className={`px-2 ${messageTypeToColor[messageStatus.type]}`}>{messageStatus.text}</span> : <span>{"\u00A0"}</span> }
      </div>

      <div className="relative flex-grow overflow-y-auto">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="w-full min-h-[200px] outline-none text-gray-800 text-lg leading-6 p-4" />
          }
          placeholder={<div className="absolute top-4 left-4 text-gray-400">Start writing...</div>}
        />
      </div>
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </div>
  );
};


export default function TextEditor({userOptions, toggleCustomize}) {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContainer userOptions={userOptions} toggleCustomize={toggleCustomize}/>
    </LexicalComposer>
  );
}

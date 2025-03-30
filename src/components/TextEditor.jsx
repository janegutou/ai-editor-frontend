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
import { debounce } from "lodash";


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

  const [editor] = useLexicalComposerContext();
  const [editorContent, setEditorContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const LOCAL_STORAGE_KEY = "editorContent"; // temporary storage key
  const [messageStatus, setMessageStatus] = useState({ type: "info", text: "\u00A0" });  // 初始化有一个空白占位

  const messageTypeToColor = { // define the message type mapping to colors
    loading: "text-blue-700",
    success: "text-green-700",
    error: "text-red-700",
    warning: "text-yellow-700",
    info: "text-gray-700",
  };

  const showMessage = (type, text, duration = 5000) => {
    setMessageStatus({ type, text });
    //console.log(messageStatus)
    if (duration) {
      setTimeout(() => setMessageStatus({ type: "info", text: "\u00A0" }), duration);
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
      showMessage("success", "Document loaded.");
      localStorage.setItem(LOCAL_STORAGE_KEY, savedContent); // 同步本地缓存
    } catch (error) {
      showMessage("error", "Could not load document from server. Please try again later.");
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

  const saveDocument = async () => {  // save document (the local storaged one??) to DB
    const content = localStorage.getItem(LOCAL_STORAGE_KEY);
    const token = localStorage.getItem("supabaseToken");
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
      }
    } catch (error) {
      showMessage("error", "Could not save document to server. Please check network connection.");
    }
  };

  const handleSave = useCallback(() => { // useCallback to prevent 闭包问题
    if (isLoaded) {
      console.log("save document triggered by useEffect");
      saveDocument();
    }
  }, [isLoaded]);

  const loadAndSetFlag = async () => {
    try {
      await loadDocument();  // if here throw any error, won't execute the following code
      setIsLoaded(true);
    } catch (error) {
      console.error("Document is not loaded, isloaded flag is false:", error);
      setIsLoaded(false);
    }
  };
  
  const debouncedLoad = useRef(debounce(loadAndSetFlag, 5000)).current // debounce to prevent too many loading requests; use ref to keep the latest function in memory


  useEffect(() => { // define when to load and save document

    const handleOffline = () => {
      setIsLoaded(false);
      showMessage("warning", "Network connection lost.");
    };

    debouncedLoad(); // first load

    // network listerers
    window.addEventListener("online", debouncedLoad); // if network is back, reload document
    window.addEventListener("offline", handleOffline); // if network offline, set isloaded flag to false:

    // event listeners
    window.addEventListener("beforeunload", handleSave); // save document on window close event
    window.addEventListener("visibilitychange", () => { // save document on tab change (add criteria to avoid frequent save)
      if (document.visibilityState === "hidden") handleSave();
    }); 
    const autoSaveInterval = setInterval(() => { // save every 5 minutes
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
  }, [editor, isLoaded, handleSave, debouncedLoad]);

  return (    
    <div className="max-w-5xl mx-auto bg-white p-2 pt-8 h-[calc(100vh-6rem)] flex flex-col">      
      <Toolbar userOptions={userOptions} toggleCustomize={toggleCustomize} showMessage={showMessage}/>
      <ListPlugin /> 
      
      {/* 状态显示区 */}
      <div className={`flex items-center justify-center w-full p-2 font-semibold transition-all text-sm ${messageTypeToColor[messageStatus.type]}`}>
        {messageStatus.text}
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

import { useState, useEffect, useCallback } from "react";
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
  const [saveError, setSaveError] = useState(null);
  const LOCAL_STORAGE_KEY = "editorContent"; // temporary storage key

  const onChange = useCallback(debounce((editorState) => { // will handle shorttime storage via local storage
    editorState.read(() => {
      const content = JSON.stringify(editorState) // convert editor state type (ob) to string for local storage
      setEditorContent(content);
      localStorage.setItem(LOCAL_STORAGE_KEY, content);
      //console.log("editorContent", content); // Logs text content on change
    });
  }, 1000), [editor]); // 每1秒存储一次内容到本地缓存
  
  const loadDocument = async () => {
    let savedContent = null;
    console.log("try to load document...")
    const token = localStorage.getItem("supabaseToken");
  
    try {
      const response = await fetch(`${apiUrl}/get_document`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      savedContent = data.content;
      console.log("✅ 服务器加载文档成功！");
      localStorage.setItem(LOCAL_STORAGE_KEY, savedContent); // 同步本地缓存
      setSaveError(null);
    } catch (error) {
      console.error("❌ 服务器加载文档失败", error);
      setSaveError("Could not load document from server. Please try again later.");
      //savedContent = localStorage.getItem(LOCAL_STORAGE_KEY); // 不再尝试加载本地缓存
    }
  
    if (savedContent) {
      const parsedContent = editor.parseEditorState(JSON.parse(savedContent)); // convert back to editor state
      editor.update(() => {
        editor.setEditorState(parsedContent);
        /* const parser = new DOMParser();
        const parsedContent = parser.parseFromString(savedContent, "text/html");
        const nodes = $generateNodesFromDOM(editor, parsedContent)
        $getRoot().clear();
        $getRoot().append(...nodes); */
      });
    } else {
      console.log("没有内容")
    }
  };

  const saveDocument = async () => {  // when needed save document to both local storage and server
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
        console.log("✅ 保存服务器成功！");
        setSaveError(null);
      }
    } catch (error) {
      console.error("❌ 保存服务器失败:", error);
      setSaveError("Could not save document to server. Please check network connection.");
    }
  };

  useEffect(() => {
    // load document
    const loadAndSetFlag = async () => {
      await loadDocument(); 
      setIsLoaded(true);
    };
    loadAndSetFlag();
   
    const handleSave = () => {
      if (isLoaded) {
        console.log("save document triggered by useEffect");
        saveDocument();
      }
    };

    window.addEventListener("beforeunload", handleSave); // save document on window close event
    window.addEventListener("visibilitychange", handleSave); // save document on tab change

    // save every 5 minutes
    const autoSaveInterval = setInterval(() => {
      handleSave();
    }, 5 * 60 * 1000); 
    
    return () => {
      if (isLoaded) {
        handleSave(); // save document on unmount
      };
      window.removeEventListener("beforeunload", handleSave);
      window.removeEventListener("visibilitychange", handleSave);
      clearInterval(autoSaveInterval);
    };
  }, [editor, isLoaded]);


  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6">
      {saveError && <div className="alert alert-error">{saveError}</div>}  {/** error message */}
      <Toolbar userOptions={userOptions} toggleCustomize={toggleCustomize}/>
      <ListPlugin /> 
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="w-full min-h-[200px] outline-none text-gray-900 text-lg leading-6 pt-6 p-2" />
          }
          placeholder={<div className="absolute top-6 left-2 text-gray-400">Start writing...</div>}
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

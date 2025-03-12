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
import { $getRoot } from "lexical";
import { $generateNodesFromDOM, $generateHtmlFromNodes } from "@lexical/html";
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


const EditorContainer = () => {

  const [editor] = useLexicalComposerContext();
  const [editorContent, setEditorContent] = useState("");
  const LOCAL_STORAGE_KEY = "editorContent"; // temporary storage key

  const onChange = useCallback(debounce((editorState) => { // will handle shorttime storage via local storage
    editorState.read(() => {
      //const content = $getRoot().getTextContent();
      //const content = $generateHtmlFromNodes(editor, null);
      const content = JSON.stringify(editorState)
      setEditorContent(content);
      localStorage.setItem(LOCAL_STORAGE_KEY, content);
      console.log("editorContent", content); // Logs text content on change
    });
  }, 1000), [editor]);
  
  const loadDocument = async () => {
    let savedContent = null;
    let user_id = localStorage.getItem("userId");
    console.log("try to load document...")
  
    try {
      const response = await fetch(`${apiUrl}/get_document?user_id=${user_id || ""}`);
      const data = await response.json();
      savedContent = data.content;
      user_id = data.user_id;
      localStorage.setItem(LOCAL_STORAGE_KEY, savedContent); // 同步本地缓存
      localStorage.setItem("userId", user_id); 
    } catch (error) {
      console.error("❌ 服务器加载文档失败", error);
      savedContent = localStorage.getItem(LOCAL_STORAGE_KEY); // 尝试加载本地缓存
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
    const user_id = localStorage.getItem("userId"); // get user_id from local storage
    console.log("sending content:", content)
    try {
      const response = await fetch(`${apiUrl}/save_document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          "content": content,
          "user_id": user_id }),
      });
      
      if (response.ok) {
        console.log("✅ 保存服务器成功！");
      }
    } catch (error) {
      console.error("❌ 保存服务器失败:", error);
    }
  };

  useEffect(() => {
    loadDocument(); // load document

    const handleSave = () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.log("先登录才能save");
        return;
      };
      console.log("save document triggered by useEffect");
      saveDocument();
    };

    window.addEventListener("beforeunload", handleSave); // save document on window close event
    window.addEventListener("visibilitychange", handleSave); // save document on tab change
    window.addEventListener("online", handleSave); // save document on back online event
    
    return () => {
      window.removeEventListener("beforeunload", handleSave);
      window.removeEventListener("online", handleSave);
      window.removeEventListener("visibilitychange", handleSave);
    };
  }, [editor]);


  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-4">
      <Toolbar />
      <ListPlugin /> 
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="w-full min-h-[200px] outline-none text-gray-900 text-lg leading-6 p-2" />
          }
          placeholder={<div className="absolute top-2 left-2 text-gray-400">Start writing...</div>}
        />
      </div>
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </div>
  );
};


export default function TextEditor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContainer />
    </LexicalComposer>
  );
}

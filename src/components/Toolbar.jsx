import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection, UNDO_COMMAND,  REDO_COMMAND, $createParagraphNode, $createTextNode } from "lexical";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { useCallback, useState } from "react";
import { $createHeadingNode } from '@lexical/rich-text';



const Toolbar = () => {

  const [prompt, setPrompt] = useState(""); // 用户自定义 prompt
  const [editor] = useLexicalComposerContext();

  const getIcon = (format) => {
    switch (format) {
      case 'bold':
        return <FontBoldIcon />;
      case 'italic':
        return <FontItalicIcon />;
      case 'strikethrough':
        return <StrikethroughIcon />;
      case 'underline':
        return <UnderlineIcon />;
      default:
        return null;
    }
  };

  const applyFormat = (format) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText(format);
      }
    });
  };

  const setBlock = (tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  const insertList = (listType) => {
    console.log(listType);
    editor.dispatchCommand(listType === "bullet" ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const removeList = useCallback(() => {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }, [editor]);

  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  
  const getEditorText = () => {  // 获取编辑器文本，并插入标记
    let fullText = "";
    let markedText = "";
    let startOffset = null;
    let endOffset =  null;
    let globalOffset = 0;

    editor.getEditorState().read(() => {
      const root = editor.getRootElement();
      if (root) {
        const nodes = root.childNodes;
        const selection = window.getSelection();            
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          //console.log(range);


          // iter all nodes to get full text offset 
          for (const node of nodes) {
            const nodeText = node.textContent || "";      

            if (node.contains(range.startContainer)) { // 如果选区在当前节点开始
              startOffset = globalOffset + range.startOffset;
            }
            if (node.contains(range.endContainer)) { // 如果选区在当前节点结束
              endOffset = globalOffset + range.endOffset;
            }

            //console.log(startOffset, endOffset, globalOffset);
            fullText += nodeText;
            globalOffset += nodeText.length;
          }
        }
      }
    });

    
    // 如果有选区，插入标记
    if (startOffset !== null && endOffset !== null && startOffset !== endOffset) {
      const selectedText = fullText.slice(startOffset, endOffset);
      markedText = 
        fullText.slice(0, startOffset) +
        `[[SELECTED]]${selectedText}[[/SELECTED]]` +
        fullText.slice(endOffset);
    }
    // 如果没有选区，标注光标位置
    else if (startOffset !== null && startOffset === endOffset) {
      markedText = 
        fullText.slice(0, startOffset) +
        `[[CURSOR]]` +
        fullText.slice(startOffset);
    }
    // 如果没有选区也没有光标，返回原文
    else {
      markedText = fullText;
    }

    return markedText;
  };

  const generateAIContent = async (selectedMode) => {
    // 1. 获取文本
    const contextText = getEditorText();
    //console.log(contextText);

    try {
      // 2. 向后端发送请求
      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_text: contextText, 
          selected_mode: selectedMode, 
          prompt: prompt}),
      });
      const data = await response.json();
      
      // 3. 插入生成的文本
      if (data.generated_text) {    
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            
            let node = selection.getNodes()[0];
            
            while (node && node.getType() !== "paragraph") {
              node = node.getParent(); // 确保 node 是 ParagraphNode
            }

            if (!node) {
              return;
            }
            const newParagraph = $createParagraphNode();
            const newTextNode = $createTextNode(data.generated_text);
            newParagraph.append(newTextNode);

            node.insertAfter(newParagraph);
          }
        });
      } else {
        console.log("No generated text");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.data.error);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Something went wrong");
      }
    }
  };

  const exportDocument = async () => {
    const userId = localStorage.getItem("userId") || null ;
    try {
      const response = await fetch(`http://127.0.0.1:5000/export_document?userId=${userId}`);
      if (!response.ok) {
        console.error("❌ 导出 Word 失败");
        return;
      }

      // 将文件转换为 Blob 下载
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my_document.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ 下载 Word 文件失败:", error);
    }
  };

  return (
    <div className="flex space-x-2 border-b border-gray-300 p-2 bg-gray-100 rounded-t-lg">
      {/* AI 交互部分 */}
      <div className="flex space-x-2">
        <button className="toolbar-btn" onClick={() => generateAIContent("expand")}>E</button>
        <button className="toolbar-btn" onClick={() => generateAIContent("continue")}>C</button>
      </div>

      {/* 自定义 Prompt 输入框 */}
      <textarea
        className="w-full p-2 border rounded-md"
        placeholder="custom prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* 其他文本编辑功能 */}
      <div className="flex space-x-2">
        <button className="toolbar-btn" onClick={() => applyFormat("bold")}>B</button>
        <button className="toolbar-btn" onClick={() => applyFormat("italic")}>I</button>
        <button className="toolbar-btn" onClick={() => applyFormat("underline")}>U</button>
        <button className="toolbar-btn" onClick={() => applyFormat("strikethrough")}>S</button>
        <button className="toolbar-btn" onClick={() => setBlock("h1")}>H1</button>
        <button className="toolbar-btn" onClick={() => setBlock("h2")}>H2</button>
        <button className="toolbar-btn" onClick={() => setBlock("h3")}>H3</button>
        <button className="toolbar-btn" onClick={() => insertList("bullet")}>• List</button>
        <button className="toolbar-btn" onClick={() => insertList("number")}>1. List</button>
        <button className="toolbar-btn" onClick={removeList}>Remove List</button>
        <button className="toolbar-btn" onClick={undo}>↺ Undo</button>
        <button className="toolbar-btn" onClick={redo}>↻ Redo</button>
        <button className="toolbar-btn" onClick={exportDocument}>Download</button>
      </div>
    </div>
  );
};

export default Toolbar;

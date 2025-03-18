import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection, UNDO_COMMAND,  REDO_COMMAND, $createParagraphNode, $createTextNode } from "lexical";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { useCallback, useState } from "react";
import { $createHeadingNode } from '@lexical/rich-text';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaHeading, FaListUl, FaListOl, FaUndo, FaRedo, FaDownload, FaExpand, FaPlay } from "react-icons/fa";
import { head } from "lodash";

const apiUrl = import.meta.env.VITE_API_URL;

const Toolbar = ({selectedModel}) => {

  const [prompt, setPrompt] = useState(""); // 用户自定义 prompt
  const [editor] = useLexicalComposerContext();

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
        const nodes = selection.getNodes();
        if (nodes.length > 0) {
          const blockNode = nodes[0].getParent();

          if (blockNode) {
            const blockType = blockNode.getType();
            //console.log("blockType:", blockType);  // Log block type

            if (blockType === "heading") {
              //  get the tag of the current heading
              const headingTag = blockNode.getTag(); // h1, h2, h3, etc.
            
              if (headingTag === tag) {
                $setBlocksType(selection, () => $createParagraphNode());
              } else {
                $setBlocksType(selection, () => $createHeadingNode(tag));
              }
            } else {
              // set the heading tag
              $setBlocksType(selection, () => $createHeadingNode(tag));
            }
          }
        }
      }
    });
  };

  const insertList = (listType) => {
    editor.update(() => {    
      const selection = $getSelection();
      const nodes = selection.getNodes();
  
      // Ensure there's a selection and the selected nodes are not empty
      if (nodes.length > 0) {
        const blockNode = nodes[0].getParent(); // Get the parent block node
  
        if (blockNode) {
          const blockType = blockNode.getType();
          //console.log("blockType:", blockType);  // Log block type, if list of not
          
        if (blockType === "listitem") {
          const parentListNode = blockNode.getParent();
          const parentListTag = parentListNode?.getTag(); // ol or ul

          if (parentListTag === listType) {
            // If it's already the same list type, remove the list
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            // Change the list type (bullet vs ordered)
            editor.dispatchCommand(
              listType === "ul" ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
              undefined
            );
          }
        } else {
          // If it's not a list item, insert a new list
          editor.dispatchCommand(
            listType === "ul" ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
            undefined
          );
        }
      }
    }
  });
};


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
      const token = localStorage.getItem("supabaseToken");
      const response = await fetch(`${apiUrl}/generate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_text: contextText, 
          selected_mode: selectedMode, 
          prompt: prompt, 
          model: selectedModel}),
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
        localStorage.setItem("remainingTokens", data.tokens);   // update remaining tokens to local storage
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
    const token = localStorage.getItem("supabaseToken");
    try {
      const response = await fetch(`${apiUrl}/export_document`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },        
      });
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
    <div className="flex border-b border-gray-300 p-2 bg-gray-100 h-16 overflow-x-auto sticky no-scrollbar">
      {/* AI 交互部分 */}
      <div className="flex space-x-2">
        <button className="toolbar-btn" onClick={() => generateAIContent("expand")}><FaExpand /></button>
        <button className="toolbar-btn" onClick={() => generateAIContent("continue")}><FaPlay /></button>
      </div>

      {/* 自定义 Prompt 输入框 */}
      <textarea
        className="w-full max-w-[250px] p-1 border rounded-md text-sm mr-2 ml-2"
        placeholder="custom prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="w-px bg-gray-300 mx-2"></div>

      {/* 其他文本编辑功能 */}
      <div className="flex space-x-2">
        <button className="toolbar-btn" onClick={() => applyFormat("bold")}><FaBold /></button>
        <button className="toolbar-btn" onClick={() => applyFormat("italic")}><FaItalic /></button>
        <button className="toolbar-btn" onClick={() => applyFormat("underline")}><FaUnderline /></button>
        <button className="toolbar-btn" onClick={() => applyFormat("strikethrough")}><FaStrikethrough /></button>
        <button className="toolbar-btn" onClick={() => setBlock("h1")}><FaHeading /><span className="text-xs">1</span></button>
        <button className="toolbar-btn" onClick={() => setBlock("h2")}><FaHeading /><span className="text-xs">2</span></button>
        <button className="toolbar-btn" onClick={() => insertList("ul")}><FaListUl /></button>
        <button className="toolbar-btn" onClick={() => insertList("ol")}><FaListOl /></button>
        <button className="toolbar-btn" onClick={undo}><FaUndo /></button>
        <button className="toolbar-btn" onClick={redo}><FaRedo /></button>
        <button className="toolbar-btn" onClick={exportDocument}><FaDownload /></button>
      </div>
    </div>
  );
};

export default Toolbar;

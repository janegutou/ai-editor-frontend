import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType, $patchStyleText } from '@lexical/selection';
import { $getSelection, $isRangeSelection, $getRoot, $isElementNode, UNDO_COMMAND,  REDO_COMMAND, $createParagraphNode, $createTextNode, $isTextNode, $isParagraphNode, $isRootNode, $getNearestNodeFromDOMNode, $getNodeByKey } from "lexical";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, $isListItemNode, $isListNode } from "@lexical/list";
import { $getNearestBlockElementAncestorOrThrow} from '@lexical/utils';
import { useCallback, useState, useEffect } from "react";
import { $createHeadingNode, $isQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $generateNodesFromDOM } from '@lexical/html';
import {$isDecoratorBlockNode} from '@lexical/react/LexicalDecoratorBlockNode';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaHeading, FaListUl, FaListOl, FaUndo, FaRedo, FaDownload, FaExpand, FaPlay } from "react-icons/fa";
import { FaMagic, FaFileAlt, FaChevronDown, FaEraser, FaPalette, FaFont, FaPlusCircle, FaAngleDoubleRight, FaRegLightbulb, FaLightbulb, FaRocket, FaCog, FaHighlighter } from "react-icons/fa";
import { marked } from "marked";
import { TwitterPicker, GithubPicker, CompactPicker } from "react-color";

const apiUrl = import.meta.env.VITE_API_URL;

const Toolbar = ({userOptions, toggleCustomize, showMessage}) => {
  const [editor] = useLexicalComposerContext();
  const [bgColor, setBgColor] = useState("#F8E71C"); // init yellow
  const [ftColor, setFtColor] = useState("#D0021B"); // init red
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showFtColorPicker, setShowFtColorPicker] = useState(false);
  const [bgColorPickerPosition, setBgColorPickerPosition] = useState({ top: 0, left: 0 }); // 控制背景颜色选择器的位置
  const [ftColorPickerPosition, setFtColorPickerPosition] = useState({ top: 0, left: 0 }); // 控制字体颜色选择器的位置
  const ColorPicker = CompactPicker; // 选择器组件

  const handleBgColorChange = (color) => {
    //console.log("color:", color)
    setBgColor(color.hex);
  };

  const handleFtColorChange = (color) => {
    setFtColor(color.hex);
  };

  const toggleBgColorPicker = (event) => {  // 切换背景颜色选择器的显示与隐藏 
    const rect = event.currentTarget.parentElement.firstChild.getBoundingClientRect();  // 获取按钮的位置，设置颜色选择器的位置
    setBgColorPickerPosition({ top: rect.bottom + 5, left: rect.left });
    setShowBgColorPicker((prev) => !prev);
  };

  const toggleFtColorPicker = (event) => {  // 切换字体颜色选择器的显示与隐藏 
    const rect = event.currentTarget.parentElement.firstChild.getBoundingClientRect();  // 获取按钮的位置，设置颜色选择器的位置
    setFtColorPickerPosition({ top: rect.bottom +5, left: rect.left });
    setShowFtColorPicker((prev) => !prev);
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();
        const extractedNodes = selection.extract();
  
        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }
  
        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }
            /**
             * If the selected text has one format applied
             * selecting a portion of the text, could
             * clear the format to the wrong portion of the text.
             *
             * The cleared text is based on the length of the selected text.
             */
            // We need this in case the selected text only has one format
            const extractedTextNode = extractedNodes[0];
            if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
              textNode = extractedTextNode;
            }
  
            if (textNode.__style !== '') {
              textNode.setStyle('');
            }
            if (textNode.__format !== 0) { /* if there is no format, set it to 0 */
              textNode.setFormat(0); /* clear the format */
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat(''); /* clear the block format */
            }
            //const parentBlock = textNode.getParent();
            //if (parentBlock && ($isParagraphNode(parentBlock) || $isHeadingNode(parentBlock) || $isQuoteNode(parentBlock))) {
            //  parentBlock.setFormat('');
            //}

            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
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

  const applyStyleText = (styleType) => {
    let color;
    switch (styleType) {
      case "background-color": color = bgColor; break;
      case "color": color = ftColor; break;
    }
    //console.log("Apply", styleType, "to color", color);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { [styleType]: color }); // set background color to the selected text
        
        if (styleType === "color") { // then, also set the marker color of the nearest block element ancestor if it's a list item
          const parentNode = $getNearestBlockElementAncestorOrThrow(selection.anchor.getNode());
          if (parentNode.getType() === "listitem") {
            const element = editor.getElementByKey(parentNode.__key);
            if (element) {
              element.style.setProperty('--listitem-marker-color', color);
            }
          }
        }
      }
    });
  };

  const applyAIDOMStyles = (node, editor) => {
    // this function is used to apply styles to the AI generated content's list item markers - if any
    if (node.getType() === 'listitem') {
      const element = editor.getElementByKey(node.__key);
      //console.log("element:", element);
      if (element) {
        element.style.setProperty('--listitem-marker-color', 'rgb(105, 108, 112)');
        element.style.setProperty('--listitem-marker-size', '16px'); // TBD: 16 or 14px?
      }
    }
    if (node.getChildren) { // recursively apply styles to children
      node.getChildren().forEach(child => applyAIDOMStyles(child, editor));
    }
  };

  const applyAITextStyle = (node) => {
    // this function is used to apply styles to the AI generated content's text nodes
    // including the background color, font color, and font size
    if (node.getType() === 'text') {
      node.setStyle("background-color: #F0FFF0; color: rgb(105, 108, 112); font-size: 16px"); // TBD: 16 or 14px?
    } 
    if (node.getChildren) {// recursively apply styles to children
      node.getChildren().forEach(child => applyAITextStyle(child)); 
    }
  };


  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);


  const getEditorText = () => {
    let fullText = "";
    let markedText = "";
    let startOffset = null;
    let endOffset = null;
    let globalOffset = 0;
  
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
  
      const anchor = selection.anchor;
      const focus = selection.focus;
      const isBackward = selection.isBackward();
  
      // 确定选区开始和结束的位置
      const selectionStart = isBackward ? focus : anchor;
      const selectionEnd = isBackward ? anchor : focus;
  
      // 递归遍历所有节点，并构建带格式的文本
      function traverseNodes(node) {
        if ($isTextNode(node)) {
          const nodeText = node.getTextContent();

          // 检查是否是选区开始/结束节点
          if (node === selectionStart.getNode()) {
            startOffset = globalOffset + selectionStart.offset;
          }
          if (node === selectionEnd.getNode()) {
            endOffset = globalOffset + selectionEnd.offset;
          }

          fullText += nodeText;
          globalOffset += nodeText.length;
        } 
        else if ($isListNode(node)) { // 处理列表（ul/ol）
          const children = node.getChildren();
          const listType = node.getListType(); // "bullet" | "number" | "check"
          
          for (let i = 0; i < children.length; i++) {
            const listItem = children[i];
            if ($isListItemNode(listItem)) {
              // 添加列表标记（• 或 1. 2. 3.）
              if (listType === "bullet") {
                fullText += "• ";
              } else if (listType === "number") {
                fullText += `${i + 1}. `;
              }
              globalOffset += 2; // 调整偏移量（• 和空格占2字符）

              // 递归处理列表项内容
              traverseNodes(listItem);
              
              // 每个列表项后加换行
              fullText += "\n";
              globalOffset += 1;
            }
          }
        } 
        else if ($isElementNode(node)) { // 其他元素（如段落、div）
          const children = node.getChildren();
          for (const child of children) {
            traverseNodes(child);
          }
          
          // 非列表元素后加换行（可选）
          if (!node.isInline()) {
            fullText += "\n";
            globalOffset += 1;
          }
        }
      }

      traverseNodes($getRoot());
    });

  
    // 插入标记
    if (startOffset !== null && endOffset !== null && startOffset !== endOffset) {
      const selectedText = fullText.slice(startOffset, endOffset);
      markedText = 
        fullText.slice(0, startOffset) +
        `[[SELECTED]]${selectedText}[[/SELECTED]]` +
        fullText.slice(endOffset);
    }
    else if (startOffset !== null && startOffset === endOffset) {
      markedText = 
        fullText.slice(0, startOffset) +
        `[[CURSOR]]` +
        fullText.slice(startOffset);
    }
    else {
      markedText = fullText;
    }
  
    return markedText;
  };

  const generateAIContent = async (selectedMode) => {
    showMessage("loading", "AI is generating...", 0);

    // 1. 获取文本
    const contextText = getEditorText();
    //console.log("All document text:", contextText);

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
          model: userOptions.selectedModel,
          tone: userOptions.tone,
          style: userOptions.style,
          audience: userOptions.audience,
          customer_prompt: userOptions.customerPrompt,
        }),
      });
      const data = await response.json();
      
      // 3. 插入生成的文本
      /*if (data.generated_text) {
        console.log("Generated text:", data.generated_text);
        showMessage("info"); // clear prev message
        let newParagraphKey = null;
        editor.update(
          () => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              
              let nodes = selection.getNodes(); 
              let lastParagraph = null;

              for (let node of nodes) {
                while (node && node.getType() !== "paragraph") {
                  node = node.getParent(); // 
                }
                if (node) {
                  lastParagraph = node;
                }
              }
              if (!lastParagraph) {
                return; 
              }

              // convert Markdown to html
              const markdownText = data.generated_text;
              const html = marked(markdownText);  
              const parser = new DOMParser();
              const dom = parser.parseFromString(html, "text/html");

              // convert hmtl to lexical nodes
              const markdownNodes = $generateNodesFromDOM(editor, dom);

              // wrap AI content in a paragraph
              const newParagraph = $createParagraphNode();
              newParagraphKey = newParagraph.__key; // Store the key
              markdownNodes.forEach((node) => {
                applyAITextStyle(node); // only handles node-level styling
                newParagraph.append(node);
              });

              // insert AI content after the last paragraph
              lastParagraph.insertAfter(newParagraph);
            }
          }
        );
          
        // second update: apply DOM styles to the new paragraph        
        requestAnimationFrame(() => {
          editor.update(() => {
            const newParagraph = $getNodeByKey(newParagraphKey);
            //console.log("newParagraph:", newParagraph, newParagraphKey);
            if (newParagraph) {
              newParagraph.getChildren().forEach(child => applyAIDOMStyles(child, editor));
            }
          });
        });
        
        localStorage.setItem("remainingTokens", data.tokens);   // update remaining tokens to local storage
      } */
      if (data.generated_text) {
        //console.log("Generated text:", data.generated_text);
        showMessage("info");
      
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
      
          // 1. 获取当前选区的最外层容器节点
          const anchorNode = selection.anchor.getNode();
          let container = $getNearestBlockElementAncestorOrThrow(anchorNode);
      
          // 2. 转换Markdown为Lexical节点
          const html = marked(data.generated_text);
          const parser = new DOMParser();
          const dom = parser.parseFromString(`<div>${html}</div>`, "text/html");
          const markdownNodes = $generateNodesFromDOM(editor, dom);
      
          // 3. 创建纯段落容器
          const newParagraph = $createParagraphNode();
          markdownNodes.forEach(node => {
            applyAITextStyle(node);
            newParagraph.append(node);
          });
      
          // 4. 强制插入到列表外部（关键修改）
          if ($isListNode(container) || $isListItemNode(container)) {
            // 找到列表的最外层父级
            while (container && !$isRootNode(container.getParent())) {
              container = container.getParent();
            }
            container.insertAfter(newParagraph);
          } else {
            // 普通情况直接插入
            container.insertAfter(newParagraph);
          }
      
          // 5. 聚焦到新内容
          newParagraph.selectEnd();
        });
      
        // 延迟样式应用
        requestAnimationFrame(() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.getNodes().forEach(node => {
                if ($isTextNode(node)) {
                  applyAIDOMStyles(node, editor);
                }
              });
            }
          });
        });
      
        localStorage.setItem("remainingTokens", data.tokens);
      } else {
        console.log("No generated text");
        showMessage("error", "Failed to generate content")
      }
    } catch (error) {
      console.error("Error:",error);
      showMessage("error", "Failed to generate content");
    }
  };

  const exportDocument = async () => {
    const token = localStorage.getItem("supabaseToken");
    try {
      const response = await fetch(`${apiUrl}/export_document`, {
        method: "GET",
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
    <div>
      <div className="flex border-b border-gray-300 p-2 bg-white h-14 shadow-md flex-wrap flex-wrap-reverse">
        {/* AI 交互部分 */}
        <div className="flex space-x-3">
          <button className="toolbar-btn" title="Polish the text" onClick={() => generateAIContent("polish")}>
            <FaMagic className="text-secondary w-4 h-4"/></button>
          <button className="toolbar-btn" title="Expand the text" onClick={() => generateAIContent("expand")}>
            <FaFileAlt className="text-secondary w-4 h-4"/></button>
          <button className="toolbar-btn" title="Continue writing" onClick={() => generateAIContent("continue")}>
            <FaLightbulb className="text-secondary w-4 h-4"/></button>
          <button className="toolbar-btn" title="Custom prompt" onClick={() => toggleCustomize(true)}>
            <FaCog /></button>
        </div>

        <div className="w-px bg-gray-300 mx-4"></div>

        {/* 其他文本编辑功能 */}
        <div className="flex space-x-3">
          <button className="toolbar-btn" onClick={() => applyFormat("bold")}><FaBold /></button>
          <button className="toolbar-btn" onClick={() => applyFormat("italic")}><FaItalic /></button>
          <button className="toolbar-btn" onClick={() => applyFormat("underline")}><FaUnderline /></button>
          <button className="toolbar-btn" onClick={() => applyFormat("strikethrough")}><FaStrikethrough /></button>
          <button className="toolbar-btn" onClick={() => setBlock("h1")}>
            <FaHeading /><span className="text-xs">1</span></button>
          <button className="toolbar-btn" onClick={() => setBlock("h2")}>
            <FaHeading /><span className="text-xs">2</span></button>
          <button className="toolbar-btn" onClick={() => insertList("ul")}><FaListUl /></button>
          <button className="toolbar-btn" onClick={() => insertList("ol")}><FaListOl /></button>
          
          { /* 字体颜色选择 */}
          <div className="flex flex-col items-center justify-center group">
            <div className="flex">
              <button 
                className="flex items-center justify-center text-gray-600 bg-transparent rounded-l-lg 
                  hover:bg-gray-200 active:bg-gray-300 group-hover:bg-gray-200 transition pt-1 pb-1 pl-2 pr-1" 
                onClick={() => applyStyleText("color")}><FaFont />
              </button>
              <div className="w-px bg-gray-100" />
              <button 
                className="flex items-center justify-center text-gray-600 bg-transparent rounded-r-lg 
                  hover:bg-gray-200 active:bg-gray-300 group-hover:bg-gray-200 transition pt-1 pb-1 pl-1 pr-2" 
                onClick={toggleFtColorPicker}><FaChevronDown className="w-2 h-2"/>
              </button>
            </div>
            <div className="w-8 h-1 mt-1" style={{ backgroundColor: ftColor }}></div>
          </div>

          <div className="flex flex-col items-center justify-center group">
            <div className="flex">
              <button 
                className="flex items-center justify-center text-gray-600 bg-transparent rounded-l-lg 
                  hover:bg-gray-200 active:bg-gray-300 group-hover:bg-gray-200 transition pt-1 pb-1 pl-2 pr-1" 
                onClick={() => applyStyleText("background-color")}><FaHighlighter />
              </button>
              <div className="w-px bg-gray-100" />
              <button 
                className="flex items-center justify-center text-gray-600 bg-transparent rounded-r-lg 
                  hover:bg-gray-200 active:bg-gray-300 group-hover:bg-gray-200 transition pt-1 pb-1 pl-1 pr-2" 
                onClick={toggleBgColorPicker}><FaChevronDown className="w-2 h-2"/>
              </button>
            </div>
            <div className="w-8 h-1 mt-1" style={{ backgroundColor: bgColor }}></div>
          </div>
          <button className="toolbar-btn" onClick={clearFormatting}><FaEraser /></button>
          <button className="toolbar-btn" onClick={undo}><FaUndo /></button>
          <button className="toolbar-btn" onClick={redo}><FaRedo /></button>
          <button className="toolbar-btn" onClick={exportDocument}><FaDownload /></button>
        </div>
      </div> 
      {/* 下拉颜色选择器  flex px-2 py-1 text-sm */}
      {showBgColorPicker && (
        <div className="absolute z-10 mt-2"
          style={{ top: bgColorPickerPosition.top + "px", left: bgColorPickerPosition.left + "px" }}
        >
          <ColorPicker color={bgColor} onChangeComplete={handleBgColorChange} />
        </div>
      )}

      {showFtColorPicker && (
        <div className="absolute z-10 mt-2"
          style={{ top: ftColorPickerPosition.top + "px", left: ftColorPickerPosition.left + "px" }}
        >
          <ColorPicker color={ftColor} onChangeComplete={handleFtColorChange} />
        </div>
      )}
    </div>
  );
};

export default Toolbar;

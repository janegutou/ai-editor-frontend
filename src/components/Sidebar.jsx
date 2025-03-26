import { useState } from "react";

const Sidebar = ({ userOptions, updateUserOption, toggleCustomize, isCustomizeOpen}) => {
  const [isOpen, setIsOpen] = useState(false);
  const models = ["GPT-3.5", "GPT-4o-mini", "GEMINI", "DEEPSEEK", "LLAMA3"]
  const sidebarOpen = isOpen || isCustomizeOpen;

  // 处理折叠逻辑（优先级最高）
  const toggleSidebar = () => {
    if (isOpen) {
      toggleCustomize(false); // 关闭 Customize
    }
    setIsOpen(!isOpen); // 切换 Sidebar
  };

  return (
    <div
      className={`bg-gray-200 p-4 ${sidebarOpen ? "w-80" : "w-16"} transition-all duration-300`}
    >
      {/* 折叠/展开按钮 */}
      <button className="text-gray-700 mb-4" onClick={toggleSidebar}>
        {sidebarOpen ? "←" : "→"}
      </button>

      {/* 侧边栏内容*/}
      {sidebarOpen && (
        <div className="flex flex-col">

          {/* AI Model Selection */}
          <h2 className="text-gray-700 mb-4">AI Model Selection</h2>
          <select
            className="p-2 mr-2 mb-2 bg-gray-700 text-white rounded"
            value={userOptions.selectedModel}
            onChange={(e) => updateUserOption("selectedModel", e.target.value)}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>

          {/* add a divider line */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Customize Settings */}
          <h2 
            className="text-gray-700 mb-4 mt-4 cursor-pointer"
            onClick={() => toggleCustomize()} // 切换 Customize 面板显示/隐藏
          >
            Customize Settings
          </h2>

          {/* Customize 面板内容 */}
          {isCustomizeOpen && (
            <div className="mt-2">
              {/* 口气输入框 */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600">Tone</label>
                <input
                  type="text"
                  className="w-full text-sm p-2 border rounded-md mt-1 overflow-x-auto whitespace-nowrap"
                  title="e.g., Humorous, Formal, Positive"
                  value={userOptions.tone}
                  onChange={(e) => updateUserOption("tone", e.target.value)}
                />
              </div>
              
              {/* 风格输入框 */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600">Style</label>
                <input
                  type="text"
                  className="w-full text-sm p-2 border rounded-md mt-1 overflow-x-auto whitespace-nowrap"
                  title="e.g., Concise, Creative, Detailed"
                  value={userOptions.style}
                  onChange={(e) => updateUserOption("style", e.target.value)}
                />
              </div>
              
              {/* 受众输入框 */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600">Audience</label>
                <input
                  type="text"
                  className="w-full text-sm p-2 border rounded-md mt-1 overflow-x-auto whitespace-nowrap"
                  title="e.g., Professional, Student, Informal"
                  value={userOptions.audience}
                  onChange={(e) => updateUserOption("audience", e.target.value)}
                />
              </div>
              {/* 自由文本输入框（Free Text） */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600">Custom Prompt</label>
                <input
                  type="text"
                  className="w-full p-2 text-sm border rounded-md mt-1 overflow-x-auto whitespace-nowrap"
                  title="Enter any other specific requirements here"
                  value={userOptions.customPrompt}
                  onChange={(e) => updateUserOption("customPrompt", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
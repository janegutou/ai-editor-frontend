import { useState } from "react";
import { FaList, FaTimes, FaBars } from "react-icons/fa";
import { FiCpu, FiSliders, FiCreditCard } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ userOptions, updateUserOption, toggleCustomize, isCustomizeOpen}) => {
  const [isOpen, setIsOpen] = useState(false);
  const models = ["GROK3", "GROK3-mini", "GPT-4o-mini", "GEMINI", "DEEPSEEK", "LLAMA3"]
  const sidebarOpen = isOpen || isCustomizeOpen;
  const navigate = useNavigate();

  // 处理折叠逻辑（优先级最高）
  const toggleSidebar = () => {
    if (isOpen) {
      toggleCustomize(false); // 关闭 Customize
    }
    setIsOpen(!isOpen); // 切换 Sidebar
  };

  return (
    <div
      className={`bg-sidebar p-4 ${sidebarOpen ? "w-80" : "w-16"} transition-all duration-300 `}
    >
      {/* 折叠/展开按钮 */}
      <button className="text-gray-500 mb-6 hover:bg-gray-100 p-2 rounded-lg transition-colors" onClick={toggleSidebar}>
        {sidebarOpen ? (
          <FaTimes className="w-5 h-5" />
        ) : (
          <FaBars className="w-5 h-5" />
        )}
      </button>

      {/* 侧边栏内容*/}
      {sidebarOpen && (
        <div className="flex flex-col">

          {/* AI Model Selection */}
          
          <h2 className="text-gray-700 font-medium mb-3 flex items-center hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition-colors">
            <FiCpu className="mr-2 text-green-600" /> {/* Added icon */}
            AI Model
          </h2>
          <select
            className="p-2 ml-5 mb-2 bg-secondary text-white rounded-lg"
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
          <div className="border-t border-gray-200 my-3"></div>

          {/* Customize Settings */}
          <div>
            <h2 
              className="text-gray-700 font-medium mb-3 flex items-center hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition-colors"
              onClick={() => toggleCustomize()} // 切换 Customize 面板显示/隐藏
            >
              <FiSliders className="mr-2 text-green-600" /> {/* Added icon */}
              Customize
            </h2>

            {isCustomizeOpen && (
              <div className="mt-2 space-y-4 ml-5 border-l-0 border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">TONE</label>
                  <input
                    type="text"
                    className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Humorous, Formal"
                    value={userOptions.tone}
                    onChange={(e) => updateUserOption("tone", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">STYLE</label>
                  <input
                    type="text"
                    className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Concise, Detailed"
                    value={userOptions.style}
                    onChange={(e) => updateUserOption("style", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">AUDIENCE</label>
                  <input
                    type="text"
                    className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Professionals, Students"
                    value={userOptions.audience}
                    onChange={(e) => updateUserOption("audience", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">CUSTOM PROMPT</label>
                  <input
                    type="text"
                    className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Specific requirements..."
                    value={userOptions.customPrompt}
                    onChange={(e) => updateUserOption("customPrompt", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* add a divider line */}
          <div className="border-t border-gray-200 my-3"></div>

          {/* billing information */}
          <h2 
            className="text-gray-700 font-medium mb-3 flex items-center hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition-colors"
            onClick={() => navigate("/billing")}
          >
            <FiCreditCard className="mr-2 text-green-600" />
            Billing
          </h2>

        </div>
      )}
    </div>
  );
};

export default Sidebar;
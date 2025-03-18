import { useState } from "react";

const Sidebar = ({ selectedModel, setSelectedModel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const models = ["GPT-3.5", "GPT-4o-mini", "GEMINI", "DEEPSEEK", "LLAMA3"]

  return (
    <div className={`bg-gray-200 h-screen p-4 ${isOpen ? "w-60" : "w-16"} transition-all duration-300`}>
      {/* 折叠/展开按钮 */}
      <button
        className="text-gray-700 mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "←" : "→"}
      </button>

      {/* 侧边栏内容 */}
      {isOpen && (
        <div className="flex flex-col">
          <h2 className="text-gray-700 mb-4">AI Model Selection</h2>
          <select
            className="p-2 mr-2 bg-gray-700 text-white rounded"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

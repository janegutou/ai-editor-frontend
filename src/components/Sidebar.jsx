import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <ul className="space-y-3">
          <li className="p-2 hover:bg-gray-300 rounded">Dashboard</li>
          <li className="p-2 hover:bg-gray-300 rounded">My Documents</li>
          <li className="p-2 hover:bg-gray-300 rounded">Settings</li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";


const Navbar = () => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tokens, setTokens] = useState( localStorage.getItem("remainingTokens") || null);

  const handleMenuToggle = () => {
    setTokens(localStorage.getItem("remainingTokens"));
    setMenuOpen(!menuOpen);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const hideLoginButton = ["/login", "/forgot-password"].includes(location.pathname);

  return (
    <nav className="px-6 py-2 flex justify-between items-center border-b">
      {/* 左侧 Logo + 名称 */}
      <div className="flex items-center space-x-2">
        <img src="/writyzen.png" alt="Logo" className="h-10" />
        <span className="text-lg pt-1 font-bold text-secondary">AI Writing Assistant</span>
      </div>

      {/* 右侧 登录/登出状态 */}
      <div className="relative">
        {user ? (
          <div className="flex items-center justify-between space-x-3">

            {/* 用户头像（首字母） */}
            <div className="flex items-center">
              <button
                onClick={handleMenuToggle}
                className="w-10 h-10 text-white bg-secondary hover:bg-primary flex items-center justify-center rounded-full text-lg font-bold cursor-pointer"
              >
                {user.email.charAt(0).toUpperCase()}
              </button>
            </div>

            {/* toggle 菜单 */}
            {menuOpen && (
              <div className="absolute z-50 right-0 top-full mt-2 p-2 w-56 bg-white text-gray-800 border border-gray-200 shadow-lg rounded-lg">
                
                { /* if too long email, add ellipsis */}
                <div className="px-4 py-2 text-sm text-gray-700 truncate">
                  {user.email} 
                </div>
                
                
                <div className="px-4 py-2 text-sm text-gray-700">
                  {tokens && <p>Tokens: {tokens}</p>} 
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-200"
                >
                  <FaSignOutAlt className="mr-2" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          !hideLoginButton && (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-2xl text-white font-bold bg-secondary hover:bg-primary"
            >
              Log In
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;

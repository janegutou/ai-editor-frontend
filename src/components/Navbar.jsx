import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { BiUser, BiLogOut, BiCube, BiCoinStack, BiMessageDetail } from "react-icons/bi";
import { Link, useNavigate, useLocation } from "react-router-dom";


const Navbar = () => {
  const { user, signOut } = useAuth();
  const isAdmin = user?.role === "admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const [tokens, setTokens] = useState( localStorage.getItem("remainingTokens") || null);

  const handleMenuToggle = () => {
    setTokens(Number(localStorage.getItem("remainingTokens")).toLocaleString());
    setMenuOpen(!menuOpen);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const hideLoginButton = ["/login", "/forgot-password"].includes(location.pathname);

  return (
    <nav className="px-6 py-2 flex justify-between items-center border-b">
      {/* 左侧 Logo + 名称 + click direct to home */}
      <div className="flex items-center space-x-2">
        <Link to = "/">
          <img src="/writyzen.png" alt="Logo" className="h-10" />
        </Link> 
        < Link to = "/">
          <span className="text-lg pt-1 font-bold text-secondary">AI Writing Assistant</span>   
        </Link>
      </div>

      {/* 中间导航栏 */}
      <div className="hidden md:flex items-center space-x-6 ml-auto pr-16">
        {isAdmin && (
          <Link to="/admin" className="text-gray-600 hover:text-secondary text-md font-bold">Admin Panel</Link>
        )}
        <Link to="/editor" className="text-gray-600 hover:text-secondary text-md font-bold">Workspace</Link>
        <Link to="/pricing" className="text-gray-600 hover:text-secondary text-md font-bold">Pricing</Link>
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
              <div className="absolute z-50 right-0 top-full mt-2 p-2 w-60 bg-white text-gray-600 border border-gray-200 shadow-lg rounded-lg">
                             
                <button
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-200 rounded-lg"
                >
                  <BiUser className="flex-shrink-0 mr-3 h-5 w-5" />  
                  <p className="truncate">{user.email}</p>
                </button>
                
                <button
                  onClick={() => navigate("/billing")}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-200 rounded-lg"
                >
                  <BiCoinStack className="flex-shrink-0 mr-3 h-5 w-5" />
                  <p className="truncate">{tokens}</p>
                </button>

                <button
                  onClick={() => navigate("/feedback")}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-200 rounded-lg"
                >
                  <BiMessageDetail className="flex-shrink-0 mr-3 h-5 w-5" />
                  Feedback
                </button>

                <hr className="my-1" />

                <button
                  onClick={signOut}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-200 rounded-lg"
                >
                  <BiLogOut className="flex-shrink-0 mr-3 h-5 w-5" />
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

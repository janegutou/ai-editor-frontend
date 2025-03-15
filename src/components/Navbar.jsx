import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const { user, signInWithGithub, signOut } = useAuth();
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      {/* 左侧 Logo + 名称 */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <span className="text-lg font-semibold">AI Writing Assistant</span>
      </div>

      {/* 右侧 登录/登出状态 */}
      <div>
        {user ? (
          <div className="flex items-center space-x-3">
            <span>{user.email}</span>
            <button
              onClick={signOut}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGithub}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
          >
            Login with GitHub
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

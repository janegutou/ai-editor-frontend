import { useAuth } from "./context/AuthProvider"
import EditorContainer from "./components/TextEditor";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";


function App() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      {/* 导航栏（顶部固定） */}
      <Navbar />

      {/* 主体部分（Sidebar + Editor） */}
      <div className="flex flex-1">
        {user && <Sidebar />}
        <div className="flex-1 p-6">
          {user ? <EditorContainer /> : <p className="text-center text-lg">Please login to continue.</p>}
        </div>
      </div>
    </div>
  );
}

export default App;

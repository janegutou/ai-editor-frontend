import { useAuth } from "./context/AuthProvider"
import EditorContainer from "./components/TextEditor";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useState } from "react";


function App() {
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState("LLAMA3");

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar selectedModel={selectedModel} setSelectedModel={setSelectedModel} /> 

        <div className="flex-1 p-6">
          {user 
            ? <EditorContainer selectedModel={selectedModel} /> 
            : <p className="text-center text-lg">Please login to continue.</p>}
        </div>
      </div>
    </div>
  );
}

export default App;

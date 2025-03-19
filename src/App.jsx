import { useAuth } from "./context/AuthProvider"
import TextEditor from "./components/TextEditor";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useState } from "react";


function App() {
  const { user } = useAuth();
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const toggleCustomize = (state) => {
    setIsCustomizeOpen((prev) => (state !== undefined ? state : !prev));
  }; 

  const [userOptions, setUserOptions] = useState({
    selectedModel: "LLAMA3",
    tone: "",
    style: "",
    audience: "",
    customerPrompt: ""
  });

  // 更新状态的函数
  const updateUserOption = (key, value) => {
    setUserOptions((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar 
          userOptions={userOptions}
          updateUserOption={updateUserOption}
          toggleCustomize={toggleCustomize}
          isCustomizeOpen={isCustomizeOpen}
        /> 

        <div className="flex-1 p-6">
          {user 
            ? <TextEditor userOptions={userOptions} toggleCustomize={toggleCustomize}/> 
            : <p className="text-center text-lg">Please login to continue.</p>}
        </div>
      </div>
    </div>
  );
}

export default App;

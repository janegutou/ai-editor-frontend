import { useAuth } from "./context/AuthProvider"
import TextEditor from "./components/TextEditor";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Langding from "./components/Landing";
import { useState } from "react";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


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

  const updateUserOption = (key, value) => {
    setUserOptions((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen font-sans"> 
        <Navbar />

        <Routes>
          {/* landing page */}
          <Route path="/" element={<Langding />} />

          {/* login pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* editor page */}
          <Route path="/editor" element={
            user ? (
              <div className="flex flex-1">
                <Sidebar 
                  userOptions={userOptions}
                  updateUserOption={updateUserOption}
                  toggleCustomize={toggleCustomize}
                  isCustomizeOpen={isCustomizeOpen}
                /> 
                <div className="flex-1 px-6">
                  <TextEditor userOptions={userOptions} toggleCustomize={toggleCustomize}/>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

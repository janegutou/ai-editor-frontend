import { useAuth } from "./context/AuthProvider"
import TextEditor from "./components/TextEditor";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Langding from "./pages/Landing";
import Pricing from "./pages/Pricing";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";


function App() {
  const location = useLocation();
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
    <div className="flex flex-col h-screen font-sans"> 
      <Navbar />

      <Routes>
        {/* landing page */}
        <Route path="/" element={<Langding />} />

        {/* other pages */ }          
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

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

      {location.pathname !== "/editor" && <Footer />}
    </div>
  );
}

export default App;

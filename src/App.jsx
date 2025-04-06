import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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
import Billing from "./pages/Billing";
import Unauthorized from "./pages/Unauthorized";



function App() {
  const location = useLocation();
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
        {/* public pages */}
        <Route path="/" element={<Langding />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* needs login */}
        <Route element={<ProtectedRoute />}>
                    
          <Route path="/billing" element={<Billing />} />
          {/* editor page */}
          <Route path="/editor" element={
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
          } />
        </Route>

        {/* administator pages */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<div>Admin Page Placeholder</div>} />
        </Route>



      </Routes>

      {location.pathname !== "/editor" && <Footer />}
    </div>
  );
}

export default App;

import { use, useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { set } from "lodash";


const Login = () => {
  const { user, signInWithGithub, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle for sign-up and login
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!email || !password) return;

    setErrorMessage("");

    if (isSignUp) {  // Sign up with email and password
      const { user, error } = await signUpWithEmail(email, password);
      if (error) {
        setErrorMessage(error);
      } else {
        console.log("User signed up:", user);
      }
    } else {   // Sign/log in with email and password
      const { user, error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMessage(error);
      } else {
        console.log("User logged in:", user);
      }
    }
  };


  useEffect(() => {
    if (user) {
      console.log("User logged in, navigating to /editor"); // Debug log
      navigate("/editor");
    }
  }, [user, navigate]);


  return (
    <div className="flex flex-grow flex-col items-center justify-center">
        <div className="flex flex-col space-y-4 p-10 border rounded-2xl max-w-lg w-full mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">{isSignUp ? "Sign up" : "Log in"}</h2>

            {/* GitHub Login */}
            <button
                onClick={signInWithGithub}
                className="w-full h-12 bg-gray-700 hover:bg-gray-600 text-white mt-4 p-2 rounded-xl"
            >
                Continue with GitHub
            </button>

            {/* Google Login Placeholder */}
            <button
                className="w-full h-12 bg-gray-400 hover:bg-gray-400 text-white mt-4 p-2 rounded-xl"
            >
                Continue with Google (to be implemented)
            </button>

            {/* divider */}
            <div className="flex items-center my-4">
                <hr className="flex-1 m-4"/>
                <span className="text-12 text-gray-500 font-bold">OR</span>
                <hr className="flex-1 m-4"/>
            </div>
            
            {/* Email and Password Sign-up/Login Form */}
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded-xl h-12"
            />
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded-xl h-12 mt-4"
            />
            <button
                onClick={handleSubmit}
                className={`w-full h-12 bg-blue-500 hover:bg-blue-400 mt-4 text-white p-2 rounded-xl ${(!email || !password) && "opacity-50 cursor-not-allowed"}`}
                disabled={!email || !password}
            >
                Continue
            </button>

            {/* Error Message */} 
              <div className="mt-4 text-center font-bold text-red-500">
                <p>{errorMessage || "\u00A0"}</p>
              </div>
            

            {/* Forgot Password Link */}
            <div className="mt-4">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Toggle between Sign-Up and Login */}
            <div className="flex mt-4 pb-2 text-sm text-gray-500">
              <span>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-500 hover:underline"
                >
                  {isSignUp ? "Log in" : "Sign up"}
                </button>
              </span>
            </div>

        </div>
        
        <div className="h-24"></div>
    </div>
  );
};

export default Login

import { useState } from 'react';
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) return;

    const { message, error } = await resetPassword(email);
    if (error) {
      console.error("Reset password error:", error);
    } else {
      setShowResetPassword(false);
      console.log("Password reset email sent:", message);
    }
  };


  return (
    <div className="flex flex-grow flex-col items-center justify-center">
        <div className="flex flex-col space-y-4 p-10 border rounded-2xl max-w-lg w-full mx-auto">
          
          <h2 className="text-2xl font-bold text-center mb-2">Reset Your Password</h2>
          
          <p className="text-center text-gray-500 mb-4">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded-xl h-12"
          />

          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            onClick={handleResetPassword}
            className="w-full h-12 bg-red-500 hover:bg-red-400 text-white p-2 rounded-xl"
          >
            Send Reset Link
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full h-12 bg-gray-500 hover:bg-gray-400 text-white p-2 rounded-xl"
          >
            Back to Login
          </button>
        </div>
        <div className="h-24"></div>
    </div>
  );
};

export default ForgotPassword;

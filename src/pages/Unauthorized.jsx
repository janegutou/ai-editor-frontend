import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">403 - Unauthorized</h1>
        <p>You don't have permission to access this page.</p>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }
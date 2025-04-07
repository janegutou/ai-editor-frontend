import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ adminOnly = false}) => {
  const location = useLocation();
  const { user } = useAuth();

  // 等待用户信息检查
  if (user === null) { // first time loading
    const token = localStorage.getItem("supabaseToken");
    if (token) { // probably logged in, but need to check, so waiting for the checking
      return <LoadingSpinner />; 
    } else { // not logged in, redirect to login page
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // 未登录
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 管理员权限检查
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // 放行
  return <Outlet />;
};

export default ProtectedRoute;

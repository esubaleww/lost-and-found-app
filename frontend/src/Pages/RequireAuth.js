import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Pages/AuthContext";

const RequireAuth = ({ allowedRoles }) => {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;

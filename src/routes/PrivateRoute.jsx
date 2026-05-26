import { Navigate, Outlet } from "react-router-dom";

/**
 * Protects routes that require authentication.
 * Redirects unauthenticated users to /login.
 */
function PrivateRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;

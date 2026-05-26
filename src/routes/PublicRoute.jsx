import { Navigate, Outlet } from "react-router-dom";

/**
 * Accessible only to unauthenticated users (e.g. login, register).
 * Redirects already-authenticated users to the dashboard.
 */
function PublicRoute() {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/user-dashboard" replace /> : <Outlet />;
}

export default PublicRoute;

import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function PrivateRoute() {
  const { user, initializing, authError } = useAuth();
  const location = useLocation();
  if (initializing) return <p className="page" role="status">Checking your session...</p>;
  if (authError) return <p className="errorbox" role="alert">{authError}</p>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
}

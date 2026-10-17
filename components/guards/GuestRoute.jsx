import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function GuestRoute() {
  const location = useLocation();
  const from = location.state?.from;
  const destination = typeof from === "string" && from.startsWith("/") && !from.startsWith("//") && !from.startsWith("/login") && !from.startsWith("/register") ? from : "/posts";
  const { user, initializing } = useAuth();
  if (initializing) return <p className="page" role="status">Checking your session...</p>;
  return user ? <Navigate to={destination} replace /> : <Outlet />;
}

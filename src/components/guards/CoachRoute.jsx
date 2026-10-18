import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function CoachRoute() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return <p className="page" role="status">Checking session...</p>;
  }

  if (error) {
    return <p className="page" role="alert">{error}</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.user_metadata?.role === "Coach"
    ? <Outlet />
    : <Navigate to="/posts" replace />;
}
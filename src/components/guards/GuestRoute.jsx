import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function GuestRoute() {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  const from = location.state?.from;
  const destination =
    typeof from === "string" &&
    from.startsWith("/") &&
    !from.startsWith("//") &&
    !/^\/(login|register)(\/|[?#]|$)/.test(from)
      ? from
      : "/posts";

  if (loading) {
    return <p className="page" role="status">Checking session...</p>;
  }

  if (error) {
    return <p className="page" role="alert">{error}</p>;
  }

  return user ? <Navigate to={destination} replace /> : <Outlet />;
}
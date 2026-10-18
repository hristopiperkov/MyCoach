import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <p className="page" role="status">
        Checking session...
      </p>
    );
  }

  if (error) {
    return (
      <p className="page" role="alert">
        {error}
      </p>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  return <Outlet />;
}
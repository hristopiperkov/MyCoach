import useToast from "../../hooks/useToast";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import supabase from "../../supabase";

export default function Navigation({ compact = false }) {
  const toast = useToast();
  const { user, loading, error: authError } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);


  const navigate = useNavigate();

  const activeClass = ({ isActive }) =>
    isActive ? "selected" : "";

  async function handleLogout() {
    if (loggingOut) return;


    setLoggingOut(true);

    try {
      if (!supabase) {
        throw new Error("Supabase is not configured.");
      }

      const { error: logoutError } = await supabase.auth.signOut({
        scope: "local",
      });

      if (logoutError) {
        throw logoutError;
      }

      toast.success("You are logged out.");
      navigate("/posts", { replace: true });
    } catch (err) {
      toast.error(err.message || "Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="site-navigation" aria-label="Main navigation">
      <NavLink to="/posts" end className={activeClass}>
        Community
      </NavLink>

      <NavLink to="/coaches" className={activeClass}>
        Coaches
      </NavLink>

      {!loading && user && !compact && (
        <>
          <NavLink to="/profile" className={activeClass}>
            My profile
          </NavLink>

          <NavLink to="/my-posts" className={activeClass}>
            My posts
          </NavLink>

          <NavLink to="/posts/new" className={activeClass}>
            Create post
          </NavLink>
        </>
      )}

      {loading ? (
        <span className="navigation-user" role="status">
          Checking session…
        </span>
      ) : user ? (
        <button
          type="button"
          className="navigation-logout"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out…" : "Logout"}
        </button>
      ) : (
        <>
          <NavLink to="/login" className={activeClass}>
            Login
          </NavLink>

          <NavLink to="/register" className="site-join">
            Join MyCoach
          </NavLink>
        </>
      )}

      {authError && (
        <span className="navigation-error" role="alert">
          {authError}
        </span>
      )}
    </nav>
  );
}
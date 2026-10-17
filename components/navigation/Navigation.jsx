import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { logout } from "../../services/authService";

export default function Navigation({ compact = false }) {
  const { user, initializing } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const activeClass = ({ isActive }) => isActive ? "selected" : "";
  async function handleLogout() {
    if (busy) return;
    setError(""); setBusy(true);
    try { await logout(); navigate("/posts", { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  const name = user?.user_metadata?.first_name || user?.email;
  return (
    <nav className="site-navigation" aria-label="Main navigation">
      <NavLink to="/posts" end className={activeClass}>Community</NavLink>
      <NavLink to="/coaches" className={activeClass}>Coaches</NavLink>
      {!initializing && user && <>
        {!compact && <NavLink to="/workspace" className={activeClass}>Workspace</NavLink>}
        {!compact && <NavLink to="/my-posts" className={activeClass}>My posts</NavLink>}
        {!compact && <NavLink to="/posts/new" className={activeClass}>Create post</NavLink>}
        <span className="signed-in-name" title={name}>{name}</span>
        <button type="button" className="site-logout" onClick={handleLogout} disabled={busy}>{busy ? "Logging out..." : "Logout"}</button>
      </>}
      {!initializing && !user && <>
        <NavLink to="/login" className={activeClass}>Login</NavLink>
        <NavLink to="/register" className="site-join">Join MyCoach</NavLink>
      </>}
      {initializing && <span role="status">Loading session...</span>}
      {error && <span className="errorbox" role="alert">{error}</span>}
    </nav>
  );
}

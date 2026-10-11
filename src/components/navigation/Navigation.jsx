import { NavLink } from "react-router";

export default function Navigation({ compact = false }) {
  const activeClass = ({ isActive }) => isActive ? "selected" : "";
  return (
    <nav className="site-navigation" aria-label="Main navigation">
      <NavLink to="/posts" end className={activeClass}>Community</NavLink>
      <NavLink to="/coaches" className={activeClass}>Coaches</NavLink>
      {!compact && <NavLink to="/workspace" className={activeClass}>Workspace</NavLink>}
      {!compact && <NavLink to="/my-posts" className={activeClass}>My posts</NavLink>}
      {!compact && <NavLink to="/posts/new" className={activeClass}>Create post</NavLink>}
      <NavLink to="/login" className={activeClass}>Login</NavLink>
      <NavLink to="/register" className="site-join">Join MyCoach</NavLink>
    </nav>
  );
}

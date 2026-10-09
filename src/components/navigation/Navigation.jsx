export default function Navigation() {
    return (
        <header className="switcher">
        <nav aria-label="Main navigation">
          <NavLink to="/posts" className={({ isActive }) => isActive ? "selected" : ""}>Community</NavLink>
          <NavLink to="/coaches" className={({ isActive }) => isActive ? "selected" : ""}>Coaches</NavLink>
          <NavLink to="/workspace" className={({ isActive }) => isActive ? "selected" : ""}>Workspace</NavLink>
        </nav>
        <nav className="application-links" aria-label="Application navigation">
          <Link to="/my-posts">My posts</Link>
          <Link className="nav-cta" to="/posts/new">Create post</Link>
        </nav>
        <div id="authlinks"></div>
      </header>
    );
}
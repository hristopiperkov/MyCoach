export default function Header() {
    return (
        <header className="topbar">
        <Link className="logo" to="/posts">
          MyCoach
          <img className="brand-mark" src="/images/logo.png" alt="" width="52" height="52" />
        </Link>
        <div className="toplinks">
          <Link to="/posts">Your community</Link>
          <Link className="btn outline" to="/coaches">Find a coach</Link>
          <span className="avatar" aria-label="Alex profile">AL</span>
        </div>
      </header>
    );
}
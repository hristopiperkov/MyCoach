import { Link } from "react-router";
import PostList from "../posts/PostList";
import "./Community.css";

function Icon({ type }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {type === "feed" ? <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" /> : type === "posts" ? <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></> : <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-4-5.65" /></>}
    </svg>
  );
}

export default function Community() {
  return (
    <section id="community" className="concept dark active community-page">
      <div className="community-layout">
        <aside className="community-left">
          <nav className="community-menu" aria-label="Community navigation">
            <Link className="community-menu-link selected" to="/posts" aria-current="page"><Icon type="feed" /><span>Your feed</span><span className="community-menu-arrow" aria-hidden="true">›</span></Link>
            <Link className="community-menu-link" to="/my-posts"><Icon type="posts" /><span>My posts</span></Link>
            <Link className="community-menu-link" to="/coaches"><Icon type="coaches" /><span>Explore coaches</span></Link>
          </nav>
          <section className="community-encouragement">
            <h2>A little every day</h2>
            <p>Progress loves consistency.</p>
            <p>Share a small win, ask a question, or learn something new.</p>
          </section>
        </aside>
        <main className="community-feed">
          <header className="community-heading">
            <span className="sub">Your circle, your momentum</span>
            <h1>Grow together.</h1>
            <p>Advice, small wins, and people who get it.</p>
          </header>
          <div className="community-actions">
            <Link className="btn" to="/posts/new"><span aria-hidden="true">＋</span>Share a new post</Link>
            <Link className="btn outline" to="/my-posts"><Icon type="posts" />My posts</Link>
          </div>
          <PostList />
        </main>
        <aside className="community-right" aria-label="Community information">
          <section className="community-info-card">
            <div className="community-card-image community-welcome-image" aria-hidden="true" />
            <div className="community-card-body">
              <h2>Make yourself at home</h2>
              <ul className="community-guidelines"><li>Share your experience.</li><li>Encourage others.</li><li>Keep conversations respectful.</li></ul>
            </div>
          </section>
          <section className="community-info-card">
            <div className="community-card-image community-coaches-image" aria-hidden="true" />
            <div className="community-card-body">
              <h2>Find your coach</h2>
              <p>Explore specialties, read profiles, and find support for your goals.</p>
              <Link className="btn outline" to="/coaches">Explore coaches <span aria-hidden="true">↗</span></Link>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

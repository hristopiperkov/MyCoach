import { Link } from "react-router";
import PostList from "../posts/PostList";
import useAuth from "../../hooks/useAuth";

export default function Community() {
    const { user } = useAuth();
    return (
        <section id="community" className="concept dark active">

        <div className="layout">
          <aside className="sidebar">
            <nav aria-label="Community navigation">
              <Link className="selected" to="/posts">◉ Your feed</Link>
              <Link to="/my-posts">▤ My posts</Link>
              <Link to="/coaches">↗ Explore coaches</Link>
              {user?.user_metadata?.role === "Coach" && <Link to="/workspace">▤ Coach workspace</Link>}
            </nav>
            <div className="note">
              <span className="sub">A little every day</span>
              <h3>Progress loves consistency.</h3>
              <p className="muted">You showed up 4 times this week. Keep your momentum.</p>
              <span className="pill">4 day streak ↗</span>
            </div>
          </aside>
          <main>
            <div className="sectionhead">
              <div>
                <span className="sub">Your circle, your momentum</span>
                <h1 style={{"marginTop": "8px"}}>Grow together.</h1>
                <span className="muted">Advice, small wins, and people who get it.</span>
              </div>
              <span className="pill">Community feed</span>
            </div>
            <div className="wrapactions">
              <Link className="btn" to="/posts/new">+ Share a new post</Link>
              <Link className="btn outline" to="/my-posts">My posts</Link>
            </div>
            <PostList />
          </main>
          <aside className="right">
            <div className="card">
              <span className="sub">Your weekly rhythm</span>
              <h3 style={{"marginTop": "12px"}}>A good week in motion</h3>
              <div className="metric">
                <span>Sessions completed</span>
                <b>3 / 4</b>
              </div>
              <div className="progress">
                <span></span>
              </div>
              <p className="muted">One more session to hit your weekly goal.</p>
              <hr style={{"border": "0", "borderTop": "1px solid #303643"}} />
              <span className="muted">Next session</span>
              <h4 style={{"margin": "8px 0"}}>Full-body strength</h4>
              <span className="muted">Tomorrow · 09:00 · with Sarah</span>
            </div>
            <div className="card">
              <h3>People to learn from</h3>
              <div className="coach">
                <span className="avatar">JD</span>
                <div>
                  <b>Jamie Davis</b>
                  <br />
                  <span className="muted">Mindful movement</span>
                </div>
                <button className="follow" aria-pressed="false">+</button>
              </div>
              <div className="coach">
                <span className="avatar">EM</span>
                <div>
                  <b>Elena Moore</b>
                  <br />
                  <span className="muted">Nutrition habits</span>
                </div>
                <button className="follow" aria-pressed="false">+</button>
              </div>
              <Link className="btn outline" to="/coaches" style={{"width": "100%"}}>Explore all coaches ↗</Link>
            </div>
            <p className="muted">Built around people. Powered by progress.</p>
          </aside>
        </div>
      </section>
    );
}
import { useState, useEffect } from "react";
import { Link, NavLink, Routes, Route, Navigate } from "react-router";
import Workspace from "./pages/workspace";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      "https://nwoawxvbarblzgrfedqa.supabase.co/rest/v1/users?select=first_name,last_name,role,specialization,hourly_rate,fitness_goals,img_url,location",
      {
        headers: {
          apikey: "sb_publishable_-IvrLhxd_oVx-WaZZkFWwA_0H-FH-Vj",
        },
        signal: controller.signal,
      }
    )
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load members.");
        }

        if (!Array.isArray(result)) {
          throw new Error("The database returned an unexpected response.");
        }

        return result;
      })
      .then((members) => {
        if (!controller.signal.aborted) {
          setUsers(members);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const coaches = users.filter((user) => user.role === "Coach");

  return (
    <>
      <div className="fitness-backdrop" aria-hidden="true"></div>
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
      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />
        <Route path="/posts" element={
      <section id="community" className="concept dark active">

        <div className="layout">
          <aside className="sidebar">
            <nav aria-label="Community navigation">
              <Link className="selected" to="/posts">◉ Your feed</Link>
              <Link to="/my-posts">▤ My posts</Link>
              <Link to="/coaches">↗ Explore coaches</Link>
              <Link to="/workspace">▤ Coach workspace</Link>
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
            <form className="card composer" id="postform" hidden>
              <div className="person">
                <span className="avatar">AL</span>
                <b>What’s your win today, Alex?</b>
              </div>
              <textarea id="posttext" aria-label="New post" placeholder="Share a milestone, ask a question, or cheer someone on…" required maxLength="1000"></textarea>
              <div className="actions">
                <span className="muted">Your community can see this post</span>
                <button className="btn" type="submit">Share post ↗</button>
              </div>
            </form>
            <div className="wrapactions">
              <Link className="btn" to="/posts/new">+ Share a new post</Link>
              <Link className="btn outline" to="/my-posts">My posts</Link>
            </div>
            <div id="newposts">
              <h2>Community members</h2>
              {loading && <p role="status">Loading members...</p>}
              {error && <p className="errorbox" role="alert">{error}</p>}
              {!loading && !error && users.length === 0 && (
                <p className="muted">No members found.</p>
              )}
              {!loading && !error && users.map((user, index) => (
                <article className="card" key={`${user.first_name}-${user.last_name}-${index}`}>
                  <div className="person">
                    {user.img_url ? (
                      <img className="avatar" src={user.img_url} alt={`${user.first_name} ${user.last_name}`} style={{ objectFit: "cover" }} />
                    ) : (
                      <span className="avatar">{user.first_name?.[0]}{user.last_name?.[0]}</span>
                    )}
                    <div>
                      <b>{user.first_name} {user.last_name}</b>
                      <p className="muted">{user.role} · {user.location}</p>
                    </div>
                  </div>
                  <p>{user.role === "Coach" ? user.specialization : user.fitness_goals}</p>
                  {user.role === "Coach" && user.hourly_rate != null && (
                    <span className="pill">{user.hourly_rate} / hour</span>
                  )}
                </article>
              ))}
            </div>
            <article className="card feedpost" hidden data-followed="true">
              <div className="person">
                <span className="avatar">SK</span>
                <div>
                  <b>Sarah Kim</b>
                  <span className="pill">Coach</span>
                  <p className="muted">Strength &amp; mobility · 2 hours ago</p>
                </div>
              </div>
              <p>You don’t need a perfect week to make progress. Start with 20 minutes, move with intention, and build from there. 🌱</p>
              <div className="postart">
                <small className="sub">The everyday strength series</small>
                <strong>
                  Small steps.
                  <br />
                  Stronger you.
                </strong>
              </div>
              <div className="postactions">
                <button className="like" aria-pressed="false">
                  ♡ 
                  <span>48</span>
                   cheers
                </button>
                <button data-action="comment">◌ Add a comment</button>
                <button data-action="save" aria-pressed="false">↗ Save</button>
              </div>
              <form className="commentform" hidden>
                <input className="search" aria-label="Comment" placeholder="Write something supportive…" required />
                <button className="btn" type="submit">Reply</button>
                <div className="comments"></div>
              </form>
            </article>
            <article className="card feedpost" hidden data-followed="false">
              <div className="person">
                <span className="avatar" style={{"background": "#394251"}}>MR</span>
                <div>
                  <b>Marcus Reed</b>
                  <p className="muted">Community member · 4 hours ago</p>
                </div>
              </div>
              <p>First 5K without stopping! Six weeks ago I couldn’t run for five minutes. Thanks to everyone who kept me going.</p>
              <div className="postactions">
                <button className="like" aria-pressed="false">
                  ♡ 
                  <span>26</span>
                   cheers
                </button>
                <button data-action="comment">◌ Add a comment</button>
              </div>
              <form className="commentform" hidden>
                <input className="search" aria-label="Comment" placeholder="Write a reply…" required />
                <button className="btn">Reply</button>
                <div className="comments"></div>
              </form>
            </article>
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
        } />
        <Route path="/coaches" element={
      <section id="wellness" className="concept dark active">
        <header className="topbar">
          <Link to="/coaches" className="logo">
            MyCoach
            <img className="brand-mark" src="/images/logo.png" alt="" width="52" height="52" />
          </Link>
          <div className="toplinks">
            <Link className="outline btn" to="/posts">Community</Link>
            <span className="avatar">AL</span>
          </div>
        </header>
        <main className="wellness">
          <div className="hero">
            <div>
              <span className="sub">A coach for your kind of journey</span>
              <h1 style={{"marginTop": "20px"}}>
                Find your person.
                <br />
                <em>Unlock your potential.</em>
              </h1>
              <p>Connect with coaches who listen, understand your goals, and help you build a healthier everyday life.</p>
              <button className="btn" id="browse">Meet your coach ↗</button>
              <p className="muted">Strength · Nutrition · Movement · Mindset</p>
            </div>
            <div className="heroart" aria-label="Abstract landscape in warm green and terracotta">
              <div className="sun"></div>
              <div className="hill"></div>
              <div className="hill two"></div>
              <div className="floating">
                <span className="avatar">SK</span>
                <b>Support that meets you where you are.</b>
              </div>
            </div>
          </div>
          <div className="sectionhead" id="coachlist">
            <div>
              <span className="sub">Real people. Personal support.</span>
              <h2>Discover your next coach</h2>
            </div>
            <input className="search" id="coachsearch" aria-label="Search coaches" placeholder="Search name or specialty…" />
          </div>
          <div className="chips" aria-label="Filter coach specialty">
            <button className="selected" data-filter="all" aria-pressed="true">All coaches</button>
            <button data-filter="strength" aria-pressed="false">Strength</button>
            <button data-filter="nutrition" aria-pressed="false">Nutrition</button>
            <button data-filter="movement" aria-pressed="false">Movement</button>
          </div>
          {loading && <p role="status">Loading coaches...</p>}
          {error && <p className="errorbox" role="alert">{error}</p>}
          <div className="grid">
            {!loading && !error && coaches.map((coach, index) => (
              <article className="profile" key={`${coach.first_name}-${coach.last_name}-${index}`}>
                {coach.img_url ? (
                  <img src={coach.img_url} alt={`${coach.first_name} ${coach.last_name}`} style={{ width: "100%", height: "170px", objectFit: "cover", display: "block" }} />
                ) : (
                  <div className="portrait">{coach.first_name?.[0]}{coach.last_name?.[0]}</div>
                )}
                <div className="body">
                  <span className="pill">{coach.role}</span>
                  <h3>{coach.first_name} {coach.last_name}</h3>
                  <span className="muted">{coach.location}</span>
                  <p>{coach.specialization}</p>
                  {coach.hourly_rate != null && (
                    <div className="metric"><b>{coach.hourly_rate} / hour</b></div>
                  )}
                  <button className="btn" type="button">Meet {coach.first_name} ↗</button>
                </div>
              </article>
            ))}
          </div>
          {!loading && !error && coaches.length === 0 && <p className="muted">No coaches found.</p>}
        </main>
      </section>
        } />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="*" element={
          <main className="page">
            <h1>This page is not built yet.</h1>
            <p className="muted">You can add its component and route as you build the project.</p>
            <Link className="btn" to="/posts">Back to community</Link>
          </main>
        } />
      </Routes>
      <footer className="demo">MyCoach · HTML prototype · Sample data and simulated sign-in only. Connect React to a hosted backend for the exam.</footer>
      <div className="notice" role="status" aria-live="polite"></div>
      <dialog className="modal" id="details">
        <h2 id="dialogtitle"></h2>
        <div id="dialogbody"></div>
        <button className="btn outline" id="closemodal">Close</button>
      </dialog>
    </>
  );
}

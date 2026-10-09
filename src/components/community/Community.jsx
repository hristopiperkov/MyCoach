import { Link } from "react-router";

export default function Community({ users, loading, error }) {
    return (
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
                    <span className="avatar" aria-label="Sarah Kim profile">
                      SK
                    </span>
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
    );
}
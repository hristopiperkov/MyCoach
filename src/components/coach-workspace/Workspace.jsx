import { Link } from "react-router";
import "./Workspace.css";

export default function Workspace() {
  return (
      <section id="performance" className="concept dark active">
        <header className="topbar">
          <Link to="/workspace" className="logo">
            MyCoach
            <img className="brand-mark" src="/images/logo.png" alt="" width="52" height="52" />
          </Link>
          <div className="toplinks">
            <span className="muted">COACH WORKSPACE</span>
            <Link className="btn" to="/posts">Community ↗</Link>
            <span className="avatar">SK</span>
          </div>
        </header>
        <main className="dashboard">
          <div className="dashhead">
            <div>
              <span className="sub lime">Wednesday, 14 October · sample data</span>
              <h1 >Make progress personal.</h1>
              <span className="muted">Welcome back, Sarah. Here’s how your team is doing.</span>
            </div>
            <button className="btn" id="invite">+ Invite a client</button>
          </div>
          <div className="statgrid">
            <div className="card">
              <span className="muted">Active clients</span>
              <div className="number">24</div>
              <span className="lime">↑ 3 this month</span>
            </div>
            <div className="card">
              <span className="muted">Weekly adherence</span>
              <div className="number">
                87
                <span >%</span>
              </div>
              <span className="lime">↑ 8% vs last week</span>
            </div>
            <div className="card">
              <span className="muted">Sessions this week</span>
              <div className="number">18</div>
              <span className="muted">4 remaining</span>
            </div>
            <div className="card">
              <span className="muted">Awaiting review</span>
              <div className="number" id="reviewcount">3</div>
              <span className="muted">Client check-ins</span>
            </div>
          </div>
          <div className="dashbody">
            <div>
              <section className="card">
                <div className="sectionhead">
                  <div>
                    <span className="sub lime">The bigger picture</span>
                    <h2>Consistency is climbing.</h2>
                  </div>
                  <span className="pill">This week</span>
                </div>
                <span className="muted">Completed sessions across your clients</span>
                <div className="chart" role="img" aria-label="Completed sessions: Monday 12, Tuesday 18, Wednesday 14, Thursday 22, Friday 19, Saturday 26, Sunday 16">
                  <div className="bar" style={{"height": "46%"}}>
                    <small>Mon</small>
                  </div>
                  <div className="bar" style={{"height": "69%"}}>
                    <small>Tue</small>
                  </div>
                  <div className="bar" style={{"height": "54%"}}>
                    <small>Wed</small>
                  </div>
                  <div className="bar" style={{"height": "85%"}}>
                    <small>Thu</small>
                  </div>
                  <div className="bar" style={{"height": "73%"}}>
                    <small>Fri</small>
                  </div>
                  <div className="bar" style={{"height": "100%"}}>
                    <small>Sat</small>
                  </div>
                  <div className="bar" style={{"height": "62%"}}>
                    <small>Sun</small>
                  </div>
                </div>
                <p className="muted chart-summary">127 sessions completed · 87% of planned sessions</p>
              </section>
          </div>
        </div>
      </main>
    </section>
  );
}

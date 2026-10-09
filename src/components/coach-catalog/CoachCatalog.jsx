export default function CoachCatalog() {
    return (
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
                  <img
                    className="avatar"
                    src={coach.img_url}
                    alt={`${coach.first_name} ${coach.last_name}`}
                  />
                ) : (
                  <span className="avatar">
                    {coach.first_name?.[0]}{coach.last_name?.[0]}
                  </span>
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
    );
}
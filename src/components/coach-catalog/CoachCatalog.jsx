import { useState } from "react";
import "./CoachCatalog.css";

const FILTERS = [
  { value: "all", label: "All coaches" },
  { value: "strength", label: "Strength" },
  { value: "nutrition", label: "Nutrition" },
  { value: "movement", label: "Movement" },
];

const SPECIALTY_KEYWORDS = {
  strength: ["strength", "weightlifting", "bodybuilding", "powerlifting"],
  nutrition: ["nutrition", "diet", "meal"],
  movement: ["movement", "mobility", "yoga", "pilates", "flexibility"],
};

export default function CoachCatalog({ coaches, loading, error }) {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");

  const filteredCoaches = coaches.filter((coach) => {
    const name = `${coach.first_name ?? ""} ${coach.last_name ?? ""}`;
    const specialization = (coach.specialization ?? "").toLowerCase();
    const searchableText = `${name} ${specialization}`.toLowerCase();

    const matchesSearch = searchableText.includes(
      search.trim().toLowerCase()
    );

    const matchesSpecialty =
      specialty === "all" ||
      SPECIALTY_KEYWORDS[specialty].some((keyword) =>
        specialization.includes(keyword)
      );

    return matchesSearch && matchesSpecialty;
  });

  return (
    <section id="wellness" className="concept dark active">
      <main className="wellness">
        <div className="hero">
          <div>
            <span className="sub">A coach for your kind of journey</span>

            <h1 style={{ marginTop: "20px" }}>
              Find your person.
              <br />
              <em>Unlock your potential.</em>
            </h1>

            <p>
              Connect with coaches who listen, understand your goals, and
              help you build a healthier everyday life.
            </p>

            <button
              className="btn"
              id="browse"
              type="button"
              onClick={() =>
                document.getElementById("coachlist")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Meet your coach ↗
            </button>

            <p className="muted">
              Strength · Nutrition · Movement · Mindset
            </p>
          </div>

          <div className="heroart" aria-label="Fitness and active lifestyle">
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

          <input
            className="search"
            id="coachsearch"
            type="search"
            aria-label="Search coaches"
            placeholder="Search name or specialty…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="chips" aria-label="Filter coach specialty">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={specialty === filter.value ? "selected" : ""}
              aria-pressed={specialty === filter.value}
              onClick={() => setSpecialty(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loading && <p role="status">Loading coaches...</p>}

        {error && (
          <p className="errorbox" role="alert">
            {error}
          </p>
        )}

        <div className="grid">
          {!loading &&
            !error &&
            filteredCoaches.map((coach) => (
              <article className="profile" key={coach.id}>
                {coach.img_url ? (
                  <img
                    className="coach-photo"
                    src={coach.img_url}
                    alt={`${coach.first_name} ${coach.last_name}`}
                    loading="lazy"
                  />
                ) : (
                  <span className="avatar">
                    {coach.first_name?.[0]}
                    {coach.last_name?.[0]}
                  </span>
                )}

                <div className="body">
                  <span className="pill">{coach.role}</span>

                  <h3>
                    {coach.first_name} {coach.last_name}
                  </h3>

                  <span className="muted">{coach.location}</span>

                  <p>{coach.specialization}</p>

                  {coach.description && (
                    <p className="muted">{coach.description}</p>
                  )}

                  {coach.hourly_rate != null && (
                    <div className="metric">
                      <b>
                        {new Intl.NumberFormat("en-GB", {
                          style: "currency",
                          currency: coach.currency || "EUR",
                          currencyDisplay: "narrowSymbol",
                        }).format(Number(coach.hourly_rate))}
                        {" / hour"}
                      </b>
                    </div>
                  )}

                  <button className="btn" type="button">
                    Meet {coach.first_name} ↗
                  </button>
                </div>
              </article>
            ))}
        </div>

        {!loading && !error && filteredCoaches.length === 0 && (
          <p className="muted">
            {coaches.length === 0
              ? "No coaches available yet."
              : "No coaches match your search and specialty filter."}
          </p>
        )}
      </main>
    </section>
  );
}
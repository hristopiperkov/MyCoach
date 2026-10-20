import { useState } from "react";
import { Link } from "react-router";

import "./CoachCatalog.css";

const FILTERS = [
  { value: "all", label: "All coaches" },
  { value: "strength", label: "Strength" },
  { value: "nutrition", label: "Nutrition" },
  { value: "movement", label: "Movement" },
];

const SPECIALTY_KEYWORDS = {
  strength: [
    "strength",
    "weightlifting",
    "bodybuilding",
    "powerlifting",
  ],
  nutrition: ["nutrition", "diet", "meal"],
  movement: [
    "movement",
    "mobility",
    "yoga",
    "pilates",
    "flexibility",
  ],
};

function formatRate(rate, currency) {
  if (rate === null || rate === undefined || rate === "") {
    return "Rate not provided";
  }

  const amount = Number(rate);

  if (!Number.isFinite(amount)) {
    return "Rate not provided";
  }

  try {
    return `${new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "EUR",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 2,
    }).format(amount)} / hour`;
  } catch {
    return `${amount} ${currency || "EUR"} / hour`;
  }
}

export default function CoachCatalog({
  coaches = [],
  loading = false,
  error = "",
}) {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCoaches = coaches.filter((coach) => {
    const fullName = [coach.first_name, coach.last_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const specialization = (
      coach.specialization || ""
    ).toLowerCase();

    const matchesSearch =
      fullName.includes(normalizedSearch) ||
      specialization.includes(normalizedSearch);

    const matchesFilter =
      selectedFilter === "all" ||
      SPECIALTY_KEYWORDS[selectedFilter].some((keyword) =>
        specialization.includes(keyword)
      );

    return matchesSearch && matchesFilter;
  });

  function scrollToCoaches() {
    document.getElementById("coachlist")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section id="wellness" className="concept dark active">
      <main className="wellness">
        <div className="hero">
          <div>
            <span className="sub">
              A coach for your kind of journey
            </span>

            <h1 style={{ marginTop: "20px" }}>
              Find your person.
              <br />
              <em>Unlock your potential.</em>
            </h1>

            <p>
              Connect with coaches who listen, understand your goals,
              and help you build a healthier everyday life.
            </p>

            <button
              className="btn"
              id="browse"
              type="button"
              onClick={scrollToCoaches}
            >
              Meet your coach ↗
            </button>

            <p className="muted">
              Strength · Nutrition · Movement · Mindset
            </p>
          </div>
        </div>

        <div className="sectionhead" id="coachlist">
          <div>
            <span className="sub">
              Real people. Personal support.
            </span>

            <h2>Discover your next coach</h2>
          </div>

          <input
            className="search"
            id="coachsearch"
            type="search"
            aria-label="Search coaches by name or specialty"
            placeholder="Search name or specialty…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div
          className="chips"
          role="group"
          aria-label="Filter coach specialty"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={
                selectedFilter === filter.value ? "selected" : ""
              }
              data-filter={filter.value}
              aria-pressed={selectedFilter === filter.value}
              onClick={() => setSelectedFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loading && (
          <p className="muted" role="status">
            Loading coaches…
          </p>
        )}

        {error && (
          <p className="errorbox" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="grid">
              {filteredCoaches.map((coach) => {
                const fullName =
                  [coach.first_name, coach.last_name]
                    .filter(Boolean)
                    .join(" ") || "Coach";

                const initials =
                  `${coach.first_name?.[0] || ""}${coach.last_name?.[0] || ""
                    }`.toUpperCase() || "MC";

                return (
                  <article className="profile" key={coach.id}>
                    {coach.img_url ? (
                      <img
                        className="coach-photo"
                        src={coach.img_url}
                        alt={fullName}
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className="avatar"
                        role="img"
                        aria-label={fullName}
                      >
                        {initials}
                      </span>
                    )}

                    <div className="body">
                      <span className="pill">{coach.role}</span>

                      <h3>{fullName}</h3>

                      <span className="muted">
                        {coach.location?.trim() ||
                          "Location not provided"}
                      </span>

                      <p>
                        {coach.specialization?.trim() ||
                          "Specialties not provided"}
                      </p>

                      {coach.description?.trim() && (
                        <p className="muted">
                          {coach.description}
                        </p>
                      )}

                      <div className="metric">
                        <b>
                          {formatRate(
                            coach.hourly_rate,
                            coach.currency
                          )}
                        </b>
                      </div>

                      <Link
                        className="btn"
                        to={`/coaches/${coach.id}`}
                      >
                        Meet {coach.first_name || "coach"} ↗
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredCoaches.length === 0 && (
              <p className="muted" role="status">
                {coaches.length === 0
                  ? "No coaches are available yet."
                  : "No coaches match your search and selected specialty."}
              </p>
            )}
          </>
        )}
      </main>
    </section>
  );
}
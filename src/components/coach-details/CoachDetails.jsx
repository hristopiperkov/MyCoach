import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import supabase from "../../supabase";
import "./CoachDetails.css";

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

export default function CoachDetails() {
  const { coachId } = useParams();

  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCoach() {
      setLoading(true);
      setError("");
      setCoach(null);

      try {
        // The users table uses numeric IDs.
        if (!/^\d+$/.test(coachId || "")) {
          return;
        }

        if (!supabase) {
          throw new Error("The database connection is not configured.");
        }

        const { data, error: requestError } = await supabase
          .from("users")
          .select(`
            id,
            first_name,
            last_name,
            role,
            img_url,
            location,
            specialization,
            description,
            hourly_rate,
            currency
          `)
          .eq("id", coachId)
          .eq("role", "Coach")
          .abortSignal(controller.signal)
          .maybeSingle();

        if (controller.signal.aborted) return;

        if (requestError) {
          throw requestError;
        }

        setCoach(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Could not load this coach.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCoach();

    return () => controller.abort();
  }, [coachId, attempt]);

  if (loading) {
    return (
      <main className="coach-details-page dark">
        <p className="muted" role="status">
          Loading coach profile…
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="coach-details-page dark">
        <Link className="btn outline" to="/coaches">
          ← Back to coaches
        </Link>

        <section className="card coach-details-state">
          <h1>Could not load the coach</h1>
          <p role="alert">{error}</p>

          <button
            type="button"
            className="btn"
            onClick={() => setAttempt((current) => current + 1)}
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  if (!coach) {
    return (
      <main className="coach-details-page dark">
        <section className="card coach-details-state">
          <h1>Coach profile unavailable</h1>
          <p className="muted">
            This coach does not exist or their profile is no longer available.
          </p>

          <Link className="btn" to="/coaches">
            Back to coaches
          </Link>
        </section>
      </main>
    );
  }

  const fullName =
    [coach.first_name, coach.last_name].filter(Boolean).join(" ") || "Coach";

  const initials =
    `${coach.first_name?.[0] || ""}${coach.last_name?.[0] || ""}`.toUpperCase() ||
    "MC";

  const specialties = [
    ...new Set(
      (coach.specialization || "")
        .split(",")
        .map((specialty) => specialty.trim())
        .filter(Boolean)
    ),
  ];

  return (
    <main className="coach-details-page dark">
      <Link className="btn outline" to="/coaches">
        ← Back to coaches
      </Link>

      <article className="card coach-details-card">
        <div className="coach-details-photo-container">
          {coach.img_url ? (
            <img
              className="coach-details-photo"
              src={coach.img_url}
              alt={fullName}
            />
          ) : (
            <div
              className="coach-details-placeholder"
              role="img"
              aria-label={fullName}
            >
              {initials}
            </div>
          )}
        </div>

        <div className="coach-details-content">
          <header className="coach-details-header">
            <span className="pill">Coach</span>
            <h1>{fullName}</h1>

            <p className="muted">
              {coach.location?.trim() || "Location not provided"}
            </p>
          </header>

          <section className="coach-details-section">
            <h2>About your coach</h2>

            <p className="muted coach-details-description">
              {coach.description?.trim() ||
                "This coach has not added a description yet."}
            </p>
          </section>

          <section className="coach-details-section">
            <h2>Specialties</h2>

            {specialties.length > 0 ? (
              <ul className="coach-details-specialties">
                {specialties.map((specialty) => (
                  <li className="pill" key={specialty}>
                    {specialty}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">
                This coach has not added their specialties yet.
              </p>
            )}
          </section>

          <section className="coach-details-section coach-details-rate">
            <h2>Hourly rate</h2>

            <p className="lime">
              {formatRate(coach.hourly_rate, coach.currency)}
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
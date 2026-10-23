import useToast from "../../hooks/useToast";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import supabase from "../../supabase";
import "./Profile.css";

const SPECIALTIES = ["Strength", "Nutrition", "Movement"];
const CURRENCIES = ["EUR", "USD", "GBP", "BGN"];
const profileFields = `
  id,
  first_name,
  last_name,
  role,
  img_url,
  location,
  specialization,
  description,
  hourly_rate,
  currency,
  fitness_goals
`;

function getSpecialties(value) {
  return (value ?? "")
    .split(",")
    .map((specialty) => specialty.trim())
    .filter(Boolean);
}

export default function Profile({ onSaved }) {
  const toast = useToast();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        if (!supabase) {
          throw new Error("Supabase is not configured.");
        }

        if (!user?.id) {
          throw new Error("Please log in to edit your profile.");
        }

        const { data, error: requestError } = await supabase
          .from("users")
          .select(profileFields)
          .eq("auth_user_id", user.id)
          .abortSignal(controller.signal)
          .maybeSingle();

        if (requestError) throw requestError;

        if (!data) {
          throw new Error(
            "Your account has no linked profile. Please contact the project administrator."
          );
        }

        if (!controller.signal.aborted) {
          setProfile(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message || "Could not load your profile.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => controller.abort();
  }, [user?.id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

  }

  function handleSpecialtyChange(event) {
    const { value, checked } = event.target;

    setProfile((current) => {
      const currentSpecialties = getSpecialties(
        current.specialization
      );

      const updatedSpecialties = checked
        ? [...new Set([...currentSpecialties, value])]
        : currentSpecialties.filter((specialty) => specialty !== value);

      return {
        ...current,
        specialization: updatedSpecialties.join(", "),
      };
    });

  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving || !profile) return;

    setError("");


    if (!supabase || !user?.id) {
      setError("Please log in to save your profile.");
      return;
    }

    const firstName = profile.first_name?.trim();
    const lastName = profile.last_name?.trim();

    if (!firstName || !lastName) {
      setError("Enter your first and last name.");
      return;
    }

    const imageUrl = profile.img_url?.trim() || null;

    if (imageUrl) {
      try {
        const url = new URL(imageUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        setError(
          "Enter a valid image URL starting with http:// or https://."
        );
        return;
      }
    }

    const updates = {
      first_name: firstName,
      last_name: lastName,
      img_url: imageUrl,
      location: profile.location?.trim() || null,
    };

    if (profile.role === "Coach") {
      const rate =
        profile.hourly_rate === "" || profile.hourly_rate == null
          ? null
          : Number(profile.hourly_rate);

      if (rate !== null && (!Number.isFinite(rate) || rate < 0)) {
        setError("Enter a valid non-negative hourly rate.");
        return;
      }

      const currency = profile.currency ?? "EUR";

      if (!CURRENCIES.includes(currency)) {
        setError("Please select a supported currency.");
        return;
      }

      updates.specialization =
        getSpecialties(profile.specialization).join(", ") || null;
      updates.description = profile.description?.trim() || null;
      updates.hourly_rate = rate;
      updates.currency = currency;
    } else {
      updates.fitness_goals = profile.fitness_goals?.trim() || null;
    }

    setSaving(true);

    try {
      const { data, error: requestError } = await supabase
        .from("users")
        .update(updates)
        .eq("auth_user_id", user.id)
        .select(profileFields)
        .single();

      if (requestError) throw requestError;

      setProfile(data);
      onSaved?.(data);
      toast.success("Profile saved successfully.");
    } catch (error) {
      toast.error(error.message || "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  const selectedSpecialties = getSpecialties(profile?.specialization);

  const existingDescriptions = selectedSpecialties.filter(
    (specialty) => !SPECIALTIES.includes(specialty)
  );

  if (loading) {
    return (
      <main className="page" role="status">
        Loading profile...
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page" role="alert">
        {error}
      </main>
    );
  }

  return (
    <main className="profile-editor dark">
      <section className="card">
        <span className="sub lime">Your account</span>
        <h1>Edit profile</h1>

        <p className="muted">
          Complete the information shown on your public profile.
        </p>

        {profile.img_url && (
          <img
            className="profile-editor-photo"
            src={profile.img_url}
            alt="Profile preview"
          />
        )}

        <form onSubmit={handleSubmit} aria-busy={saving}>
          <fieldset disabled={saving}>
            <label>
              First name
              <input
                name="first_name"
                autoComplete="given-name"
                value={profile.first_name ?? ""}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Last name
              <input
                name="last_name"
                autoComplete="family-name"
                value={profile.last_name ?? ""}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Profile picture URL
              <input
                type="url"
                name="img_url"
                value={profile.img_url ?? ""}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </label>

            <label>
              City or coaching location
              <input
                name="location"
                value={profile.location ?? ""}
                onChange={handleChange}
              />
            </label>

            {profile.role === "Coach" ? (
              <>
                <div
                  className="profile-specialties"
                  role="group"
                  aria-labelledby="specialties-label"
                >
                  <span id="specialties-label">Specialties</span>
                  <p className="muted">Choose all that apply.</p>

                  <div className="specialty-options">
                    {SPECIALTIES.map((specialty) => (
                      <label
                        className="specialty-option"
                        key={specialty}
                      >
                        <input
                          type="checkbox"
                          name="specialties"
                          value={specialty}
                          checked={selectedSpecialties.includes(
                            specialty
                          )}
                          onChange={handleSpecialtyChange}
                        />
                        <span>{specialty}</span>
                      </label>
                    ))}
                  </div>

                  {existingDescriptions.length > 0 && (
                    <p className="muted">
                      Existing specialty text retained:{" "}
                      {existingDescriptions.join(", ")}
                    </p>
                  )}
                </div>

                <label>
                  About you
                  <textarea
                    name="description"
                    value={profile.description ?? ""}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your experience, qualifications, and coaching approach..."
                  />
                </label>

                <div className="profile-rate">
                  <label>
                    Hourly rate
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="hourly_rate"
                      value={profile.hourly_rate ?? ""}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    Currency
                    <select
                      name="currency"
                      value={profile.currency ?? "EUR"}
                      onChange={handleChange}
                    >
                      <option value="EUR">EUR — €</option>
                      <option value="USD">USD — $</option>
                      <option value="GBP">GBP — £</option>
                      <option value="BGN">BGN — лв.</option>
                    </select>
                  </label>
                </div>
              </>
            ) : (
              <label>
                Fitness goals
                <textarea
                  name="fitness_goals"
                  value={profile.fitness_goals ?? ""}
                  onChange={handleChange}
                  rows={4}
                />
              </label>
            )}

            <button type="submit" className="btn">
              {saving ? "Saving..." : "Save profile"}
            </button>
          </fieldset>

          {error && (
            <p role="alert" className="errorbox">
              {error}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
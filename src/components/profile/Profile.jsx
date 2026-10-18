import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import supabase from "../../supabase";
import "./Profile.css";

export default function Profile({ onSaved }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    supabase.from("users").select("id,first_name,last_name,role,img_url,location,specialization,hourly_rate,fitness_goals")
      .eq("auth_user_id", user.id).maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) throw error;
        if (!data) throw new Error("Your account has no linked profile. Please contact the project administrator.");
        setProfile(data);
      })
      .catch(error => { if (active) setError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user.id]);

  function change(event) {
    const { name, value } = event.target;
    setProfile(current => ({ ...current, [name]: value }));
    setMessage("");
  }

  async function save(event) {
    event.preventDefault();
    if (saving) return;
    setError("");
    setMessage("");
    const first_name = profile.first_name?.trim();
    const last_name = profile.last_name?.trim();
    if (!first_name || !last_name) return setError("Enter your first and last name.");
    const img_url = profile.img_url?.trim() || null;
    if (img_url) {
      try {
        if (!["http:", "https:"].includes(new URL(img_url).protocol)) throw new Error();
      } catch { return setError("Enter an image URL starting with http:// or https://."); }
    }
    const updates = { first_name, last_name, img_url, location: profile.location?.trim() || null };
    if (profile.role === "Coach") {
      const rate = profile.hourly_rate === "" || profile.hourly_rate == null ? null : Number(profile.hourly_rate);
      if (rate !== null && (!Number.isFinite(rate) || rate < 0)) return setError("Enter a valid non-negative hourly rate.");
      updates.specialization = profile.specialization?.trim() || null;
      updates.hourly_rate = rate;
    } else {
      updates.fitness_goals = profile.fitness_goals?.trim() || null;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.from("users").update(updates)
        .eq("auth_user_id", user.id).select("id,first_name,last_name,role,img_url,location,specialization,hourly_rate,fitness_goals").single();
      if (error) throw error;
      setProfile(data);
      onSaved(data);
      setMessage("Profile saved successfully.");
    } catch (error) {
      setError(error.message || "Could not save your profile.");
    } finally { setSaving(false); }
  }

  if (loading) return <main className="page" role="status">Loading profile...</main>;
  if (!profile) return <main className="page" role="alert">{error}</main>;

  return (
    <main className="profile-editor">
      <section className="card">
        <span className="sub lime">Your account</span>
        <h1>Edit profile</h1>
        <p className="muted">Complete the information shown on your public profile.</p>
        {profile.img_url && <img className="profile-editor-photo" src={profile.img_url} alt="Profile preview" />}
        <form onSubmit={save} aria-busy={saving}>
          <fieldset disabled={saving}>
            <label>First name<input name="first_name" value={profile.first_name ?? ""} onChange={change} required /></label>
            <label>Last name<input name="last_name" value={profile.last_name ?? ""} onChange={change} required /></label>
            <label>Profile picture URL<input type="url" name="img_url" value={profile.img_url ?? ""} onChange={change} placeholder="https://example.com/photo.jpg" /></label>
            <label>City or coaching location<input name="location" value={profile.location ?? ""} onChange={change} /></label>
            {profile.role === "Coach" ? <>
              <label>Specialties<textarea name="specialization" value={profile.specialization ?? ""} onChange={change} rows={4} /></label>
              <label>Hourly rate<input type="number" min="0" step="0.01" name="hourly_rate" value={profile.hourly_rate ?? ""} onChange={change} /></label>
            </> : <label>Fitness goals<textarea name="fitness_goals" value={profile.fitness_goals ?? ""} onChange={change} rows={4} /></label>}
            <button type="submit" className="btn">{saving ? "Saving..." : "Save profile"}</button>
          </fieldset>
          {error && <p role="alert" className="errorbox">{error}</p>}
          {message && <p role="status" className="lime">{message}</p>}
        </form>
      </section>
    </main>
  );
}

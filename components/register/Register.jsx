import { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../auth/AuthLayout";
import { register } from "../../services/authService";
import { validateRegister } from "../../utils/authValidation";
import useAuth from "../../hooks/useAuth";

export default function Register() {
  const [values, setValues] = useState({ first_name: "", last_name: "", email: "", password: "", confirmPassword: "", role: "Client", img_url: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const { authError } = useAuth();
  const navigate = useNavigate();
  function change(event) { setValues({ ...values, [event.target.name]: event.target.value }); }
  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    setMessage("");
    const validationError = validateRegister(values);
    setError(validationError);
    if (validationError) return;
    setBusy(true);
    try {
      const { session } = await register(values);
      if (session) navigate("/posts", { replace: true });
      else {
        setMessage("Check your inbox for a confirmation email. If you already have an account, please log in.");
        setValues(previous => ({ ...previous, password: "", confirmPassword: "" }));
      }
    } catch (err) { setError(err.message || "Could not create your account. Please try again."); }
    finally { setBusy(false); }
  }
  return (
    <AuthLayout>
      <section id="register-page" className="mycoach-auth" aria-labelledby="register-title">
        <form id="register" className="mycoach-auth__form" onSubmit={handleSubmit} aria-busy={busy}>
          <span className="mycoach-auth__eyebrow">Join the community</span>
          <h2 id="register-title">Create your account</h2>
          {(error || authError) && <p className="errorbox" role="alert">{error || authError}</p>}
          {message && <p className="infobox" role="status">{message}</p>}
          <fieldset className="auth-fields" disabled={busy}>
            <div className="mycoach-auth__names">
              <div><label htmlFor="register-first-name">First name</label><input id="register-first-name" name="first_name" autoComplete="given-name" value={values.first_name} onChange={change} maxLength={80} required /></div>
              <div><label htmlFor="register-last-name">Last name</label><input id="register-last-name" name="last_name" autoComplete="family-name" value={values.last_name} onChange={change} maxLength={80} required /></div>
            </div>
            <label htmlFor="register-email">Email</label>
            <input type="email" id="register-email" name="email" autoComplete="email" value={values.email} onChange={change} required />
            <label htmlFor="register-password">Password</label>
            <input type="password" id="register-password" name="password" autoComplete="new-password" value={values.password} onChange={change} minLength={8} aria-describedby="password-help" required />
            <small id="password-help" className="mycoach-auth__help">At least 8 characters.</small>
            <label htmlFor="confirm-password">Confirm password</label>
            <input type="password" id="confirm-password" name="confirmPassword" autoComplete="new-password" value={values.confirmPassword} onChange={change} minLength={8} required />
            <fieldset className="auth-role">
              <legend>I am joining as a</legend>
              <label><input type="radio" name="role" value="Client" checked={values.role === "Client"} onChange={change} /><span>Client</span></label>
              <label><input type="radio" name="role" value="Coach" checked={values.role === "Coach"} onChange={change} /><span>Coach</span></label>
            </fieldset>
            <label htmlFor="register-avatar">Profile picture URL (optional)</label>
            <input type="url" id="register-avatar" name="img_url" placeholder="https://example.com/photo.jpg" value={values.img_url} onChange={change} />
            <button className="mycoach-auth__submit" type="submit" disabled={busy || Boolean(authError)}>{busy ? "Creating account..." : "Create account"}</button>
          </fieldset>
          <p className="mycoach-auth__footer">Already a member? <Link to="/login">Login</Link></p>
        </form>
      </section>
    </AuthLayout>
  );
}

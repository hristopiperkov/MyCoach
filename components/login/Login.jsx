import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import AuthLayout from "../auth/AuthLayout";
import { login } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  function change(event) { setValues({ ...values, [event.target.name]: event.target.value }); }
  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    setError(""); setBusy(true);
    try {
      await login(values.email, values.password);
      const from = location.state?.from;
      const destination = typeof from === "string" && from.startsWith("/") && !from.startsWith("//") && !from.startsWith("/login") && !from.startsWith("/register") ? from : "/posts";
      navigate(destination, { replace: true });
    } catch (err) { setError(err.message || "Could not log in. Please try again."); }
    finally { setBusy(false); }
  }
  return (
    <AuthLayout>
      <section id="login-page" className="mycoach-auth" aria-labelledby="login-title">
        <form id="login" className="mycoach-auth__form" onSubmit={handleSubmit} aria-busy={busy}>
          <span className="mycoach-auth__eyebrow">Welcome back</span>
          <h2 id="login-title">Login to MyCoach</h2>
          <p className="mycoach-auth__intro">Connect with your community and keep making progress.</p>
          {(error || authError) && <p className="errorbox" role="alert">{error || authError}</p>}
          <fieldset className="auth-fields" disabled={busy}>
            <label htmlFor="login-email">Email</label>
            <input type="email" id="login-email" name="email" autoComplete="email" value={values.email} onChange={change} required />
            <label htmlFor="login-password">Password</label>
            <input type="password" id="login-password" name="password" autoComplete="current-password" value={values.password} onChange={change} required />
            <button className="mycoach-auth__submit" type="submit" disabled={busy || Boolean(authError)}>{busy ? "Logging in..." : "Login"}</button>
          </fieldset>
          <p className="mycoach-auth__footer">New to MyCoach? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
    </AuthLayout>
  );
}

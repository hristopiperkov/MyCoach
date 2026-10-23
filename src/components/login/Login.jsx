import useToast from "../../hooks/useToast";
import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "../auth/AuthLayout";
import supabase from "../../supabase";

export default function Login() {
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!supabase) {
      setError("Missing VITE_API_KEY in .env.local.");
      return;
    }

    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) throw loginError;
      toast.success("You are logged in.");

    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <section
        id="login-page"
        className="mycoach-auth"
        aria-labelledby="login-title"
      >
        <form
          id="login"
          className="mycoach-auth__form"
          onSubmit={handleSubmit}
          aria-busy={loading}
        >
          <span className="mycoach-auth__eyebrow">Welcome back</span>

          <h2 id="login-title">Login to MyCoach</h2>

          <p className="mycoach-auth__intro">
            Connect with your community and keep making progress.
          </p>

          <label htmlFor="login-email">Email</label>
          <input
            type="email"
            id="login-email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            name="password"
            placeholder="Your password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
          />

          {error && (
            <p role="alert" className="mycoach-auth__help">
              {error}
            </p>
          )}

          <button
            className="mycoach-auth__submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mycoach-auth__footer">
            New to MyCoach? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </AuthLayout>
  );
}
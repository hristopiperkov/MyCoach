import { Link } from "react-router";
import "../auth/Auth.css";

export default function Login() {
  function handleSubmit(event) {
    event.preventDefault();
    // Add Supabase login logic here.
  }

  return (
    <section id="login-page" className="mycoach-auth" aria-labelledby="login-title">
      <form id="login" className="mycoach-auth__form" onSubmit={handleSubmit}>
        <span className="mycoach-auth__eyebrow">Welcome back</span>
        <h1 id="login-title">Login to MyCoach</h1>
        <p className="mycoach-auth__intro">Connect with your community and keep making progress.</p>

        <label htmlFor="login-email">Email</label>
        <input type="email" id="login-email" name="email" placeholder="you@example.com" autoComplete="email" required />

        <label htmlFor="login-password">Password</label>
        <input type="password" id="login-password" name="password" placeholder="Your password" autoComplete="current-password" required />

        <button className="mycoach-auth__submit" type="submit">Login</button>
        <p className="mycoach-auth__footer">New to MyCoach? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
}

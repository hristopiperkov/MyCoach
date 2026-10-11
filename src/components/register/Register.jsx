import { Link } from "react-router";
import AuthLayout from "../auth/AuthLayout";

export default function Register() {
  function handleSubmit(event) {
    event.preventDefault();
    // Add password confirmation validation and Supabase registration here.
  }

  return (
    <AuthLayout>
    <section id="register-page" className="mycoach-auth" aria-labelledby="register-title">
      <form id="register" className="mycoach-auth__form" onSubmit={handleSubmit}>
        <span className="mycoach-auth__eyebrow">Join the community</span>
        <h2 id="register-title">Create your account</h2>
        <p className="mycoach-auth__intro">Build healthy habits with people who support your goals.</p>

        <div className="mycoach-auth__names">
          <div>
            <label htmlFor="register-first-name">First name</label>
            <input type="text" id="register-first-name" name="first_name" autoComplete="given-name" required />
          </div>
          <div>
            <label htmlFor="register-last-name">Last name</label>
            <input type="text" id="register-last-name" name="last_name" autoComplete="family-name" required />
          </div>
        </div>

        <label htmlFor="register-email">Email</label>
        <input type="email" id="register-email" name="email" placeholder="you@example.com" autoComplete="email" required />

        <label htmlFor="register-password">Password</label>
        <input type="password" id="register-password" name="password" autoComplete="new-password" required />

        <label htmlFor="confirm-password">Confirm password</label>
        <input type="password" id="confirm-password" name="confirm-password" autoComplete="new-password" required />

        <fieldset className="auth-role">
          <legend>I am joining as a</legend>
          <label><input type="radio" name="role" value="Client" defaultChecked /><span>Client</span></label>
          <label><input type="radio" name="role" value="Coach" /><span>Coach</span></label>
        </fieldset>

        <label htmlFor="register-avatar">Profile picture URL (optional)</label>
        <input type="url" id="register-avatar" name="img_url" placeholder="https://example.com/photo.jpg" aria-describedby="avatar-help" />
        <small id="avatar-help" className="mycoach-auth__help">Use a direct link to your image.</small>

        <button className="mycoach-auth__submit" type="submit">Create account</button>
        <p className="mycoach-auth__footer">Already a member? <Link to="/login">Login</Link></p>
      </form>
    </section>
    </AuthLayout>
  );
}

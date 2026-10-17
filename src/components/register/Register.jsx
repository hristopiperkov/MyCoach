import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "../auth/AuthLayout";
import request from "../../request";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = formData.get("first_name").trim();
    const lastName = formData.get("last_name").trim();
    const email = formData.get("email").trim();
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");
    const role = formData.get("role");
    const imgUrl = formData.get("img_url").trim();

    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!["Client", "Coach"].includes(role)) {
      setError("Please choose Client or Coach.");
      return;
    }

    if (imgUrl) {
      try {
        const url = new URL(imgUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        setError("Enter a valid image URL starting with http:// or https://.");
        return;
      }
    }

    setLoading(true);

    try {
      const result = await request("/auth/v1/signup", "POST", {
        email,
        password,
        data: {
          first_name: firstName,
          last_name: lastName,
          role,
          img_url: imgUrl || null,
        },
      });

      setMessage(
        result?.access_token
          ? "Your account was created successfully."
          : "Check your email for a confirmation link. If you already have an account, use Login."
      );

      form.reset();
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <section
        id="register-page"
        className="mycoach-auth"
        aria-labelledby="register-title"
      >
        <form
          id="register"
          className="mycoach-auth__form"
          onSubmit={handleSubmit}
          aria-busy={loading}
        >
          <span className="mycoach-auth__eyebrow">Join the community</span>

          <h2 id="register-title">Create your account</h2>

          <p className="mycoach-auth__intro">
            Build healthy habits with people who support your goals.
          </p>

          <div className="mycoach-auth__names">
            <div>
              <label htmlFor="register-first-name">First name</label>
              <input
                type="text"
                id="register-first-name"
                name="first_name"
                autoComplete="given-name"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="register-last-name">Last name</label>
              <input
                type="text"
                id="register-last-name"
                name="last_name"
                autoComplete="family-name"
                disabled={loading}
                required
              />
            </div>
          </div>

          <label htmlFor="register-email">Email</label>
          <input
            type="email"
            id="register-email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            type="password"
            id="register-password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            disabled={loading}
            required
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            autoComplete="new-password"
            minLength={8}
            disabled={loading}
            required
          />

          <fieldset className="auth-role" disabled={loading}>
            <legend>I am joining as a</legend>

            <label>
              <input
                type="radio"
                name="role"
                value="Client"
                defaultChecked
              />
              <span>Client</span>
            </label>

            <label>
              <input type="radio" name="role" value="Coach" />
              <span>Coach</span>
            </label>
          </fieldset>

          <label htmlFor="register-avatar">
            Profile picture URL (optional)
          </label>
          <input
            type="url"
            id="register-avatar"
            name="img_url"
            placeholder="https://example.com/photo.jpg"
            aria-describedby="avatar-help"
            disabled={loading}
          />

          <small id="avatar-help" className="mycoach-auth__help">
            Use a direct link to your image.
          </small>

          {error && (
            <p role="alert" className="mycoach-auth__help">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="mycoach-auth__help">
              {message}
            </p>
          )}

          <button
            className="mycoach-auth__submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mycoach-auth__footer">
            Already a member? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </AuthLayout>
  );
}
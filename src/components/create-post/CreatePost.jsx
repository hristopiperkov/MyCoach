import { useState } from "react";
import { Link } from "react-router";
import supabase from "../../supabase";
import "./CreatePost.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setMessage("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const trimmedImageUrl = imageUrl.trim();

    if (trimmedTitle.length < 3 || trimmedTitle.length > 120) {
      setError("The title must contain between 3 and 120 characters.");
      return;
    }

    if (trimmedContent.length < 10 || trimmedContent.length > 10000) {
      setError("The content must contain between 10 and 10,000 characters.");
      return;
    }

    if (trimmedImageUrl) {
      try {
        const url = new URL(trimmedImageUrl);

        if (
          !["http:", "https:"].includes(url.protocol) ||
          /\s/.test(trimmedImageUrl)
        ) {
          throw new Error();
        }
      } catch {
        setError("Enter a valid image URL starting with http:// or https://.");
        return;
      }
    }

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setSaving(true);

    try {
      const { error: requestError } = await supabase
        .from("posts")
        .insert({
          title: trimmedTitle,
          content: trimmedContent,
          image_url: trimmedImageUrl || null,
        });

      if (requestError) throw requestError;

      setTitle("");
      setContent("");
      setImageUrl("");
      setMessage("Your post was created successfully.");
    } catch (error) {
      setError(error.message || "Could not create your post. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="post-editor">
      <section className="card">
        <span className="sub lime">Share your journey</span>
        <h1>Create a post</h1>
        <p className="muted">
          Share progress, training tips, or a little motivation.
        </p>

        <form onSubmit={handleSubmit} aria-busy={saving}>
          <fieldset disabled={saving}>
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              name="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setMessage("");
              }}
              minLength={3}
              maxLength={120}
              placeholder="What would you like to share?"
              required
            />

            <label htmlFor="post-content">Content</label>
            <textarea
              id="post-content"
              name="content"
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setMessage("");
              }}
              minLength={10}
              maxLength={10000}
              rows={8}
              placeholder="Tell the community about it..."
              required
            />

            <label htmlFor="post-image">Image URL (optional)</label>
            <input
              id="post-image"
              name="image_url"
              type="url"
              value={imageUrl}
              onChange={(event) => {
                setImageUrl(event.target.value);
                setMessage("");
              }}
              placeholder="https://example.com/photo.jpg"
            />

            <button className="btn" type="submit">
              {saving ? "Publishing..." : "Publish post"}
            </button>
          </fieldset>

          {error && (
            <p className="errorbox" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="lime" role="status">
              {message}
            </p>
          )}
        </form>

        <Link className="post-editor-back" to="/posts">
          Back to community
        </Link>
      </section>
    </main>
  );
}
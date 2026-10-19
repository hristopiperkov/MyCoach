import { useEffect, useState } from "react";
import { Link } from "react-router";
import supabase from "../../supabase";
import useAuth from "../../hooks/useAuth";
import "./Comments.css";

const commentFields = `
  id,
  content,
  created_at,
  author_id,
  author:users (
    first_name,
    last_name,
    img_url
  )
`;

export default function Comments({ postId }) {
  const { user, loading: authLoading } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadComments() {
      setLoading(true);
      setError("");

      try {
        if (!supabase) {
          throw new Error("Supabase is not configured.");
        }

        const { data, error: requestError } = await supabase
          .from("comments")
          .select(commentFields)
          .eq("post_id", postId)
          .order("created_at", { ascending: true })
          .abortSignal(controller.signal);

        if (requestError) throw requestError;

        if (!controller.signal.aborted) {
          setComments(data ?? []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message || "Could not load comments.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadComments();

    return () => controller.abort();
  }, [postId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user || saving || loading || error) return;

    setSubmitError("");

    const text = content.trim();

    if (!text || text.length > 2000) {
      setSubmitError("Write a comment between 1 and 2,000 characters.");
      return;
    }

    setSaving(true);

    try {
      if (!supabase) {
        throw new Error("Supabase is not configured.");
      }

      const { data, error: requestError } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          content: text,
        })
        .select(commentFields)
        .single();

      if (requestError) throw requestError;

      setComments((currentComments) => [...currentComments, data]);
      setContent("");
    } catch (error) {
      setSubmitError(error.message || "Could not add your comment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="post-comments" aria-labelledby="comments-title">
      <h2 id="comments-title">
        Comments
        {!loading && !error && ` (${comments.length})`}
      </h2>

      {loading && <p role="status">Loading comments...</p>}

      {error && (
        <p className="errorbox" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && comments.length === 0 && (
        <p className="muted">
          No comments yet. Start the conversation!
        </p>
      )}

      {!loading &&
        !error &&
        comments.map((comment) => {
          const authorName =
            [
              comment.author?.first_name,
              comment.author?.last_name,
            ]
              .filter(Boolean)
              .join(" ") || "Community member";

          return (
            <article className="card comment-item" key={comment.id}>
              <div className="person">
                {comment.author?.img_url ? (
                  <img
                    className="avatar"
                    src={comment.author.img_url}
                    alt=""
                  />
                ) : (
                  <span className="avatar">
                    {comment.author?.first_name?.[0]}
                    {comment.author?.last_name?.[0]}
                  </span>
                )}

                <div>
                  <b>{authorName}</b>

                  <p className="muted">
                    <time dateTime={comment.created_at}>
                      {new Date(comment.created_at).toLocaleString()}
                    </time>
                  </p>
                </div>
              </div>

              <p className="comment-content">{comment.content}</p>
            </article>
          );
        })}

      {authLoading ? (
        <p role="status">Checking session...</p>
      ) : user ? (
        <form
          className="comment-editor"
          onSubmit={handleSubmit}
          aria-busy={saving}
        >
          <label htmlFor="new-comment">Add a comment</label>

          <textarea
            id="new-comment"
            name="content"
            rows={3}
            maxLength={2000}
            placeholder="Share a thought or encourage someone..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={saving || loading || !!error}
            required
          />

          <button
            className="btn"
            type="submit"
            disabled={saving || loading || !!error}
          >
            {saving ? "Posting..." : "Post comment"}
          </button>

          {submitError && (
            <p className="errorbox" role="alert">
              {submitError}
            </p>
          )}
        </form>
      ) : (
        <p className="muted">
          <Link
            to="/login"
            state={{ from: `/posts/${postId}` }}
          >
            Log in
          </Link>{" "}
          to add a comment.
        </p>
      )}
    </section>
  );
}
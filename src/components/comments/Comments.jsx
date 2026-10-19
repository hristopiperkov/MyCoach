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
  const [attempt, setAttempt] = useState(0);

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [message, setMessage] = useState("");

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
          .order("id", { ascending: true })
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
  }, [postId, attempt]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !user ||
      authLoading ||
      saving ||
      loading ||
      error ||
      deletingId !== null
    ) {
      return;
    }

    setSubmitError("");
    setDeleteError("");
    setMessage("");

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
      setMessage("Comment added.");
    } catch (error) {
      setSubmitError(error.message || "Could not add your comment.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(comment) {
    if (
      !user ||
      authLoading ||
      user.id !== comment.author_id ||
      deletingId !== null ||
      saving
    ) {
      return;
    }

    if (!window.confirm("Delete this comment?")) return;

    setDeleteError("");
    setSubmitError("");
    setMessage("");
    setDeletingId(comment.id);

    try {
      if (!supabase) {
        throw new Error("Supabase is not configured.");
      }

      const { data, error: requestError } = await supabase
        .from("comments")
        .delete()
        .eq("id", comment.id)
        .eq("author_id", user.id)
        .select("id");

      if (requestError) throw requestError;

      if (!data?.length) {
        throw new Error(
          "The comment could not be deleted. It may already be removed or you may no longer have permission."
        );
      }

      setComments((currentComments) =>
        currentComments.filter((item) => item.id !== comment.id)
      );

      setMessage("Comment deleted.");
    } catch (error) {
      setDeleteError(error.message || "Could not delete your comment.");
    } finally {
      setDeletingId(null);
    }
  }

  const formDisabled =
    saving || loading || !!error || deletingId !== null;

  return (
    <section
      className="post-comments"
      aria-labelledby={`comments-title-${postId}`}
    >
      <h2 id={`comments-title-${postId}`}>
        Comments
        {!loading && !error && ` (${comments.length})`}
      </h2>

      {loading && <p role="status">Loading comments...</p>}

      {error && (
        <div>
          <p className="errorbox" role="alert">
            {error}
          </p>

          <button
            className="btn outline"
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again
          </button>
        </div>
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
                    loading="lazy"
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

              {!authLoading && user?.id === comment.author_id && (
                <button
                  className="btn outline"
                  type="button"
                  disabled={deletingId !== null || saving}
                  onClick={() => handleDelete(comment)}
                >
                  {deletingId === comment.id
                    ? "Deleting..."
                    : "Delete comment"}
                </button>
              )}
            </article>
          );
        })}

      {deleteError && (
        <p className="errorbox" role="alert">
          {deleteError}
        </p>
      )}

      {authLoading ? (
        <p role="status">Checking session...</p>
      ) : user ? (
        <form
          className="comment-editor"
          onSubmit={handleSubmit}
          aria-busy={saving}
        >
          <label htmlFor={`new-comment-${postId}`}>
            Add a comment
          </label>

          <textarea
            id={`new-comment-${postId}`}
            name="content"
            rows={3}
            maxLength={2000}
            placeholder="Share a thought or encourage someone..."
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setMessage("");
            }}
            disabled={formDisabled}
            required
          />

          <button
            className="btn"
            type="submit"
            disabled={formDisabled}
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
          <Link to="/login" state={{ from: `/posts/${postId}` }}>
            Log in
          </Link>{" "}
          to add a comment.
        </p>
      )}

      {message && (
        <p className="lime" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
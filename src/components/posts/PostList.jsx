import { useEffect, useState } from "react";
import { Link } from "react-router";
import supabase from "../../supabase";
import useAuth from "../../hooks/useAuth";
import Comments from "../comments/Comments";
import "./PostList.css";

export default function PostList({ authorId = null }) {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      setLoading(true);
      setError("");

      try {
        if (!supabase) {
          throw new Error("Supabase is not configured.");
        }

        let query = supabase
          .from("posts")
          .select(`
            id,
            title,
            content,
            image_url,
            created_at,
            author_id,
            author:users!posts_author_id_fkey (
              first_name,
              last_name,
              img_url,
              role
            )
          `)
          .order("created_at", { ascending: false });

        if (authorId) {
          query = query.eq("author_id", authorId);
        }

        const { data, error: requestError } = await query.abortSignal(
          controller.signal
        );

        if (requestError) throw requestError;

        if (!controller.signal.aborted) {
          setPosts(data ?? []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message || "Could not load posts.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => controller.abort();
  }, [authorId, attempt]);

  if (loading) {
    return <p role="status">Loading posts...</p>;
  }

  if (error) {
    return (
      <div className="card">
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
    );
  }

  if (posts.length === 0) {
    return (
      <p className="muted">
        {authorId
          ? "You haven't published any posts yet."
          : "No posts yet. Be the first to share something!"}
      </p>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => {
        const author = post.author;
        const authorName =
          [author?.first_name, author?.last_name]
            .filter(Boolean)
            .join(" ") || "Community member";

        return (
          <article className="card feedpost" key={post.id}>
            <div className="person">
              {author?.img_url ? (
                <img
                  className="avatar"
                  src={author.img_url}
                  alt=""
                />
              ) : (
                <span className="avatar">
                  {author?.first_name?.[0]}
                  {author?.last_name?.[0]}
                </span>
              )}

              <div>
                <b>{authorName}</b>

                {author?.role && (
                  <span className="pill">{author.role}</span>
                )}

                <p className="muted">
                  <time dateTime={post.created_at}>
                    {new Date(post.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </p>
              </div>
            </div>

            <h2>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>

            <p className="post-list-content">{post.content}</p>

            {post.image_url && (
              <Link
                to={`/posts/${post.id}`}
                aria-label={`Open post: ${post.title}`}
              >
                <img
                  className="post-list-image"
                  src={post.image_url}
                  alt={post.title}
                  loading="lazy"
                />
              </Link>
            )}

            <Comments
              key={`${post.id}-${user?.id ?? "guest"}`}
              postId={post.id}
            />
          </article>
        );
      })}
    </div>
  );
}
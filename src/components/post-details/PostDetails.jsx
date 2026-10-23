import useToast from "../../hooks/useToast";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import usePost from "../../hooks/usePost";
import { deletePost } from "../../services/postService";
import Comments from "../comments/Comments";
import "../posts/PostList.css";
import "./PostDetails.css";

export default function PostDetails() {
  const toast = useToast();
  const { postId } = useParams();
  const { user } = useAuth();
  const { post, loading, error, retry } = usePost(postId);
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const isAuthor = !!user && user.id === post?.author_id;

  async function handleDelete() {
    if (!isAuthor || deleting) return;

    if (!window.confirm("Delete this post permanently?")) return;

    setDeleting(true);


    try {
      await deletePost(post.id, user.id);
      toast.success("Post deleted.");
      navigate("/my-posts", { replace: true });
    } catch (error) {
      toast.error(error.message || "Could not delete the post.");
    } finally {
      setDeleting(false);
    }
  }

  const authorName =
    [post?.author?.first_name, post?.author?.last_name]
      .filter(Boolean)
      .join(" ") || "Community member";

  return (
    <main className="post-detail-page dark">
      <Link className="btn outline" to="/posts">
        ← Community
      </Link>

      {loading ? (
        <p role="status">Loading post...</p>
      ) : error ? (
        <div>
          <p className="errorbox" role="alert">
            {error}
          </p>
          <button className="btn" type="button" onClick={retry}>
            Try again
          </button>
        </div>
      ) : !post ? (
        <section className="card">
          <h1>Post not found</h1>
          <p>This post may have been deleted.</p>
        </section>
      ) : (
        <article className="card post-detail-card">
          <div className="person">
            {post.author?.img_url ? (
              <img
                className="avatar"
                src={post.author.img_url}
                alt=""
              />
            ) : (
              <span className="avatar">
                {post.author?.first_name?.[0]}
                {post.author?.last_name?.[0]}
              </span>
            )}

            <div>
              <b>{authorName}</b>

              <p className="muted">
                {post.author?.role && `${post.author.role} · `}
                <time dateTime={post.created_at}>
                  {new Date(post.created_at).toLocaleString()}
                </time>
              </p>
            </div>
          </div>

          <h1>{post.title}</h1>

          <p className="post-list-content">{post.content}</p>

          {post.image_url && (
            <img
              className="post-list-image"
              src={post.image_url}
              alt={post.title}
            />
          )}

          {isAuthor && (
            <div className="post-detail-actions">
              {!deleting && (
                <Link className="btn" to={`/posts/${post.id}/edit`}>
                  Edit post
                </Link>
              )}

              <button
                className="btn outline"
                type="button"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? "Deleting..." : "Delete post"}
              </button>
            </div>
          )}

          <Comments
            key={`${post.id}-${user?.id ?? "guest"}`}
            postId={post.id}
          />
        </article>
      )}
    </main>
  );
}
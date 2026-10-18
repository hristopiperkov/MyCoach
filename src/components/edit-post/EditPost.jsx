import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import usePost from "../../hooks/usePost";
import { updatePost, validatePost } from "../../services/postService";
import "../post-details/PostDetails.css";

function EditForm({ post, authorId }) {
  const [values, setValues] = useState({ title: post.title, content: post.content, image_url: post.image_url || "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  function change(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
  }
  async function save(event) {
    event.preventDefault();
    if (saving) return;
    setError("");
    try {
      const validated = validatePost(values);
      setSaving(true);
      await updatePost(post.id, authorId, validated);
      navigate(`/posts/${post.id}`, { replace: true });
    } catch (error) { setError(error.message || "Could not save changes."); }
    finally { setSaving(false); }
  }
  return <section className="card"><h1>Edit post</h1><form onSubmit={save} aria-busy={saving}>
    <fieldset disabled={saving}>
      <label>Title<input name="title" value={values.title} onChange={change} minLength={3} maxLength={120} required /></label>
      <label>Content<textarea name="content" value={values.content} onChange={change} minLength={10} maxLength={10000} rows={8} required /></label>
      <label>Image URL (optional)<input type="url" name="image_url" value={values.image_url} onChange={change} /></label>
      <button type="submit" className="btn">{saving ? "Saving..." : "Save changes"}</button>
    </fieldset>
    {error && <p className="errorbox" role="alert">{error}</p>}
  </form>{!saving && <Link className="btn outline" to={`/posts/${post.id}`}>Cancel</Link>}</section>;
}

export default function EditPost() {
  const { postId } = useParams();
  const { user } = useAuth();
  const { post, loading, error, retry } = usePost(postId);
  return <main className="edit-post-page dark">
    {loading ? <p role="status">Loading post...</p> : error ? <div role="alert"><p>{error}</p><button className="btn" onClick={retry}>Try again</button></div> : !post ? <section className="card"><h1>Post not found</h1><Link to="/posts">Back to community</Link></section> : user?.id !== post.author_id ? <section className="card"><h1>You cannot edit this post</h1><p>Only its author can make changes.</p><Link to={`/posts/${post.id}`}>Back to post</Link></section> : <EditForm key={post.id} post={post} authorId={user.id} />}
  </main>;
}

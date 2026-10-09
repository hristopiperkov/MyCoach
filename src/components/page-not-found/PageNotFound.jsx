import { Link } from "react-router";

export default function PageNotFound() {
  return (
    <main className="page">
      <h1>404 — Page not found</h1>
      <Link className="btn" to="/posts">
        Back to community
      </Link>
    </main>
  );
}
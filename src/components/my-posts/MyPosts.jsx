import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import PostList from "../posts/PostList";

export default function MyPosts() {
  const { user } = useAuth();
  return <main className="my-posts-page dark">
    <div className="sectionhead">
      <div><span className="sub lime">Your journey</span><h1>My posts</h1></div>
      <Link className="btn" to="/posts/new">+ Create post</Link>
    </div>
    {user && <PostList key={user.id} authorId={user.id} />}
  </main>;
}

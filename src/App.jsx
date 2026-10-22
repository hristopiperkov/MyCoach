import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import useAuth from "./hooks/useAuth";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import GuestRoute from "./components/guards/GuestRoute";
import Header from "./components/header/Header";
import Community from "./components/community/Community";
import CoachCatalog from "./components/coach-catalog/CoachCatalog";
import CoachDetails from "./components/coach-details/CoachDetails";
import Profile from "./components/profile/Profile";
import CreatePost from "./components/create-post/CreatePost";
import MyPosts from "./components/my-posts/MyPosts";
import PostDetails from "./components/post-details/PostDetails";
import EditPost from "./components/edit-post/EditPost";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import PageNotFound from "./components/page-not-found/PageNotFound";
import "./theme.css";

export default function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const controller = new AbortController();

    async function loadMembers() {
      setLoading(true);
      setError("");

      try {
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!apiKey) {
          throw new Error("The database API key is not configured.");
        }

        const response = await fetch(
          "https://nwoawxvbarblzgrfedqa.supabase.co/rest/v1/users?select=id,first_name,last_name,role,specialization,description,hourly_rate,currency,fitness_goals,img_url,location",
          {
            headers: {
              apikey: apiKey,
            },
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load members.");
        }

        if (!Array.isArray(result)) {
          throw new Error("The database returned an unexpected response.");
        }

        if (!controller.signal.aborted) {
          setUsers(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Could not load members.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMembers();

    return () => controller.abort();
  }, [user?.id]);

  function handleProfileSaved(updatedProfile) {
    setUsers((currentUsers) => {
      const profileExists = currentUsers.some(
        (member) => member.id === updatedProfile.id
      );

      if (!profileExists) {
        return [...currentUsers, updatedProfile];
      }

      return currentUsers.map((member) =>
        member.id === updatedProfile.id
          ? { ...member, ...updatedProfile }
          : member
      );
    });
  }

  const coaches = users.filter((member) => member.role === "Coach");

  return (
    <div
      className={`mycoach-app ${isAuthPage ? "auth-mode" : "content-mode"
        }`}
    >
      <div className="fitness-backdrop" aria-hidden="true"></div>

      <Header compact={isAuthPage} />

      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />

        <Route path="/posts" element={<Community />} />
        <Route path="/posts/:postId" element={<PostDetails />} />

        <Route
          path="/coaches"
          element={
            <CoachCatalog
              coaches={coaches}
              loading={loading}
              error={error}
            />
          }
        />

        <Route path="/coaches/:coachId" element={<CoachDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/profile"
            element={
              <Profile
                key={user?.id}
                onSaved={handleProfileSaved}
              />
            }
          />

          <Route path="/posts/new" element={<CreatePost />} />
          <Route path="/posts/:postId/edit" element={<EditPost />} />
          <Route path="/my-posts" element={<MyPosts />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <footer className="demo">
        MyCoach · Move better. Live better.
      </footer>
    </div>
  );
}
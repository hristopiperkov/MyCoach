import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import GuestRoute from "./components/guards/GuestRoute";
import CoachRoute from "./components/guards/CoachRoute";
import Profile from "./components/profile/Profile";
import useAuth from "./hooks/useAuth";
import Header from "./components/header/Header";
import Community from "./components/community/Community";
import CoachCatalog from "./components/coach-catalog/CoachCatalog";
import Workspace from "./components/coach-workspace/Workspace";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import PageNotFound from "./components/page-not-found/PageNotFound";
import CreatePost from "./components/create-post/CreatePost";

import "./theme.css";

export default function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      "https://nwoawxvbarblzgrfedqa.supabase.co/rest/v1/users?select=id,first_name,last_name,role,specialization,hourly_rate,currency,fitness_goals,img_url,location",
      {
        headers: {
          apikey: import.meta.env.VITE_API_KEY,
        },
        signal: controller.signal,
      }
    )
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load members.");
        }

        if (!Array.isArray(result)) {
          throw new Error("The database returned an unexpected response.");
        }

        return result;
      })
      .then((members) => {
        if (!controller.signal.aborted) {
          setUsers(members);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [user?.id]);

  const coaches = users.filter((user) => user.role === "Coach");

  return (
    <div className={`mycoach-app ${isAuthPage ? "auth-mode" : "content-mode"}`}>
      <div className="fitness-backdrop" aria-hidden="true"></div>

      <Header compact={isAuthPage} />

      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />

        <Route
          path="/posts"
          element={
            <Community
              users={users}
              loading={loading}
              error={error}
            />
          }
        />

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

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile key={user?.id} onSaved={(updated) => setUsers(current => current.some(member => member.id === updated.id) ? current.map(member => member.id === updated.id ? updated : member) : [...current, updated])} />} />
          <Route path="/posts/new" element={<CreatePost />} />
          <Route element={<CoachRoute />}>
            <Route path="/workspace" element={<Workspace />} />
          </Route>
        </Route>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <footer className="demo">MyCoach · Move better. Live better.</footer>

      <div className="notice" role="status" aria-live="polite"></div>

      <dialog className="modal" id="details">
        <h2 id="dialogtitle"></h2>
        <div id="dialogbody"></div>

        <button
          className="btn outline"
          id="closemodal"
          type="button"
          onClick={(event) => event.currentTarget.closest("dialog").close()}
        >
          Close
        </button>
      </dialog>
    </div>
  );
}
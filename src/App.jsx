import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";

import Header from "./components/header/Header";
import Navigation from "./components/navigation/Navigation";
import Community from "./components/community/Community";
import CoachCatalog from "./components/coach-catalog/CoachCatalog";
import Workspace from "./components/coach-workspace/Workspace";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import PageNotFound from "./components/page-not-found/PageNotFound";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      "https://nwoawxvbarblzgrfedqa.supabase.co/rest/v1/users?select=first_name,last_name,role,specialization,hourly_rate,fitness_goals,img_url,location",
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
  }, []);

  const coaches = users.filter((user) => user.role === "Coach");

  return (
    <>
      <div className="fitness-backdrop" aria-hidden="true"></div>

      <Header />
      <Navigation />

      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />

        <Route
          path="/posts"
          element={
            <Community
              users={users}
              coaches={coaches}
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

        <Route path="/workspace" element={<Workspace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <footer className="demo">MyCoach · University project</footer>

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
    </>
  );
}
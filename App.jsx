import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";

import Header from "./components/header/Header";
import Community from "./components/community/Community";
import CoachCatalog from "./components/coach-catalog/CoachCatalog";
import Workspace from "./components/coach-workspace/Workspace";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import PageNotFound from "./components/page-not-found/PageNotFound";

import "./theme.css";
import PrivateRoute from "./components/guards/PrivateRoute";
import GuestRoute from "./components/guards/GuestRoute";
import request from "./utils/request";

export default function App() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    request("/rest/v1/users?select=first_name,last_name,role,specialization,hourly_rate,fitness_goals,img_url,location", "GET", undefined, undefined, { signal: controller.signal })
      .then((result) => {
        if (!Array.isArray(result)) throw new Error("The database returned an unexpected response.");
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

        <Route element={<PrivateRoute />}>
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/my-posts" element={<PageNotFound />} />
          <Route path="/posts/new" element={<PageNotFound />} />
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
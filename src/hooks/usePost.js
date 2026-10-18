import { useEffect, useState } from "react";
import { getPost } from "../services/postService";

export default function usePost(postId) {
  const [state, setState] = useState({ post: null, loading: true, error: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setState({ post: null, loading: true, error: "" });
      try {
        const post = await getPost(postId, controller.signal);
        if (!controller.signal.aborted) setState({ post, loading: false, error: "" });
      } catch (error) {
        if (!controller.signal.aborted) setState({ post: null, loading: false, error: error.message });
      }
    }
    load();
    return () => controller.abort();
  }, [postId, attempt]);
  return { ...state, retry: () => setAttempt(value => value + 1) };
}

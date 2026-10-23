import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ToastContext from "../../contexts/ToastContext";
import "./Toast.css";

function Toast({ item, dismiss }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || item.type === "error") return;
    const timer = setTimeout(() => dismiss(item.id), 6000);
    return () => clearTimeout(timer);
  }, [item, dismiss, paused]);

  return (
    <div className={`mc-toast mc-toast--${item.type}`}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}>
      <span className="mc-toast__icon" aria-hidden="true">{item.type === "error" ? "!" : "✓"}</span>
      <p role={item.type === "error" ? "alert" : "status"}>{item.message}</p>
      <button type="button" className="mc-toast__close" aria-label="Dismiss notification"
        onClick={() => dismiss(item.id)}>×</button>
    </div>
  );
}

export default function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const nextId = useRef(0);
  const dismiss = useCallback((id) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);
  const show = useCallback((message, type) => {
    const item = { id: ++nextId.current, message, type };
    setItems(current => [...current.slice(-3), item]);
  }, []);
  const toast = useMemo(() => ({
    success: message => show(message, "success"),
    error: message => show(message, "error"),
  }), [show]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <section className="mc-toasts" aria-label="Notifications">
        {items.map(item => <Toast key={item.id} item={item} dismiss={dismiss} />)}
      </section>
    </ToastContext.Provider>
  );
}

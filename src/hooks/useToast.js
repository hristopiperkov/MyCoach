import { useContext } from "react";
import ToastContext from "../contexts/ToastContext";

export default function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast requires ToastProvider.");
  return toast;
}

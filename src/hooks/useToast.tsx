import { ToastCreateContext, type ToastContextValue } from "@/contexts/ToastContext";
import { useContext } from "react";



export const useToast = (): ToastContextValue => {
  const context = useContext(ToastCreateContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
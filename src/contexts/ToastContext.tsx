import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import ToasterSnackbar from "@/components/resuable/ToasterSnackbar";

export type ToastVariant = "success" | "error" | "info";

export type ToastContextValue = {
  showToast: (message: string, type?: ToastVariant) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    key: number;
    message: string;
    type: ToastVariant;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastVariant = "success") => {
    setToast((prev) => ({
      key: (prev?.key ?? 0) + 1,
      message,
      type,
    }));
  }, []);

  const showError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );
  const showSuccess = useCallback(
    (message: string) => showToast(message, "success"),
    [showToast],
  );
  const showWarning = useCallback(
    (message: string) => showToast(message, "info"),
    [showToast],
  );

  const value = useMemo(
    () => ({
      showToast,
      showError,
      showSuccess,
      showWarning,
    }),
    [showToast, showError, showSuccess, showWarning],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast !== null ? (
        <ToasterSnackbar
          key={toast.key}
          message={toast.message}
          type={toast.type}
        />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

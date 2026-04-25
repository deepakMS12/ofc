import ToasterSnackbar from "@/components/resuable/ToasterSnackbar";
import { createContext, useEffect, useState, type ReactNode } from "react";



type ToastType = "success" | "error" | "warning" | "info";
type ShowToastFn = (msg: string, type?: ToastType) => void;

export type ToastContextValue = {
  showToast: ShowToastFn;
};

export const ToastCreateContext = createContext<ToastContextValue | undefined>(undefined);


let globalShowToast: ShowToastFn | null = null;

export const getGlobalToast = () => {
  return globalShowToast;
};

export const ToastContext = ({ children }: { children: ReactNode }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  const showToast: ShowToastFn = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setToastOpen(true);
  };

  
  useEffect(() => {
    globalShowToast = showToast;
    return () => {
      globalShowToast = null;
    };
  }, []);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <ToastCreateContext.Provider value={{ showToast }}>
      {children}
      <ToasterSnackbar
        isOpen={toastOpen}
        message={toastMessage}
        type={toastType}
        onClose={handleToastClose}
      />
    </ToastCreateContext.Provider>
  );
};
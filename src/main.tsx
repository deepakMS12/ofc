import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import "@/styles/globals.css";
import "sweetalert2/dist/sweetalert2.min.css";

const rootElement = document.querySelector<HTMLDivElement>("#app");

if (!rootElement) {
  throw new Error("Root element #app not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

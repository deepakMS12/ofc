import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider from "@/components/providers/ThemeProvider";

import "@/styles/globals.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { ToastContext } from "./contexts/ToastContext";

const rootElement = document.querySelector<HTMLDivElement>("#app");

if (!rootElement) {
  throw new Error("Root element #app not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ToastContext>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ToastContext>
  </React.StrictMode>,
);

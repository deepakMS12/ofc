import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
} from "@mui/material";
import netLostImg from "../../../public/assets/images/net-lost.jpg";

const APP_TITLE = "OFC";
const DEFAULT_FAVICON = "/assets/assets/images/icon/favicon/favicon.ico";
const OFFLINE_FAVICON = "/offline.png";
const RETRY_INTERVAL = 5;

const updateFavicon = (iconPath: string) => {
  const existingLinks = document.querySelectorAll("link[rel*='icon']");
  existingLinks.forEach((link) => link.remove());

  const link = document.createElement("link");
  link.type = "image/png";
  link.rel = "shortcut icon";
  link.href = iconPath;
  document.getElementsByTagName("head")[0].appendChild(link);

  const appleLink = document.createElement("link");
  appleLink.rel = "apple-touch-icon";
  appleLink.href = iconPath;
  document.getElementsByTagName("head")[0].appendChild(appleLink);
};

const resetFavicon = () => {
  const existingLinks = document.querySelectorAll("link[rel*='icon']");
  existingLinks.forEach((link) => link.remove());

  const link = document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = DEFAULT_FAVICON;
  document.getElementsByTagName("head")[0].appendChild(link);
};

const OfflineStatusModal: React.FC = () => {
  const [open, setOpen] = useState(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );
  const [retryCountdown, setRetryCountdown] = useState(RETRY_INTERVAL);
  const countdownRef = useRef(RETRY_INTERVAL);

  const goOnline = useCallback(() => {
    setOpen(false);
    setRetryCountdown(RETRY_INTERVAL);
    countdownRef.current = RETRY_INTERVAL;
    document.title = APP_TITLE;
    resetFavicon();
  }, []);

  const syncNavigatorOffline = useCallback(() => {
    const offline = !navigator.onLine;
    if (!offline) {
      goOnline();
    } else {
      setOpen(true);
    }
  }, [goOnline]);

  useEffect(() => {
    syncNavigatorOffline();
    window.addEventListener("offline", syncNavigatorOffline);
    window.addEventListener("online", syncNavigatorOffline);
    return () => {
      window.removeEventListener("offline", syncNavigatorOffline);
      window.removeEventListener("online", syncNavigatorOffline);
    };
  }, [syncNavigatorOffline]);

  useEffect(() => {
    if (!open) return;

    document.title = `Offline - ${APP_TITLE}`;
    updateFavicon(OFFLINE_FAVICON);

    const interval = setInterval(() => {
      countdownRef.current -= 1;
      setRetryCountdown(countdownRef.current);

      if (countdownRef.current <= 0) {
        if (navigator.onLine) {
          goOnline();
        } else {
          countdownRef.current = RETRY_INTERVAL;
          setRetryCountdown(RETRY_INTERVAL);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [open, goOnline]);

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24,
          backgroundColor: "#fff",
          border: "1px solid #e0e0e0",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="img"
            src={netLostImg}
            alt="No internet connection"
            sx={{ width: 90, height: 90, objectFit: "contain", flexShrink: 0 }}
          />

          <Box>
            <Typography variant="h5" sx={{ color: "#000", fontWeight: 600, mb: 0.75 }}>
              Internet Connection Lost
            </Typography>

            <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.5, mb: 1.25 }}>
              Please check your network connection. We'll automatically retry.
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#f44336", fontWeight: 600, fontFamily: "monospace", fontSize: "0.875rem" }}
            >
              Retrying in {retryCountdown}s...
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineStatusModal;

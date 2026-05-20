import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import { useToast } from "@/hooks/useToast";
import offlineIcon from "../../../public/offline.png"


const APP_TITLE = "OFC";
const DEFAULT_FAVICON = "/assets/assets/images/icon/favicon/favicon.ico";
const OFFLINE_FAVICON = "/offline.png";

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

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

/**
 * Full-screen offline notice when the browser reports no network.
 * UI matches the legacy TMS modal; logic is adapted for this app (no status API).
 */
const OfflineStatusModal: React.FC = () => {
  const [open, setOpen] = useState(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );
  const [offlineSessionStart, setOfflineSessionStart] = useState<number | null>(
    null,
  );
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { showToast } = useToast();
  const isLoading = false;

  const syncNavigatorOffline = useCallback(() => {
    const offline = !navigator.onLine;
    setOpen(offline);
    if (offline) {
      setOfflineSessionStart((prev) => (prev === null ? Date.now() : prev));
    } else {
      setOfflineSessionStart(null);
    }
  }, []);

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
    if (!open || offlineSessionStart === null) return;

    const startTimestamp = offlineSessionStart;

    const getElapsedTime = () =>
      Math.max(Math.floor((Date.now() - startTimestamp) / 1000), 0);

    setTimeElapsed(getElapsedTime());

    const interval = setInterval(() => {
      setTimeElapsed(getElapsedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [open, offlineSessionStart]);

  useEffect(() => {
    if (open) {
      document.title = `Offline - ${APP_TITLE}`;
      updateFavicon(OFFLINE_FAVICON);
    } else {
      document.title = APP_TITLE;
      resetFavicon();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.title = `${formatTime(timeElapsed)}`;
    }
  }, [timeElapsed, open]);

  const handleResumeClick = () => {
    if (!navigator.onLine) {
      showToast(
        "You are still offline. Check your connection and try again.",
        "error",
      );
      return;
    }

    setOpen(false);
    setOfflineSessionStart(null);
    setTimeElapsed(0);
    document.title = APP_TITLE;
    resetFavicon();
  };

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
      <DialogContent
        sx={{
          p: 3,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
          }}
        >
   
          <img  src={offlineIcon} style={{width:72, height: 72, objectFit: "contain", marginRight:15 }}  />

          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "#000",
                fontWeight: 600,
                mb: 1,
              }}
            >
              You're offline
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#666",
                lineHeight: 1.4,
                mb: 1,
              }}
            >
              Document conversions, uploads, and API requests are paused until
              your internet connection is restored.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#f44336",
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            >
              Offline for: {formatTime(timeElapsed)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            onClick={handleResumeClick}
            sx={{
              backgroundColor: "#ff9800",
              color: "#fff",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#f57c00",
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={22} /> : "Resume"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineStatusModal;

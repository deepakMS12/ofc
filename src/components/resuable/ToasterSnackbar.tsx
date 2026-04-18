import {
  CheckCircleOutlineRounded,
  CloseRounded,
  ErrorOutlineRounded,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Slide,
  Snackbar,
  Typography,
  type SlideProps,
} from "@mui/material";
import { forwardRef, useEffect, useMemo, useState } from "react";

type ToasterSnackbarProps = {
  error?: unknown;
  isError?: boolean;
  message?: string;
  type?: "error" | "success" | "info";
  title?: string;
  open?: boolean;
  autoHideDuration?: number;
  fallbackMessage?: string;
};

const TransitionDown = forwardRef(function TransitionDown(
  props: SlideProps,
  ref: React.Ref<unknown>,
) {
  return <Slide {...props} direction="down" ref={ref} />;
});

const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (!error) return fallbackMessage;

  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const apiError = error as {
      error?: string;
      message?: string;
      data?: unknown;
    };

    if (typeof apiError.data === "string") return apiError.data;

    if (apiError.data && typeof apiError.data === "object") {
      const data = apiError.data as {
        message?: string;
        error?: string;
        detail?: string;
      };

      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.detail) return data.detail;
    }

    if (apiError.message) return apiError.message;
    if (apiError.error) return apiError.error;
  }

  return fallbackMessage;
};

const SNACKBAR_VARIANT_CONFIG: Record<
  NonNullable<ToasterSnackbarProps["type"]>,
  {
    title: string;
    message: string;
    color: string;
    icon: typeof CheckCircleOutlineRounded;
  }
> = {
  success: {
    title: "Everything worked!",
    message: "Action completed successfully.",
    color: "#53d67b",
    icon: CheckCircleOutlineRounded,
  },
  info: {
    title: "Did you know?",
    message: "Here is something helpful for you.",
    color: "#4f7cff",
    icon: InfoOutlined,
  },
  error: {
    title: "Something went wrong",
    message: "Something went wrong. Please try again.",
    color: "#ff6f6f",
    icon: ErrorOutlineRounded,
  },
};

const ToasterSnackbar = ({
  error,
  isError = true,
  message,
  type = "error",
  title,
  open,
  autoHideDuration = 4000,
  fallbackMessage,
}: ToasterSnackbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const variant = SNACKBAR_VARIANT_CONFIG[type];
  const Icon = variant.icon;

  const resolvedMessage = useMemo(
    () =>
      message ??
      (type === "error"
        ? getApiErrorMessage(
            error,
            fallbackMessage ?? SNACKBAR_VARIANT_CONFIG.error.message,
          )
        : (fallbackMessage ?? variant.message)),
    [error, fallbackMessage, message, type],
  );

  const shouldOpen =
    typeof open === "boolean"
      ? open
      : type === "error"
        ? Boolean(isError && error)
        : Boolean(message);

  useEffect(() => {
    if (typeof open === "boolean") {
      setIsOpen(open);
      return;
    }

    if (shouldOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [open, shouldOpen]);

  if (!shouldOpen && !isOpen) return null;

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      TransitionComponent={TransitionDown}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={(_, reason) => {
        if (reason === "clickaway") return;
        setIsOpen(false);
      }}
    >
      <Box
        sx={{
          width: { xs: "calc(100vw - 32px)", sm: 400 },
          maxWidth: "100%",
          bgcolor: "#ffffff",
          color: "#000000",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          py: 2.5,
          pl: 2.5,
          pr: 6.5,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: 4,
            top: 8,
            bottom: 8,
            width: 5,
            borderRadius: 999,
            bgcolor: variant.color,
          }}
        />
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            mr: 2,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            bgcolor: `${variant.color}22`,
            color: variant.color,
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ fontSize: 15, lineHeight: 1.2, fontWeight: 600, mb: 0.5 }}
          >
            {title ?? variant.title}
          </Typography>
          <Typography
            sx={{
              color: "rgb(78, 78, 78)",
              fontSize: 12,
              lineHeight: 1.4,
              overflowWrap: "anywhere",
            }}
          >
            {resolvedMessage}
          </Typography>
        </Box>
        <IconButton
          onClick={() => setIsOpen(false)}
          size="small"
          aria-label="Close snackbar"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
               color: "rgb(78, 78, 78)",
            "&:hover": { color: "#ffffff", bgcolor: "rgba(0,0,0,0.08)" },
          }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

export default ToasterSnackbar;

import {
  CheckCircleOutlineRounded,
  CloseRounded,
  ErrorOutlineRounded,
  InfoOutlined,
  WarningAmberRounded,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Slide,
  Snackbar,
  Typography,
  type SlideProps,
} from "@mui/material";
import { forwardRef } from "react";

type ToasterSnackbarProps = {
  isOpen?: boolean;
  message?: string;
  type?: "success" | "error" | "warning" | "info";
  onClose?: () => void;
};

const TransitionDown = forwardRef(function TransitionDown(
  props: SlideProps,
  ref: React.Ref<unknown>,
) {
  return <Slide {...props} direction="down" ref={ref} />;
});

const SNACKBAR_VARIANT_CONFIG: Record<
  NonNullable<ToasterSnackbarProps["type"]>,
  {
    bg: string;
    textColor: string;
    accent: string;
    borderColor: string;
    closeColor: string;
    icon: typeof CheckCircleOutlineRounded;
  }
> = {
  success: {
    bg: "#ffffff",
    textColor: "#111827",
    accent: "#22c55e",
    borderColor: "rgba(15,23,42,0.08)",
    closeColor: "#64748b",
    icon: CheckCircleOutlineRounded,
  },
  info: {
    bg: "#eff6ff",
    textColor: "#1e3a8a",
    accent: "#3b82f6",
    borderColor: "#bfdbfe",
    closeColor: "#1d4ed8",
    icon: InfoOutlined,
  },
  error: {
    bg: "#fef2f2",
    textColor: "#991b1b",
    accent: "#ef4444",
    borderColor: "#fecaca",
    closeColor: "#b91c1c",
    icon: ErrorOutlineRounded,
  },
  warning: {
    bg: "#fff7ed",
    textColor: "#9a3412",
    accent: "#f59e0b",
    borderColor: "#fed7aa",
    closeColor: "#c2410c",
    icon: WarningAmberRounded,
  },
};

const ToasterSnackbar = ({
  isOpen,
  message,
  type = "success",
  onClose,
}: ToasterSnackbarProps) => {
  const variant = SNACKBAR_VARIANT_CONFIG[type];
  const Icon = variant.icon;

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={5000}
      TransitionComponent={TransitionDown}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
      key={"top" + "center"}
    >
      <Box
        sx={{
          width: { xs: "calc(100vw - 32px)", sm: 400 },
          maxWidth: "100%",
          bgcolor: variant.bg,
          color: variant.textColor,
          borderRadius: 3,
          border: "1px solid",
          borderColor: variant.borderColor,
          boxShadow: "0 4px 8px 0 rgba(53, 73, 118, 0.12), 0 0 1px 0 rgba(53, 73, 118, 0.12)",
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
            bgcolor: variant.accent,
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
            bgcolor: `${variant.accent}22`,
            color: variant.accent,
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ fontSize: 15, lineHeight: 1.2, fontWeight: 600, mb: 0.5 }}
          >
            {message}
          </Typography>
        </Box>
        <IconButton
          onClick={() => onClose?.()}
          size="small"
          aria-label="Close snackbar"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: variant.closeColor,
            "&:hover": { color: variant.closeColor, bgcolor: "rgba(15,23,42,0.06)" },
          }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

export default ToasterSnackbar;

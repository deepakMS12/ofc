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
import { forwardRef } from "react";

type ToasterSnackbarProps = {
  isOpen?: boolean;
  message?: string;
  type?: "success" | "error" | "info";
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
          bgcolor: "#202835",
          color: "#f1f5ff",
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
            color: "rgba(210,220,236,0.7)",
            "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

export default ToasterSnackbar;

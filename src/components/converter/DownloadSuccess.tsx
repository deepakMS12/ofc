import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { colors } from "@/utils/customColor";

const iconPop = keyframes`
  0% {
    transform: scale(0.35);
    opacity: 0;
  }
  55% {
    transform: scale(1.08);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export type DownloadSuccessProps = {
  title: string;
  subtitle?: string;
};
export default function DownloadSuccess({
  title,
  subtitle = "Your PDF download has started. Check your downloads folder.",
}: DownloadSuccessProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        py: 4,
        maxWidth: 420,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          bgcolor: colors.switch,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          mb: 3,
          boxShadow: `0 8px 24px rgba(53, 171, 92, 0.28)`,
          animation: `${iconPop} 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
        }}
      >
        <CheckRoundedIcon sx={{ fontSize: 48 }} aria-hidden />
      </Box>

      <Typography
        component="h2"
        sx={{
          fontSize: { xs: "1.35rem", sm: "1.5rem" },
          fontWeight: 700,
          color: "#2f2f33",
          lineHeight: 1.35,
          mb: 1,
          animation: `${fadeUp} 0.5s ease 0.15s both`,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          lineHeight: 1.6,
          maxWidth: 360,
          animation: `${fadeUp} 0.55s ease 0.28s both`,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

import { colors } from "@/utils/customColor";
import { Box, CircularProgress, Typography } from "@mui/material";

export type ConverterLoadingWorkspaceProps = {
  title: string;
  subtitle?: string;
};

export default function ConverterLoadingWorkspace({
  title,
  subtitle = "Please wait, don't close your browser.",
}: ConverterLoadingWorkspaceProps) {
  const size = 88;
  const thickness = 4.5;

  return (
    <Box
      role="status"
      aria-busy="true"
      aria-live="polite"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: "100%",
        minHeight: { xs: 280, md: 360 },
        px: 2,
        py: 4,
        bgcolor: "transparent",
        borderRadius: 2,
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: "1.125rem", sm: "1.25rem" },
          fontWeight: 700,
          color: "#374151",
          lineHeight: 1.4,
          mb: 4,
          maxWidth: 480,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: size,
          height: size,
          mb: 3,
        }}
      >
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={thickness}
          sx={{
            color: "#e5e7eb",
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          size={size}
          thickness={thickness}
          sx={{
            color: colors.primary,
            position: "absolute",
            left: 0,
            top: 0,
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: "#6b7280",
          lineHeight: 1.6,
          maxWidth: 360,
          fontSize: "0.9375rem",
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

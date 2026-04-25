import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Google } from "@mui/icons-material";
import { keyframes } from "@mui/system";

export const BRAND_GREEN = "#4caf50";

const gridPulse = keyframes`
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
`;

const animateLine = keyframes`
  0% {
    transform: translateY(0);
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(calc(100vh - 8px));
    opacity: 0.8;
  }
`;

const sidePanelSx = {
  width: { xs: 0, md: "30%" },
  display: { xs: "none", md: "flex" },
  flexDirection: "column",
  justifyContent: "space-between",
  p: 4,
  color: "#fff",
  background: "linear-gradient(135deg, #545454, #2f3235)",
  position: "relative",
  overflow: "hidden",
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(#5b3ff51f 1px, #0000 0), linear-gradient(90deg, #5b3ff51f 1px, #0000 0)",
    backgroundSize: "48px 48px",
    animation: `${gridPulse} 6s ease-in-out infinite`,
    WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 30% 50%, #000 20%, #0000 80%)",
    maskImage: "radial-gradient(ellipse 90% 90% at 30% 50%, #000 20%, #0000 80%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "8px",
    background: "#3fefef",
    borderRadius: "8px",
    filter: "drop-shadow(0 0 20px #3fefef) drop-shadow(0 0 60px #3fefef)",
    animation: `${animateLine} 4s ease-in-out infinite`,
    pointerEvents: "none",
    zIndex: 0,
  },
};

export const AuthSplitLayout = ({ children, maxWidth = 520 }:any) => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f4f4f4" }}>
      <Box sx={sidePanelSx}>
        <Typography
          sx={{
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 0.4,
            textAlign: "center",
          }}
        >
          OFC
        </Typography>
        <Box sx={{ fontSize: 13, lineHeight: 1.6, color: "#f3f4f6" }}>
          <Typography sx={{ mb: 1, fontWeight: 600 }}>
            Do you need help?
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            Contact support@OFC.se or call us:
          </Typography>
          <Typography sx={{ fontSize: 13, mt: 1 }}>
            India: +91 99999 99999
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "grid",
          // placeItems: "center",
          p: { xs: 2, md: 10 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth }}>{children}</Box>
      </Box>
    </Box>
  );
};

export const AuthOrDivider = () => {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ my: 2 }}>
      <Divider sx={{ flex: 1 }} />
      <Typography sx={{ fontSize: 12, color: "#6b7280" }}>OR</Typography>
      <Divider sx={{ flex: 1 }} />
    </Stack>
  );
};

export const SocialAuthButtons = () => {
  return (
    <Stack spacing={1.5}>
   
      <Button
        variant="outlined"
        startIcon={<Google />}
        sx={{
          justifyContent: "flex-start",
          color: BRAND_GREEN,
          borderColor: "#b0b0b0",
          py: 1.2,
          fontWeight: 700,
        }}
      >
        CONTINUE WITH GOOGLE
      </Button>
    </Stack>
  );
};

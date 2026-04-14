import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Google } from "@mui/icons-material";

export const BRAND_GREEN = "#4caf50";

const sidePanelSx = {
  width: { xs: 0, md: "30%" },
  display: { xs: "none", md: "flex" },
  flexDirection: "column",
  justifyContent: "space-between",
  p: 4,
  color: "#fff",
  background:
    "linear-gradient(rgba(26, 28, 30, 0.8), rgba(26, 28, 30, 0.8)), linear-gradient(135deg, #545454, #2f3235)",
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

import { Box, Button, Paper, Typography } from "@mui/material";
import { Upload, Image } from "lucide-react";
import { colors } from "@/utils/customColor";

export default function Media() {
  return (
    <Box sx={{ p: "20px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1a1a1a">
            Media Library
          </Typography>
          <Typography variant="body2" color="#666" mt={0.5}>
            Upload and manage images used in your email campaigns.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Upload size={16} />}
          sx={{
            bgcolor: colors.primary,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
            "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)" },
          }}
        >
          Upload Media
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: "1px dashed #d0d0d0",
          borderRadius: 2,
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          textAlign: "center",
          bgcolor: "#fafafa",
          cursor: "pointer",
          "&:hover": { borderColor: colors.primary, bgcolor: `${colors.primary}06` },
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: `${colors.primary}12`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image size={26} color={colors.primary} strokeWidth={1.5} />
        </Box>
        <Typography fontWeight={600} color="#333">
          No media files yet
        </Typography>
        <Typography variant="body2" color="#888" maxWidth={360}>
          Upload images, logos, and banners to use in your email campaigns.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Upload size={15} />}
          size="small"
          sx={{
            textTransform: "none",
            borderColor: colors.primary,
            color: colors.primary,
            borderRadius: 1.5,
            mt: 0.5,
          }}
        >
          Upload Files
        </Button>
      </Paper>
    </Box>
  );
}

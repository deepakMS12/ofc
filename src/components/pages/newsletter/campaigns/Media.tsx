import { Box, Button, Typography, Card, CardContent, IconButton, Tooltip } from "@mui/material";
import { Upload, Image as ImageIcon, Download, Trash2, Copy } from "lucide-react";
import { colors } from "@/utils/customColor";

const mockMedia = [
  { id: 1, name: "black-friday-banner.jpg", size: "256 KB", uploaded: "Nov 28, 2024", type: "banner" },
  { id: 2, name: "product-logo.png", size: "64 KB", uploaded: "Nov 20, 2024", type: "logo" },
  { id: 3, name: "feature-image.jpg", size: "512 KB", uploaded: "Nov 15, 2024", type: "banner" },
  { id: 4, name: "header-bg.png", size: "128 KB", uploaded: "Nov 10, 2024", type: "header" },
  { id: 5, name: "icon-check.svg", size: "8 KB", uploaded: "Oct 30, 2024", type: "icon" },
  { id: 6, name: "promotional-hero.jpg", size: "384 KB", uploaded: "Oct 25, 2024", type: "banner" },
];

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

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2 }}>
        {mockMedia.map((media) => (
          <Card key={media.id} elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 2, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                height: 140,
                bgcolor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                "&:hover .media-actions": { opacity: 1 },
              }}
            >
              <ImageIcon size={40} color="#ccc" strokeWidth={1.5} />
              <Box
                className="media-actions"
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
              >
                <Tooltip title="Download">
                  <IconButton size="small" sx={{ color: "#fff" }}>
                    <Download size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy URL">
                  <IconButton size="small" sx={{ color: "#fff" }}>
                    <Copy size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" sx={{ color: "#fff" }}>
                    <Trash2 size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <CardContent sx={{ pb: 1 }}>
              <Typography fontWeight={500} fontSize="0.875rem" color="#333" noWrap title={media.name}>
                {media.name}
              </Typography>
              <Typography variant="caption" color="#888" display="block" mt={0.5}>
                {media.size} • {media.uploaded}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

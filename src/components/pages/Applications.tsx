import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Typography,
} from "@mui/material";
import { Link as LinkIcon } from "lucide-react";
import { colors } from "@/utils/customColor";

interface ActiveApp {
  id: string;
  name: string;
  iconBg: string;
  iconColor: string;
  iconLabel: string;
}

const activeApps: ActiveApp[] = [
  {
    id: "email-verification",
    name: "Email Verification",
    iconBg: "#E8EAF6",
    iconColor: "#3949AB",
    iconLabel: "EV",
  },
];

export default function Applications() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3.5,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}
          >
            Applications
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: colors.primary }}>
            Your all active applications in this current project.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<LinkIcon size={15} />}
          onClick={() => navigate("/home/marketplace")}
          sx={{
            bgcolor: "#F5A623",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: 16,
            px: 4,
            py: 1.35,
            borderRadius: 0.5,
            whiteSpace: "nowrap",
            "&:hover": {
              bgcolor: "#e0951f",
              boxShadow: "0 4px 14px rgba(17, 86, 166, 0.4)",
            },
          }}
        >
          View marketplace
        </Button>
      </Box>

      {/* Grid */}
      <Grid container spacing={1.5}>
        {activeApps.map((app) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={app.id}>
            <Card
              variant="outlined"
              sx={{
                border: "2px solid #b1b1b180",
                transition: "box-shadow 0.2s, border-color 0.2s, opacity 0.2s",
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": { boxShadow: "0 2px 10px rgba(0,0,0,0.07)" },
              }}
            >
              <CardActionArea
                sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: app.iconBg,
                    color: app.iconColor,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    borderRadius: 1.5,
                    flexShrink: 0,
                  }}
                >
                  {app.iconLabel}
                </Avatar>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#1a1a1a",
                    lineHeight: 1.3,
                  }}
                >
                  {app.name}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {activeApps.length === 0 && (
        <Box sx={{ textAlign: "center", py: 10, color: "#999" }}>
          <Typography sx={{ mb: 1.5 }}>No active applications yet.</Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/home/marketplace")}
            sx={{
              bgcolor: "#F5A623",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#e0951f", boxShadow: "none" },
            }}
          >
            Browse Marketplace
          </Button>
        </Box>
      )}
    </Box>
  );
}

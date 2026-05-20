import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Link as LinkIcon, Play, Search } from "lucide-react";
import { colors } from "@/utils/customColor";

interface MarketplaceApp {
  id: string;
  name: string;
  description: string;
  iconBg: string;
  iconColor: string;
  iconLabel: string;
  activated: boolean;
}

const allApps: MarketplaceApp[] = [
  {
    id: "email-verification",
    name: "Email Verification",
    description:
      "Verify email addresses in real-time to reduce bounce rates and protect your sender reputation.",
    iconBg: "#E8EAF6",
    iconColor: "#3949AB",
    iconLabel: "EV",
    activated: false,
  },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [apps, setApps] = useState(allApps);

  const filtered = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleActivate = (id: string) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, activated: true } : app)),
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}
        >
          Marketplace
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", color: colors.primary }}>
          Find application &amp; activate to setup their API
        </Typography>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="search applications"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#999" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "#fff",
            "& fieldset": { borderColor: "#e0e0e0" },
            "&:hover fieldset": { borderColor: "#bdbdbd" },
            "&.Mui-focused fieldset": { borderColor: colors.primary },
          },
        }}
      />

      {/* Grid — max 3 per row */}
      <Grid container spacing={2.5} alignItems="stretch">
        {filtered.map((app) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            key={app.id}
            sx={{ display: "flex" }}
          >
            <Card
              variant="outlined"
              sx={{
                border: "2px solid #b1b1b180",
                transition: "box-shadow 0.2s, border-color 0.2s, opacity 0",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "none",
                "&:hover": { boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
              }}
            >
              <CardContent
                sx={{
                  p: 2.5,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Icon + Title */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: app.iconBg,
                      color: app.iconColor,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      borderRadius: 1.5,
                    }}
                  >
                    {app.iconLabel}
                  </Avatar>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "1rem", color: "#1a1a1a" }}
                  >
                    {app.name}
                  </Typography>
                </Box>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: colors.primary,
                    lineHeight: 1.6,
                    flex: 1,
                    mb: 2,
                  }}
                >
                  {app.description}
                </Typography>

                {/* Action Button */}
                {app.activated ? (
                  <Button
                    variant="contained"
                    startIcon={<LinkIcon size={14} />}
                    onClick={() => navigate("/home/applications")}
                    sx={{
                      alignSelf: "flex-start",
                      bgcolor: "#F5A623",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.75,
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#e0951f", boxShadow: "none" },
                    }}
                  >
                    Activate
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Play size={13} />}
                    onClick={() => handleActivate(app.id)}
                    sx={{
                      alignSelf: "flex-start",
                      borderColor: "#ccc",
                      color: "#333",
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.8125rem",
                      borderRadius: 1,
                      px: 2,
                      py: 0.75,
                      "&:hover": { borderColor: "#999", bgcolor: "#fafafa" },
                    }}
                  >
                    Use this API
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filtered.length === 0 && (
          <Grid size={12}>
            <Box sx={{ textAlign: "center", py: 8, color: "#999" }}>
              <Typography>
                No applications found for &ldquo;{search}&rdquo;
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

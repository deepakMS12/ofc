import { Box, Paper, Typography, MenuItem, TextField } from "@mui/material";
import { TrendingUp, MousePointerClick, UserMinus, Send } from "lucide-react";
import { colors } from "@/utils/customColor";

const metrics = [
  { label: "Emails Sent", value: "0", icon: Send, color: colors.primary, bg: `${colors.primary}12` },
  { label: "Open Rate", value: "0%", icon: TrendingUp, color: "#059669", bg: "#05966912" },
  { label: "Click Rate", value: "0%", icon: MousePointerClick, color: "#7c3aed", bg: "#7c3aed12" },
  { label: "Unsubscribes", value: "0", icon: UserMinus, color: "#dc2626", bg: "#dc262612" },
];

export default function Analytics() {
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
            Campaign Analytics
          </Typography>
          <Typography variant="body2" color="#666" mt={0.5}>
            Track performance metrics across all your campaigns.
          </Typography>
        </Box>
        <TextField select size="small" defaultValue="30" sx={{ minWidth: 140 }}>
          <MenuItem value="7">Last 7 days</MenuItem>
          <MenuItem value="30">Last 30 days</MenuItem>
          <MenuItem value="90">Last 90 days</MenuItem>
          <MenuItem value="all">All time</MenuItem>
        </TextField>
      </Box>

      {/* Metrics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Paper
              key={m.label}
              elevation={0}
              sx={{ border: "1px solid #e8e8e8", borderRadius: 2, p: 2.5 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: m.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.5,
                }}
              >
                <Icon size={20} color={m.color} strokeWidth={1.75} />
              </Box>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a" }}>
                {m.value}
              </Typography>
              <Typography sx={{ fontSize: "0.8125rem", color: "#666", mt: 0.25 }}>{m.label}</Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Chart placeholder */}
      <Paper elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 2, p: 3 }}>
        <Typography fontWeight={600} color="#333" mb={1}>
          Performance Over Time
        </Typography>
        <Box
          sx={{
            height: 200,
            bgcolor: "#f9f9f9",
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed #ddd",
          }}
        >
          <Typography color="#bbb" fontSize="0.875rem">
            Chart will appear once you send your first campaign
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

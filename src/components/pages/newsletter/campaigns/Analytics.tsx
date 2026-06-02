import { useState } from "react";
import { Box, Paper, Typography, TextField, IconButton, InputAdornment, Autocomplete } from "@mui/material";
import { Search } from "lucide-react";
import { colors } from "@/utils/customColor";

const campaignOptions = [
  "Black Friday Sale 2024",
  "Test campaign",
  "October Newsletter",
  "Product Update: v2.0",
  "Welcome to Premium",
];

export default function Analytics() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>("Campaigns");

  const SimpleLineChart = ({ height = 300 }: { height?: number }) => (
    <svg width="100%" height={height} style={{ marginTop: "20px" }}>
      <line x1="50" y1="0" x2="50" y2={height} stroke="#ddd" strokeWidth="1" />
      <line x1="0" y1={height - 40} x2="100%" y2={height - 40} stroke="#ddd" strokeWidth="1" />
      <text x="10" y="20" fontSize="12" fill="#666">
        1
      </text>
      <text x="0" y={height - 20} fontSize="12" fill="#666">
        0
      </text>
      <line x1="50" y1={height - 40} x2="100%" y2={height - 40} stroke={colors.primary} strokeWidth="2" />
    </svg>
  );

  return (
    <Box sx={{ p: "20px" }}>
      <Typography variant="h5" fontWeight={700} color="#1a1a1a" mb={3}>
        Analytics
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr auto" },
          gap: 2,
          mb: 4,
          alignItems: "end",
        }}
      >
        <Autocomplete
          options={campaignOptions}
          value={selectedCampaign}
          onChange={(_, newValue) => setSelectedCampaign(newValue)}
          size="small"
          fullWidth
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Campaigns"
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: "1.2rem" }}>📋</Typography>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />
        <TextField label="From" size="small" fullWidth defaultValue="2026-05-26 00:00" />
        <TextField label="To" size="small" fullWidth defaultValue="2026-06-02 23:59" />
        <IconButton sx={{ bgcolor: "#ddd", color: "#999", borderRadius: 1 }}>
          <Search size={18} />
        </IconButton>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr" }, gap: 3 }}>
        <Paper elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 1, p: 3 }}>
          <Typography fontWeight={600} color="#333" mb={1}>
            Views (0)
          </Typography>
          <SimpleLineChart height={300} />
        </Paper>

        <Paper elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 1, p: 3 }}>
          <Typography fontWeight={600} color="#333" mb={1}>
            Clicks (0)
          </Typography>
          <SimpleLineChart height={300} />
        </Paper>

        <Paper elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 1, p: 3 }}>
          <Typography fontWeight={600} color="#333" mb={1}>
            Bounces (0)
          </Typography>
          <SimpleLineChart height={300} />
        </Paper>
      </Box>
    </Box>
  );
}

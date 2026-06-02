import { Box, Button, Divider, Paper, TextField, Typography } from "@mui/material";
import { Save } from "lucide-react";
import { colors } from "@/utils/customColor";

export default function NewsletterSettings() {
  return (
    <Box sx={{ p: "20px" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#1a1a1a">
          Settings
        </Typography>
        <Typography variant="body2" color="#666" mt={0.5}>
          Configure your newsletter sender and general preferences.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 2, maxWidth: 600 }}>
        {/* Sender settings */}
        <Box sx={{ p: 3 }}>
          <Typography fontWeight={600} color="#333" mb={2}>
            Sender Information
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Sender Name" defaultValue="TechFlow Newsletter" size="small" fullWidth />
            <TextField
              label="Sender Email"
              defaultValue="newsletter@techflow.com"
              size="small"
              fullWidth
              type="email"
            />
            <TextField
              label="Reply-To Email"
              defaultValue="support@techflow.com"
              size="small"
              fullWidth
              type="email"
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#f0f0f0" }} />

        {/* Footer settings */}
        <Box sx={{ p: 3 }}>
          <Typography fontWeight={600} color="#333" mb={2}>
            Email Footer
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Company Name"
              defaultValue="TechFlow, Inc."
              size="small"
              fullWidth
            />
            <TextField
              label="Physical Address"
              defaultValue="456 Innovation Way, San Francisco, CA 94105"
              size="small"
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Unsubscribe Text"
              defaultValue="You are receiving this email because you subscribed to TechFlow Newsletter. Manage your preferences or unsubscribe."
              size="small"
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#f0f0f0" }} />

        <Box sx={{ px: 3, py: 2, bgcolor: "#fafafa", display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<Save size={15} />}
            sx={{
              bgcolor: colors.primary,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)" },
            }}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

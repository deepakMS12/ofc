import { Box, Button, Paper, Typography } from "@mui/material";
import { AlertTriangle } from "lucide-react";
import { colors } from "@/utils/customColor";

const actions = [
  {
    title: "Clean Hard Bounces",
    desc: "Remove all hard-bounced email addresses from your subscriber lists to improve deliverability.",
    label: "Clean Bounces",
    danger: false,
  },
  {
    title: "Remove Unsubscribed",
    desc: "Permanently delete unsubscribed contacts from the database to free up storage.",
    label: "Remove Unsubscribed",
    danger: false,
  },
  {
    title: "Re-confirm Subscribers",
    desc: "Send a re-confirmation email to all subscribers who have not confirmed their subscription.",
    label: "Send Re-confirm",
    danger: false,
  },
  {
    title: "Purge All Data",
    desc: "Permanently delete ALL subscribers, lists, and campaign data. This action cannot be undone.",
    label: "Purge All Data",
    danger: true,
  },
];

export default function Maintenance() {
  return (
    <Box sx={{ p: "20px" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#1a1a1a">
          Maintenance
        </Typography>
        <Typography variant="body2" color="#666" mt={0.5}>
          Housekeeping tools to keep your newsletter data clean and healthy.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600 }}>
        {actions.map((action, i) => (
          <Paper
            key={i}
            elevation={0}
            sx={{
              border: `1px solid ${action.danger ? "#fecaca" : "#e8e8e8"}`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    {action.danger && <AlertTriangle size={15} color="#dc2626" />}
                    <Typography fontWeight={600} color={action.danger ? "#dc2626" : "#1a1a1a"} fontSize="0.9375rem">
                      {action.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="#666">
                    {action.desc}
                  </Typography>
                </Box>
                <Button
                  variant={action.danger ? "contained" : "outlined"}
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 1.5,
                    flexShrink: 0,
                    ...(action.danger
                      ? { bgcolor: "#dc2626", "&:hover": { bgcolor: "#b91c1c" } }
                      : { borderColor: colors.primary, color: colors.primary }),
                  }}
                >
                  {action.label}
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

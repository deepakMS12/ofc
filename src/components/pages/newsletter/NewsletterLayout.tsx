import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function NewsletterLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <Outlet />
    </Box>
  );
}

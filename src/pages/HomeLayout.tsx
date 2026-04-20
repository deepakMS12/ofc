import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Header, Sidebar, Footer } from "@/components/layout";
import { colors } from "@/utils/customColor";

export default function HomeLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: colors.secondary,
        
      }}
    >
      <Header />
      <Box sx={{ display: "flex", flex: 1, pt: "64px" }}>
        <Sidebar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
            ml: "80px",
          }}
        >
          <Box component="main" sx={{ flex: 1, overflow: "auto" }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

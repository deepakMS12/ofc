import { Outlet, useMatch } from "react-router-dom";
import { Box } from "@mui/material";
import { Header, Sidebar, Footer } from "@/components/layout";
import { ConverterSearchProvider } from "@/contexts/ConverterSearchContext";
import { colors } from "@/utils/customColor";

export default function HomeLayout() {
  const isConverterToolRoute = Boolean(useMatch("/home/converter/:slug"));

  return (
    <ConverterSearchProvider>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: isConverterToolRoute ? "#fff" : colors.secondary,
      }}
    >
      <Header />
      <Box sx={{ display: "flex", flex: 1, pt: "62px" }}>
        <Sidebar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            ml: "80px",
            ...(isConverterToolRoute && {
              bgcolor: "#fff",
              minHeight: "calc(100vh - 64px)",
            }),
          }}
        >
          <Box
            component="main"
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: isConverterToolRoute ? "hidden" : "auto",
              display: "flex",
              flexDirection: "column",
              ...(isConverterToolRoute && { bgcolor: "#fff" }),
            }}
          >
            <Outlet />
          </Box>
          {!isConverterToolRoute && <Footer />}
        </Box>
      </Box>
    </Box>
    </ConverterSearchProvider>
  );
}

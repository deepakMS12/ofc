import { Outlet, useLocation, useMatch } from "react-router-dom";
import { Box } from "@mui/material";
import { Header, Sidebar, Footer } from "@/components/layout";
import { ConverterSearchProvider } from "@/contexts/ConverterSearchContext";
import {
  LAYOUT_HEADER_OFFSET,
  LayoutShellProvider,
} from "@/contexts/LayoutShellContext";
import { colors } from "@/utils/customColor";

export default function HomeLayout() {
  const { hash } = useLocation();
  const isConverterToolRoute = Boolean(useMatch("/home/converter/:slug"));
  const isSslManageRoute = Boolean(useMatch("/home/ssl-manage"));
  const isPlansHistoryRoute = Boolean(useMatch("/home/plans")) && hash === "#history";
  const footerVisible = !(
    isConverterToolRoute ||
    isSslManageRoute ||
    isPlansHistoryRoute
  );

  return (
    <ConverterSearchProvider>
      <LayoutShellProvider footerVisible={footerVisible}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: isConverterToolRoute ? "#fff" : colors.secondary,
          }}
        >
          <Header />
          <Box
            sx={{
              display: "flex",
              flex: 1,
              pt: LAYOUT_HEADER_OFFSET,
              minHeight: 0,
            }}
          >
            <Sidebar />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minWidth: 0,
                minHeight: 0,
                ml: "80px",
                height: `calc(100vh - ${LAYOUT_HEADER_OFFSET})`,
                ...(isConverterToolRoute && { bgcolor: "#fff" }),
              }}
            >
              <Box
                component="main"
                sx={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflow: footerVisible ? "auto" : "hidden",
                  ...(isConverterToolRoute && { bgcolor: "#fff" }),
                }}
              >
                <Outlet />
              </Box>
              {footerVisible ? <Footer /> : null}
            </Box>
          </Box>
        </Box>
      </LayoutShellProvider>
    </ConverterSearchProvider>
  );
}

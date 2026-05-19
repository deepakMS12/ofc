import { Outlet, useMatch } from "react-router-dom";
import { Box } from "@mui/material";
import { Header, Sidebar, Footer } from "@/components/layout";
import { ConverterSearchProvider } from "@/contexts/ConverterSearchContext";
import {
  LAYOUT_HEADER_OFFSET,
  LayoutShellProvider,
} from "@/contexts/LayoutShellContext";
import { SIDEBAR_TRANSITION, SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { colors } from "@/utils/customColor";

function HomeLayoutContent() {
  const { sidebarWidth } = useSidebar();

  const isConverterToolRoute = Boolean(useMatch("/home/converter/:slug"));
  const isConverterRoute = Boolean(useMatch("/home/converter"));
  const isSslManageRoute = Boolean(useMatch("/home/ssl-manage"));
  const isPlansRoute = Boolean(useMatch("/home/plans"));
  const footerVisible = !(
    isConverterToolRoute ||
    isConverterRoute ||
    isSslManageRoute ||
    isPlansRoute
  );

  return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: isConverterToolRoute ? "#fff" : colors.secondary,
          }}
        >
          <Sidebar />
          <Header />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
              ml: `${sidebarWidth}px`,
              pt: LAYOUT_HEADER_OFFSET,
              transition: `margin-left ${SIDEBAR_TRANSITION}`,
              ...(footerVisible
                ? { minHeight: `calc(100vh - ${LAYOUT_HEADER_OFFSET})` }
                : { height: `calc(100vh - ${LAYOUT_HEADER_OFFSET})`, minHeight: 0 }),
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
                  overflow: (isConverterToolRoute || isSslManageRoute || isPlansRoute) ? "hidden" : "auto",
                  ...(isConverterToolRoute && { bgcolor: "#fff" }),
                }}
              >
                <Outlet />
              </Box>
              {footerVisible ? <Footer /> : null}
          </Box>
        </Box>
  );
}

export default function HomeLayout() {
  const isConverterToolRoute = Boolean(useMatch("/home/converter/:slug"));
  const isConverterRoute = Boolean(useMatch("/home/converter"));
  const isSslManageRoute = Boolean(useMatch("/home/ssl-manage"));
  const isPlansRoute = Boolean(useMatch("/home/plans"));
  const footerVisible = !(
    isConverterToolRoute ||
    isConverterRoute ||
    isSslManageRoute ||
    isPlansRoute
  );

  return (
    <ConverterSearchProvider>
      <SidebarProvider>
        <LayoutShellProvider footerVisible={footerVisible}>
          <HomeLayoutContent />
        </LayoutShellProvider>
      </SidebarProvider>
    </ConverterSearchProvider>
  );
}

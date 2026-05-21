import { useEffect } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Header, Sidebar, Footer } from "@/components/layout";
import { ConverterSearchProvider } from "@/contexts/ConverterSearchContext";
import {
  LAYOUT_HEADER_OFFSET,
  LayoutShellProvider,
} from "@/contexts/LayoutShellContext";
import { SIDEBAR_TRANSITION, SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserProfile } from "@/store/thunks/profileThunks";
import { colors } from "@/utils/customColor";

function HomeLayoutContent() {
  const dispatch = useAppDispatch();
  const { sidebarWidth, isCollapsed, closeSidebar } = useSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { pathname } = useLocation();

  useEffect(() => {
    void dispatch(fetchUserProfile());
  }, [dispatch]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) closeSidebar();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Force-close sidebar on initial mobile load
  useEffect(() => {
    if (isMobile) closeSidebar();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isConverterToolRoute = Boolean(useMatch("/home/doc-forge/:slug"));
  const isConverterRoute = Boolean(useMatch("/home/doc-forge"));
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

          {/* Mobile backdrop — tap outside sidebar to close */}
          {isMobile && !isCollapsed && (
            <Box
              onClick={closeSidebar}
              sx={{
                position: "fixed",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(2px)",
                zIndex: 1299,
              }}
            />
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
              ml: { xs: 0, md: `${sidebarWidth}px` },
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
              {footerVisible ? (
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Footer />
                </Box>
              ) : null}
          </Box>
        </Box>
  );
}

export default function HomeLayout() {
  const isConverterToolRoute = Boolean(useMatch("/home/doc-forge/:slug"));
  const isConverterRoute = Boolean(useMatch("/home/doc-forge"));
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

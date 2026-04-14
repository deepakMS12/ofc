import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Skeleton } from "@mui/material";
import { Header, Sidebar, Footer } from "@/components/layout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAuthenticated } from "@/store/slices/authSlice";

export default function HomeLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("token");
 
      if (!isLoggedIn) {
        
        dispatch(setAuthenticated(false));
        navigate("/login", { replace: true });
      } else {
      
        dispatch(setAuthenticated(true));
      }
    };

    checkAuth();
  }, [navigate, dispatch]);

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#fffdf5",
       
        }}
      >
        <Box
          sx={{
            height: 74,
            backgroundColor: "white",
            borderBottom: "4px solid #0b996e",
          }}
        />
        <Box sx={{ display: "flex", flex: 1, pt: "74px" }}>
          <Box
            sx={{
              width: 80,
              backgroundColor: "white",
              borderRight: "1px solid #e0e0e0",
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
              ml: "80px",
            }}
          >
            <Box component="main" sx={{ flex: 1, overflow: "auto", p: 4 }}>
              <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" width={500} height={24} sx={{ mb: 4 }} />
              <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width="100%"
                    height={120}
                    sx={{ borderRadius: 2, flex: 1 }}
                  />
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                height: 64,
                backgroundColor: "white",
                borderTop: "1px solid #e0e0e0",
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#fffdf5",
        
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

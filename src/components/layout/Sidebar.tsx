"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { SIDEBAR_TRANSITION, SIDEBAR_WIDTH } from "@/contexts/SidebarContext";
import {
  Box as BoxIcon,
  ChevronDown,
  CodeXml,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Share2
} from "lucide-react";
import HttpsIcon from "@mui/icons-material/Https";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { ArrowLeftRight as ArrowIcon } from "lucide-react";
import ApiDrawer from "@/components/dialogs/ApiDrawer";
import { ConfirmDialog } from "@/components/common";
import { useSidebar } from "@/contexts/SidebarContext";
import { logout } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { colors } from "@/utils/customColor";

const navLinks = [
  {
    slug: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    lucide: true,
  },
  { slug: "applications", label: "Applications", icon: Share2, lucide: true },
  { slug: "marketplace", label: "Marketplace", icon: BoxIcon, lucide: true },
  { slug: "ssl-manage", label: "SSL Manage", icon: HttpsIcon, mui: true },
  { slug: "doc-forge", label: "Doc forge", icon: ArrowIcon, lucide: true },
];

const bottomLinks = [
  { slug: "api", label: "Dev API", icon: CodeXml, lucide: true },
];

export default function Sidebar() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isCollapsed } = useSidebar();
  const user = useAppSelector((s) => s.user.profile);
  const profileLoading = useAppSelector((s) => s.user.isLoading);

  const [apiDrawerOpen, setApiDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    if (hash === "#api") setApiDrawerOpen(true);
  }, [hash]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    setLogoutConfirmOpen(false);
    navigate("/login", { replace: true });
  };

  const displayName =
    profileLoading && !user?.name && !user?.username
      ? "Loading..."
      : user?.name || user?.username || "Guest";
  const displayHandle = user?.username
    ? `@${user.username}`
    : user?.email || (profileLoading ? "..." : "Account");

  const renderNavIcon = (
    link: (typeof navLinks)[number] | (typeof bottomLinks)[number],
    active: boolean,
  ) => {
    const iconColor = active ? "#fff" : "#666";

    if ("mui" in link && link.mui) {
      const MuiIcon = link.icon;
      return <MuiIcon sx={{ color: iconColor, fontSize: 20 }} />;
    }

    const LucideIcon = link.icon as ComponentType<{
      size?: number;
      color?: string;
      strokeWidth?: number;
    }>;
    return <LucideIcon size={20} color={iconColor} strokeWidth={1.75} />;
  };

  const navItemSx = (active: boolean) => ({
    borderRadius: 2,
    mb: 0.5,
    py: 1,
    px: 1.5,
    minHeight: 44,
    color: active ? "#fff" : "#333",
    bgcolor: active ? colors.primary : "transparent",
    "&:hover": {
      bgcolor: active ? colors.primary : "#f5f5f5",
    },
  });

  return (
    <>
      <Box
        component="nav"
        aria-label="Main navigation"
        aria-hidden={isCollapsed}
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          backgroundColor: "#fff",
          borderRight: "1px solid #e0e0e0",
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
          transition: `transform ${SIDEBAR_TRANSITION}`,
          pointerEvents: isCollapsed ? "none" : "auto",
          willChange: "transform",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            px: 2,
            pt: 2.5,
            pb: 2,
          }}
        >
          {/* Logo */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.5 }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                bgcolor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src="/assets/images/ajaxter-logo.svg"
                alt="OFC"
                sx={{ width: 64, height: 64, objectFit: "contain" }}
              />
            </Box>
            <Typography
              sx={{
                color: colors.primary,
                fontWeight: 700,
                fontSize: "1.375rem",
                letterSpacing: "-0.02em",
              }}
            >
              OFC
            </Typography>
          </Box>

          {/* User profile */}
          <Box
            component="button"
            type="button"
            onClick={(e) => setUserMenuAnchor(e.currentTarget)}
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              p: 1.25,
              mb: 2,
              border: `1px solid ${colors.primary}`,
              borderRadius: 1,
              bgcolor: "transparent",
              cursor: "pointer",
              textAlign: "left",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <Avatar
              src="/assets/images/user.png"
              alt={displayName}
              sx={{ width: 32, height: 32 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                noWrap
                sx={{ color: "#333", fontSize: "0.875rem", fontWeight: 600 }}
              >
                {displayName}
              </Typography>
              <Typography noWrap sx={{ color: "#666", fontSize: "0.75rem" }}>
                {displayHandle}
              </Typography>
            </Box>
            <ChevronDown size={18} color="#666" />
          </Box>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  mt: 0.75,
                  minWidth: 220,
                  borderRadius: 2,
                  border: "1px solid #e8e8e8",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                },
              },
            }}
          >
            {/* User info header */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                bgcolor: "#fafafa",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Avatar
                  src="/assets/images/user.png"
                  alt={displayName}
                  sx={{ width: 36, height: 36 }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#1a1a1a",
                    }}
                  >
                    {displayName}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ fontSize: "0.75rem", color: "#888" }}
                  >
                    {displayHandle}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Menu items */}
            <Box sx={{ py: 0.5 }}>
              <MenuItem
                component={Link}
                to="/home/settings"
                onClick={() => setUserMenuAnchor(null)}
                sx={{
                  px: 2,
                  py: 1,
                  gap: 1.5,
                  fontSize: "0.875rem",
                  color: "#333",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                <Settings size={16} color="#666" />
                Account settings
              </MenuItem>

              <Divider sx={{ my: 0.5, borderColor: "#f0f0f0" }} />

              <MenuItem
                onClick={() => {
                  setUserMenuAnchor(null);
                  setLogoutConfirmOpen(true);
                }}
                sx={{
                  px: 2,
                  py: 1,
                  gap: 1.5,
                  fontSize: "0.875rem",
                  color: "#e53935",
                  "&:hover": { bgcolor: "#fff5f5" },
                }}
              >
                <LogOut size={16} color="#e53935" />
                Log out
              </MenuItem>
            </Box>
          </Menu>

          {/* Upgrade CTA */}
          <Button
            component={Link}
            to="/home/plans"
            fullWidth
            startIcon={
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  bgcolor: "#fff",
                  color: colors.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={14} strokeWidth={2.5} />
              </Box>
            }
            sx={{
              mb: 2.5,
              py: 1.1,
              justifyContent: "flex-start",
              pl: 1.5,
              bgcolor: colors.primary,
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9375rem",
              borderRadius: 1,
              "&:hover": {
                bgcolor: colors.primary,
                filter: "brightness(0.92)",
              },
            }}
          >
            Upgrade Plan
          </Button>

          {/* Main nav */}
          <List disablePadding sx={{ mb: 1 }}>
            {navLinks.map((link) => {
              const isActive = pathname?.includes(link.slug);
              return (
                <ListItemButton
                  key={link.slug}
                  component={Link}
                  to={`/home/${link.slug}`}
                  sx={navItemSx(isActive)}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    {renderNavIcon(link, isActive)}
                  </ListItemIcon>
                  <ListItemText
                    primary={link.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: "0.9375rem",
                          fontWeight: isActive ? 600 : 500,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          <Box sx={{ flex: 1 }} />

          {/* Bottom nav */}
          <List disablePadding>
            {bottomLinks.map((link) => {
              const isApiLink = link.slug === "api";
              const isActive = !isApiLink && pathname?.includes(link.slug);

              if (isApiLink) {
                return (
                  <ListItemButton
                    key={link.slug}
                    onClick={() => setApiDrawerOpen(true)}
                    sx={{ ...navItemSx(false), display: { xs: 'none', md: 'flex' } }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                      {renderNavIcon(link, false)}
                    </ListItemIcon>
                    <ListItemText
                      primary={link.label}
                      slotProps={{
                        primary: {
                          sx: { fontSize: "0.9375rem", fontWeight: 500 },
                        },
                      }}
                    />
                  </ListItemButton>
                );
              }

              return (
                <ListItemButton
                  key={link.slug}
                  component={Link}
                  to={`/home/${link.slug}`}
                  sx={navItemSx(isActive)}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    {renderNavIcon(link, isActive)}
                  </ListItemIcon>
                  <ListItemText
                    primary={link.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: "0.9375rem",
                          fontWeight: isActive ? 600 : 500,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          <Divider sx={{ borderColor: "#e0e0e0", my: 2 }} />

          <Box
            component="a"
            href="https://wa.ajaxter.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#666",
              textDecoration: "none",
              fontSize: "0.875rem",
              px: 0.5,
              "&:hover": { color: colors.primary },
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 18, color: "#25D366" }} />
            <Typography
              variant="body2"
              sx={{ color: "inherit", fontSize: "0.875rem" }}
            >
              @Free Whatsapp API
            </Typography>
            <OpenInNewIcon sx={{ fontSize: 14, color: "inherit", ml: "auto" }} />
          </Box>
        </Box>
      </Box>

      <ApiDrawer
        open={apiDrawerOpen}
        onClose={() => {
          setApiDrawerOpen(false);
          if (hash === "#api") navigate({ hash: "" }, { replace: true });
        }}
      />

      <ConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Log out?"
        description="You will need to sign in again to use OFC."
        confirmText="Log out"
        cancelText="Stay signed in"
        confirmColor="error"
      />
    </>
  );
}

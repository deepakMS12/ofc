import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  LayoutDashboard,
  List as ListIcon,
  Users,
  Megaphone,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronRight,
  Menu as MenuIcon,
  Mail,
} from "lucide-react";
import { colors } from "@/utils/customColor";

const NAV_WIDTH = 240;

type NavChild = { label: string; path: string };
type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  path: string | null;
  children: NavChild[] | null;
};

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/home/newsletter/dashboard",
    children: null,
  },
  {
    id: "lists",
    label: "Lists",
    icon: ListIcon,
    path: null,
    children: [
      { label: "All Lists", path: "/home/newsletter/lists" },
      { label: "Forms", path: "/home/newsletter/lists/forms" },
    ],
  },
  {
    id: "subscribers",
    label: "Subscribers",
    icon: Users,
    path: null,
    children: [
      { label: "All Subscribers", path: "/home/newsletter/subscribers" },
      { label: "Import", path: "/home/newsletter/subscribers/import" },
      { label: "Bounce", path: "/home/newsletter/subscribers/bounce" },
    ],
  },
  {
    id: "campaigns",
    label: "Campaigns",
    icon: Megaphone,
    path: null,
    children: [
      { label: "All Campaigns", path: "/home/newsletter/campaigns" },
      { label: "Create New", path: "/home/newsletter/campaigns/create" },
      { label: "Media", path: "/home/newsletter/campaigns/media" },
      { label: "Templates", path: "/home/newsletter/campaigns/templates" },
      { label: "Analytics", path: "/home/newsletter/campaigns/analytics" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    path: null,
    children: [
      { label: "Settings", path: "/home/newsletter/settings" },
      { label: "Maintenance", path: "/home/newsletter/settings/maintenance" },
      { label: "Logs", path: "/home/newsletter/settings/logs" },
    ],
  },
];

function NavContent({ onClose }: { onClose?: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const getInitialOpen = (): Record<string, boolean> => {
    const open: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.children) {
        const active = item.children.some((c) => pathname.startsWith(c.path));
        if (active) open[item.id] = true;
      }
    });
    return open;
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(getInitialOpen);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNav = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const groupHeaderSx = (active: boolean) => ({
    borderRadius: 1.5,
    mb: 0.25,
    py: 0.875,
    px: 1.25,
    color: active ? colors.primary : "#333",
    bgcolor: active ? `${colors.primary}14` : "transparent",
    "&:hover": { bgcolor: active ? `${colors.primary}1a` : "#f5f5f5" },
  });

  const childItemSx = (active: boolean) => ({
    borderRadius: 1.5,
    mb: 0.25,
    py: 0.75,
    pl: 4.5,
    pr: 1.25,
    color: active ? "#fff" : "#555",
    bgcolor: active ? colors.primary : "transparent",
    "&:hover": { bgcolor: active ? colors.primary : "#f5f5f5" },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#fff",
        borderRight: "1px solid #e8e8e8",
        overflowY: "auto",
        overflowX: "hidden",
        px: 1.5,
        pt: 2,
        pb: 2,
      }}
    >
      {/* Module header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, px: 0.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Mail size={17} color="#fff" strokeWidth={1.75} />
        </Box>
        <Typography
          sx={{ fontWeight: 700, fontSize: "1rem", color: "#1a1a1a", letterSpacing: "-0.01em" }}
        >
          Newsletter
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#f0f0f0", mb: 1.5 }} />

      <List disablePadding>
        {navItems.map((item) => {
          const isGroupActive = item.children
            ? item.children.some((c) => pathname.startsWith(c.path))
            : pathname === item.path;

          const Icon = item.icon;

          if (!item.children) {
            return (
              <ListItemButton
                key={item.id}
                onClick={() => handleNav(item.path!)}
                sx={groupHeaderSx(isGroupActive)}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Icon
                    size={18}
                    color={isGroupActive ? colors.primary : "#666"}
                    strokeWidth={1.75}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.9rem",
                        fontWeight: isGroupActive ? 600 : 500,
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          }

          const isOpen = !!openGroups[item.id];

          return (
            <Box key={item.id}>
              <ListItemButton
                onClick={() => toggleGroup(item.id)}
                sx={groupHeaderSx(isGroupActive && !isOpen)}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Icon
                    size={18}
                    color={isGroupActive ? colors.primary : "#666"}
                    strokeWidth={1.75}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.9rem",
                        fontWeight: isGroupActive ? 600 : 500,
                      },
                    },
                  }}
                />
                {isOpen ? (
                  <ChevronDown size={15} color="#999" />
                ) : (
                  <ChevronRight size={15} color="#999" />
                )}
              </ListItemButton>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ mb: 0.5 }}>
                  {item.children.map((child) => {
                    const isActive = pathname === child.path;
                    return (
                      <ListItemButton
                        key={child.path}
                        onClick={() => handleNav(child.path)}
                        sx={childItemSx(isActive)}
                      >
                        <ListItemText
                          primary={child.label}
                          slotProps={{
                            primary: {
                              sx: {
                                fontSize: "0.875rem",
                                fontWeight: isActive ? 600 : 400,
                              },
                            },
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </List>
    </Box>
  );
}

export default function NewsletterLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", height: "100%", minHeight: 0 }}>
      {/* Desktop secondary sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: NAV_WIDTH,
            flexShrink: 0,
            height: "100%",
            position: "sticky",
            top: 0,
          }}
        >
          <NavContent />
        </Box>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ "& .MuiDrawer-paper": { width: NAV_WIDTH } }}
        >
          <NavContent onClose={() => setDrawerOpen(false)} />
        </Drawer>
      )}

      {/* Content area */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "auto" }}>
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1.25,
              borderBottom: "1px solid #e8e8e8",
              bgcolor: "#fff",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <IconButton size="small" onClick={() => setDrawerOpen(true)}>
              <MenuIcon size={20} />
            </IconButton>
            <Mail size={16} color={colors.primary} />
            <Typography sx={{ fontWeight: 600, fontSize: "0.9375rem", color: "#1a1a1a" }}>
              Newsletter
            </Typography>
          </Box>
        )}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

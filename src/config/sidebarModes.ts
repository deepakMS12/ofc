import type { ComponentType } from "react";
import {
  LayoutDashboard,
  List as ListIcon,
  Users,
  Megaphone,
  Settings as SettingsIcon,
} from "lucide-react";

export type NavChild = { label: string; path: string };

export type SidebarNavItem = {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  path?: string;
  children?: NavChild[];
};

export type SidebarModeConfig = {
  id: string;
  routePrefix: string;
  label: string;
  backPath: string;
  navItems: SidebarNavItem[];
};

/**
 * Registry of sidebar modes. Each module that needs its own sidebar
 * adds an entry here. The Sidebar component picks the active one
 * by matching routePrefix against the current URL.
 */
export const SIDEBAR_MODES: SidebarModeConfig[] = [
  {
    id: "newsletter",
    routePrefix: "/home/newsletter",
    label: "Newsletter",
    backPath: "/home/dashboard",
    navItems: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/home/newsletter/dashboard",
      },
      {
        id: "lists",
        label: "Lists",
        icon: ListIcon,
        children: [
          { label: "All Lists", path: "/home/newsletter/lists" },
          { label: "Forms", path: "/home/newsletter/lists/forms" },
        ],
      },
      {
        id: "subscribers",
        label: "Subscribers",
        icon: Users,
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
        children: [
          { label: "Settings", path: "/home/newsletter/settings" },
          { label: "Maintenance", path: "/home/newsletter/settings/maintenance" },
          { label: "Logs", path: "/home/newsletter/settings/logs" },
        ],
      },
    ],
  },
  // Add more sidebar modes here for future modules:
  // { id: "crm", routePrefix: "/home/crm", label: "CRM", backPath: "/home/dashboard", navItems: [...] },
];

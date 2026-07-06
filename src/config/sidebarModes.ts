import type { ComponentType } from "react";

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
  // Add more sidebar modes here for future modules:
  // { id: "crm", routePrefix: "/home/crm", label: "CRM", backPath: "/home/dashboard", navItems: [...] },
];

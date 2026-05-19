import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export const SIDEBAR_WIDTH = 260;

/** Shared easing — sidebar slide + content shift stay in sync (Gofile-style). */
export const SIDEBAR_TRANSITION = '0.25s cubic-bezier(0.4, 0, 0.2, 1)';

export const SIDEBAR_COLLAPSED_KEY = 'ofc-sidebar-collapsed';

type SidebarContextValue = {
  /** true = drawer closed */
  isCollapsed: boolean;
  /** 0 when closed (drawer overlay); width when open for optional layout */
  sidebarWidth: number;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
};

/** Call after login so the nav drawer opens by default. */
export function openSidebarOnLogin() {
  if (typeof globalThis.window === 'undefined') return;
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, 'false');
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function readCollapsedPreference(): boolean {
  if (typeof globalThis.window === 'undefined') return false;
  const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
  if (stored === null) return false;
  return stored === 'true';
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(readCollapsedPreference);

  const openSidebar = useCallback(() => {
    setIsCollapsed(false);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, 'false');
  }, []);

  const closeSidebar = useCallback(() => {
    setIsCollapsed(true);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, 'true');
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      isCollapsed,
      sidebarWidth: isCollapsed ? 0 : SIDEBAR_WIDTH,
      toggleSidebar,
      openSidebar,
      closeSidebar,
    }),
    [isCollapsed, toggleSidebar, openSidebar, closeSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return ctx;
}

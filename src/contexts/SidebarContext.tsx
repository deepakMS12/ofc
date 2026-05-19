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

const STORAGE_KEY = 'ofc-sidebar-collapsed';

type SidebarContextValue = {
  /** true = drawer closed */
  isCollapsed: boolean;
  /** 0 when closed (drawer overlay); width when open for optional layout */
  sidebarWidth: number;
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function readCollapsedPreference(): boolean {
  if (typeof globalThis.window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return true;
  return stored === 'true';
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(readCollapsedPreference);

  const closeSidebar = useCallback(() => {
    setIsCollapsed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      isCollapsed,
      sidebarWidth: isCollapsed ? 0 : SIDEBAR_WIDTH,
      toggleSidebar,
      closeSidebar,
    }),
    [isCollapsed, toggleSidebar, closeSidebar],
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

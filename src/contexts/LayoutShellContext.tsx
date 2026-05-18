import { createContext, useContext, type ReactNode } from 'react';

/** Fixed app header height (matches Header AppBar). */
export const LAYOUT_HEADER_OFFSET = '4.620rem';

/** Approximate footer block height when rendered in HomeLayout. */
export const LAYOUT_FOOTER_OFFSET = '3.3rem';

export type LayoutShellHeights = {
  footerVisible: boolean;
  mainAreaHeight: string;
  pageShellMinHeight: string;
  pageContentMaxHeight: string;
  pageContentMinHeight: string;
};

export function getLayoutShellHeights(footerVisible: boolean): LayoutShellHeights {
  const mainAreaHeight = footerVisible
    ? `calc(100vh - ${LAYOUT_HEADER_OFFSET} - ${LAYOUT_FOOTER_OFFSET})`
    : `calc(100vh - ${LAYOUT_HEADER_OFFSET})`;

  return {
    footerVisible,
    mainAreaHeight,
    pageShellMinHeight: mainAreaHeight,
    pageContentMaxHeight: footerVisible
      ? 'calc(100vh - 11.0rem)'
      : 'calc(100vh - 7.60rem)',
    pageContentMinHeight: footerVisible
      ? 'calc(100vh - 11.875rem)'
      : 'calc(100vh - 7.125rem)',
  };
}

const defaultHeights = getLayoutShellHeights(true);

const LayoutShellContext = createContext<LayoutShellHeights>(defaultHeights);

export function LayoutShellProvider({
  footerVisible,
  children,
}: {
  footerVisible: boolean;
  children: ReactNode;
}) {
  const value = getLayoutShellHeights(footerVisible);
  return (
    <LayoutShellContext.Provider value={value}>{children}</LayoutShellContext.Provider>
  );
}

export function useLayoutShell() {
  return useContext(LayoutShellContext);
}

'use client';

import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useSidebar } from '@/contexts/SidebarContext';
import { colors } from '@/utils/customColor';

/** Inline header toggle — first item before wallet (no fixed overlap). */
export default function SidebarToggle() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <Box
      component="button"
      type="button"
      onClick={toggleSidebar}
      aria-label={isCollapsed ? 'Open navigation menu' : 'Close navigation menu'}
      aria-expanded={!isCollapsed}
      sx={{
        width: 40,
        height: 40,
        flexShrink: 0,
        border: 'none',
        borderRadius: 1,
        bgcolor: colors.primary,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        mr: 2,
        transition: 'background-color 0.2s ease',
        '&:hover': {
          bgcolor: colors.primary,
          filter: 'brightness(0.92)',
        },
      }}
    >
      <MenuIcon sx={{ fontSize: 22 }} />
    </Box>
  );
}

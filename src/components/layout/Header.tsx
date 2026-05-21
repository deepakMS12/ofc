'use client';

import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Divider,
  Chip,
} from '@mui/material';
import { LogOut, Bell } from 'lucide-react';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsDrawer from '@/components/dialogs/NotificationsDrawer';
import SupportDrawer from '@/components/dialogs/SupportDrawer';
import { ConfirmDialog } from '@/components/common';
import { useConverterSearch } from '@/contexts/ConverterSearchContext';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { clearUser } from '@/store/slices/userSlice';
import { colors } from '@/utils/customColor';
import { accountApi } from '@/lib/api/account';
import { SIDEBAR_TRANSITION, useSidebar } from '@/contexts/SidebarContext';
import SidebarToggle from '@/components/layout/SidebarToggle';

export default function Header() {
  const navigate = useNavigate();
  const { openSearch } = useConverterSearch();
  const dispatch = useAppDispatch();
  const { sidebarWidth } = useSidebar();
  // const user = useAppSelector((s) => s.user.profile);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [supportOpen, setSupportOpen] = useState(false);
  const [apiUsed] = useState(22); // dummy — replace with real API call
  const FREE_QUOTA = 50;
  const BLOCK_COUNT = 10;

  useEffect(() => {
    accountApi.getBalance().catch(() => {});
  }, []);

  const filledBlocks = Math.round((Math.min(apiUsed, FREE_QUOTA) / FREE_QUOTA) * BLOCK_COUNT);
  const pct = Math.round((Math.min(apiUsed, FREE_QUOTA) / FREE_QUOTA) * 100);
  const remaining = FREE_QUOTA - apiUsed;

  const resetDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1, 1);
    d.setHours(0, 0, 0, 0);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy} 00:00`;
  })();

  const apiTooltip = (
    <Box sx={{ p: 0.5, minWidth: 210 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6a6a6a', mb: 1, borderBottom: '1px solid rgba(255,255,255,0.15)', pb: 0.75 }}>
        Free Tier Usage
      </Typography>
      {[
        { label: 'Consumed', value: `${apiUsed} requests` },
        { label: 'Remaining', value: `${remaining} requests` },
        { label: 'Total quota', value: `${FREE_QUOTA} requests / month` },
        { label: 'Usage', value: `${pct}%` },
        { label: 'Resets on', value: resetDate },
      ].map(({ label, value }) => (
        <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.5 }}>
          <Typography sx={{ fontSize: 11, color: '#6a6a6a' }}>{label}</Typography>
          <Typography sx={{ fontSize: 11, color: '#6a6a6a', fontWeight: 600 }}>{value}</Typography>
        </Box>
      ))}
    </Box>
  );

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    setLogoutConfirmOpen(false);
    navigate('/login', { replace: true });
  };

  const triggerConverterSearch = () => {
    openSearch();
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: `4px solid ${colors.primary}`,
          height: '4.625rem',
          zIndex: 1200,
          left: { xs: 0, md: `${sidebarWidth}px` },
          width: { xs: '100%', md: `calc(100% - ${sidebarWidth}px)` },
          transition: `left ${SIDEBAR_TRANSITION}, width ${SIDEBAR_TRANSITION}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1.5, md: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <SidebarToggle />
            {/* <Avatar
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: '#e3f2fd',
                color: colors.primary,
                fontWeight: 600,
              }}
            >
              <User size={20} />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
                Welcome,
              </Typography>
              <Typography variant="body2" sx={{ color: '#333', fontWeight: 600, marginBottom: '-6px' }}>
                {user?.name || 'User'}
              </Typography>
            </Box> */}

            {/* API Usage Progress */}
            <Tooltip
              title={apiTooltip}
              placement="bottom-start"
              arrow
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#f5f5f5',
                    borderRadius: 1.5,
                    p: 1.25,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
                    maxWidth: 260,
                  },
                },
                arrow: { sx: { color: '#f5f5f5' } },
              }}
            >
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  flexDirection: 'column',
                  gap: 0.4,
                  flexShrink: 0,
                  pl: 1,
                  cursor: 'default',
                }}
              >
                <Box sx={{ display: 'flex', gap: 0.4 }}>
                  {Array.from({ length: BLOCK_COUNT }, (_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 16,
                        height: 13,
                        bgcolor: i < filledBlocks ? '#face86' : '#d8dde6',
                        borderRadius: 0.25,
                      }}
                    />
                  ))}
                </Box>
                <Typography sx={{ fontSize: 11, color: '#555', fontWeight: 500, lineHeight: 1 }}>
                  {pct}% ({apiUsed}/{FREE_QUOTA}) API requests consumed
                </Typography>
              </Box>
            </Tooltip>

            <Box
              role="button"
              tabIndex={0}
              aria-label="Search converters"
              onClick={triggerConverterSearch}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  triggerConverterSearch();
                }
              }}
              sx={{
                display: 'none',
                margin: '0 0 0 50px',
                height: 40,
                minWidth: 280,
                px: 1.25,
                borderRadius: '3px',
                border: '1px solid',
                borderColor: 'hsla(215, 15%, 88%, 0.95)',
                backgroundColor: 'hsla(215, 15%, 97%, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#64748b',
                cursor: 'pointer',
                alignSelf: 'center',
                transition: (theme) =>
                  theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
                    duration: 150,
                  }),
                '&:hover': {
                  backgroundColor: '#fff',
                  borderColor: '#60a5fa',
                  boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.18)',
                  '& .header-search-shortcut': {
                    backgroundColor: '#eef2ff',
                    color: '#1d4ed8',
                  },
                },
                '&:focus-visible': {
                  outline: 'none',
                  backgroundColor: '#fff',
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.22)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'hsla(215, 15%, 92%, 0.9)',
                    backgroundColor: '#f8fafc',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <SearchIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                </Box>
                <Typography variant="body2" sx={{ fontSize: 15, color: 'inherit', lineHeight: 1 }}>
                  What are you looking for?
                </Typography>
              </Box>
              <Chip
                className="header-search-shortcut"
                label="Ctrl+K"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  triggerConverterSearch();
                }}
                sx={{
                  height: 24,
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: 12,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  transition: (theme) =>
                    theme.transitions.create(['background-color', 'color'], { duration: 150 }),
                  '& .MuiChip-label': { px: 0.9 },
                }}
              />
            </Box>
          </Box>

          {/* Right Side - Notifications */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 2 }, ml: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 2 }, mr: { xs: 0, sm: 2, md: 3 } }}>
              {/* Notifications Bell — hidden on mobile */}
              <Tooltip title="Notifications">
                <IconButton
                  onClick={() => setNotificationsOpen(true)}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    color: '#666',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <Bell size={20} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Support — hidden on mobile */}
              <Tooltip title="Support">
                <IconButton
                  onClick={() => setSupportOpen(true)}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    color: '#666',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <Box component="img" src="/assets/images/support.png" alt="Get Help" sx={{ width: 22, height: 22, display: 'block' }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'flex' } }} />

            {/* Logout Button */}
            <Tooltip title="Logout">
              <IconButton
                onClick={() => setLogoutConfirmOpen(true)}
                sx={{
                  color: '#666',
                  ml: { xs: 0, sm: 2, md: 3 },
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    color: '#d32f2f',
                  },
                }}
              >
                <LogOut size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <NotificationsDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNotificationCountChange={setNotificationCount}
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



      <SupportDrawer open={supportOpen} onClose={() => setSupportOpen(false)} />

    </>
  );
}

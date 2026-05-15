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
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import { Clock, User, LogOut, Bell } from 'lucide-react';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsDrawer from '@/components/dialogs/NotificationsDrawer';
import { ConfirmDialog } from '@/components/common';
import { useConverterSearch } from '@/contexts/ConverterSearchContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { clearUser } from '@/store/slices/userSlice';
import { colors } from '@/utils/customColor';

export default function Header() {
  const navigate = useNavigate();
  const { openSearch } = useConverterSearch();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);
  const [time, setTime] = useState('--:--:--');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {

    // Update clock
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

 

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
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3, position: 'relative' }}>
          {/* Left Side - OFC Logo */}
          <Box
            sx={{
              backgroundColor: colors.primary,
              height: '4.625rem',
              display: 'flex',
              alignItems: 'center',
              px: 3,
              position: 'absolute',
              left: 0,
              top: 0,
              width: 'calc(236px + 0.5rem)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.primary,
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              >
                <img src='/assets/images/ajaxter-logo.svg' alt='logo' style={{ width: 80, height: 80 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '18px',
                }}
              >
                OFC
              </Typography>
            </Box>
          </Box>

          {/* Left Side - User Profile with Avatar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              m: 'calc(210px + 15px + 3.5rem)',
            }}
          >
            <Avatar
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
            </Box>
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
                margin: '0 0 0 200px',
                height: 40,
                minWidth: 280,
                px: 1.25,
                borderRadius: '10px',
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

          {/* Right Side - Notifications, Clock */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, ml: 'auto' }}>
            {/* Clock */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mr: { xs: 0, sm: 3, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={20} color="#666" />
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                  {time}
                </Typography>
              </Box>

              {/* Notifications Bell */}
              <Tooltip title="Notifications">
                <IconButton
                  onClick={() => setNotificationsOpen(true)}
                  sx={{
                    color: '#666',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <Bell size={20} />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
            <Divider orientation="vertical" flexItem />

            {/* Logout Button */}
            <Tooltip title="Logout">
              <IconButton
                onClick={() => setLogoutConfirmOpen(true)}
                sx={{
                  color: '#666',
                  ml: { xs: 0, sm: 3, md: 3 },
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
    </>
  );
}

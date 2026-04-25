'use client';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Badge, Tooltip, Avatar, Divider, Chip } from '@mui/material';
import { Clock, User, LogOut, Bell } from 'lucide-react';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsDrawer from '@/components/dialogs/NotificationsDrawer';
import { ConfirmDialog } from '@/components/common';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { clearUser } from '@/store/slices/userSlice';
import { colors } from '@/utils/customColor';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);
  const [time, setTime] = useState('--:--:--');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const isConverterPage = location.pathname.startsWith('/home/converter');

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
    if (isConverterPage) {
      window.dispatchEvent(new Event('open-converter-search'));
      return;
    }
    sessionStorage.setItem('openConverterSearchOnLoad', '1');
    navigate('/home/converter');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        triggerConverterSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConverterPage]);

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
              onClick={triggerConverterSearch}
              sx={{
                margin: '0 0 0 200px',
                height: 36,
                minWidth: 210,
                px: 1.5,
                borderRadius: 3,
                border: '1px solid #d1d5db',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#6b7280',
                cursor: 'pointer',
                alignSelf: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
                <Typography variant="body2" sx={{ fontSize: 15, color: '#6b7280', lineHeight: 1 }}>
                  Search...
                </Typography>
              </Box>
              <Chip
                label="Ctrl+K"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  triggerConverterSearch();
                }}
                sx={{
                  height: 24,
                  borderRadius: 2,
                  fontWeight: 700,
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  '& .MuiChip-label': { px: 1 },
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

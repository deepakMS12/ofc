'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Badge, Tooltip, Avatar, Divider, Button } from '@mui/material';
import { Clock, User, LogOut, Bell } from 'lucide-react';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NotificationsDrawer from '@/components/dialogs/NotificationsDrawer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { clearUser } from '@/store/slices/userSlice';
import { dashboardApi } from '@/lib/api/dashboard';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);
  const [time, setTime] = useState('--:--:--');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [planCode, setPlanCode] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const planDetails = await dashboardApi.getPlan();
        setPlanCode(planDetails.planCode ?? null);
      } catch (error) {
        console.error('Failed to fetch plan info', error);
        setPlanCode(null);
      }
    };
    fetchPlan();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    navigate('/login', { replace: true });
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: '4px solid #0b996e',
          height: '4.625rem',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3, position: 'relative' }}>
          {/* Left Side - OFC Logo */}
          <Box
            sx={{
              backgroundColor: '#0b996e',
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
                  color: '#0b996e',
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
                color: '#0b996e',
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
            <Button
              size="small"
              startIcon={
                planCode === 'free' || !planCode ? (
                  <UpgradeIcon fontSize="small" />
                ) : (
                  <ArrowDownwardIcon fontSize="small" />
                )
              }
              onClick={() => navigate('/home/plans')}
              sx={{
                margin: '10px 0 0 80px',
                height: '30px',
                textTransform: 'none',
                fontWeight: 600,
                border: '2px solid #4caf50',
                backgroundColor: planCode === 'free' || !planCode ? '#ffffff' : '#0b996e',
                color: planCode === 'free' || !planCode ? '#4caf50' : '#ffffff',
                borderRadius: 20,
                '&:hover': {
                  backgroundColor: planCode === 'free' || !planCode ? '#4caf50' : '#077655',
                  color: '#ffffff',
                },
              }}
            >
              {planCode === 'free' || !planCode ? 'Upgrade' : 'Downgrade'}
            </Button>
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
                onClick={handleLogout}
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
    </>
  );
}

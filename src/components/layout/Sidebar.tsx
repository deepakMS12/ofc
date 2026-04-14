'use client';

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Tooltip } from '@mui/material';
import { LayoutDashboard, CodeXml, ArrowLeftRight, Settings } from 'lucide-react';

import ApiDrawer from '@/components/dialogs/ApiDrawer';

const navLinks = [
  { slug: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },

  { slug: 'converter', label: 'Converter', icon: ArrowLeftRight },
  { slug: 'api', label: 'Dev API', icon: CodeXml },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [apiDrawerOpen, setApiDrawerOpen] = useState(false);
  const isSettingsActive = pathname?.includes('settings');

  return (
    <Box
      sx={{
        width: 80,
        backgroundColor: 'white',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 3,
        gap: 2,
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
        zIndex: 1100,
        overflowY: 'auto',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {navLinks.map((link:any) => {
          const isActive = pathname?.includes(link.slug);
          const IconComponent = link.icon;
          const isApiLink = link.slug === 'api';
          const iconElement = link.mui ? (
            <IconComponent fontSize="medium" />
          ) : (
            <IconComponent size={24} />
          );

          return (
            <Tooltip key={link.slug} title={link.label} placement="right" arrow>
              {isApiLink ? (
                <Box
                  onClick={() => setApiDrawerOpen(true)}
                  sx={{
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    backgroundColor: 'transparent',
                    color: '#666',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {iconElement}
                </Box>
              ) : (
                <Link to={`/home/${link.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      backgroundColor: isActive ? '#0b996e' : 'transparent',
                      color: isActive ? 'white' : '#666',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isActive ? '#0b996e' : '#f5f5f5',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {iconElement}
                  </Box>
                </Link>
              )}
            </Tooltip>
          );
        })}
      </Box>

      {/* Drawers */}
      <ApiDrawer open={apiDrawerOpen} onClose={() => setApiDrawerOpen(false)} />

      {/* Settings Icon at Bottom */}
      <Tooltip title="Settings" placement="right" arrow>
        <Link to="/home/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              backgroundColor: isSettingsActive ? '#0b996e' : 'transparent',
              color: isSettingsActive ? 'white' : '#666',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isSettingsActive ? '#0b996e' : '#f5f5f5',
                transform: 'scale(1.05)',
              },
            }}
          >
            <Settings size={24} />
          </Box>
        </Link>
      </Tooltip>
    </Box>
  );
}

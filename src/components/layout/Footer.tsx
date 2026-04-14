'use client';

import { Box, Typography } from '@mui/material';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightYear = currentYear === 2025 ? '2025' : `2025 - ${currentYear}`;

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        py: 2,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 },
      }}
    >
      <Typography variant="body2" sx={{ color: '#666' }}>
        Copyright © {copyrightYear} OFC. | All rights reserved.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Hand-crafted & made with
        </Typography>
        <Heart size={16} color="#d32f2f" fill="#d32f2f" />
      </Box>
    </Box>
  );
}


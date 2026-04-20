'use client';

import { colors } from '@/utils/customColor';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary, // Green color from the design
      dark: colors.primary,
      light: colors.primary,
    },
    secondary: {
      main: colors.primary, // Green color
    },
    background: {
      default: '#ffffff', // Off-white background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"MsCorpres EmberFont", Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 300,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          // '&:hover': {
          //   boxShadow: '0 8px 20px rgba(1, 103, 65, 0.35)',
          // },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
  },
});

export default theme;


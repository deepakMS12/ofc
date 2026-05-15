'use client';

import { colors } from '@/utils/customColor';
import { alpha, createTheme } from '@mui/material/styles';

/** MsCorpres EmberFont regular (400) as the default UI stack. */
export const APP_FONT_FAMILY = '"MsCorpres EmberFont", Arial, sans-serif';

const paletteColorKeys = [
  'primary',
  'secondary',
  'error',
  'info',
  'success',
  'warning',
] as const;

type PaletteColorKey = (typeof paletteColorKeys)[number];

function isPaletteColorKey(color: string): color is PaletteColorKey {
  return (paletteColorKeys as readonly string[]).includes(color);
}

function outlinedHoverBorderColor(
  theme: ReturnType<typeof createTheme>,
  ownerState: { color?: string; error?: boolean },
) {
  if (ownerState.error) {
    return theme.palette.error.main;
  }
  const colorKey = ownerState.color ?? 'primary';
  if (isPaletteColorKey(colorKey)) {
    return theme.palette[colorKey].main;
  }
  return theme.palette.primary.main;
}

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
    fontFamily: APP_FONT_FAMILY,
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 400,
    fontWeightBold: 400,
    allVariants: {
      fontFamily: APP_FONT_FAMILY,
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: APP_FONT_FAMILY,
          fontWeight: 400,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 400,
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          if (ownerState.disabled) {
            return {};
          }
          const borderColor = outlinedHoverBorderColor(theme, ownerState);
          const defaultOutline =
            theme.palette.mode === 'light'
              ? 'rgba(0, 0, 0, 0.23)'
              : 'rgba(255, 255, 255, 0.23)';
          const resetOutlineColor = theme.vars
            ? alpha(theme.vars.palette.common.onBackground, 0.23)
            : defaultOutline;

          return {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor,
              borderWidth: 2,
            },
            '@media (hover: none)': {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: resetOutlineColor,
                borderWidth: 1,
              },
            },
          };
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          if (ownerState.disableUnderline) {
            return {};
          }
          const light = theme.palette.mode === 'light';
          let bottomLineColor = light
            ? 'rgba(0, 0, 0, 0.42)'
            : 'rgba(255, 255, 255, 0.7)';
          if (theme.vars) {
            bottomLineColor = alpha(
              theme.vars.palette.common.onBackground,
              theme.vars.opacity.inputUnderline,
            );
          }
          const activeColor = outlinedHoverBorderColor(theme, ownerState);

          return {
            '&:hover:not(.Mui-disabled):before': {
              borderBottom: `2px solid ${activeColor}`,
              '@media (hover: none)': {
                borderBottom: `1px solid ${bottomLineColor}`,
              },
            },
          };
        },
      },
    },
  },
});

export default theme;


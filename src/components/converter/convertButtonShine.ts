import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '@/utils/customColor';

/** Sweeping shine overlay — same effect as URL-to-PDF convert button. */
export const convertButtonShineSx: SxProps<Theme> = {
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-45%',
    width: '35%',
    height: '100%',
    background:
      'linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0) 100%)',
    transform: 'skewX(-20deg)',
    pointerEvents: 'none',
    animation: 'buttonShineSweep 2.8s ease-in-out infinite',
  },
  '@keyframes buttonShineSweep': {
    '0%': { left: '-45%' },
    '55%': { left: '125%' },
    '100%': { left: '125%' },
  },
};

export function getConvertButtonSx(loading: boolean): SxProps<Theme> {
  return {
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    width: '100%',
    height: 56,
    borderRadius: 2,
    textTransform: 'none',
    fontSize: 18,
    fontWeight: 700,
    bgcolor: colors.primary,
    boxShadow: 'none',
    '&:hover': {
      bgcolor: 'rgba(17,86,166,0.9)',
      boxShadow: 'none',
    },
    '&.Mui-disabled': {
      bgcolor: 'rgba(17,86,166,0.35)',
      color: '#fff',
      opacity: 0.55,
    },
    ...(!loading ? convertButtonShineSx : {}),
  };
}

import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';

export const theme = createTheme({
  palette,
  typography,
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgb(226,232,240)',
          boxShadow: 'none',
        },
      },
    },
  },
});

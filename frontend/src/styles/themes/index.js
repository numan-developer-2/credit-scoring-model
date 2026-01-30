import { createTheme } from '@mui/material/styles';

// Simple theme without complex shadows
export const getTheme = (mode = 'light') => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
        light: mode === 'light' ? '#42a5f5' : '#e3f2fd',
        dark: mode === 'light' ? '#1565c0' : '#42a5f5',
        contrastText: mode === 'light' ? '#fff' : '#000',
      },
      secondary: {
        main: mode === 'light' ? '#9c27b0' : '#ce93d8',
        light: mode === 'light' ? '#ba68c8' : '#f3e5f5',
        dark: mode === 'light' ? '#7b1fa2' : '#ab47bc',
        contrastText: mode === 'light' ? '#fff' : '#000',
      },
      success: {
        main: mode === 'light' ? '#2e7d32' : '#66bb6a',
        light: mode === 'light' ? '#4caf50' : '#81c784',
        dark: mode === 'light' ? '#1b5e20' : '#388e3c',
      },
      error: {
        main: mode === 'light' ? '#d32f2f' : '#f44336',
        light: mode === 'light' ? '#ef5350' : '#e57373',
        dark: mode === 'light' ? '#c62828' : '#d32f2f',
      },
      warning: {
        main: mode === 'light' ? '#ed6c02' : '#ffa726',
        light: mode === 'light' ? '#ff9800' : '#ffb74d',
        dark: mode === 'light' ? '#e65100' : '#f57c00',
      },
      info: {
        main: mode === 'light' ? '#0288d1' : '#29b6f6',
        light: mode === 'light' ? '#03a9f4' : '#4fc3f7',
        dark: mode === 'light' ? '#01579b' : '#0288d1',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#fff',
        secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)',
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
    },
  });
};

export default getTheme;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/inter';
import '@fontsource/jetbrains-mono';
import App from './App.jsx';
import { theme } from './theme';
import { AppProvider } from './state/AppContext';
import { SnackbarProvider } from 'notistack';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <AppProvider>
          <App />
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
);

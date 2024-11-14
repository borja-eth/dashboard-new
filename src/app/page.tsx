'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import Dashboard from '../components/dashboard';



// Create dark theme similar to Binance/FTX
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F0B90B', // Binance yellow
    },
    background: {
      default: '#0B0E11',
      paper: '#1E2329',
    },
    text: {
      primary: '#EAECEF',
      secondary: '#848E9C',
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #2B3139',
        },
      },
    },
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h1 style={{ color: '#EAECEF', margin: 0 }}>Treasury Dashboard</h1>
          </Box>
          <Dashboard />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

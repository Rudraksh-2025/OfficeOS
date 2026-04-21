// import React from 'react';
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './index.css'
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

const client = new QueryClient();

// Add your Google Client ID here
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

const isMobile = window.innerWidth < 768;

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <Toaster
          position={isMobile ? "bottom-center" : "top-right"}
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: "#111B2E",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#F1F5F9",
              borderRadius: "12px",
            },
          }}
        />
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </>
  // </React.StrictMode>,
)
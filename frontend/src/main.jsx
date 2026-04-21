// import React from 'react';
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const client = new QueryClient();

// Add your Google Client ID here
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </>
  // </React.StrictMode>,
)
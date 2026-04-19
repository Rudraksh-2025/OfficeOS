// import React from 'react';
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </>
  // </React.StrictMode>,
)
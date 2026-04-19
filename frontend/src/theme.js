import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6C5CE7',
            light: '#A29BFE',
            dark: '#5A4BD1',
        },
        secondary: {
            main: '#00CEC9',
            light: '#55EFC4',
        },
        background: {
            default: '#0B1220',
            paper: '#111B2E',
        },
        text: {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
        },
        success: {
            main: '#22C55E',
        },
        warning: {
            main: '#F59E0B',
        },
        error: {
            main: '#EF4444',
        },
        divider: 'rgba(255,255,255,0.08)',
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: { fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.02em' },
        h3: { fontWeight: 600, letterSpacing: '-0.01em' },
        h4: { fontWeight: 600, letterSpacing: '-0.01em' },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500, color: '#94A3B8' },
        subtitle2: { fontWeight: 500, color: '#64748B' },
        body2: { color: '#94A3B8' },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 10,
                    fontSize: '0.875rem',
                    padding: '10px 20px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                    boxShadow: '0 4px 16px rgba(108, 92, 231, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5A4BD1 0%, #8B7EFC 100%)',
                        boxShadow: '0 6px 24px rgba(108, 92, 231, 0.4)',
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#111B2E',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#111B2E',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif',
                    '&.Mui-focused': {
                        color: '#A29BFE',
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6C5CE7',
                        borderWidth: '1.5px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(108, 92, 231, 0.5)',
                    },
                },
                notchedOutline: {
                    borderColor: 'rgba(255,255,255,0.1)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#0B1220',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0B1220',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    '&:focus': {
                        backgroundColor: 'transparent',
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'capitalize',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#64748B',
                    '&.Mui-selected': {
                        color: '#6C5CE7',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    fontSize: '12px',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#1A2744',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: '12px',
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: '28px',
    },
    position: "relative",
    '& .MuiInputBase-input': {
        borderRadius: 10,
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        fontSize: 14,
        padding: '12px 14px',
        color: '#F1F5F9',
        transition: 'all 0.2s ease',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '&::placeholder': {
            color: '#64748B',
            opacity: 1,
        },
        '&:focus': {
            borderColor: '#6C5CE7',
            backgroundColor: 'rgba(108, 92, 231, 0.06)',
            boxShadow: '0 0 0 3px rgba(108, 92, 231, 0.1)',
            outline: 'none',
        },
        '&:hover': {
            borderColor: 'rgba(108, 92, 231, 0.4)',
        },
        '&:disabled': {
            color: '#64748B',
            WebkitTextFillColor: '#64748B',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
        },
    },
}));
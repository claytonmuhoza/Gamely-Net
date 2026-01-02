import { createTheme } from '@mui/material/styles'

// Créer un thème moderne et épuré
export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2563eb', // Bleu moderne
            light: '#60a5fa',
            dark: '#1e40af',
            50: '#eff6ff',
        },
        secondary: {
            main: '#f59e0b', // Orange/Ambre
            light: '#fbbf24',
            dark: '#d97706',
            50: '#fffbeb',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
            50: '#fef2f2',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
            50: '#fffbeb',
        },
        info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
        },
        grey: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        },
        background: {
            default: '#f9fafb',
            paper: '#ffffff',
        },
        text: {
            primary: '#111827',
            secondary: '#6b7280',
        },
        divider: '#e5e7eb',
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        h1: {
            fontWeight: 800,
            fontSize: '3rem',
            lineHeight: 1.2,
        },
        h2: {
            fontWeight: 800,
            fontSize: '2.5rem',
            lineHeight: 1.2,
        },
        h3: {
            fontWeight: 800,
            fontSize: '2rem',
            lineHeight: 1.3,
        },
        h4: {
            fontWeight: 800,
            fontSize: '1.75rem',
            lineHeight: 1.3,
        },
        h5: {
            fontWeight: 700,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h6: {
            fontWeight: 700,
            fontSize: '1.25rem',
            lineHeight: 1.4,
        },
        subtitle1: {
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        subtitle2: {
            fontWeight: 600,
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                sizeLarge: {
                    padding: '12px 24px',
                    fontSize: '1rem',
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                rounded: {
                    borderRadius: 8,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 6,
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
                standardSuccess: {
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                },
                standardError: {
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                },
                standardWarning: {
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                },
                standardInfo: {
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    height: 8,
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #e5e7eb',
                },
                head: {
                    backgroundColor: '#f9fafb',
                    fontWeight: 700,
                },
            },
        },
    },
})
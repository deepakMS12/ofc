'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

type AlertSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarContextType {
    showSnackbar: (message: string, severity: AlertSeverity) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertSeverity>('info');

    const showSnackbar = (msg: string, sev: AlertSeverity) => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    };

    const showSuccess = (msg: string) => showSnackbar(msg, 'success');
    const showError = (msg: string) => showSnackbar(msg, 'error');
    const showWarning = (msg: string) => showSnackbar(msg, 'warning');

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar, showSuccess, showError, showWarning }}>
            {children}
                <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{
                    bottom: '24px !important',
                        zIndex: 99999,
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        minWidth: '300px',
                        maxWidth: '600px',
                            zIndex: 100000,
                        '& .MuiAlert-message': {
                            whiteSpace: 'pre-line',
                        },
                    }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}

export function useSnackbar() {
    const context = useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
}


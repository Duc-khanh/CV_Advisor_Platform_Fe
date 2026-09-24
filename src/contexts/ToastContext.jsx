import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // 'success' | 'error' | 'warning' | 'info'

  const showToast = useCallback((msg, sev = 'success') => {
    const text = typeof msg === 'string' ? msg : 'Đã xảy ra lỗi. Vui lòng thử lại.';
    setMessage(text.length > 220 ? text.slice(0, 217) + '...' : text);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Snackbar 
        open={open} 
        autoHideDuration={severity === 'error' ? 5000 : 3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          maxWidth: { xs: 'calc(100vw - 32px)', sm: 420 },
          '& .MuiSnackbarContent-root': { maxWidth: '100%' },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: '100%', alignItems: 'center', '& .MuiAlert-message': { lineHeight: 1.45 } }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

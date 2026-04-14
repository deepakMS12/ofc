'use client';

import { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { authApi } from '@/lib/api/auth';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fatalError, setFatalError] = useState('');

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setFatalError('');
    setSuccess('');

    if (!token || !email) {
      setError('Invalid or missing verification link.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyEmail({ token, email, password });
      if (response.status === 'success') {
        setSuccess(response.message || 'Email verified successfully.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const msg = response.message || 'Unable to verify email.';
        if (msg.toLowerCase().includes('already verified') || msg.toLowerCase().includes('expired')) {
          setFatalError(msg);
        } else {
          setError(msg);
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Unable to verify email. Please try again.';
      if (msg.toLowerCase().includes('already verified') || msg.toLowerCase().includes('expired')) {
        setFatalError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffdf6',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 420,
          width: '100%',
          p: 4,
          border: '1px solid #f0e7dc',
          borderRadius: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Verify your email
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
          Set a password to activate your account.
        </Typography>

        {!token || !email ? (
          <Alert severity="error">
            Invalid verification link. Please check the link sent to your email.
          </Alert>
        ) : fatalError ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {fatalError}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/login"
                sx={{ textTransform: 'none' }}
              >
                Go to Login
              </Button>
            </Box>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              value={email}
              margin="normal"
              InputProps={{ readOnly: true }}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, textTransform: 'none', backgroundColor: '#0b996e', '&:hover': { backgroundColor: '#0a7a5a' } }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              fullWidth
              variant="text"
              sx={{ mt: 1, textTransform: 'none' }}
            >
              Back to login
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}


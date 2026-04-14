'use client';

import { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { authApi } from '@/lib/api/auth';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token || !email) {
      setError('Invalid or missing reset link.');
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
      const response = await authApi.resetPassword({ token, email, password });
      if (response.status === 'success') {
        setSuccess(response.message || 'Password updated successfully.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.message || 'Unable to reset password.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to reset password. Please try again.');
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
          Reset password
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
          Enter a new password for your account.
        </Typography>

        {!token || !email ? (
          <Alert severity="error">
            Invalid reset link. Please check the link sent to your email.
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
              label="New Password"
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
              {loading ? 'Updating...' : 'Update Password'}
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


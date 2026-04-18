'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Skeleton,
  Switch,
} from '@mui/material';
import { Copy, RefreshCw, FileText } from 'lucide-react';
import LaunchIcon from '@mui/icons-material/Launch';
import { apiKeyApi } from '@/lib/api/apiKey';
import { showConfirm } from '@/lib/utils/sweetalert';

export default function ApiPortal() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyEnabled, setApiKeyEnabled] = useState(true);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    setLoading(true);
    try {
      const data = await apiKeyApi.getApiKey();
      if (data.apiKey) {
        setApiKey(data.apiKey);
      }
      if (data.enabled !== undefined) {
        setApiKeyEnabled(data.enabled);
      }
      if (data.createdAt) {
        setCreatedAt(data.createdAt);
      }
    } catch (error) {
      console.error('Failed to load API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyApiKey = async () => {
    if (apiKey) {
      try {
        await navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleEnable = async () => {
    try {
      const response = await apiKeyApi.enableApiKey();
      if (response.status === 'success') {
        setApiKeyEnabled(true);
   
      }
    } catch (error) {
      console.error('Failed to enable API key:', error);
      setApiKeyEnabled(false);
    }
  };

  const handleDisable = async () => {
    try {
      const response = await apiKeyApi.disableApiKey();
      if (response.status === 'success') {
        setApiKeyEnabled(false);
      }
    } catch (error) {
      console.error('Failed to disable API key:', error);
      setApiKeyEnabled(true);
    }
  };

  const handleRegenerateApiKey = async () => {
    const confirmed = await showConfirm({
      title: 'Regenerate API Key?',
      text: 'Are you sure you want to regenerate your API key? The old key will be invalidated.',
      icon: 'warning',
      confirmButtonText: 'Yes, regenerate it',
      cancelButtonText: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiKeyApi.regenerateApiKey();
      if (response.status === 'success' && response.apiKey) {
        setApiKey(response.apiKey);
        if (response.createdAt) {
          setCreatedAt(response.createdAt);
        }
      }
    } catch (error) {
      console.error('Failed to regenerate API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocumentation = () => {
    window.open('http://wa-api-ajaxter.readme.io/', '_blank');
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: 'white' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: '#333',
              }}
            >
              API Authorization Key
            </Typography>

            {/* Icon - API Key SVG */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                component="img"
                src="/assets/assets/images/icon/api_key.svg"
                alt="API Key"
                sx={{ width: 100, height: 100, objectFit: 'contain' }}
              />
            </Box>

            {loading ? (
              <Box>
                <Skeleton variant="text" width={200} height={20} sx={{ mx: 'auto', mb: 3 }} />
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={120} height={36} sx={{ mx: 'auto', mb: 4, borderRadius: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                      <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                    </Box>
                  </Box>
                  <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 1 }} />
                </Box>
              </Box>
            ) : (
              <>
                {/* Created At */}
                {createdAt && (
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Created at: {createdAt}
                    </Typography>
                  </Box>
                )}

                {/* API Key Field */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    value={apiKey || ''}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fafafa',
                      },
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleCopyApiKey}
                    startIcon={<Copy size={18} />}
                    sx={{
                      borderColor: '#e0e0e0',
                      color: '#666',
                      textTransform: 'none',
                      minWidth: 120,
                      '&:hover': {
                        borderColor: '#bdbdbd',
                        backgroundColor: '#fafafa',
                      },
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Management Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                  {/* Left: API Key Status */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                      API Key Status : {apiKeyEnabled ? 'Enabled' : 'Disabled'}
                    </Typography>
                    <Switch
                      checked={apiKeyEnabled}
                      onChange={(event) => {
                        if (event.target.checked) {
                          handleEnable();
                        } else {
                          handleDisable();
                        }
                      }}
                      disabled={loading}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0b996e',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#0b996e',
                        },
                        '& .MuiSwitch-switchBase': {
                          color: '#d32f2f',
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: '#f5b5b5',
                        },
                      }}
                    />
                  </Box>

                  {/* Right: Re-Generate */}
                  <Box sx={{ flex: 1, textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      onClick={handleRegenerateApiKey}
                      disabled={loading}
                      startIcon={<RefreshCw size={18} />}
                      sx={{
                        backgroundColor: '#0b996e',
                        color: 'white',
                        textTransform: 'none',
                        px: 3,
                        mt: 4.5,
                        '&:hover': {
                          backgroundColor: '#0a7a5a',
                        },
                      }}
                    >
                      Regenerate
                    </Button>
                  </Box>
                </Box>

                {apiKeyEnabled && (
                  <>
                    <Divider sx={{ my: 4 }} />

                    {/* API Documentation */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                        To Read API Documentation
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={handleViewDocumentation}
                        startIcon={<FileText size={20} />}
                        endIcon={<LaunchIcon />}
                        sx={{
                          backgroundColor: '#0b996e',
                          color: 'white',
                          textTransform: 'none',
                          px: 4,
                          py: 1.5,
                          fontSize: '16px',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: '#0a7a5a',
                          },
                        }}
                      >
                        CLICK HERE
                      </Button>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Skeleton,
} from '@mui/material';
import { devicesApi } from '@/lib/api/devices';
import { useToast } from '@/contexts/ToastContext';
import { PhoneInputField } from '@/components/common';

interface StepIndicatorProps {
  currentStep: number;
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 40,
        pt: 2,
      }}
    >
      {/* Step 1 */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: currentStep >= 1 ? '#0b996e' : '#e0e0e0',
          color: currentStep >= 1 ? 'white' : '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '16px',
          border: currentStep >= 1 ? 'none' : '2px solid #e0e0e0',
        }}
      >
        1
      </Box>
      <Box
        sx={{
          width: 2,
          height: 60,
          backgroundColor: currentStep >= 2 ? '#0b996e' : '#e0e0e0',
          my: 1,
        }}
      />
      {/* Step 2 */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: currentStep >= 2 ? '#0b996e' : '#e0e0e0',
          color: currentStep >= 2 ? 'white' : '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '16px',
          border: currentStep >= 2 ? 'none' : '2px solid #e0e0e0',
        }}
      >
        2
      </Box>
      <Box
        sx={{
          width: 2,
          height: 60,
          backgroundColor: currentStep >= 3 ? '#0b996e' : '#e0e0e0',
          my: 1,
        }}
      />
      {/* Step 3 */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: currentStep >= 3 ? '#0b996e' : '#e0e0e0',
          color: currentStep >= 3 ? 'white' : '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '16px',
          border: currentStep >= 3 ? 'none' : '2px solid #e0e0e0',
        }}
      >
        3
      </Box>
    </Box>
  );
}

export default function RegisterDevice() {
  const navigate = useNavigate();
  const { showError, showWarning } = useToast();
  const [step, setStep] = useState(1);
  const [deviceName, setDeviceName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrExpiresIn, setQrExpiresIn] = useState(0);
  const [qrTimestamp, setQrTimestamp] = useState<Date | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [deviceDetails, setDeviceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('initializing');
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [qrPollingInterval, setQrPollingInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Helper function to format QR code for display
  const formatQRCode = (qrCodeString: string | null): string | null => {
    if (!qrCodeString) return null;
    // If it's already a data URL or HTTP(S) URL, return as is
    if (qrCodeString.startsWith('data:') || qrCodeString.startsWith('http://') || qrCodeString.startsWith('https://')) {
      return qrCodeString;
    }
    // If it looks like base64 (no data URL prefix), add the prefix
    if (/^[A-Za-z0-9+/=]+$/.test(qrCodeString)) {
      return `data:image/png;base64,${qrCodeString}`;
    }
    return qrCodeString;
  };

  const startQRPolling = (deviceId: string | undefined) => {
    // Validate deviceId
    if (!deviceId) {
      console.error('[RegisterDevice] Cannot start QR polling: deviceId is undefined');
      return;
    }
    
    // Clear existing polling
    if (qrPollingInterval) {
      clearInterval(qrPollingInterval);
    }

    const interval = setInterval(async () => {
      try {
        if (!deviceId) {
          console.error('[RegisterDevice] deviceId is undefined in QR polling interval');
          clearInterval(interval);
          return;
        }
        
        const response = await devicesApi.getQRCode(deviceId);
        
        // Extract connection status
        const connStatus = typeof response.connectionStatus === 'string' 
          ? response.connectionStatus 
          : (typeof response.connectionStatus === 'object' && response.connectionStatus?.status ? response.connectionStatus.status : 'unknown');
        
        // Check if device is connected - only if explicitly marked as connected
        // Don't rely on response.connected alone, check the actual status
        if (response.connected === true && connStatus === 'connected') {
          // Device is connected - stop polling and move to success step
          clearInterval(interval);
          setQrPollingInterval(null);
          setIsVerifying(false);
          setQrCode(null); // Clear QR code
          setConnectionStatus('connected');
          setDeviceDetails((prev: any) => ({
            ...prev,
            status: 'connected',
          }));
          setStep(3);
          return;
        }
        
        // If QR code is available, set it
        if (response.qrCode) {
          setQrCode(response.qrCode);
          setQrTimestamp(response.timestamp ? new Date(response.timestamp) : new Date());
          setQrExpiresIn(10); // Reset to 10 seconds for auto-refresh
          setConnectionStatus(connStatus);
          clearInterval(interval);
          setQrPollingInterval(null);
        } else {
          // Still generating, update status
          setConnectionStatus(connStatus);
        }
      } catch (error) {
        console.error('Failed to poll QR code:', error);
      }
    }, 10000); // Poll every 10 seconds

    setQrPollingInterval(interval);

    // Stop polling after 2 minutes
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        setQrPollingInterval(null);
      }
    }, 120000);
  };

  useEffect(() => {
    if (step === 2 && qrCode && qrTimestamp && deviceDetails?.deviceId) {
      // Auto-refresh QR code by calling GET /qr endpoint every 10 seconds
      const autoRefreshInterval = setInterval(async () => {
        if (deviceDetails?.deviceId) {
          try {
            const response = await devicesApi.getQRCode(deviceDetails.deviceId);
            // Extract connection status
            const connStatus = typeof response.connectionStatus === 'string' 
              ? response.connectionStatus 
              : (typeof response.connectionStatus === 'object' && response.connectionStatus?.status ? response.connectionStatus.status : 'unknown');
            
            // Update QR code if available
            if (response.qrCode) {
              setQrCode(response.qrCode);
              setQrTimestamp(response.timestamp ? new Date(response.timestamp) : new Date());
              setConnectionStatus(connStatus);
            } else {
              // Update status even if no QR code
              setConnectionStatus(connStatus);
            }
          } catch (error) {
            console.error('Failed to refresh QR code:', error);
          }
        }
      }, 10000); // 10 seconds

      // Countdown timer for display (shows time until next refresh)
      // Calculate remaining time based on when QR was last refreshed
      const updateTimer = () => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - qrTimestamp.getTime()) / 1000);
        const remaining = Math.max(0, 10 - (elapsed % 10)); // Reset every 10 seconds
        setQrExpiresIn(remaining);
      };
      
      // Update countdown every second
      const countdownInterval = setInterval(updateTimer, 1000);
      
      // Initial update
      updateTimer();
      
      return () => {
        clearInterval(autoRefreshInterval);
        clearInterval(countdownInterval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, qrCode, qrTimestamp, deviceDetails?.deviceId]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      if (qrPollingInterval) {
        clearInterval(qrPollingInterval);
      }
    };
  }, [pollingInterval, qrPollingInterval]);

  const handleNext = async () => {
    if (step === 1) {
      if (!deviceName.trim() || !mobileNumber.trim()) {
        showWarning('Please fill in all required fields');
        return;
      }
      setLoading(true);
      try {
        // Register device and get QR code
        const response = await devicesApi.registerDevice({
          alias: deviceName,
          deviceName: deviceName,
          mobileNumber: mobileNumber,
        });
        
        // Extract deviceId from response - backend returns instanceKey
        const deviceId = response.device?.deviceId || response.device?.instanceKey;
        
        if (!deviceId) {
          console.error('No deviceId in response:', response);
          showError('Failed to register device: No device ID returned');
          setStep(1);
          return;
        }
        
        console.log('[RegisterDevice] Device registered with ID:', deviceId);
        
        // Store device info for later use
        setDeviceDetails({
          deviceName,
          mobileNumber,
          deviceId: deviceId,
          status: response.device?.status || 'pending',
        });
        
        setConnectionStatus(response.connectionStatus || 'initializing');
        
        // Move to step 2 immediately to start polling
        setStep(2);
        setIsVerifying(true);
        
        // If QR code is available, set it
        if (response.qrCode) {
          setQrCode(response.qrCode);
          setQrTimestamp(new Date());
          setQrExpiresIn(10); // Start countdown at 10 seconds for auto-refresh
        } else {
          // Start polling for QR code
          startQRPolling(deviceId);
        }
        
        // Start polling for connection status
        startConnectionPolling(deviceId);
      } catch (error: any) {
        console.error('Failed to register device:', error);
        showError(error.response?.data?.message || 'Failed to register device. Please try again.');
        setStep(1);
      } finally {
        setLoading(false);
      }
    }
  };

  const startConnectionPolling = (deviceId: string | undefined) => {
    // Validate deviceId
    if (!deviceId) {
      console.error('[RegisterDevice] Cannot start connection polling: deviceId is undefined');
      return;
    }
    
    // Clear existing polling
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const pollInterval = setInterval(async () => {
      try {
        if (!deviceId) {
          console.error('[RegisterDevice] deviceId is undefined in polling interval');
          clearInterval(pollInterval);
          return;
        }
        
        try {
          const statusResponse = await devicesApi.getConnectionStatus(deviceId);
          
          // Check if there's an error (e.g., mobile number mismatch)
          if (statusResponse.status === 'error') {
            clearInterval(pollInterval);
            setPollingInterval(null);
            setIsVerifying(false);
            setQrCode(null);
            setConnectionStatus('error');
            
            // Show error message to user
            const errorMessage = statusResponse.message || 'Device number is not matching with WhatsApp scan account. Note: Your account creation request has been cancelled. You can logout the inactive session from your phone.';
            showError(errorMessage);
            
            // Reset to step 1
            setStep(1);
            setDeviceDetails(null);
            return;
          }
          
          // Extract connection status - backend now returns it as a string
          const status = statusResponse.connectionStatus || 'unknown';
          
          console.log(`[RegisterDevice] Connection status check: ${status}`, statusResponse);
          
          setConnectionStatus(status);
          
          // Check if connected - require ALL conditions to be true:
          // 1. Connection status must be 'connected'
          // 2. Socket must be ready
          // 3. Database status must be 'active' or 'online' (not 'pending')
          const isConnected = status === 'connected' 
            && statusResponse.isReady === true 
            && (statusResponse.databaseStatus === 'active' || statusResponse.databaseStatus === 'online');
          
          if (isConnected) {
            clearInterval(pollInterval);
            setPollingInterval(null);
            setIsVerifying(false);
            // Clear QR code when connected
            setQrCode(null);
            // Update device details with connected status
            setDeviceDetails((prev: any) => ({
              ...prev,
              status: 'connected',
            }));
            setStep(3);
          } else if (status === 'qr_ready' && !qrCode) {
            // QR code is ready but we don't have it, fetch it
            try {
              const qrResponse = await devicesApi.getQRCode(deviceId);
              if (qrResponse.qrCode) {
                setQrCode(qrResponse.qrCode);
                setQrTimestamp(qrResponse.timestamp ? new Date(qrResponse.timestamp) : new Date());
                setQrExpiresIn(10); // Reset to 10 seconds for auto-refresh
                // Stop QR polling if active
                if (qrPollingInterval) {
                  clearInterval(qrPollingInterval);
                  setQrPollingInterval(null);
                }
              }
            } catch (error) {
              console.error('Failed to fetch QR code:', error);
            }
          }
        } catch (error: any) {
          // Handle API errors (including 400 status for mobile mismatch)
          if (error.response?.status === 400 && error.response?.data?.status === 'error') {
            clearInterval(pollInterval);
            setPollingInterval(null);
            setIsVerifying(false);
            setQrCode(null);
            setConnectionStatus('error');
            
            const errorMessage = error.response.data.message || 'Device number is not matching with WhatsApp scan account. Note: Your account creation request has been cancelled. You can logout the inactive session from your phone.';
            showError(errorMessage);
            
            // Reset to step 1
            setStep(1);
            setDeviceDetails(null);
            return;
          }
          console.error('Failed to check connection status:', error);
        }
      } catch (error) {
        console.error('Failed to check connection status:', error);
      }
    }, 1000); // Poll every 1 second

    setPollingInterval(pollInterval);

    // Stop polling after 10 minutes
    setTimeout(() => {
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollingInterval(null);
      }
    }, 600000);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/home/devices');
    }
  };

  const handleCancel = () => {
    navigate('/home/devices');
  };

  const handleRegisterAnother = () => {
    setStep(1);
    setDeviceName('');
    setMobileNumber('');
    setQrCode(null);
    setDeviceDetails(null);
  };

  const handleGoToDashboard = () => {
    navigate('/home/dashboard')
  };

  return (
    <Box sx={{ p: 4, backgroundColor: 'fffdf5', minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', alignItems:"center", justifyContent:"center" }}>
   
        <Box sx={{ display: 'flex' }}>
          {/* Step Indicator on Left */}
          <Box sx={{ mr: 4, flexShrink: 0 }}>
            <StepIndicator currentStep={step} />
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 800,maxWidth: 800 }}>
            {/* Step 1: Device Registration Form */}
          {step === 1 && (
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: 'white' }}>
              {loading ? (
                <>
                  <Skeleton variant="text" width={60} height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width={300} height={40} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width={500} height={24} sx={{ mb: 4 }} />
                  <Box sx={{ mb: 3 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 1, borderRadius: 1 }} />
                    <Skeleton variant="text" width={250} height={16} />
                  </Box>
                  <Box sx={{ mb: 4 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 1, borderRadius: 1 }} />
                    <Skeleton variant="text" width={400} height={16} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={180} height={36} sx={{ borderRadius: 1 }} />
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="caption" sx={{ color: '#666', fontSize: '12px', mb: 1, display: 'block' }}>
                    STEP 1
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                    Register WhatsApp Device
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', mb: 4, fontSize: '16px' }}>
                    Enter your device details to begin the registration process. You'll receive a QR code to scan with WhatsApp.
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Device Name"
                      required
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      placeholder="e.g., Support-node-01, Marketing-device"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
                      A friendly name to identify this device
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "#333", mb: 1 }}
                    >
                      Mobile Number
                    </Typography>
                    <PhoneInputField
                      value={mobileNumber}
                      onChange={setMobileNumber}
                      placeholder="91 98765 43210"
                      defaultCountry="in"
                      
                    />
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '12px', mt: 1, display: 'block' }}>
                      The WhatsApp number associated with this device you want to register with country code
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{
                        borderColor: '#e0e0e0',
                        color: '#666',
                        textTransform: 'none',
                        px: 3,
                        '&:hover': {
                          borderColor: '#bdbdbd',
                          backgroundColor: '#fffdf5',
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={loading}
                      sx={{
                        backgroundColor: '#0b996e',
                        color: 'white',
                        textTransform: 'none',
                        px: 3,
                        '&:hover': {
                          backgroundColor: '#025630',
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'Next: Generate QR Code'}
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          )}

          {/* Step 2: QR Code Scanning */}
          {step === 2 && (
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: 'white' }}>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px', mb: 1, display: 'block' }}>
                STEP 2
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                Follow the instructions below to scan the QR code with your WhatsApp mobile app.
              </Typography>

              <Box sx={{ display: 'flex', gap: 4, mt: 4 }}>
                {/* Instructions */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
                    Steps to log in
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    {/* Connecting line */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: 32,
                        bottom: 32,
                        width: '2px',
                        backgroundColor: '#e0e0e0',
                        zIndex: 0,
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'relative', zIndex: 1 }}>
                      {/* Step 1 */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: '#0b996e',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            flexShrink: 0,
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        >
                          1
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 0.5 }}>
                          <Typography variant="body1" sx={{ color: '#333' }}>
                            Open WhatsApp
                          </Typography>
                          <Box
                            component="img"
                            src="/assets/assets/images/icon/whatsapp.png"
                            alt="WhatsApp"
                            sx={{ width: 20, height: 20, ml: 0.5 }}
                          />
                          <Typography variant="body1" sx={{ color: '#333' }}>
                            on your phone
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Step 2 */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: '#0b996e',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            flexShrink: 0,
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        >
                          2
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body1" sx={{ color: '#333' }}>
                              On Android tap
                            </Typography>
                            <Box
                              component="img"
                              src="/assets/assets/images/icon/dot.png"
                              alt="Menu"
                              sx={{ width: 18, height: 18 }}
                            />
                            <Typography variant="body1" sx={{ color: '#333' }}>
                              Menu
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ color: '#333' }}>
                              On iPhone tap
                            </Typography>
                            <Box
                              component="img"
                              src="/assets/assets/images/icon/cog.png"
                              alt="Settings"
                              sx={{ width: 18, height: 18 }}
                            />
                            <Typography variant="body1" sx={{ color: '#333' }}>
                              Settings
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      {/* Step 3 */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: '#0b996e',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            flexShrink: 0,
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        >
                          3
                        </Box>
                        <Typography variant="body1" sx={{ color: '#333', pt: 0.5 }}>
                          Tap Linked devices, then Link device
                        </Typography>
                      </Box>
                      
                      {/* Step 4 */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: '#0b996e',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            flexShrink: 0,
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        >
                          4
                        </Box>
                        <Typography variant="body1" sx={{ color: '#333', pt: 0.5 }}>
                          Scan the QR code to confirm
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* QR Code */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      width: 300,
                      height: 300,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                      mb: 2,
                    }}
                  >
                    {qrCode ? (
                      <Box
                        component="img"
                        src={formatQRCode(qrCode) || qrCode}
                        alt="QR Code"
                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          console.error('Failed to load QR code image:', e);
                          // Try to reload or show error
                        }}
                      />
                    ) : (
                      <CircularProgress />
                    )}
                  </Paper>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                    {qrCode ? (
                      <>QR expires in {qrExpiresIn}s</>
                    ) : (
                      <>Status: {typeof connectionStatus === 'string' 
                        ? (connectionStatus === 'initializing' ? 'Generating QR code...' : connectionStatus === 'qr_ready' ? 'QR code ready' : connectionStatus)
                        : 'Loading...'}</>
                    )}
                  </Typography>
                  {isVerifying && typeof connectionStatus === 'string' && connectionStatus !== 'connected' && (
                    <Typography variant="caption" sx={{ color: '#0b996e', display: 'block', mb: 2, fontWeight: 600 }}>
                      Please scan the QR code with your WhatsApp mobile app.
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    borderColor: '#e0e0e0',
                    color: '#666',
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                      borderColor: '#bdbdbd',
                      backgroundColor: '#fffdf5',
                    },
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={isVerifying}
                  sx={{
                    backgroundColor: '#0b996e',
                    color: 'white',
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                      backgroundColor: '#025630',
                    },
                  }}
                >
                  {isVerifying ? <CircularProgress size={20} color="inherit" /> : "I've Scanned the QR Code"}
                </Button>
              </Box>
            </Paper>
          )}

          {/* Step 3: Success/Verification */}
          {step === 3 && (
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: 'white' }}>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px', mb: 1, display: 'block' }}>
                STEP 3
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mb: 4, fontSize: '16px' }}>
                We're verifying your device connection. This may take a few moments.
              </Typography>

              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: '#0b996e',
                  }}
                >
                  Device Connected Successfully!
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                  Your WhatsApp device has been registered and is ready to use.
                </Typography>

                {deviceDetails && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      backgroundColor: 'white',
                      maxWidth: 500,
                      mx: 'auto',
                      textAlign: 'left',
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                        Device Name:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                        {deviceDetails.deviceName}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                        Mobile Number:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                        {deviceDetails.mobileNumber}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                        Status:
                      </Typography>
                      <Chip
                        label={deviceDetails.status}
                        size="small"
                        sx={{
                          backgroundColor: '#fff3e0',
                          color: '#f57c00',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Paper>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleRegisterAnother}
                  sx={{
                    backgroundColor: 'white',
                    borderColor: '#0b996e',
                    color: '#0b996e',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#025630',
                      color: '#025630',
                      backgroundColor: 'white',
                    },
                  }}
                >
                  Register Another Device
                </Button>
                <Button
                  variant="contained"
                  onClick={handleGoToDashboard}
                  sx={{
                    backgroundColor: '#0b996e',
                    color: 'white',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#025630',
                    },
                  }}
                >
                  Go to Dashboard
                </Button>
              </Box>
            </Paper>
          )}
          </Box>
        </Box>

    </Box>
  );
}


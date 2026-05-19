'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Divider,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Wallet, X } from 'lucide-react';
import { colors } from '@/utils/customColor';
import { accountApi } from '@/lib/api/account';
import { paymentApi } from '@/lib/api/payment';
import { useToast } from '@/hooks/useToast';

const PAYTM_MID = import.meta.env.VITE_PAYTM_MID as string;
const PAYTM_STAGING = import.meta.env.VITE_PAYTM_STAGING === 'true';

function loadPaytmScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('paytm-checkout-js')) {
      resolve();
      return;
    }
    const base = PAYTM_STAGING ? 'https://securegw-stage.paytm.in' : 'https://securegw.paytm.in';
    const script = document.createElement('script');
    script.id = 'paytm-checkout-js';
    script.src = `${base}/merchantpgpui/checkoutjs/merchants/${PAYTM_MID}.js`;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paytm checkout script'));
    document.body.appendChild(script);
  });
}

export interface AddFundsDrawerProps {
  open: boolean;
  onClose: () => void;
  walletBalance: number | null;
  onBalanceChange?: (balance: number) => void;
}

export default function AddFundsDrawer({
  open,
  onClose,
  walletBalance,
  onBalanceChange,
}: AddFundsDrawerProps) {
  const { showToast } = useToast();
  const [addAmount, setAddAmount] = useState('');
  const [addAmountError, setAddAmountError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const parsedAmount = parseInt(addAmount, 10);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 10 && parsedAmount <= 10000;
  const gstAmount = isValidAmount ? Math.round(parsedAmount * 0.18 * 100) / 100 : 0;
  const totalAmount = isValidAmount ? parsedAmount + gstAmount : 0;

  const handleClose = () => {
    setAddAmount('');
    setAddAmountError('');
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAddAmount(val);
    if (!val) {
      setAddAmountError('');
      return;
    }
    const n = parseInt(val, 10);
    if (n < 10) setAddAmountError('Minimum amount is ₹10');
    else if (n > 10000) setAddAmountError('Maximum amount is ₹10,000');
    else setAddAmountError('');
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleAddFunds = async () => {
    if (!isValidAmount || addAmountError) return;
    const orderId = `OFC_W_${Date.now()}_${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
    setIsProcessingPayment(true);
    try {
      const { txnToken } = await paymentApi.initiatePaytm({
        planCode: 'wallet',
        amount: totalAmount.toFixed(2),
        orderId,
      });
      await loadPaytmScript();
      const paytm = (window as { Paytm?: { CheckoutJS: { init: (config: unknown) => Promise<void>; invoke: () => void } } }).Paytm;
      if (!paytm?.CheckoutJS) throw new Error('Paytm CheckoutJS not available');
      const config = {
        root: '',
        flow: 'DEFAULT',
        merchant: { mid: PAYTM_MID, redirect: false },
        data: { orderId, token: txnToken, tokenType: 'TXN_TOKEN', amount: totalAmount.toFixed(2) },
        handler: {
          notifyMerchant: (eventName: string) => {
            if (eventName === 'SESSION_EXPIRED') {
              showToast('Payment session expired. Please try again.', 'error');
              setIsProcessingPayment(false);
            }
          },
          transactionStatus: async (data: { STATUS: string }) => {
            setIsProcessingPayment(false);
            if (data.STATUS === 'TXN_SUCCESS') {
              showToast('Funds added successfully!', 'success');
              setAddAmount('');
              const balance = await accountApi.getBalance();
              onBalanceChange?.(balance.balance);
              handleClose();
            } else {
              showToast('Payment failed or cancelled. Please try again.', 'error');
            }
          },
        },
      };
      await paytm.CheckoutJS.init(config);
      paytm.CheckoutJS.invoke();
    } catch {
      showToast('Failed to initiate payment. Please try again.', 'error');
      setIsProcessingPayment(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: '35%' } }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Wallet size={22} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              Add Money to Wallet
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: '#666' }}>
            <X size={20} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 3, backgroundColor: '#fafafa' }}>
          <Box sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'white' }}>
            {walletBalance !== null && (
              <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mb: 2 }}>
                Current Balance: ₹{walletBalance.toFixed(4)}
              </Typography>
            )}

            {walletBalance !== null && <Divider sx={{ mb: 3 }} />}

            <TextField
              label="Amount"
              value={addAmount}
              onChange={handleAmountChange}
              error={!!addAmountError}
              helperText={addAmountError || 'Min ₹10 · Max ₹10,000 · No decimals'}
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { bgcolor: '#fafafa' } }}
            />

            {isValidAmount && (
              <Box sx={{ bgcolor: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Amount
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    ₹{parsedAmount}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    GST (18%)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    ₹{gstAmount.toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    Total
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary }}>
                    ₹{totalAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}

            <FormControl sx={{ mb: 1 }}>
              <FormLabel sx={{ fontSize: 14, fontWeight: 600, color: '#333', mb: 0.5 }}>
                Payment Gateway
              </FormLabel>
              <RadioGroup value="paytm">
                <FormControlLabel
                  value="paytm"
                  control={
                    <Radio
                      size="small"
                      sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                      Paytm
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            <Button
              variant="contained"
              disableElevation
              fullWidth
              disabled={!isValidAmount || !!addAmountError || isProcessingPayment}
              onClick={() => void handleAddFunds()}
              sx={{
                py: 1.4,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 15,
                bgcolor: colors.primary,
                boxShadow: 'none',
                '&:hover': { bgcolor: colors.primary, filter: 'brightness(0.92)', boxShadow: 'none' },
              }}
            >
              {isProcessingPayment ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                `Proceed to Pay${isValidAmount ? ` ₹${totalAmount.toFixed(2)}` : ''}`
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

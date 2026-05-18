'use client';

import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Divider,
  Chip,
  Drawer,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import { Clock, LogOut, Bell } from 'lucide-react';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsDrawer from '@/components/dialogs/NotificationsDrawer';
import { ConfirmDialog } from '@/components/common';
import { useConverterSearch } from '@/contexts/ConverterSearchContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { clearUser } from '@/store/slices/userSlice';
import { colors } from '@/utils/customColor';
import { accountApi } from '@/lib/api/account';
import { paymentApi } from '@/lib/api/payment';
import { supportApi, type SupportCategory } from '@/lib/api/support';
import { useToast } from '@/hooks/useToast';

const PAYTM_MID = import.meta.env.VITE_PAYTM_MID as string;
const PAYTM_STAGING = import.meta.env.VITE_PAYTM_STAGING === 'true';

function loadPaytmScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('paytm-checkout-js')) { resolve(); return; }
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

export default function Header() {
  const navigate = useNavigate();
  const { openSearch } = useConverterSearch();
  const dispatch = useAppDispatch();
  // const user = useAppSelector((s) => s.user.profile);
  const { showToast } = useToast();
  const [time, setTime] = useState('--:--:--');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [addAmountError, setAddAmountError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportCategory, setSupportCategory] = useState<SupportCategory | ''>('');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportAttachments, setSupportAttachments] = useState<File[]>([]);
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  useEffect(() => {

    // Update clock
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    accountApi.getBalance().then((data) => setWalletBalance(data.balance)).catch(() => {});
  }, []);

  const parsedAmount = parseInt(addAmount, 10);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 10 && parsedAmount <= 10000;
  const gstAmount = isValidAmount ? Math.round(parsedAmount * 0.18 * 100) / 100 : 0;
  const totalAmount = isValidAmount ? parsedAmount + gstAmount : 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAddAmount(val);
    if (!val) { setAddAmountError(''); return; }
    const n = parseInt(val, 10);
    if (n < 10) setAddAmountError('Minimum amount is ₹10');
    else if (n > 10000) setAddAmountError('Maximum amount is ₹10,000');
    else setAddAmountError('');
  };

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
      const paytm = (window as any).Paytm;
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
              setAddFundsOpen(false);
              setAddAmount('');
              const balance = await accountApi.getBalance();
              setWalletBalance(balance.balance);
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

  const handleAddFundsClose = () => {
    setAddFundsOpen(false);
    setAddAmount('');
    setAddAmountError('');
  };

  const handleSupportClose = () => {
    setSupportOpen(false);
    setSupportCategory('');
    setSupportSubject('');
    setSupportMessage('');
    setSupportAttachments([]);
  };

  const handleAttachmentAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    e.target.value = '';
    const ALLOWED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    const MAX_SIZE = 5 * 1024 * 1024;

    for (const file of incoming) {
      if (!ALLOWED.includes(file.type)) {
        showToast(`"${file.name}" is not allowed. Only images and PDFs are accepted.`, 'error');
        return;
      }
      if (file.size > MAX_SIZE) {
        showToast(`"${file.name}" exceeds the 5 MB limit.`, 'error');
        return;
      }
    }

    setSupportAttachments((prev) => {
      const merged = [...prev, ...incoming];
      if (merged.length > 2) {
        showToast('Maximum 2 attachments allowed.', 'error');
        return prev;
      }
      return merged;
    });
  };

  const handleAttachmentRemove = (index: number) => {
    setSupportAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSupportSubmit = async () => {
    if (!supportCategory || !supportSubject.trim() || !supportMessage.trim()) return;
    setIsSubmittingSupport(true);
    try {
      await supportApi.submitTicket({
        category: supportCategory,
        subject: supportSubject.trim(),
        message: supportMessage.trim(),
        attachments: supportAttachments.length ? supportAttachments : undefined,
      });
      showToast('Support ticket submitted successfully!', 'success');
      handleSupportClose();
    } catch {
      showToast('Failed to submit ticket. Please try again.', 'error');
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    setLogoutConfirmOpen(false);
    navigate('/login', { replace: true });
  };

  const triggerConverterSearch = () => {
    openSearch();
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: `4px solid ${colors.primary}`,
          height: '4.625rem',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3, position: 'relative' }}>
          {/* Left Side - OFC Logo */}
          <Box
            sx={{
              backgroundColor: colors.primary,
              height: '4.625rem',
              display: 'flex',
              alignItems: 'center',
              px: 3,
              position: 'absolute',
              left: 0,
              top: 0,
              width: 'calc(236px + 0.5rem)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.primary,
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              >
                <img src='/assets/images/ajaxter-logo.svg' alt='logo' style={{ width: 80, height: 80 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '18px',
                }}
              >
                OFC
              </Typography>
            </Box>
          </Box>

          {/* Left Side - User Profile with Avatar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              m: 'calc(210px + 15px + 3.5rem)',
            }}
          >
            {/* <Avatar
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: '#e3f2fd',
                color: colors.primary,
                fontWeight: 600,
              }}
            >
              <User size={20} />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
                Welcome,
              </Typography>
              <Typography variant="body2" sx={{ color: '#333', fontWeight: 600, marginBottom: '-6px' }}>
                {user?.name || 'User'}
              </Typography>
            </Box> */}

            {/* Wallet Balance Chip */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#1156a6',
                borderRadius: '3px',
                pl: 2,
                pr: 2,
                py: 1,
                gap: 1,
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src="/assets/images/wallet.svg"
                alt="wallet"
                sx={{ width: 30, height: 20, display: 'block' }}
              />
              <Typography
                sx={{ color: 'white', fontWeight: 600, fontSize: 13, fontFamily: 'monospace', mt: 0.5 }}
              >
                ₹ {walletBalance !== null ? walletBalance.toFixed(4) : '00'}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setAddFundsOpen(true)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderRadius: '3px',
                  width: 24,
                  height: 24,
                  ml: 2,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
                }}
              >
                <Box
                  component="img"
                  src="/assets/images/wallet-plus.svg"
                  alt="add funds"
                  sx={{ width: 15, height: 15, display: 'block' }}
                />
              </IconButton>
            </Box>

            <Box
              role="button"
              tabIndex={0}
              aria-label="Search converters"
              onClick={triggerConverterSearch}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  triggerConverterSearch();
                }
              }}
              sx={{
                margin: '0 0 0 50px',
                height: 40,
                minWidth: 280,
                px: 1.25,
                borderRadius: '3px',
                border: '1px solid',
                borderColor: 'hsla(215, 15%, 88%, 0.95)',
                backgroundColor: 'hsla(215, 15%, 97%, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#64748b',
                cursor: 'pointer',
                alignSelf: 'center',
                transition: (theme) =>
                  theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
                    duration: 150,
                  }),
                '&:hover': {
                  backgroundColor: '#fff',
                  borderColor: '#60a5fa',
                  boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.18)',
                  '& .header-search-shortcut': {
                    backgroundColor: '#eef2ff',
                    color: '#1d4ed8',
                  },
                },
                '&:focus-visible': {
                  outline: 'none',
                  backgroundColor: '#fff',
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.22)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'hsla(215, 15%, 92%, 0.9)',
                    backgroundColor: '#f8fafc',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <SearchIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                </Box>
                <Typography variant="body2" sx={{ fontSize: 15, color: 'inherit', lineHeight: 1 }}>
                  What are you looking for?
                </Typography>
              </Box>
              <Chip
                className="header-search-shortcut"
                label="Ctrl+K"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  triggerConverterSearch();
                }}
                sx={{
                  height: 24,
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: 12,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  transition: (theme) =>
                    theme.transitions.create(['background-color', 'color'], { duration: 150 }),
                  '& .MuiChip-label': { px: 0.9 },
                }}
              />
            </Box>
          </Box>

          {/* Right Side - Notifications, Clock */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, ml: 'auto' }}>
            {/* Clock */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mr: { xs: 0, sm: 3, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={20} color="#666" />
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                  {time}
                </Typography>
              </Box>

              {/* Notifications Bell */}
              <Tooltip title="Notifications">
                <IconButton
                  onClick={() => setNotificationsOpen(true)}
                  sx={{
                    color: '#666',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <Bell size={20} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Support */}
              <Tooltip title="Support">
                <IconButton
                  onClick={() => setSupportOpen(true)}
                  sx={{
                    color: '#666',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <Box component="img" src="/assets/images/support.svg" alt="support" sx={{ width: 22, height: 22, marginTop: -1, display: 'block' }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider orientation="vertical" flexItem />

            {/* Logout Button */}
            <Tooltip title="Logout">
              <IconButton
                onClick={() => setLogoutConfirmOpen(true)}
                sx={{
                  color: '#666',
                  ml: { xs: 0, sm: 3, md: 3 },
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    color: '#d32f2f',
                  },
                }}
              >
                <LogOut size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <NotificationsDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNotificationCountChange={setNotificationCount}
      />

      <ConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Log out?"
        description="You will need to sign in again to use OFC."
        confirmText="Log out"
        cancelText="Stay signed in"
        confirmColor="error"
      />

      {/* Support Drawer */}
      <Drawer
        anchor="right"
        open={supportOpen}
        onClose={handleSupportClose}
        PaperProps={{ sx: { width: '35%', bgcolor: '#fafafa' } }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
            <IconButton size="small" onClick={handleSupportClose} sx={{ color: '#666' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'white' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', textAlign: 'center', mb: 2 }}>
              Contact Support
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Box component="img" src="/assets/images/support.svg" alt="support" sx={{ width: 80, height: 80, objectFit: 'contain' }} />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormControl fullWidth>
                <InputLabel id="support-category-label">Category</InputLabel>
                <Select
                  labelId="support-category-label"
                  label="Category"
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value as SupportCategory)}
                  sx={{ bgcolor: '#fafafa' }}
                >
                  <MenuItem value="api_request">API Request</MenuItem>
                  <MenuItem value="bug_report">Bug Report</MenuItem>
                  <MenuItem value="account_related">Account Related</MenuItem>
                  <MenuItem value="billing_related">Billing Related</MenuItem>
                  <MenuItem value="feature_request">Feature Request</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Subject"
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
                fullWidth
                inputProps={{ maxLength: 150 }}
                helperText={`${supportSubject.length}/150`}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fafafa' } }}
              />

              <TextField
                label="Message"
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                fullWidth
                multiline
                rows={5}
                inputProps={{ maxLength: 2000 }}
                helperText={`${supportMessage.length}/2000`}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fafafa' } }}
              />

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    Attachments{' '}
                    <Typography component="span" variant="body2" sx={{ color: '#999', fontWeight: 400 }}>(optional)</Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    {supportAttachments.length}/2 · Images & PDF · Max 5 MB
                  </Typography>
                </Box>
                {supportAttachments.map((file, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, mb: 1, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#fafafa' }}>
                    <AttachFileIcon sx={{ color: colors.primary, fontSize: 16, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#333', fontWeight: 500 }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999', flexShrink: 0 }}>{(file.size / 1024).toFixed(0)} KB</Typography>
                    <IconButton size="small" onClick={() => handleAttachmentRemove(i)} sx={{ color: '#bbb', '&:hover': { color: '#d32f2f' } }}>
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
                {supportAttachments.length < 2 && (
                  <Box component="label" htmlFor="support-file-input" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, border: '1px dashed #bdbdbd', borderRadius: 1, cursor: 'pointer', bgcolor: '#fafafa', '&:hover': { borderColor: colors.primary, bgcolor: '#f5f8ff' }, transition: 'all 0.15s' }}>
                    <AttachFileIcon sx={{ color: '#bdbdbd', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>Click to attach a file</Typography>
                  </Box>
                )}
                <input id="support-file-input" type="file" hidden accept="image/jpeg,image/png,image/gif,image/webp,application/pdf" onChange={handleAttachmentAdd} />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Button
              variant="contained"
              disableElevation
              fullWidth
              disabled={!supportCategory || !supportSubject.trim() || !supportMessage.trim() || isSubmittingSupport}
              onClick={() => void handleSupportSubmit()}
              sx={{ py: 1.4, textTransform: 'none', fontWeight: 600, fontSize: 15, bgcolor: colors.primary, boxShadow: 'none', '&:hover': { bgcolor: colors.primary, filter: 'brightness(0.92)', boxShadow: 'none' } }}
            >
              {isSubmittingSupport ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Submit Ticket'}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Add Funds Drawer */}
      <Drawer
        anchor="right"
        open={addFundsOpen}
        onClose={handleAddFundsClose}
        PaperProps={{ sx: { width: '35%', bgcolor: '#fafafa' } }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
            <IconButton size="small" onClick={handleAddFundsClose} sx={{ color: '#666' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'white' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', textAlign: 'center', mb: 2 }}>
              Add Money to Wallet
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Box component="img" src="/assets/images/wallet.svg" alt="wallet" sx={{ width: 80, height: 80, objectFit: 'contain' }} />
            </Box>
            {walletBalance !== null && (
              <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                Current Balance: ₹{walletBalance.toFixed(4)}
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

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
                  <Typography variant="body2" sx={{ color: '#666' }}>Amount</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>₹{parsedAmount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>GST (18%)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>₹{gstAmount.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>Total</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary }}>₹{totalAmount.toFixed(2)}</Typography>
                </Box>
              </Box>
            )}

            <FormControl sx={{ mb: 1 }}>
              <FormLabel sx={{ fontSize: 14, fontWeight: 600, color: '#333', mb: 0.5 }}>Payment Gateway</FormLabel>
              <RadioGroup value="paytm">
                <FormControlLabel
                  value="paytm"
                  control={<Radio size="small" sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }} />}
                  label={<Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>Paytm</Typography>}
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
              sx={{ py: 1.4, textTransform: 'none', fontWeight: 600, fontSize: 15, bgcolor: colors.primary, boxShadow: 'none', '&:hover': { bgcolor: colors.primary, filter: 'brightness(0.92)', boxShadow: 'none' } }}
            >
              {isProcessingPayment ? <CircularProgress size={20} sx={{ color: 'white' }} /> : `Proceed to Pay${isValidAmount ? ` ₹${totalAmount.toFixed(2)}` : ''}`}
            </Button>
          </Box>
        </Box>
      </Drawer>

    </>
  );
}

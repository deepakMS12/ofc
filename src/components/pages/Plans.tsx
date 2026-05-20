import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { paymentApi } from '@/lib/api/payment';
import { accountApi } from '@/lib/api/account';
import { useToast } from '@/hooks/useToast';
import { Crown, Receipt } from 'lucide-react';
import PlanTransactionHistory from './PlanTransactionHistory';
import SupportDrawer from '@/components/dialogs/SupportDrawer';
import { colors } from '@/utils/customColor';
import { useLayoutShell } from '@/contexts/LayoutShellContext';

type PlanTier = 'bronze' | 'silver' | 'gold' | 'enterprise';
type PlansTab = 'plans' | 'history';

const TIERS: PlanTier[] = ['bronze', 'silver', 'gold', 'enterprise'];
const PLAN_CARDS = [
  {
    tier: 'bronze' as PlanTier,
    name: 'Personal',
    monthlyPrice: 10,
    annualPrice: 85,
    description: 'Standard Kit — includes core features and',
    requestsText: '10,000 monthly API requests',
    popular: false,
  },
  {
    tier: 'silver' as PlanTier,
    name: 'Professional',
    monthlyPrice: 25,
    annualPrice: 240,
    description: 'Startup Plan — higher volume to build your MVPs. up to',
    requestsText: '50,000 monthly API requests',
    popular: true,
  },
  {
    tier: 'gold' as PlanTier,
    name: 'Business',
    monthlyPrice: 50,
    annualPrice: 480,
    description: 'Smart Option — complete suite of advanced features and',
    requestsText: '120,000 monthly API requests',
    popular: false,
  },
];

const tabHashMap: Record<PlansTab, string> = { plans: 'plans', history: 'history' };
const hashToTabMap: Record<string, PlansTab> = Object.entries(tabHashMap).reduce(
  (acc, [k, v]) => { acc[v.toLowerCase()] = k as PlansTab; return acc; },
  {} as Record<string, PlansTab>,
);

const getInitialTab = (): PlansTab => {
  if (typeof window === 'undefined') return 'plans';
  return hashToTabMap[window.location.hash.replace(/^#/, '').toLowerCase()] || 'plans';
};

const tabConfig: { key: PlansTab; label: string; icon: React.ReactNode }[] = [
  { key: 'plans', label: 'Plans', icon: <Crown size={16} /> },
  { key: 'history', label: 'History', icon: <Receipt size={16} /> },
];

export default function Plans() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pageShellMinHeight, pageContentMaxHeight } = useLayoutShell();
  const { showToast } = useToast();
  const [tab, setTab] = useState<PlansTab>(getInitialTab);
  const [currentPlan, setCurrentPlan] = useState<PlanTier | null>(null);
  const [payingTier, setPayingTier] = useState<PlanTier | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');

  const openContact = (subject: string) => {
    setContactSubject(subject);
    setContactOpen(true);
  };

  useEffect(() => {
    accountApi.getBalance().catch(() => {});
  }, []);

  const handleSelectPlan = useCallback(async (tier: PlanTier) => {
    setPayingTier(tier);
    try {
      await paymentApi.purchasePlan(tier);
      showToast('Plan activated successfully!', 'success');
      setCurrentPlan(tier);
    } catch {
      showToast('Failed to activate plan. Please try again.', 'error');
    } finally {
      setPayingTier(null);
    }
  }, [showToast]);

  useEffect(() => {
    const normalized = location.hash.replace(/^#/, '').toLowerCase();
    setTab(hashToTabMap[normalized] || 'plans');
  }, [location.hash]);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: PlansTab) => {
      setTab(newValue);
      navigate(
        { pathname: location.pathname, search: location.search, hash: `#${tabHashMap[newValue]}` },
        { replace: true },
      );
    },
    [navigate, location.pathname, location.search],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const normalizeTier = (v: unknown): PlanTier | null => {
      if (typeof v !== 'string') return null;
      const n = v.trim().toLowerCase();
      return TIERS.includes(n as PlanTier) ? (n as PlanTier) : null;
    };
    const detectFromToken = (): PlanTier | null => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      try {
        const seg = token.split('.')[1];
        if (!seg) return null;
        const base64 = seg.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const payload = JSON.parse(atob(padded)) as { plan?: unknown; planCode?: unknown; tier?: unknown };
        return normalizeTier(payload.plan) || normalizeTier(payload.planCode) || normalizeTier(payload.tier);
      } catch { return null; }
    };
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const parsed = JSON.parse(userRaw) as { planCode?: string; plan?: string; tier?: string; planName?: string };
        const detected =
          normalizeTier(parsed.planCode) || normalizeTier(parsed.plan) ||
          normalizeTier(parsed.tier) || normalizeTier(parsed.planName) || detectFromToken();
        if (detected) { setCurrentPlan(detected); return; }
      } catch {}
    }
    setCurrentPlan(normalizeTier(localStorage.getItem('planCode')) || detectFromToken());
  }, []);

  const resetDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1, 1);
    d.setHours(0, 0, 0, 0);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  })();

  const renderPlans = () => (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 1 }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.4 }}>
          Plan & Pricing
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#555' }}>
          Your current plan and options to upgrade for high plan.
        </Typography>
      </Box>

      {/* Note banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3.5 }}>
        <Box
          sx={{
            px: 1,
            py: 0.3,
            bgcolor: '#F5A623',
            borderRadius: 0.5,
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          Note:
        </Box>
        <Typography sx={{ fontSize: 13, color: '#555' }}>
          API consumption will be reset on{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {resetDate}
          </Box>
        </Typography>
      </Box>

      {/* Plan cards */}
      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        {/* Trial card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: currentPlan === null ? `2px solid ${colors.primary}` : '1px solid #e0e0e0',
              p: 2.5,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              bgcolor: '#fff',
              boxShadow: 'none',
            }}
          >
            {currentPlan === null && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bgcolor: colors.primary,
                  color: '#fff',
                  px: 1.25,
                  py: 0.35,
                  borderRadius: '0 10px 0 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                Current
              </Box>
            )}
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
              Trial
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1.5 }}>
              <Typography sx={{ fontSize: 38, fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>
                $0
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#888' }}>/month</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: '#555', flex: 1, lineHeight: 1.65 }}>
              Get started for free with{' '}
              <Box component="span" sx={{ color: colors.primary, fontWeight: 600 }}>
                50 API calls / month
              </Box>
              , resets every month automatically.
            </Typography>
          </Paper>
        </Grid>

        {PLAN_CARDS.map((plan) => {
          const isCurrent = currentPlan === plan.tier;
          const isPaying = payingTier === plan.tier;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={plan.tier}>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  border: isCurrent ? `2px solid ${colors.primary}` : '1px solid #e0e0e0',
                  p: 2.5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  bgcolor: plan.popular ? '#fafafa' : '#fff',
                  boxShadow: 'none',
                  mt: plan.popular ? 0 : 0,
                }}
              >
                {/* Most Popular badge */}
                {plan.popular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: colors.primary,
                      color: '#fff',
                      px: 1.5,
                      py: 0.4,
                      borderRadius: 1,
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    🔥 Most Popular
                  </Box>
                )}

                {/* Current plan badge */}
                {isCurrent && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bgcolor: colors.primary,
                      color: '#fff',
                      px: 1.25,
                      py: 0.35,
                      borderRadius: '0 10px 0 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    Current
                  </Box>
                )}

                <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                  {plan.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 5 }}>
                  <Typography sx={{ fontSize: 38, fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>
                    ${plan.monthlyPrice}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: '#888' }}>/month</Typography>
                </Box>

                <Typography sx={{ fontSize: 13, color: '#555', mb: 4, flex: 1, lineHeight: 1.65 }}>
                  {plan.description}{' '}
                  <Box
                    component="span"
                    sx={{ color: colors.primary, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {plan.requestsText}
                  </Box>
                  .
                </Typography>

                {!isCurrent && (
                  <>
                    {/* Pay Monthly */}
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={payingTier !== null}
                      onClick={() => void handleSelectPlan(plan.tier)}
                      sx={{
                        mb: 1,
                        bgcolor: '#F5A623',
                        color: '#fff',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: 12,
                        borderRadius: 2,
                        boxShadow: 'none',
                        py: 1.1,
                        '&:hover': { bgcolor: '#e0951f', boxShadow: 'none' },
                      }}
                    >
                      {isPaying ? (
                        <CircularProgress size={18} sx={{ color: '#fff' }} />
                      ) : (
                        `Pay Monthly — $${plan.monthlyPrice}`
                      )}
                    </Button>

                    {/* Pay Annually */}
                    <Button
                      variant="outlined"
                      fullWidth
                      disabled={payingTier !== null}
                      onClick={() => void handleSelectPlan(plan.tier)}
                      sx={{
                        color: '#333',
                        borderColor: '#ccc',
                        textTransform: 'none',
                        fontWeight: 550,
                        fontSize: 12,
                        borderRadius: 2,
                        py: 1.1,
                        '&:hover': { borderColor: '#999', bgcolor: '#fafafa' },
                      }}
                    >
                      Pay Annually — ${plan.annualPrice}
                    </Button>
                  </>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Enterprise footer */}
      <Divider sx={{  borderColor: '#e8e8e8' }} />
      <Box sx={{ textAlign: 'left', py: 1.5 }}>
        <Typography sx={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>
        Need unlimited API requests? We also offer custom{' '}
          <Box
            component="span"
            onClick={() => openContact('Enterprise plan')}
            sx={{ color: colors.primary, fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Enterprise plan
          </Box>{' '}
          for unlimited API requests, 
          Dedicated server and more —{' '}
          <Box
            component="span"
            onClick={() => openContact('Request Quote')}
            sx={{ color: colors.primary, fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Request Quote
          </Box>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        p: 0,
        backgroundColor: '#fff',
        minHeight: pageShellMinHeight,
        height: pageShellMinHeight,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          backgroundColor: 'white',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: '1px solid #e5e7eb',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 44, py: 0.75, px: 2 },
            '& .Mui-selected': { color: `${colors.primary} !important` },
            '& .MuiTabs-indicator': { backgroundColor: colors.primary, height: 3 },
          }}
        >
          {tabConfig.map((item) => (
            <Tab
              key={item.key}
              value={item.key}
              iconPosition="start"
              icon={<Box sx={{ display: 'flex', alignItems: 'center' }}>{item.icon}</Box>}
              label={<Box sx={{ display: 'flex', alignItems: 'center' }}>{item.label}</Box>}
              sx={{ gap: 1, '& svg': { color: 'inherit' } }}
            />
          ))}
        </Tabs>

        <Box sx={{ py: 3, flex: 1, minHeight: 0, maxHeight: pageContentMaxHeight, overflow: 'auto' }}>
          {tab === 'history' ? <PlanTransactionHistory embedded /> : renderPlans()}
        </Box>
      </Paper>

      <SupportDrawer
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        initialCategory="billing_related"
        initialSubject={contactSubject}
      />
    </Box>
  );
}

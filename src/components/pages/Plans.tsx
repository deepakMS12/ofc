import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

type PlanTier = 'bronze' | 'silver' | 'gold' | 'enterprise';

type ConversionPlan = {
  maxUpload: number;
  perPage: string;
  rateLimit: number;
};

type ConversionEntry = {
  plan?: Partial<Record<PlanTier, ConversionPlan>>;
};

type ConversionCostsFile = {
  conversions?: Record<string, ConversionEntry>;
};

type PlanMetrics = {
  tier: PlanTier;
  label: string;
  description: string;
  icon: ReactNode;
  gradient: string;
  accentColor: string;
  cta: string;
  highlight?: boolean;
  conversionCount: number;
  perPageMin: number;
  perPageMax: number;
  maxUploadMin: number;
  maxUploadMax: number;
  rateLimitMin: number;
  rateLimitMax: number;
};

const tierMeta: Record<
  PlanTier,
  {
    label: string;
    description: string;
    icon: ReactNode;
    gradient: string;
    accentColor: string;
    cta: string;
    highlight?: boolean;
  }
> = {
  bronze: {
    label: 'BRONZE',
    description: 'Starter automation for small conversion volume',
    icon: <BoltIcon fontSize="small" />,
    gradient: 'linear-gradient(135deg, #7a4b2f 0%, #b77846 100%)',
    accentColor: '#8b5e3c',
    cta: 'Start Bronze',
  },
  silver: {
    label: 'SILVER',
    description: 'Balanced speed and cost for growing teams',
    icon: <AutoAwesomeIcon fontSize="small" />,
    gradient: 'linear-gradient(135deg, #5f6675 0%, #9ba3b2 100%)',
    accentColor: '#6366f1',
    cta: 'Choose Silver',
    highlight: true,
  },
  gold: {
    label: 'GOLD',
    description: 'Best value for high-volume production use',
    icon: <WorkspacePremiumIcon fontSize="small" />,
    gradient: 'linear-gradient(135deg, #846300 0%, #d5a500 100%)',
    accentColor: '#ca8a04',
    cta: 'Choose Gold',
  },
  enterprise: {
    label: 'ENTERPRISE',
    description: 'Scale-ready throughput and priority handling',
    icon: <BusinessCenterIcon fontSize="small" />,
    gradient: 'linear-gradient(135deg, #1a5f73 0%, #2aa5c9 100%)',
    accentColor: '#0e7490',
    cta: 'Contact Sales',
  },
};

const TIERS: PlanTier[] = ['bronze', 'silver', 'gold', 'enterprise'];

const formatRange = (min: number, max: number, suffix = '') => {
  if (min === max) {
    return `${min}${suffix}`;
  }
  return `${min}-${max}${suffix}`;
};

const formatPriceRange = (min: number, max: number) => {
  if (min === max) {
    return `INR ${min.toFixed(2)} /page`;
  }
  return `INR ${min.toFixed(2)}-${max.toFixed(2)} /page`;
};

export default function Plans() {
  const [pricingData, setPricingData] = useState<ConversionCostsFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanTier | null>(null);

  useEffect(() => {
    let active = true;

    const loadPricing = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const response = await fetch('/conversion_costs.json', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to load conversion pricing (${response.status})`);
        }
        const json = (await response.json()) as ConversionCostsFile;
        if (active) {
          setPricingData(json);
        }
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load pricing data.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadPricing();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const normalizeTier = (value: unknown): PlanTier | null => {
      if (typeof value !== 'string') {
        return null;
      }
      const normalized = value.trim().toLowerCase();
      return TIERS.includes(normalized as PlanTier) ? (normalized as PlanTier) : null;
    };

    const detectPlanFromToken = (): PlanTier | null => {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      try {
        const payloadSegment = token.split('.')[1];
        if (!payloadSegment) {
          return null;
        }

        const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const payloadText = atob(padded);
        const payload = JSON.parse(payloadText) as { plan?: unknown; planCode?: unknown; tier?: unknown };

        return (
          normalizeTier(payload.plan) ||
          normalizeTier(payload.planCode) ||
          normalizeTier(payload.tier)
        );
      } catch {
        return null;
      }
    };

    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const parsed = JSON.parse(userRaw) as {
          planCode?: string;
          plan?: string;
          tier?: string;
          planName?: string;
        };
        const detected =
          normalizeTier(parsed.planCode) ||
          normalizeTier(parsed.plan) ||
          normalizeTier(parsed.tier) ||
          normalizeTier(parsed.planName) ||
          detectPlanFromToken();
        if (detected) {
          setCurrentPlan(detected);
          return;
        }
      } catch {
        // Ignore invalid cached user payload.
      }
    }

    setCurrentPlan(normalizeTier(localStorage.getItem('planCode')) || detectPlanFromToken());
  }, []);

  const planMetrics = useMemo<PlanMetrics[]>(() => {
    const conversions = Object.values(pricingData?.conversions ?? {});

    return TIERS.map((tier) => {
      const tierPoints = conversions
        .map((item) => item.plan?.[tier])
        .filter((point): point is ConversionPlan => Boolean(point));

      const perPagePoints = tierPoints
        .map((point) => Number(point.perPage))
        .filter((value) => Number.isFinite(value));
      const maxUploadPoints = tierPoints.map((point) => point.maxUpload);
      const rateLimitPoints = tierPoints.map((point) => point.rateLimit);

      return {
        tier,
        ...tierMeta[tier],
        conversionCount: tierPoints.length,
        perPageMin: perPagePoints.length ? Math.min(...perPagePoints) : 0,
        perPageMax: perPagePoints.length ? Math.max(...perPagePoints) : 0,
        maxUploadMin: maxUploadPoints.length ? Math.min(...maxUploadPoints) : 0,
        maxUploadMax: maxUploadPoints.length ? Math.max(...maxUploadPoints) : 0,
        rateLimitMin: rateLimitPoints.length ? Math.min(...rateLimitPoints) : 0,
        rateLimitMax: rateLimitPoints.length ? Math.max(...rateLimitPoints) : 0,
      };
    });
  }, [pricingData]);

  const getUnavailableSpecs = (tier: PlanTier) => {
    if (tier === 'enterprise') {
      return [];
    }
    if (tier === 'gold') {
      return ['Unlimited enterprise throughput'];
    }
    if (tier === 'silver') {
      return ['Unlimited enterprise throughput', 'Dedicated enterprise support'];
    }
    return [
      'Unlimited enterprise throughput',
      'Dedicated enterprise support',
      'Priority enterprise queue',
    ];
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #f8fbff 0%, #edf2f7 100%)',
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 840, mx: 'auto', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', mb: 1 }}>
          Choose the plan that matches your conversion volume
        </Typography>
        <Typography variant="body1" sx={{ color: '#4b5563' }}>
          Pricing is generated directly from conversion costs and reflects per-page rates, request
          limits, and upload caps across available conversion tools.
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : loadError ? (
        <Alert severity="error" sx={{ maxWidth: 800, mx: 'auto' }}>
          {loadError}
        </Alert>
      ) : (
        <Stack spacing={3}>
          {planMetrics.map((plan, index) => {
            const unavailable = getUnavailableSpecs(plan.tier);
            const included = [
              `Per page pricing: ${formatPriceRange(plan.perPageMin, plan.perPageMax)}`,
              `Conversion tools covered: ${plan.conversionCount}`,
              `Max uploads per request: ${formatRange(plan.maxUploadMin, plan.maxUploadMax)}`,
              `API rate limit: ${formatRange(plan.rateLimitMin, plan.rateLimitMax)} req/min`,
            ];

            return (
              <Paper
                key={plan.tier}
                elevation={0}
                sx={{
                  boxShadow: '0 1px 5px #c8c8c8',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                }}
              >
                <Grid container>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ height: '100%' }}>
                      <Box
                        sx={{
                          background: plan.gradient,
                          color: 'white',
                          py: 1.6,
                          px: 2,
                          textAlign: 'center',
                          fontWeight: 700,
                          position: 'relative',
                        }}
                      >
                        {plan.tier === 'silver' && (
                          <Box
                            className="ribbon"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              display: 'inline-block',
                              minWidth: 200,
                              height: 24,
                              lineHeight: '24px',
                              mt: 2.5,
                              pl: 2.5,
                              backgroundColor: '#32864c',
                              fontSize: 12,
                              color: '#fff',
                              textAlign: 'left',
                            }}
                          >
                            Recommended
                          </Box>
                        )}
                        {currentPlan === plan.tier && (
                          <Chip
                            size="small"
                            label="Current plan"
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              backgroundColor: 'rgba(17,24,39,0.28)',
                              color: 'white',
                              fontWeight: 700,
                            }}
                          />
                        )}
                        <Typography sx={{ fontWeight: 700, fontSize: 30, mt: 0.5 }}>{index + 1}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {plan.label}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {plan.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 3,
                          pb: currentPlan !== plan.tier ? 9 : 3,
                          position: 'relative',
                          minHeight: 260,
                          boxSizing: 'border-box',
                        }}
                      >
                        <Typography sx={{ color: '#6d28d9', fontWeight: 700, mb: 0.7 }}>
                          {plan.conversionCount} Credits
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
                          {plan.label}
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2.5, color: '#6d28d9' }}>
                          <Typography component="li" sx={{ color: '#374151' }}>
                            Total Overage: <strong>{formatPriceRange(plan.perPageMin, plan.perPageMax)}</strong>
                          </Typography>
                          <Typography component="li" sx={{ color: '#374151' }}>
                            Max uploads: <strong>{formatRange(plan.maxUploadMin, plan.maxUploadMax)}</strong>
                          </Typography>
                          <Typography component="li" sx={{ color: '#374151' }}>
                            Timeout: <strong>30s</strong>
                          </Typography>
                        </Box>
                        {currentPlan !== plan.tier && (
                          <Button
                            variant="contained"
                            sx={{
                              position: 'absolute',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              bottom: 5,
                              width: '50%',
                              py: 1.8,
                              textTransform: 'none',
                              fontWeight: 700,
                              backgroundColor: plan.accentColor,
                              '&:hover': {
                                filter: 'brightness(0.92)',
                                backgroundColor: plan.accentColor,
                              },
                            }}
                          >
                            SELECT
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 8 }}>
                    <Box
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        pb: { xs: 7, md: 8 },
                        position: 'relative',
                        height: '100%',
                        minHeight: 260,
                        boxSizing: 'border-box',
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
                        Basic features:
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: unavailable.length ? 6 : 12 }}>
                          <Stack spacing={1.2}>
                            {included.map((item) => (
                              <Stack key={`${plan.tier}-${item}`} direction="row" spacing={1.2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: '50%',
                                    backgroundColor: '#fff',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src="/assets/images/icon-tick.svg"
                                    alt="Included"
                                    sx={{ width: 12, height: 12 }}
                                  />
                                </Box>
                                <Typography sx={{ color: '#1f2937' }}>{item}</Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Grid>

                        {unavailable.length > 0 && (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ borderLeft: { md: '1px solid #c7cbe0' }, pl: { md: 2 } }}>
                              <Stack spacing={1.2}>
                                {unavailable.map((item) => (
                                  <Stack key={`${plan.tier}-${item}`} direction="row" spacing={1.2} alignItems="center">
                                    <Box
                                      sx={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: '50%',
                                        backgroundColor: '#fff',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                      }}
                                    >
                                      <Box
                                        component="img"
                                        src="/assets/images/icon-cross.svg"
                                        alt="Not included"
                                        sx={{ width: 11, height: 11 }}
                                      />
                                    </Box>
                                    <Typography sx={{ color: '#4b5563', textDecoration: 'line-through' }}>
                                      {item}
                                    </Typography>
                                  </Stack>
                                ))}
                              </Stack>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                      <Typography sx={{ mt: 4, color: '#374151', fontSize: 14 }}>
                        * We count 1 credit per request unit; billing varies by tier and conversion type.
                      </Typography>
                      <Box
                        sx={{
                          mt: 1.5,
                          position: 'absolute',
                          left: 0,
                          right: 5,
                          bottom: 5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: 1,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 14,
                          px: 2,
                          py: 0.6,
                          backgroundColor: plan.accentColor,
                        }}
                      >
                        <Typography component="span" sx={{ fontSize: 14, fontWeight: 700, color: 'inherit' }}>
                          1 /
                        </Typography>
                        <Box
                          component="img"
                          src="/assets/images/user.png"
                          alt="Max login one"
                          sx={{ width: 14, height: 14, filter: 'brightness(0) invert(1)' }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}



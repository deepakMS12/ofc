import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import conversionCosts from '../../../conversion_costs.json';

type PlanTier = 'free' | 'bronze' | 'silver' | 'gold' | 'enterprise';

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
  recommendation?: string;
  creditsLabel: string;
  overageLabel: string;
  maxFileSizeLabel: string;
  timeoutLabel: string;
  cta: string;
  highlight?: boolean;
  conversionCount: number;
  perPageMin: number;
  perPageMax: number;
  maxUploadMin: number;
  maxUploadMax: number;
  rateLimitMin: number;
  rateLimitMax: number;
  includedFeatures: string[];
  excludedFeatures: string[];
};

const PURPLE = '#7349F8';
const PURPLE_DARK = '#5f3ad6';

const tierMeta: Record<
  PlanTier,
  {
    label: string;
    recommendation?: string;
    creditsLabel: string;
    cta: string;
    highlight?: boolean;
    includedFeatures: string[];
    excludedFeatures: string[];
  }
> = {
  free: {
    label: 'Free',
    recommendation: 'We recommend the Free plan',
    creditsLabel: '50 Credits',
    cta: 'Get Started',
    highlight: true,
    includedFeatures: [
      'CSS & Javascript injection',
      'Advanced header & footer',
      'Encryption and Watermark',
    ],
    excludedFeatures: [
      'No file size limit',
      'AWS S3 delivery',
      'Parallel & Asynchronous responses',
    ],
  },
  bronze: {
    label: 'Bronze',
    creditsLabel: '100 Credits',
    cta: 'Get Started',
    includedFeatures: [
      'CSS & Javascript injection',
      'Advanced header & footer',
      'Encryption and Watermark',
    ],
    excludedFeatures: [
      'No file size limit',
      'AWS S3 delivery',
      'Parallel & Asynchronous responses',
    ],
  },
  silver: {
    label: 'Silver',
    recommendation: 'We recommend the Silver plan',
    creditsLabel: '250 Credits',
    cta: 'Get Started',
    highlight: true,
    includedFeatures: [
      'CSS & Javascript injection',
      'Advanced header & footer',
      'Encryption and Watermark',
      'No file size limit',
    ],
    excludedFeatures: ['AWS S3 delivery', 'Parallel & Asynchronous responses'],
  },
  gold: {
    label: 'Gold',
    creditsLabel: '500 Credits',
    cta: 'Get Started',
    includedFeatures: [
      'CSS & Javascript injection',
      'Advanced header & footer',
      'Encryption and Watermark',
      'No file size limit',
      'AWS S3 delivery',
    ],
    excludedFeatures: ['Parallel & Asynchronous responses'],
  },
  enterprise: {
    label: 'Enterprise',
    creditsLabel: 'Custom Credits',
    cta: 'Contact Sales',
    includedFeatures: [
      'CSS & Javascript injection',
      'Advanced header & footer',
      'Encryption and Watermark',
      'No file size limit',
      'AWS S3 delivery',
      'Parallel & Asynchronous responses',
    ],
    excludedFeatures: [],
  },
};

const TIERS: PlanTier[] = ['free', 'bronze', 'silver', 'gold', 'enterprise'];
const pricingData = conversionCosts as ConversionCostsFile;

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
  const [currentPlan, setCurrentPlan] = useState<PlanTier | null>(null);

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
    const conversions = Object.values(pricingData.conversions ?? {});

    return TIERS.map((tier) => {
      const tierPoints = conversions
        .map((item) => item.plan?.[tier])
        .filter((point): point is ConversionPlan => Boolean(point));

      const perPagePoints = tierPoints
        .map((point) => Number(point.perPage))
        .filter((value) => Number.isFinite(value));
      const maxUploadPoints = tierPoints.map((point) => point.maxUpload);
      const rateLimitPoints = tierPoints.map((point) => point.rateLimit);

      const perPageMin = perPagePoints.length ? Math.min(...perPagePoints) : 0;
      const perPageMax = perPagePoints.length ? Math.max(...perPagePoints) : 0;
      const maxUploadMin = maxUploadPoints.length ? Math.min(...maxUploadPoints) : 0;
      const maxUploadMax = maxUploadPoints.length ? Math.max(...maxUploadPoints) : 0;
      const rateLimitMin = rateLimitPoints.length ? Math.min(...rateLimitPoints) : 0;
      const rateLimitMax = rateLimitPoints.length ? Math.max(...rateLimitPoints) : 0;

      const meta = tierMeta[tier];

      return {
        tier,
        label: meta.label,
        recommendation: meta.recommendation,
        creditsLabel: meta.creditsLabel,
        overageLabel: tier === 'free' ? 'N/A/credits' : formatPriceRange(perPageMin, perPageMax),
        maxFileSizeLabel:
          tier === 'free' ? '2Mb' : `${formatRange(maxUploadMin, maxUploadMax)} uploads`,
        timeoutLabel: '30s',
        cta: meta.cta,
        highlight: meta.highlight,
        conversionCount: tierPoints.length,
        perPageMin,
        perPageMax,
        maxUploadMin,
        maxUploadMax,
        rateLimitMin,
        rateLimitMax,
        includedFeatures: meta.includedFeatures,
        excludedFeatures: meta.excludedFeatures,
      };
    });
  }, []);

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #f8fbff 0%, #edf2f7 100%)',
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: 1180, mx: 'auto' }}>
        {planMetrics.map((plan) => (
          <Paper
            key={plan.tier}
            elevation={0}
            sx={{
              border: `1px solid ${PURPLE}`,
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#fff',
            }}
          >
            <Grid container>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {plan.recommendation && (
                    <Box
                      sx={{
                        backgroundColor: PURPLE,
                        color: '#fff',
                        py: 1.5,
                        px: 2,
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      {plan.recommendation}
                    </Box>
                  )}

                  <Box
                    sx={{
                      p: 3,
                      pb: currentPlan !== plan.tier ? 10 : 3,
                      position: 'relative',
                      flex: 1,
                      minHeight: 260,
                      boxSizing: 'border-box',
                    }}
                  >
                    {currentPlan === plan.tier && (
                      <Chip
                        size="small"
                        label="Current plan"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          backgroundColor: 'rgba(115, 73, 248, 0.12)',
                          color: PURPLE_DARK,
                          fontWeight: 700,
                        }}
                      />
                    )}

                    <Typography sx={{ color: '#1f2937', fontWeight: 600, mb: 0.5 }}>
                      {plan.creditsLabel}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 2 }}>
                      {plan.label}
                    </Typography>

                    <Box component="ul" sx={{ m: 0, pl: 2.2, color: PURPLE }}>
                      <Typography component="li" sx={{ color: '#374151', mb: 0.8 }}>
                        Total Overage:{' '}
                        <Box component="span" sx={{ color: PURPLE, fontWeight: 700 }}>
                          {plan.overageLabel}
                        </Box>
                      </Typography>
                      <Typography component="li" sx={{ color: '#374151', mb: 0.8 }}>
                        Max file size:{' '}
                        <Box component="span" sx={{ color: PURPLE, fontWeight: 700 }}>
                          {plan.maxFileSizeLabel}
                        </Box>
                      </Typography>
                      <Typography component="li" sx={{ color: '#374151' }}>
                        Timeout:{' '}
                        <Box component="span" sx={{ color: PURPLE, fontWeight: 700 }}>
                          {plan.timeoutLabel}
                        </Box>
                      </Typography>
                    </Box>

                    {currentPlan !== plan.tier && (
                      <Button
                        variant="contained"
                        sx={{
                          position: 'absolute',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          bottom: 20,
                          minWidth: 180,
                          px: 4,
                          py: 1.2,
                          textTransform: 'none',
                          fontWeight: 700,
                          borderRadius: '6px',
                          backgroundColor: PURPLE,
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: PURPLE_DARK,
                            boxShadow: 'none',
                          },
                        }}
                      >
                        {plan.cta}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Box
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    height: '100%',
                    minHeight: 260,
                    boxSizing: 'border-box',
                    borderLeft: { md: `1px solid ${PURPLE}` },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
                    Basic features:
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: plan.excludedFeatures.length ? 6 : 12 }}>
                      <Stack spacing={1.4}>
                        {plan.includedFeatures.map((item) => (
                          <Stack key={`${plan.tier}-included-${item}`} direction="row" spacing={1.2} alignItems="center">
                            <Box
                              sx={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                backgroundColor: PURPLE,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <CheckIcon sx={{ width: 14, height: 14, color: '#fff' }} />
                            </Box>
                            <Typography sx={{ color: '#1f2937' }}>{item}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Grid>

                    {plan.excludedFeatures.length > 0 && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ borderLeft: { md: '1px solid #d8d8e4' }, pl: { md: 2 } }}>
                          <Stack spacing={1.4}>
                            {plan.excludedFeatures.map((item) => (
                              <Stack key={`${plan.tier}-excluded-${item}`} direction="row" spacing={1.2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: '50%',
                                    backgroundColor: '#fff',
                                    border: `1px solid ${PURPLE}`,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  <CloseIcon sx={{ width: 13, height: 13, color: PURPLE }} />
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
                    * We count 1 credit per 5Mb. For example, a 14Mb PDF will consume 3 credits.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

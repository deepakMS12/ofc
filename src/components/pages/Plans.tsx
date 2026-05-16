import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import conversionCosts from '../../../conversion_costs.json';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

/** Plan page palette — solid colors from reference (no gradients). */
const PLAN_PURPLE = '#1156a6';
const PLAN_NAVY = '#1A1A40';
const PLAN_BODY = '#4A5568';
const PLAN_MUTED = '#9CA3AF';
const PLAN_BORDER = PLAN_PURPLE;
const PLAN_PAGE_BG = '#F5F5F8';

const planPanelSx = {
  border: `1px solid ${PLAN_BORDER}`,
  borderRadius: '10px',
  overflow: 'hidden',
  backgroundColor: '#fff',
  boxShadow: '0 2px 10px rgba(112, 71, 235, 0.12)',
} as const;

const currentPlanBadgeSx = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 3,
  px: 1.75,
  py: 0.65,
  bgcolor: '#fff',
  color: PLAN_PURPLE,
  border: `2px solid ${PLAN_PURPLE}`,
  borderTop: 'none',
  borderLeft: 'none',
  borderRadius: '0 0 10px 0',
  boxShadow: '0 4px 12px rgba(112, 71, 235, 0.22)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
} as const;

const planBulletListSx = {
  m: 0,
  pl: 2.2,
  listStyleType: 'disc',
  '& li': {
    color: PLAN_NAVY,
    fontSize: 14,
    lineHeight: 1.65,
    mb: 0.75,
    pl: 0.25,
    '&::marker': { color: PLAN_PURPLE, fontSize: 12 },
  },
} as const;

function PlanHeaderMessage({
  label,
  description,
  highlight,
}: {
  label: string;
  description: string;
  highlight?: boolean;
}) {
  if (highlight) {
    return (
      <Typography
        sx={{
          color: '#fff',
          fontSize: 15,
          fontWeight: 400,
          lineHeight: 1.45,
          textAlign: 'center',
          px: 1,
        }}
      >
        We recommend the {label.charAt(0) + label.slice(1).toLowerCase()} plan
      </Typography>
    );
  }

  return (
    <Typography
      sx={{
        color: '#fff',
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.45,
        textAlign: 'center',
        px: 1,
      }}
    >
      {description}
    </Typography>
  );
}

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
    gradient: PLAN_PURPLE,
    accentColor: PLAN_PURPLE,
    cta: 'Start Bronze',
  },
  silver: {
    label: 'SILVER',
    description: 'Balanced speed and cost for growing teams',
    icon: <AutoAwesomeIcon fontSize="small" />,
    gradient: PLAN_PURPLE,
    accentColor: PLAN_PURPLE,
    cta: 'Choose Silver',
    highlight: true,
  },
  gold: {
    label: 'GOLD',
    description: 'Best value for high-volume production use',
    icon: <WorkspacePremiumIcon fontSize="small" />,
    gradient: PLAN_PURPLE,
    accentColor: PLAN_PURPLE,
    cta: 'Choose Gold',
  },
  enterprise: {
    label: 'ENTERPRISE',
    description: 'Scale-ready throughput and priority handling',
    icon: <BusinessCenterIcon fontSize="small" />,
    gradient: PLAN_PURPLE,
    accentColor: PLAN_PURPLE,
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

const pricingData = conversionCosts as ConversionCostsFile;

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
  }, []);

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
        backgroundColor: PLAN_PAGE_BG,
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 840, mx: 'auto', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: PLAN_NAVY, mb: 1 }}>
          Choose the plan that matches your conversion volume
        </Typography>
        <Typography variant="body1" sx={{ color: PLAN_BODY }}>
          Pricing is generated directly from conversion costs and reflects per-page rates, request
          limits, and upload caps across available conversion tools.
        </Typography>
      </Box>

      <Stack spacing={3}>
          {planMetrics.map((plan) => {
            const unavailable = getUnavailableSpecs(plan.tier);
            const included = [
              `Per page pricing: ${formatPriceRange(plan.perPageMin, plan.perPageMax)}`,
              `Conversion tools covered: ${plan.conversionCount}`,
              `Max uploads per request: ${formatRange(plan.maxUploadMin, plan.maxUploadMax)}`,
              `API rate limit: ${formatRange(plan.rateLimitMin, plan.rateLimitMax)} req/min`,
            ];

            const planTitle =
              plan.label.charAt(0) + plan.label.slice(1).toLowerCase();

            return (
              <Box
                key={plan.tier}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                  alignItems: 'stretch',
                }}
              >
                {/* Left — plan summary card (narrow) */}
                <Paper
                  elevation={0}
                  sx={{
                    ...planPanelSx,
                    position: 'relative',
                    flex: { xs: '1 1 auto', md: '0 0 300px' },
                    maxWidth: { md: 320 },
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {currentPlan === plan.tier && (
                    <Box component="span" sx={currentPlanBadgeSx}>
                      Current plan
                    </Box>
                  )}
                  <Box
                    sx={{
                      backgroundColor: PLAN_PURPLE,
                      py: 2.25,
                      px: 2,
                      pt: currentPlan === plan.tier ? 3.5 : 2.25,
                      position: 'relative',
                      borderRadius: '9px 9px 0 0',
                    }}
                  >
                    <PlanHeaderMessage
                      label={plan.label}
                      description={plan.description}
                      highlight={plan.highlight}
                    />
                  </Box>

                  <Box
                    sx={{
                      p: 2.5,
                      pt: 2,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      sx={{
                        color: PLAN_NAVY,
                        fontWeight: 400,
                        fontSize: 15,
                        mb: 0.25,
                      }}
                    >
                      {plan.conversionCount} Credits
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: PLAN_NAVY,
                        fontSize: 36,
                        lineHeight: 1.1,
                        mb: 1.75,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {planTitle}
                    </Typography>

                    <Box component="ul" sx={{ ...planBulletListSx, flex: 1 }}>
                      <Box component="li">
                        Total Overage:{' '}
                        <Box component="span" sx={{ color: PLAN_PURPLE, fontWeight: 700 }}>
                          {formatPriceRange(plan.perPageMin, plan.perPageMax)}
                        </Box>
                      </Box>
                      <Box component="li">
                        Max uploads:{' '}
                        <Box component="span" sx={{ color: PLAN_PURPLE, fontWeight: 700 }}>
                          {formatRange(plan.maxUploadMin, plan.maxUploadMax)}
                        </Box>
                      </Box>
                      <Box component="li">
                        Timeout:{' '}
                        <Box component="span" sx={{ color: PLAN_PURPLE, fontWeight: 700 }}>
                          30s
                        </Box>
                      </Box>
                    </Box>

                    {currentPlan !== plan.tier && (
                      <Button
                        variant="contained"
                        disableElevation
                        fullWidth
                        sx={{
                          mt: 2,
                          py: 1.35,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 400,
                          fontSize: 16,
                          backgroundColor: PLAN_PURPLE,
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: PLAN_PURPLE,
                            filter: 'brightness(0.94)',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        SELECT
                      </Button>
                    )}
                  </Box>
                </Paper>

                {/* Right — features card (wider) */}
                <Paper
                  elevation={0}
                  sx={{
                    ...planPanelSx,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: PLAN_NAVY,
                        fontSize: 20,
                        mb: 2.5,
                      }}
                    >
                      Basic features:
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        flex: 1,
                        gap: 0,
                      }}
                    >
                      <Box sx={{ flex: 1, pr: { md: unavailable.length ? 2.5 : 0 } }}>
                        <Stack spacing={1.75}>
                          {included.map((item) => (
                            <Stack
                              key={`${plan.tier}-${item}`}
                              direction="row"
                              spacing={1.25}
                              alignItems="flex-start"
                            >
                              <Box
                                sx={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  backgroundColor: "#e3f2fd",
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  mt: 0.1,
                                }}
                              >
                                <Check sx={{ fontSize: 14, color: '#1156a6' }} aria-hidden />
                              </Box>
                              <Typography
                                sx={{
                                  color: PLAN_BODY,
                                  fontSize: 14,
                                  lineHeight: 1.55,
                                  fontWeight: 400,
                                }}
                              >
                                {item}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>

                      {unavailable.length > 0 && (
                        <Box
                          sx={{
                            flex: 1,
                            borderLeft: { xs: 'none', md: `1px solid ${PLAN_BORDER}` },
                            borderTop: { xs: `1px solid ${PLAN_BORDER}`, md: 'none' },
                            mt: { xs: 2.5, md: 0 },
                            pt: { xs: 2.5, md: 0 },
                            pl: { md: 2.5 },
                          }}
                        >
                          <Stack spacing={1.75}>
                            {unavailable.map((item) => (
                              <Stack
                                key={`${plan.tier}-${item}`}
                                direction="row"
                                spacing={1.25}
                                alignItems="flex-start"
                              >
                                <Close
                                  sx={{
                                    fontSize: 18,
                                    color: "#1156a6",
                                    flexShrink: 0,
                                    mt: 0.05,
                                  }}
                                  aria-hidden
                                />
                                <Typography
                                  sx={{
                                    color: PLAN_BODY,
                                    fontSize: 14,
                                    lineHeight: 1.55,
                                    textDecoration: 'line-through',
                                    fontWeight: 400,
                                  }}
                                >
                                  {item}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Box>

                 <Box sx={{width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.75 }}>
                      <Typography component="span" sx={{ fontSize: 13, color: PLAN_MUTED, fontWeight: 400 }}>
                        1 /
                      </Typography>
                      <Box
                        component="img"
                        src="/assets/images/user.png"
                        alt="Max login one"
                        sx={{ width: 14, height: 14, opacity: 0.7 }}
                      />
                    </Stack>
                         <Typography
                      sx={{
                        mt: 'auto',
                        pt: 3,
                        color: PLAN_MUTED,
                        fontSize: 13,
                        lineHeight: 1.55,
                        fontWeight: 400,
                      }}
                    >
                      * We count 1 credit per request unit; billing varies by tier and conversion type.
                    </Typography>
                 </Box>
                  </Box>
                </Paper>
              </Box>
            );
          })}
      </Stack>
    </Box>
  );
}



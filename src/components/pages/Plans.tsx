import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

type PlanType = {
  name: string;
  code: string;
  description: string;
  price: number;
  currency: string;
  highlight?: boolean;
  brandShow: boolean;
  dailyMessageLimit: number;
  maxMediaPerMessage: number;
  maxMediaSizeBytes: number;
  maxDevices: number;
  inactivityDays: number;
  maxGroupRecipients: number;
  lifetime: boolean;
  billingNote: string;
};

const plans: PlanType[] = [
  {
    name: 'Free Plan',
    code: 'free',
    description: 'Free lifetime plan with brand name in footer',
    price: 0,
    currency: 'INR',
    brandShow: true,
    dailyMessageLimit: 100,
    maxMediaPerMessage: 2,
    maxMediaSizeBytes: 5242880,
    maxDevices: 3,
    inactivityDays: 15,
    maxGroupRecipients: 100,
    lifetime: true,
    billingNote: 'Free forever',
  },
  {
    name: 'Silver Plan',
    code: 'silver',
    description: 'Silver plan with enhanced features',
    price: 600,
    currency: 'INR',
    highlight: true,
    brandShow: false,
    dailyMessageLimit: 1000,
    maxMediaPerMessage: 8,
    maxMediaSizeBytes: 26214400,
    maxDevices: 6,
    inactivityDays: 90,
    maxGroupRecipients: 500,
    lifetime: false,
    billingNote: 'Billed monthly',
  },
  {
    name: 'Gold Plan',
    code: 'gold',
    description: 'Gold plan with premium features',
    price: 2000,
    currency: 'INR',
    brandShow: false,
    dailyMessageLimit: 25000,
    maxMediaPerMessage: 30,
    maxMediaSizeBytes: 104857600,
    maxDevices: 25,
    inactivityDays: 90,
    maxGroupRecipients: 10000,
    lifetime: false,
    billingNote: 'Billed monthly',
  },
];

const formatPrice = (plan: PlanType) => {
  if (plan.price === 0) {
    return 'Free';
  }
  return `₹${plan.price.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`;
};

const formatMediaSize = (bytes: number) => {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${bytes} B`;
};

const planFeatureRows = (plan: PlanType) => [
  { label: 'Plan code', value: plan.code.toUpperCase() },
  {
    label: 'Daily message limit',
    value: plan.dailyMessageLimit.toLocaleString(),
  },
  { label: 'Max media per message', value: plan.maxMediaPerMessage },
  {
    label: 'Max media size',
    value: formatMediaSize(plan.maxMediaSizeBytes),
  },
  { label: 'Max devices', value: plan.maxDevices },
  {
    label: 'Max group recipients',
    value: plan.maxGroupRecipients.toLocaleString(),
  },
  {
    label: 'Inactivity deletion window',
    value: `${plan.inactivityDays} days`,
  },
];

export default function Plans() {
  return (
    <Box sx={{ backgroundColor: '#f4f7fb', minHeight: '100vh', p: { xs: 3, md: 6 } }}>
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 720,
          mx: 'auto',
          mb: 6,
        }}
      >
        <Chip
          label="Choose your plan"
          sx={{
            mb: 2,
            backgroundColor: '#e3f5ef',
            color: '#0b996e',
            fontWeight: 600,
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#222', mb: 1 }}>
          Plans crafted for every stage of growth
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Start for free and scale seamlessly as your usage grows. Each plan
          includes secured infrastructure, automatic clean-up of inactive data,
          and lightning-fast delivery.
        </Typography>
      </Box>

      <Stack
        spacing={3}
        direction={{ xs: 'column', lg: 'row' }}
        alignItems="stretch"
        justifyContent="center"
      >
        {plans.map((plan) => {
          const featureRows = planFeatureRows(plan);
          return (
            <Paper
              key={plan.code}
              elevation={plan.highlight ? 6 : 1}
              sx={{
                flex: '1 1 0',
                borderRadius: 3,
                border: plan.highlight ? '2px solid #0b996e' : '1px solid #e2e8f0',
                backgroundColor: plan.highlight ? '#0b996e' : 'white',
                color: plan.highlight ? 'white' : 'inherit',
                overflow: 'hidden',
                position: 'relative',
                transform: plan.highlight ? 'translateY(-8px)' : 'none',
              }}
            >
              {plan.highlight && (
                <Chip
                  label="Most popular"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              )}

              <Box sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {plan.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, opacity: plan.highlight ? 0.85 : 0.8 }}>
                  {plan.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {formatPrice(plan)}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {plan.price === 0 ? '' : '/ month'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: plan.highlight ? 0.85 : 0.7, mb: 2 }}>
                  {plan.billingNote}
                </Typography>

                <Chip
                  icon={
                    plan.brandShow ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      <CancelIcon fontSize="small" />
                    )
                  }
                  label={plan.brandShow ? 'Brand watermark visible' : 'No branding'}
                  sx={{
                    mb: 3,
                    backgroundColor: plan.highlight ? 'rgba(255,255,255,0.15)' : '#f0fdf4',
                    color: plan.highlight ? 'white' : '#166534',
                    '& .MuiChip-icon': {
                      color: plan.highlight ? 'white' : '#22c55e',
                    },
                  }}
                />

                <Chip
                  label={plan.lifetime ? 'Lifetime plan' : 'Monthly renewal'}
                  sx={{
                    mb: 3,
                    backgroundColor: plan.highlight ? 'rgba(255,255,255,0.15)' : '#e0f2fe',
                    color: plan.highlight ? 'white' : '#0c4a6e',
                    fontWeight: 600,
                  }}
                />

                <Divider
                  sx={{
                    borderColor: plan.highlight ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                    mb: 2,
                  }}
                />

                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  {featureRows.map((row) => (
                    <Box
                      key={row.label}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 14,
                        color: plan.highlight ? 'rgba(255,255,255,0.9)' : '#374151',
                      }}
                    >
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {row.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.value}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Button
                  fullWidth
                  variant={plan.highlight ? 'contained' : 'outlined'}
                  sx={{
                    py: 1.2,
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: plan.highlight ? 'white' : 'transparent',
                    color: plan.highlight ? '#0b996e' : '#0b996e',
                    borderColor: plan.highlight ? 'white' : '#0b996e',
                    '&:hover': {
                      backgroundColor: plan.highlight ? '#f5f5f5' : 'rgba(11,153,110,0.08)',
                      borderColor: '#0b996e',
                    },
                  }}
                >
                  {plan.price === 0 ? 'Start for free' : 'Choose plan'}
                </Button>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}



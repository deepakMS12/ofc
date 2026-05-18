import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import { accountApi, type Transaction } from '@/lib/api/account';
import { useToast } from '@/hooks/useToast';
import { colors } from '@/utils/customColor';
import { useLayoutShell } from '@/contexts/LayoutShellContext';

const PRIMARY = colors.primary;
const NAVY = '#1A1A40';
const BODY = '#4A5568';
const MUTED = '#9CA3AF';
const BORDER = '#e5e7eb';
const PAGE_BG = '#F5F5F8';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: '#fff',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY },
} as const;

const panelSx = {
  border: `1px solid ${BORDER}`,
  borderRadius: '10px',
  bgcolor: '#fff',
  boxShadow: '0 2px 10px rgba(17, 86, 166, 0.08)',
  overflow: 'hidden',
} as const;

type TransactionRow = Transaction & { id: string };

function formatTransDate(value?: string) {
  if (!value) return '—';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD-MM-YYYY HH:mm') : value;
}

function formatPrice(value?: number) {
  if (value == null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

function TypeChip({ type }: { type?: string }) {
  if (!type) return <Typography sx={{ color: MUTED, fontSize: 13 }}>—</Typography>;
  const normalized = type.toLowerCase();
  const isCredit = normalized === 'credit';
  return (
    <Chip
      label={type.charAt(0).toUpperCase() + type.slice(1)}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: 12,
        bgcolor: isCredit ? 'rgba(53, 171, 92, 0.12)' : 'rgba(17, 86, 166, 0.1)',
        color: isCredit ? colors.switch : PRIMARY,
        border: 'none',
      }}
    />
  );
}

type PlanTransactionHistoryProps = {
  /** When true, renders inside Plans tab panel (no standalone page chrome). */
  embedded?: boolean;
};

export default function PlanTransactionHistory({
  embedded = false,
}: PlanTransactionHistoryProps) {
  const { showToast } = useToast();
  const { mainAreaHeight } = useLayoutShell();
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [invoiceId, setInvoiceId] = useState('');
  const [fromDate, setFromDate] = useState(dayjs().subtract(3, 'month').format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params: Parameters<typeof accountApi.getTransactions>[0] = {
        page: 1,
        limit: 500,
      };
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (invoiceId.trim()) params.transactionId = invoiceId.trim();

      const data = await accountApi.getTransactions(params);
      const list = Array.isArray(data) ? data : data.transactions ?? [];
      setTransactions(
        list.map((row, index) => ({
          ...row,
          id: row.transId || row.paymentReference || `tx-${index}`,
        })),
      );
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      showToast(message || 'Failed to load transactions', 'error');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, invoiceId, showToast, toDate]);

  useEffect(() => {
    void loadTransactions();
  }, []);

  const handleClearFilters = () => {
    setInvoiceId('');
    setFromDate(dayjs().subtract(3, 'month').format('YYYY-MM-DD'));
    setToDate(dayjs().format('YYYY-MM-DD'));
  };

  const filteredRows = useMemo(() => transactions, [transactions]);

  const columns: GridColDef<TransactionRow>[] = [
    {
      field: 'transId',
      headerName: 'Trans. ID',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<TransactionRow>) => (
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: NAVY, fontFamily: 'monospace' }}>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'detail',
      headerName: 'Detail',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, color: BODY }} noWrap title={String(params.value ?? '')}>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => <TypeChip type={params.value as string} />,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 130,
      valueGetter: (_value, row) => row.price ?? row.amount,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: NAVY }}>
          {formatPrice(typeof params.value === 'number' ? params.value : Number(params.value))}
        </Typography>
      ),
    },
    {
      field: 'transDt',
      headerName: 'Date/Time',
      flex: 1,
      minWidth: 170,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, color: BODY }}>
          {formatTransDate(typeof params.value === 'string' ? params.value : undefined)}
        </Typography>
      ),
    },
  ];

  return (
    <Box
      sx={
        embedded
          ? {
              height: '100%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }
          : { bgcolor: PAGE_BG, minHeight: mainAreaHeight }
      }
    >
      {!embedded && (
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2.5,
            bgcolor: '#fff',
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: 'rgba(17, 86, 166, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReceiptLongOutlinedIcon sx={{ fontSize: 22, color: PRIMARY }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: 22, lineHeight: 1.2 }}>
                Transactions
              </Typography>
              <Typography sx={{ color: BODY, fontSize: 14, mt: 0.25 }}>
                View and manage your transaction history. Filter by date, amount, or type.
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      <Box
        sx={{
          ...(embedded ? { px: { xs: 3, md: 4 } } : { p: { xs: 2, md: 3 } }),
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 2,
          alignItems: 'stretch',
          ...(embedded && { flex: 1, minHeight: 0 }),
        }}
      >
        <Paper elevation={0} sx={{ ...panelSx, flex: { lg: '0 0 300px' }, p: 0 }}>
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderBottom: `1px solid ${BORDER}`,
              bgcolor: 'rgba(17, 86, 166, 0.04)',
            }}
          >
            <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: 16 }}>
              Filter Criteria
            </Typography>
          </Box>

          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Invoice ID"
              size="small"
              fullWidth
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              sx={fieldSx}
            />
            <TextField
              label="Start date"
              type="date"
              size="small"
              fullWidth
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <TextField
              label="End date"
              type="date"
              size="small"
              fullWidth
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <Stack spacing={1} sx={{ pt: 0.5 }}>
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={<SearchIcon />}
                onClick={() => void loadTransactions()}
                sx={{
                  py: 1.15,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 15,
                  bgcolor: PRIMARY,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: PRIMARY,
                    filter: 'brightness(0.94)',
                    boxShadow: 'none',
                  },
                }}
              >
                Search
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={handleClearFilters}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  color: MUTED,
                  '&:hover': { color: PRIMARY, bgcolor: 'rgba(17, 86, 166, 0.06)' },
                }}
              >
                Clear filters
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            ...panelSx,
            flex: 1,
            minWidth: 0,
            height: { xs: 520, lg: embedded ? '100%' : `calc(${mainAreaHeight} - 5.5rem)` },
            minHeight: 440,
            display: 'flex',
            flexDirection: 'column',
            ...(embedded && { flex: 1 }),
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            disableColumnMenu
            pageSizeOptions={[25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 100 } },
            }}
            sx={{
              border: 'none',
              flex: 1,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(17, 86, 166, 0.06)',
                fontWeight: 700,
                color: NAVY,
                fontSize: 13,
                borderBottom: `1px solid ${BORDER}`,
                minHeight: '48px !important',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
              },
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${BORDER}`,
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(17, 86, 166, 0.03)',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${BORDER}`,
                minHeight: 52,
              },
            }}
            slots={{
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: 1.5,
                    py: 4,
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/assets/images/icon/empty.svg"
                    alt="No transactions"
                    sx={{ width: 180, height: 180, opacity: 0.65 }}
                  />
                  <Typography sx={{ color: MUTED, fontSize: 14 }}>
                    No transactions found for the selected filters
                  </Typography>
                </Box>
              ),
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
}

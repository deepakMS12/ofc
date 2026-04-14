'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Drawer,
  Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { RefreshCw, Search, History as HistoryIcon } from 'lucide-react';
import { historyApi } from '@/lib/api/history';
import type { MessageHistory } from '@/lib/api/history';
import { useSnackbar } from '@/contexts/SnackbarContext';

export default function History() {
  const { showError } = useSnackbar();
  const [messages, setMessages] = useState<MessageHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<string>('0');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchMobile, setSearchMobile] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (dateRange !== 'all' && dateRange !== '0') {
        params.dateRange = dateRange;
      }
      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }
      if (searchMobile) {
        params.search = searchMobile;
      }

      const data = await historyApi.list(params);
      // Handle both array and object response
      const messagesList = Array.isArray(data) ? data : (data as any).messages || [];
      
      // Ensure all messages have required fields and proper formatting
      const formattedMessages = messagesList.map((msg: any) => ({
        id: msg.deviceId ? `${msg.deviceId}-${msg.mobileNumber || ''}-${msg.sentAt || Date.now()}` : `msg-${Date.now()}-${Math.random()}`,
        deviceId: msg.deviceId,
        mobileNumber: msg.mobileNumber || msg.to || msg.recipient || '',
        status: msg.status || 'pending',
        type: msg.type || (msg.source === 'api' ? 'API' : 'WEB'),
        content: msg.content || (msg.mediaUrl || msg.media ? 'Media' : 'Text'),
        sentAt: msg.sentAt || msg.createdAt || msg.timestamp || new Date().toISOString(),
      }));
      
      setMessages(formattedMessages);
    } catch (error: any) {
      console.error('Failed to load history:', error);
      showError(error.response?.data?.message || 'Failed to load message history');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setDrawerOpen(false);
    loadHistory();
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleRefresh = () => {
    loadHistory();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return '#9c27b0';
      case 'delivered':
        return '#4caf50';
      case 'failed':
        return '#f44336';
      case 'pending':
        return '#ff9800';
      default:
        return '#666';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'WEB':
        return '#9c27b0';
      case 'API':
        return '#2196f3';
      default:
        return '#666';
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesType = typeFilter === 'all' || msg.type === typeFilter;
      const matchesMobile = searchMobile === '' || msg.mobileNumber.toLowerCase().includes(searchMobile.toLowerCase());
      
      // Date range filter
      if (dateRange !== 'all') {
        const days = parseInt(dateRange);
        // Parse date in DD-MM-YYYY HH:mm:ss format
        let messageDate: Date;
        if (typeof msg.sentAt === 'string' && /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(msg.sentAt)) {
          // Parse DD-MM-YYYY HH:mm:ss format
          const [datePart, timePart] = msg.sentAt.split(' ');
          const [day, month, year] = datePart.split('-');
          const [hours, minutes, seconds] = timePart.split(':');
          messageDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
        } else {
          messageDate = new Date(msg.sentAt);
        }
        const now = new Date();
        const diffTime = now.getTime() - messageDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > days) {
          return false;
        }
      }
      
      return matchesType && matchesMobile;
    });
  }, [messages, typeFilter, searchMobile, dateRange]);

  const columns: GridColDef[] = [
    {
      field: 'sentAt',
      headerName: 'Sent Time',
      width: 200,
      valueFormatter: (value: string | null | undefined) => {
        if (!value) return '';
        // If already in DD-MM-YYYY HH:mm:ss format, return as-is
        if (typeof value === 'string' && /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(value)) {
          return value;
        }
        // Fallback: try to format if it's a different format
        try {
          const date = new Date(value);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        } catch {
          return value;
        }
      },
    },
    {
      field: 'device',
      headerName: 'From (Device)',
      width: 200,
      valueGetter: (_, row) => row.deviceAlias || row.deviceId,
    },
    {
      field: 'mobileNumber',
      headerName: 'To',
      width: 150,
    },
    {
      field: 'content',
      headerName: 'Content',
      width: 120,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: getStatusColor(params.value),
            color: 'white',
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
        />
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: getTypeColor(params.value),
            color: 'white',
            fontWeight: 500,
          }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* <Box sx={{ maxWidth: 1400, mx: 'auto' }}> */}
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{display: 'flex', alignItems: 'center' }}>
                <HistoryIcon size={25} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: '#333',
                }}
              >
                Message History
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontSize: '16px',
              }}
            >
              Use the filters in the table header to search by device, status, or message content.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                border: '1px solid #e0e0e0',
                color: '#666',
                '&:hover': {
                  borderColor: '#bdbdbd',
                  backgroundColor: '#fafafa',
                },
                '&:disabled': {
                  borderColor: '#e0e0e0',
                  color: '#bdbdbd',
                },
              }}
            >
              <RefreshCw size={20} />
            </IconButton>
            <Button
              variant="contained"
              onClick={handleOpenDrawer}
              startIcon={<Search size={18} />}
              sx={{
                backgroundColor: '#0b996e',
                color: 'white',
                textTransform: 'none',
                px: 3,
                '&:hover': {
                  backgroundColor: '#0a7a5a',
                },
              }}
            >
              Apply Filter
            </Button>
          </Box>
        </Box>

        {/* Filter Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{
            sx: {
              width: 400,
              p: 3,
            },
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: '#333',
              }}
            >
              Filters
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  label="Date Range"
                >
                  <MenuItem value="0">Today</MenuItem>
                  <MenuItem value="1">Yesterday</MenuItem>
                  <MenuItem value="7">Last 1 week</MenuItem>
                  <MenuItem value="14">Last 2 week</MenuItem>
                  <MenuItem value="21">Last 3 week</MenuItem>
                  <MenuItem value="30">Last 30 days</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="WEB">WEB</MenuItem>
                  <MenuItem value="API">API</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Search Mobile"
                placeholder="Enter mobile number"
                value={searchMobile}
                onChange={(e) => setSearchMobile(e.target.value)}
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Button
                variant="outlined"
                onClick={handleCloseDrawer}
                fullWidth
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#666',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#bdbdbd',
                    backgroundColor: '#fafafa',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                fullWidth
                sx={{
                  backgroundColor: '#0b996e',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#0a7a5a',
                  },
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Drawer>

        {/* History DataGrid */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: "calc(100vh - 200px)", width: '100%' }}>
          <DataGrid
            rows={filteredMessages}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            disableColumnResize
            disableColumnMenu
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#fafafa',
                fontWeight: 600,
                color: '#333',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#fafafa',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #e0e0e0',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid #e0e0e0',
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
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/assets/images/icon/empty.svg"
                    alt="No data"
                    sx={{
                      width: 200,
                      height: 200,
                      opacity: 0.6,
                    }}
                  />
                </Box>
              ),
            }}
          />
        </Paper>
      {/* </Box> */}
    </Box>
  );
}

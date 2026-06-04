import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
  TablePagination,
} from "@mui/material";
import { Plus, Search, LinkIcon, BarChart3, Copy, Lock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { colors } from "@/utils/customColor";
import SelectionToolbar from "../SelectionToolbar";

const mockCampaigns = [
  {
    id: 1,
    name: "Black Friday Sale 2024",
    description: "Welcome to our big sale",
    slug: "black-friday-2024",
    status: "sent",
    lists: "Marketing Subscribers",
    createdDate: "Sun, 28 Nov 2024, 10:30",
    endedDate: "Sun, 28 Nov 2024, 11:30",
    views: 2442,
    clicks: 2516,
    sent: "1 / 1",
    bounces: 489,
  },
  {
    id: 2,
    name: "Test campaign",
    description: "Welcome to listmonk",
    slug: "test-campaign",
    status: "draft",
    lists: "Default list",
    createdDate: "Fri, 15 Nov 2024, 13:20",
    endedDate: null,
    views: 2558,
    clicks: 2484,
    sent: "0 / 1",
    bounces: 511,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "sent":
      return { bg: "#d4edda", color: "#155724" };
    case "scheduled":
      return { bg: "#cce5ff", color: "#004085" };
    case "draft":
      return { bg: "#e8e8e8", color: "#666" };
    default:
      return { bg: "#f0f0f0", color: "#666" };
  }
};

export default function AllCampaigns() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(mockCampaigns.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    }
  };

  const paginatedCampaigns = mockCampaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const actions = [
    {
      label: "DELETE",
      icon: <Trash2 size={16} />,
      color: "#d32f2f",
      onClick: () => {
        console.log("Delete action for campaigns:", selectedIds);
      },
    },
  ];

  return (
    <Box sx={{ p: "20px" }}>
      <SelectionToolbar
        selectedCount={selectedIds.length}
        totalCount={mockCampaigns.length}
        actions={actions}
        onSelectAll={toggleSelectAll}
        showSelectAll={true}
      />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#1a1a1a">
          Campaigns ({mockCampaigns.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => navigate("/home/newsletter/campaigns/create")}
          sx={{
            bgcolor: colors.primary,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 0.75,
            px: 2.5,
            "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)" },
          }}
        >
          New
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        placeholder="Name or subject"
        size="small"
        fullWidth
        sx={{ mb: 2.5, maxWidth: 600 }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: colors.primary,
                    color: "#fff",
                    borderRadius: 0.5,
                    "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)" },
                  }}
                >
                  <Search size={16} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Campaigns List */}
      <Paper elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 1, overflow: "hidden" }}>

        {/* Table Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#fafafa",
            borderBottom: "1px solid #e8e8e8",
            minHeight: 40,
          }}
        >
          <Box sx={{ px: 1.5, display: "flex", alignItems: "center" }}>
            <Checkbox
              size="small"
              checked={selectedIds.length === mockCampaigns.length && mockCampaigns.length > 0}
              indeterminate={selectedIds.length > 0 && selectedIds.length < mockCampaigns.length}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
          </Box>
          <Box sx={{ px: 1.5, minWidth: 90 }}>
            <Typography variant="caption" fontWeight={600} color="#555">Status</Typography>
          </Box>
          <Box sx={{ flex: 1, px: 2 }}>
            <Typography variant="caption" fontWeight={600} color="#555">Campaign</Typography>
          </Box>
          <Box sx={{ px: 2, minWidth: 180 }}>
            <Typography variant="caption" fontWeight={600} color="#555">Lists</Typography>
          </Box>
          <Box sx={{ px: 2, minWidth: 200 }}>
            <Typography variant="caption" fontWeight={600} color="#555">Dates</Typography>
          </Box>
          <Box sx={{ px: 2, minWidth: 150 }}>
            <Typography variant="caption" fontWeight={600} color="#555">Stats</Typography>
          </Box>
          <Box sx={{ px: 1.5, minWidth: 120 }}>
            <Typography variant="caption" fontWeight={600} color="#555">Actions</Typography>
          </Box>
        </Box>

        {paginatedCampaigns.map((campaign, idx) => {
          const statusColor = getStatusColor(campaign.status);
          return (
            <Box
              key={campaign.id}
              sx={{
                borderBottom: idx < paginatedCampaigns.length - 1 ? "1px solid #e8e8e8" : "none",
                "&:hover": { bgcolor: "#fafafa" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "stretch", minHeight: 100 }}>
                {/* Checkbox */}
                <Box sx={{ display: "flex", alignItems: "center", px: 1.5, bgcolor: "#fafafa" }}>
                  <Checkbox
                    size="small"
                    checked={selectedIds.includes(campaign.id)}
                    onChange={(e) => toggleSelect(campaign.id, e.target.checked)}
                  />
                </Box>

                {/* Status */}
                <Box sx={{ display: "flex", alignItems: "center", px: 1.5 }}>
                  <Chip
                    label={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    size="small"
                    sx={{
                      bgcolor: statusColor.bg,
                      color: statusColor.color,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      height: 24,
                      borderRadius: 0.5,
                    }}
                  />
                </Box>

                {/* Name & Description */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", px: 2 }}>
                  <Typography
                    component="a"
                    href="#"
                    sx={{
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      color: colors.primary,
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {campaign.name}
                  </Typography>
                  <Typography variant="caption" color="#888" display="block" mt={0.25}>
                    {campaign.description}
                  </Typography>
                  <Typography variant="caption" color="#aaa" display="block" mt={0.25}>
                    {campaign.slug}
                  </Typography>
                </Box>

                {/* Lists */}
                <Box sx={{ display: "flex", alignItems: "center", px: 2, minWidth: 180 }}>
                  <Typography variant="body2" color="#666">
                    {campaign.lists}
                  </Typography>
                </Box>

                {/* Timestamps */}
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", px: 2, minWidth: 200 }}>
                  <Box>
                    <Typography variant="caption" color="#666" fontWeight={500} display="block">
                      Created
                    </Typography>
                    <Typography variant="caption" color="#888">
                      {campaign.createdDate}
                    </Typography>
                  </Box>
                  {campaign.endedDate && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="#666" fontWeight={500} display="block">
                        Ended
                      </Typography>
                      <Typography variant="caption" color="#888">
                        {campaign.endedDate}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Stats */}
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", px: 2, minWidth: 150, gap: 0.5 }}>
                  {[
                    { label: "Views", value: campaign.views.toLocaleString(), color: "#1a1a1a" },
                    { label: "Clicks", value: campaign.clicks.toLocaleString(), color: "#1a1a1a" },
                    { label: "Sent", value: campaign.sent, color: "#1a1a1a" },
                    { label: "Bounces", value: campaign.bounces, color: campaign.bounces > 400 ? "#dc2626" : "#1a1a1a" },
                  ].map(({ label, value, color }) => (
                    <Box key={label} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                      <Typography variant="caption" color="#666" fontWeight={500}>
                        {label}
                      </Typography>
                      <Typography variant="caption" color={color} fontWeight={600}>
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1.5 }}>
                  <Tooltip title="View" placement="top">
                    <IconButton size="small" sx={{ color: colors.primary }}>
                      <LinkIcon size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Analytics" placement="top">
                    <IconButton size="small" sx={{ color: colors.primary }}>
                      <BarChart3 size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clone" placement="top">
                    <IconButton size="small" sx={{ color: "#666" }}>
                      <Copy size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Lock" placement="top">
                    <IconButton size="small" sx={{ color: "#bbb" }}>
                      <Lock size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          );
        })}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockCampaigns.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

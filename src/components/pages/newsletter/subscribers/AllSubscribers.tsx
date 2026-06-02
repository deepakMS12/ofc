import {
  Box,
  Button,
  Chip,
  Checkbox,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
} from "@mui/material";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { colors } from "@/utils/customColor";

const columns = ["", "Email", "Name", "List", "Status", "Date Added"];

const mockSubscribers = [
  { id: 1, email: "sarah.johnson@example.com", name: "Sarah Johnson", list: "Marketing Subscribers", status: "confirmed", dateAdded: "Oct 15, 2024" },
  { id: 2, email: "mike.smith@example.com", name: "Mike Smith", list: "Product Updates", status: "confirmed", dateAdded: "Oct 12, 2024" },
  { id: 3, email: "elena.rodriguez@example.com", name: "Elena Rodriguez", list: "Newsletter Digest", status: "unconfirmed", dateAdded: "Oct 10, 2024" },
  { id: 4, email: "john.davis@example.com", name: "John Davis", list: "Premium Members", status: "confirmed", dateAdded: "Sep 28, 2024" },
  { id: 5, email: "jessica.wilson@example.com", name: "Jessica Wilson", list: "Trial Users", status: "confirmed", dateAdded: "Sep 20, 2024" },
  { id: 6, email: "robert.miller@example.com", name: "Robert Miller", list: "Marketing Subscribers", status: "confirmed", dateAdded: "Sep 15, 2024" },
  { id: 7, email: "olivia.taylor@example.com", name: "Olivia Taylor", list: "Product Updates", status: "confirmed", dateAdded: "Sep 05, 2024" },
  { id: 8, email: "david.brown@example.com", name: "David Brown", list: "Newsletter Digest", status: "unconfirmed", dateAdded: "Aug 30, 2024" },
];

export default function AllSubscribers() {
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
      setSelectedIds(mockSubscribers.map((s) => s.id));
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

  const paginatedSubscribers = mockSubscribers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: "20px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1a1a1a">
            All Subscribers
          </Typography>
          <Typography variant="body2" color="#666" mt={0.5}>
            View and manage all your newsletter subscribers.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          sx={{
            bgcolor: colors.primary,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
            "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)" },
          }}
        >
          Add Subscriber
        </Button>
      </Box>

      <TextField
        placeholder="Search subscribers..."
        size="small"
        sx={{ mb: 2, maxWidth: 340 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color="#999" />
              </InputAdornment>
            ),
          },
        }}
      />

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              <TableCell sx={{ width: 40, fontWeight: 600, fontSize: "0.8125rem", color: "#555", borderBottom: "1px solid #e8e8e8", p: 1 }}>
                <Checkbox
                  size="small"
                  checked={selectedIds.length === mockSubscribers.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < mockSubscribers.length}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </TableCell>
              {columns.slice(1).map((col) => (
                <TableCell
                  key={col}
                  sx={{ fontWeight: 600, fontSize: "0.8125rem", color: "#555", borderBottom: "1px solid #e8e8e8" }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSubscribers.map((sub) => (
              <TableRow key={sub.id} sx={{ "&:hover": { bgcolor: "#fafafa" }, "&:last-child td": { borderBottom: 0 } }}>
                <TableCell sx={{ width: 40, p: 1 }}>
                  <Checkbox
                    size="small"
                    checked={selectedIds.includes(sub.id)}
                    onChange={(e) => toggleSelect(sub.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: colors.primary, cursor: "pointer", fontWeight: 500 }}>
                  {sub.email}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "#555" }}>
                  {sub.name}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "#888" }}>
                  {sub.list}
                </TableCell>
                <TableCell>
                  <Chip
                    label={sub.status === "confirmed" ? "Confirmed" : "Unconfirmed"}
                    size="small"
                    sx={{
                      bgcolor: sub.status === "confirmed" ? "#d4edda" : "#ffe5e5",
                      color: sub.status === "confirmed" ? "#155724" : "#721c24",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      height: 22,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "#888" }}>
                  {sub.dateAdded}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockSubscribers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

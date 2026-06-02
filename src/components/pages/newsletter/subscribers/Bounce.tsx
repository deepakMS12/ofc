import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  TablePagination,
} from "@mui/material";
import { useState } from "react";

const columns = ["", "Email", "Bounce Type", "Reason", "Date", "Status"];

const mockBounces = [
  { id: 1, email: "invalid.email@example.com", bounceType: "hard", reason: "Invalid mailbox", date: "Nov 25, 2024", status: "blocked" },
  { id: 2, email: "inactive.user@example.com", bounceType: "soft", reason: "Mailbox full", date: "Nov 23, 2024", status: "retry" },
  { id: 3, email: "spam.trap@example.com", bounceType: "hard", reason: "Spam trap", date: "Nov 20, 2024", status: "blocked" },
  { id: 4, email: "no.longer@example.com", bounceType: "hard", reason: "User unknown", date: "Nov 18, 2024", status: "blocked" },
  { id: 5, email: "complaint@example.com", bounceType: "complaint", reason: "Marked as spam", date: "Nov 15, 2024", status: "blocked" },
  { id: 6, email: "temporary@example.com", bounceType: "soft", reason: "Temporary issue", date: "Nov 12, 2024", status: "retry" },
];

const getBounceTypeColor = (type: string) => {
  switch (type) {
    case "hard":
      return { bg: "#fef2f2", color: "#dc2626" };
    case "soft":
      return { bg: "#fffbeb", color: "#d97706" };
    case "complaint":
      return { bg: "#faf5ff", color: "#7c3aed" };
    default:
      return { bg: "#f0f0f0", color: "#666" };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "blocked":
      return { bg: "#fef2f2", color: "#dc2626" };
    case "retry":
      return { bg: "#fffbeb", color: "#d97706" };
    default:
      return { bg: "#f0f0f0", color: "#666" };
  }
};

export default function Bounce() {
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
      setSelectedIds(mockBounces.map((b) => b.id));
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

  const paginatedBounces = mockBounces.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const hardBounces = mockBounces.filter((b) => b.bounceType === "hard").length;
  const softBounces = mockBounces.filter((b) => b.bounceType === "soft").length;
  const complaints = mockBounces.filter((b) => b.bounceType === "complaint").length;

  return (
    <Box sx={{ p: "20px" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#1a1a1a">
          Bounce Management
        </Typography>
        <Typography variant="body2" color="#666" mt={0.5}>
          Monitor and manage email bounces to maintain list health.
        </Typography>
      </Box>

      {/* Summary chips */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
        <Chip
          label={`Hard Bounces: ${hardBounces}`}
          size="small"
          sx={{ bgcolor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontWeight: 500 }}
        />
        <Chip
          label={`Soft Bounces: ${softBounces}`}
          size="small"
          sx={{ bgcolor: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", fontWeight: 500 }}
        />
        <Chip
          label={`Complaints: ${complaints}`}
          size="small"
          sx={{ bgcolor: "#faf5ff", color: "#7c3aed", border: "1px solid #e9d5ff", fontWeight: 500 }}
        />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              <TableCell sx={{ width: 40, fontWeight: 600, fontSize: "0.8125rem", color: "#555", borderBottom: "1px solid #e8e8e8", p: 1 }}>
                <Checkbox
                  size="small"
                  checked={selectedIds.length === mockBounces.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < mockBounces.length}
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
            {paginatedBounces.map((bounce) => {
              const bounceTypeColor = getBounceTypeColor(bounce.bounceType);
              const statusColor = getStatusColor(bounce.status);
              return (
                <TableRow key={bounce.id} sx={{ "&:hover": { bgcolor: "#fafafa" }, "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={{ width: 40, p: 1 }}>
                    <Checkbox
                      size="small"
                      checked={selectedIds.includes(bounce.id)}
                      onChange={(e) => toggleSelect(bounce.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem", color: "#555", fontWeight: 500 }}>
                    {bounce.email}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bounce.bounceType.charAt(0).toUpperCase() + bounce.bounceType.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: bounceTypeColor.bg,
                        color: bounceTypeColor.color,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        height: 22,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem", color: "#888" }}>
                    {bounce.reason}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem", color: "#888" }}>
                    {bounce.date}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bounce.status.charAt(0).toUpperCase() + bounce.status.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: statusColor.bg,
                        color: statusColor.color,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        height: 22,
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockBounces.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

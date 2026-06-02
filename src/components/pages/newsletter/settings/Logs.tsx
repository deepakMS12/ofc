import { useState } from "react";
import {
  Box,
  Chip,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";

const columns = ["Timestamp", "Level", "Event", "Details"];

const mockLogs = [
  { id: 1, timestamp: "Nov 28, 2024 14:32:15", level: "info", event: "Campaign sent", details: "Black Friday Sale 2024 sent to 5,240 recipients" },
  { id: 2, timestamp: "Nov 28, 2024 14:15:43", level: "info", event: "Import completed", details: "Imported 156 subscribers from CSV file" },
  { id: 3, timestamp: "Nov 27, 2024 10:22:08", level: "warning", event: "Bounce recorded", details: "3 hard bounces detected in recent campaign" },
  { id: 4, timestamp: "Nov 26, 2024 09:45:22", level: "info", event: "List created", details: "New list 'Premium Members' created with 892 subscribers" },
  { id: 5, timestamp: "Nov 25, 2024 16:12:39", level: "error", event: "API error", details: "Failed to sync with email service provider - retry scheduled" },
  { id: 6, timestamp: "Nov 24, 2024 13:08:15", level: "info", event: "Template saved", details: "Template 'Default campaign template' updated" },
  { id: 7, timestamp: "Nov 23, 2024 11:34:52", level: "warning", event: "Quota approaching", details: "You have used 85% of your monthly sending quota" },
  { id: 8, timestamp: "Nov 22, 2024 08:19:41", level: "info", event: "Subscriber removed", details: "Unsubscribed email removed from all lists" },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "info":
      return { bg: "#cce5ff", color: "#004085" };
    case "warning":
      return { bg: "#fffbeb", color: "#d97706" };
    case "error":
      return { bg: "#fef2f2", color: "#dc2626" };
    default:
      return { bg: "#f0f0f0", color: "#666" };
  }
};

export default function Logs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedLogs = mockLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            System Logs
          </Typography>
          <Typography variant="body2" color="#666" mt={0.5}>
            View activity and error logs for your newsletter system.
          </Typography>
        </Box>
        <TextField select size="small" defaultValue="all" sx={{ minWidth: 140 }}>
          <MenuItem value="all">All Events</MenuItem>
          <MenuItem value="info">Info</MenuItem>
          <MenuItem value="warning">Warning</MenuItem>
          <MenuItem value="error">Error</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              {columns.map((col) => (
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
            {paginatedLogs.map((log) => {
              const levelColor = getLevelColor(log.level);
              return (
                <TableRow key={log.id} sx={{ "&:hover": { bgcolor: "#fafafa" }, "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={{ fontSize: "0.8125rem", color: "#888", whiteSpace: "nowrap" }}>
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: levelColor.bg,
                        color: levelColor.color,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        height: 20,
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8125rem", color: "#555", fontWeight: 500 }}>
                    {log.event}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8125rem", color: "#888" }}>
                    {log.details}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

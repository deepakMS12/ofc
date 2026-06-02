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
  Typography,
} from "@mui/material";
import { AlertCircle } from "lucide-react";

const columns = ["Email", "Bounce Type", "Reason", "Date", "Status"];

export default function Bounce() {
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
          label="Hard Bounces: 0"
          size="small"
          sx={{ bgcolor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontWeight: 500 }}
        />
        <Chip
          label="Soft Bounces: 0"
          size="small"
          sx={{ bgcolor: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", fontWeight: 500 }}
        />
        <Chip
          label="Complaints: 0"
          size="small"
          sx={{ bgcolor: "#faf5ff", color: "#7c3aed", border: "1px solid #e9d5ff", fontWeight: 500 }}
        />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 2 }}>
        <Table>
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
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ textAlign: "center", py: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                  <AlertCircle size={36} color="#ccc" strokeWidth={1.25} />
                  <Typography color="#888" fontSize="0.9rem">
                    No bounces recorded. Your list health looks great!
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

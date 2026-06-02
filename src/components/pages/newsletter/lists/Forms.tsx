import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { Plus, Edit2, Copy, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { colors } from "@/utils/customColor";

const mockForms = [
  { id: 1, name: "Newsletter Signup", list: "Marketing Subscribers", subscribers: 342, created: "Oct 15, 2024", status: "active" },
  { id: 2, name: "Welcome Form", list: "Product Updates", subscribers: 156, created: "Sep 20, 2024", status: "active" },
  { id: 3, name: "Trial Interest", list: "Trial Users", subscribers: 89, created: "Aug 10, 2024", status: "inactive" },
];

const columns = ["Name", "List", "Subscribers", "Created", "Status", "Actions"];

export default function Forms() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedForms = mockForms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            Forms
          </Typography>
          <Typography variant="body2" color="#666" mt={0.5}>
            Create and manage subscription forms for your lists.
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
          Create Form
        </Button>
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
            {paginatedForms.map((form) => (
              <TableRow key={form.id} sx={{ "&:hover": { bgcolor: "#fafafa" }, "&:last-child td": { borderBottom: 0 } }}>
                <TableCell sx={{ fontWeight: 500, color: colors.primary, cursor: "pointer", fontSize: "0.875rem" }}>
                  {form.name}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "#888" }}>{form.list}</TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "#555" }}>{form.subscribers}</TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "#888" }}>{form.created}</TableCell>
                <TableCell>
                  <Chip
                    label={form.status === "active" ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      bgcolor: form.status === "active" ? "#d4edda" : "#f0f0f0",
                      color: form.status === "active" ? "#155724" : "#666",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      height: 22,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Preview">
                      <IconButton size="small" sx={{ color: colors.primary }}>
                        <Eye size={15} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ color: colors.primary }}>
                        <Edit2 size={15} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Duplicate">
                      <IconButton size="small" sx={{ color: "#666" }}>
                        <Copy size={15} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" sx={{ color: "#bbb", "&:hover": { color: "#dc2626" } }}>
                        <Trash2 size={15} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockForms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

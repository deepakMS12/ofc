import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Checkbox,
  Typography,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { Plus, Edit2, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { colors } from "@/utils/customColor";
import SelectionToolbar from "../SelectionToolbar";

const columns = ["", "Name", "Subscribers", "Created", "Status", "Actions"];

const mockLists = [
  { id: 1, name: "Marketing Subscribers", subscribers: 5240, created: "Oct 15, 2024", status: "active" },
  { id: 2, name: "Product Updates", subscribers: 3891, created: "Sep 22, 2024", status: "active" },
  { id: 3, name: "Newsletter Digest", subscribers: 1250, created: "Aug 10, 2024", status: "active" },
  { id: 4, name: "Trial Users", subscribers: 642, created: "Nov 03, 2024", status: "paused" },
  { id: 5, name: "Premium Members", subscribers: 892, created: "Jul 18, 2024", status: "active" },
];

export default function AllLists() {
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
      setSelectedIds(mockLists.map((l) => l.id));
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

  const paginatedLists = mockLists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const actions = [
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      color: "#ff6b6b",
      onClick: () => {
        console.log("Delete action for lists:", selectedIds);
        setSelectedIds([]);
      },
    },
  ];

  return (
    <Box sx={{ p: "20px" }}>
      <SelectionToolbar
        selectedCount={selectedIds.length}
        totalCount={mockLists.length}
        actions={actions}
        onSelectAll={toggleSelectAll}
        showSelectAll={true}
      />

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
            All Lists
          </Typography>
          <Typography variant="body2" color="#666" mt={0.5}>
            Manage your subscriber lists.
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
          Create List
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              <TableCell sx={{ width: 40, fontWeight: 600, fontSize: "0.8125rem", color: "#555", borderBottom: "1px solid #e8e8e8", p: 1 }}>
                <Checkbox
                  size="small"
                  checked={selectedIds.length === mockLists.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < mockLists.length}
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
            {paginatedLists.map((list) => (
              <TableRow key={list.id} sx={{ "&:hover": { bgcolor: "#fafafa" }, "&:last-child td": { borderBottom: 0 } }}>
                <TableCell sx={{ width: 40, p: 1 }}>
                  <Checkbox
                    size="small"
                    checked={selectedIds.includes(list.id)}
                    onChange={(e) => toggleSelect(list.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: colors.primary, cursor: "pointer", fontSize: "0.875rem" }}>
                  {list.name}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "#555" }}>
                  {list.subscribers.toLocaleString()}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "#888" }}>
                  {list.created}
                </TableCell>
                <TableCell>
                  <Chip
                    label={list.status === "active" ? "Active" : "Paused"}
                    size="small"
                    sx={{
                      bgcolor: list.status === "active" ? "#d4edda" : "#fff3cd",
                      color: list.status === "active" ? "#155724" : "#856404",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      height: 22,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
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
          count={mockLists.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

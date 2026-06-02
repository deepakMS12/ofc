import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TablePagination,
  Typography,
} from "@mui/material";
import {
  Copy,
  CheckCircle2,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { colors } from "@/utils/customColor";

type TemplateType = "Campaign / HTML" | "Campaign / Visual" | "Transactional";

interface Template {
  id: number;
  name: string;
  type: TemplateType;
  isDefault?: boolean;
  created: string;
  updated: string;
}

const templates: Template[] = [
  {
    id: 1,
    name: "Default campaign template",
    type: "Campaign / HTML",
    isDefault: true,
    created: "Fri, 15 Nov 2024",
    updated: "Fri, 15 Nov 2024",
  },
  {
    id: 2,
    name: "Default archive template",
    type: "Campaign / HTML",
    created: "Fri, 15 Nov 2024",
    updated: "Fri, 15 Nov 2024",
  },
  {
    id: 3,
    name: "Sample transactional template",
    type: "Transactional",
    created: "Fri, 15 Nov 2024",
    updated: "Fri, 15 Nov 2024",
  },
  {
    id: 4,
    name: "Sample visual template",
    type: "Campaign / Visual",
    created: "Tue, 29 Apr 2025",
    updated: "Tue, 29 Apr 2025",
  },
];

const typeBadge: Record<TemplateType, { label: string; bg: string; color: string }> = {
  "Campaign / HTML":   { label: "Campaign / HTML",   bg: "#e0f2fe", color: "#0369a1" },
  "Campaign / Visual": { label: "Campaign / Visual", bg: "#fce7f3", color: "#9d174d" },
  "Transactional":     { label: "Transactional",     bg: "#fef3c7", color: "#92400e" },
};

export default function Templates() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTemplates = templates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: "20px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#1a1a1a">
          Templates ({templates.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={15} />}
          sx={{
            bgcolor: colors.primary,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1,
            fontSize: "0.875rem",
            "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)" },
          }}
        >
          New
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              {["Name", "Type", "ID", "Created", "Updated", ""].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    color: "#444",
                    borderBottom: "1px solid #e8e8e8",
                    py: 1.25,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedTemplates.map((tpl) => {
              const badge = typeBadge[tpl.type];
              return (
                <TableRow
                  key={tpl.id}
                  sx={{ "&:hover": { bgcolor: "#fafafa" }, "&:last-child td": { border: 0 } }}
                >
                  {/* Name */}
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: colors.primary,
                          fontWeight: 500,
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {tpl.name}
                      </Typography>
                      {tpl.isDefault && (
                        <Chip
                          label="Default"
                          size="small"
                          sx={{
                            bgcolor: "#f1f5f9",
                            color: "#64748b",
                            fontSize: "0.7rem",
                            height: 20,
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  {/* Type */}
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip
                      label={badge.label}
                      size="small"
                      sx={{
                        bgcolor: badge.bg,
                        color: badge.color,
                        fontSize: "0.75rem",
                        height: 22,
                        fontWeight: 500,
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>

                  {/* ID */}
                  <TableCell sx={{ py: 1.5, color: "#888", fontSize: "0.875rem" }}>
                    {tpl.id}
                  </TableCell>

                  {/* Created */}
                  <TableCell sx={{ py: 1.5, color: "#555", fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                    {tpl.created}
                  </TableCell>

                  {/* Updated */}
                  <TableCell sx={{ py: 1.5, color: "#555", fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                    {tpl.updated}
                  </TableCell>

                  {/* Actions */}
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                      <Tooltip title="Preview">
                        <IconButton size="small" sx={{ color: colors.primary }}>
                          <Eye size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" sx={{ color: colors.primary }}>
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate">
                        <IconButton size="small" sx={{ color: colors.primary }}>
                          <Copy size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Set as default">
                        <IconButton
                          size="small"
                          sx={{ color: tpl.isDefault ? colors.primary : "#bbb" }}
                        >
                          <CheckCircle2 size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" sx={{ color: "#bbb", "&:hover": { color: "#dc2626" } }}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={templates.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

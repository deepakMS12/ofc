import { Box, Button, Typography, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";

interface Action {
  label: string;
  icon: React.ReactNode;
  color?: string;
  onClick: () => void;
}

interface SelectionToolbarProps {
  selectedCount: number;
  totalCount: number;
  actions: Action[];
  onSelectAll: (checked: boolean) => void;
  showSelectAll?: boolean;
}

export default function SelectionToolbar({ selectedCount, totalCount, actions, onSelectAll, showSelectAll = true }: SelectionToolbarProps) {
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<Action | null>(null);

  if (selectedCount === 0) return null;

  const isAllSelected = selectedCount === totalCount;

  const handleActionClick = (action: Action) => {
    if (action.label.toUpperCase() === "DELETE") {
      setPendingAction(action);
      setConfirmDialog(true);
    } else {
      action.onClick();
    }
  };

  const confirmDelete = () => {
    if (pendingAction) {
      pendingAction.onClick();
      setConfirmDialog(false);
      setPendingAction(null);
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "#ffeaea",
          border: "2px solid #d32f2f",
          color: "#1a1a1a",
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          animation: "slideDown 0.3s ease-in-out",
          "@keyframes slideDown": {
            from: { transform: "translateY(-100%)" },
            to: { transform: "translateY(0)" },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {showSelectAll && (
            <>
              <Checkbox
                checked={isAllSelected}
                indeterminate={selectedCount > 0 && !isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                sx={{
                  color: "#d32f2f",
                  "&.Mui-checked": { color: "#d32f2f" },
                  width: 32,
                  height: 32,
                }}
              />
              <Typography fontWeight={600} sx={{ whiteSpace: "nowrap", color: "#1a1a1a" }}>
                {selectedCount.toString().padStart(2, "0")} selected
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {actions.map((action, idx) => (
            <Button
              key={idx}
              size="small"
              startIcon={action.icon}
              onClick={() => handleActionClick(action)}
              sx={{
                color: action.color || "#1a1a1a",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
                "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            are you sure you want to delete {selectedCount} selected item{selectedCount !== 1 ? "s" : ""} ?<br/>this action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} sx={{ color: "#666" }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

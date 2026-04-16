import { memo } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";

type FileTileProps = {
  name: string;
  onRemove: () => void;
};

const FileTile = memo(({ name, onRemove }: FileTileProps) => (
  <Paper
    elevation={0}
    sx={{
      width: 144,
      border: "1px solid #ececf2",
      borderRadius: 2,
      p: 1.5,
      textAlign: "center",
      bgcolor: "#fff",
      position: "relative",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        borderColor: "#57b746",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
      },
      "&:hover .remove-file-btn": {
        opacity: 1,
        transform: "scale(1)",
      },
    }}
  >
    <IconButton
      className="remove-file-btn"
      size="small"
      onClick={onRemove}
      sx={{
        position: "absolute",
        top: 6,
        right: 6,
        width: 22,
        height: 22,
        bgcolor: "#fff",
        border: "1px solid #e5e7eb",
        color: "#ef4444",
        opacity: 0,
        transform: "scale(0.85)",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "#fee2e2",
          borderColor: "#fecaca",
        },
      }}
    >
      <CloseIcon sx={{ fontSize: 14 }} />
    </IconButton>
    <Box
      sx={{
        width: 88,
        height: 116,
        mx: "auto",
        mb: 1.5,
        border: "1px solid #f0f0f5",
        borderRadius: 1,
        display: "grid",
        placeItems: "center",
        bgcolor: "#fafbff",
      }}
    >
      <DescriptionOutlinedIcon sx={{ color: "#1565c0", fontSize: 40 }} />
    </Box>
    <Typography noWrap sx={{ fontSize: 12, color: "#5f6368" }}>
      {name}
    </Typography>
  </Paper>
));

FileTile.displayName = "FileTile";

export default FileTile;

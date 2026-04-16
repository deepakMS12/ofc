import { memo } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { colors } from "@/utils/customColor";

type EmptyWorkspaceStateProps = {
  sourceLabel: string;
  onPickFiles: () => void;
};

const EmptyWorkspaceState = memo(
  ({ sourceLabel, onPickFiles }: EmptyWorkspaceStateProps) => (
    <Box
      sx={{
        width: 400,
        minHeight: { xs: 360, md: 400 },
        border: "2px dashed #d3dbeb",
        borderRadius: 2,
        display: "grid",
        placeItems: "center",
        bgcolor: "#fff",
        textAlign: "center",
        px: 3,
      }}
    >
      <Stack spacing={1.3} alignItems="center">
        <Box
          className="file__canvas"
          sx={{
            width: 160,
            height: 180,
            borderRadius: 1,
            overflow: "hidden",
            border: "1px solid #e8eaf0",
            bgcolor: "#fff",
          }}
        >
          <canvas
            id="cover-empty-placeholder"
            width={98}
            height={140}
            className="pdf pdf"
            data-file="empty_placeholder"
            data-page="1"
            dir="ltr"
            data-width={595.28}
            data-height={841.89}
            style={{ backgroundImage: "none", display: "block" }}
          />
        </Box>
        <Typography sx={{ fontWeight: 700, color: "#1f2937" }}>
          Upload {sourceLabel} files to start canvas editor
        </Typography>

        <Button
          onClick={onPickFiles}
          startIcon={<AddRoundedIcon />}
          variant="contained"
          size="small"
          sx={{
            mt: 0.8,
            bgcolor: colors.primary,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { bgcolor: "rgba(17,86,166,0.9)" },
          }}
        >
          Select {sourceLabel} files
        </Button>
      </Stack>
    </Box>
  )
);

EmptyWorkspaceState.displayName = "EmptyWorkspaceState";

export default EmptyWorkspaceState;

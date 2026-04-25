import { memo } from "react";
import type { RefObject } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseIcon from "@mui/icons-material/Close";
import { colors } from "@/utils/customColor";

type EmptyWorkspaceStateProps = {
  sourceLabel: string;
  onPickFiles: () => void;
  selectedFileName?: string;
  previewCanvasRef?: RefObject<HTMLCanvasElement | null>;
  onRemoveSelectedFile?: () => void;
};

const EmptyWorkspaceState = memo(
  ({
    sourceLabel,
    onPickFiles,
    selectedFileName,
    previewCanvasRef,
    onRemoveSelectedFile,
  }: EmptyWorkspaceStateProps) => (
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
        {selectedFileName ? (
          <>
            <Box sx={{ position: "relative", width: 160, height: 180 }}>
              {onRemoveSelectedFile && (
                <IconButton
                  size="small"
                  onClick={onRemoveSelectedFile}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    width: 24,
                    height: 24,
                    bgcolor: "#fff",
                    border: "1px solid #e5e7eb",
                    color: "#ef4444",
                    zIndex: 2,
                    "&:hover": {
                      bgcolor: "#fee2e2",
                      borderColor: "#fecaca",
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 15 }} />
                </IconButton>
              )}
              <Box
                className="file__canvas"
                sx={{
                  width: 160,
                  height: 180,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid #e8eaf0",
                  bgcolor: "#fff",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <canvas
                  ref={previewCanvasRef}
                  id="cover-empty-placeholder"
                  width={160}
                  height={180}
                  className="pdf pdf"
                  data-file={selectedFileName}
                  data-page="1"
                  dir="ltr"
                  data-width={595.28}
                  data-height={841.89}
                  style={{ backgroundImage: "none", display: "block" }}
                />
              </Box>
            </Box>
            <Typography noWrap sx={{ maxWidth: 220, fontSize: 12, color: "#5f6368" }}>
              {selectedFileName}
            </Typography>
          </>
        ) : (
          <>
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
          </>
        )}
      </Stack>
    </Box>
  )
);

EmptyWorkspaceState.displayName = "EmptyWorkspaceState";

export default EmptyWorkspaceState;

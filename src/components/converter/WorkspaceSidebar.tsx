import { memo } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { colors } from "@/utils/customColor";
import type { ImageOutputFormat } from "./types";
import PDFCompress from "./PDFCompress";
import PDFMerge from "./PDFMerge";
import URLtoPDF from "./URLtoPDF";

type WorkspaceSidebarProps = {
  toolSlug?: string;
  files: File[];
  miniCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  activePageIndex: number;
  zoomLevel: number;
  rotation: number;
  imageResizePercent: number;
  imageCompressionQuality: number;
  imageOutputFormat: ImageOutputFormat;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onRotate: () => void;
  onRemoveFile: (index: number) => void;
  onImageResizePercentChange: (value: number) => void;
  onImageCompressionQualityChange: (value: number) => void;
  onImageOutputFormatChange: (value: ImageOutputFormat) => void;
};

const WorkspaceSidebar = memo(
  ({
    toolSlug,
    files,
    activePageIndex,
    zoomLevel,
    rotation,
    imageResizePercent,
    imageCompressionQuality,
    imageOutputFormat,
    onZoomOut,
    onZoomIn,
    onRotate,
    onRemoveFile,
    onImageResizePercentChange,
    onImageCompressionQualityChange,
    onImageOutputFormatChange,
  }: WorkspaceSidebarProps) => {
    // const getTitle = (slug?: string) => {
    //   if (slug === "pdf-compressor") return "PDF Compress";
    //   if (slug === "resizer") return "Resizer";
    //   return "Tools";
    // };
    return (
      <Paper
        elevation={0}
        sx={{
      height: "100%",
          p: 0,
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 1.6,
        }}
      >
        {/* <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
          {getTitle(toolSlug)}
        </Typography> */}

        {(toolSlug === "pdf-compressor" || toolSlug === "pdf-to-docx") && <PDFCompress />}
        {toolSlug === "pdf-merge" && <PDFMerge />}
        {toolSlug === "url-to-pdf" && <URLtoPDF />}

        {toolSlug === "pdf-canvas" && (
          <Stack spacing={1.2}>
            <Stack direction="row" spacing={0.8} flexWrap="wrap">
              <IconButton size="small" onClick={onZoomOut}>
                <ZoomOutRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={onZoomIn}>
                <ZoomInRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={onRotate}>
                <RotateRightRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small">
                <SwapVertRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
            <Typography
              sx={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}
            >
              Zoom {zoomLevel}% | Rotation {rotation}deg
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                color="error"
                disabled={!files.length}
                onClick={() => onRemoveFile(activePageIndex)}
                sx={{
                  minWidth: "auto",
                  px: 1.2,
                  py: 0.5,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Remove
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                disabled={!files.length}
                onClick={() => onRemoveFile(activePageIndex)}
                sx={{
                  minWidth: "auto",
                  px: 1.2,
                  py: 0.5,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                }}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        )}

        {toolSlug === "resizer" && (
          <Box>
            <Typography
              sx={{ fontSize: 12, color: "#374151", fontWeight: 700 }}
            >
              Resize ({imageResizePercent}%)
            </Typography>
            <Slider
              value={imageResizePercent}
              min={10}
              max={200}
              step={5}
              valueLabelDisplay="auto"
              onChange={(_, value) =>
                onImageResizePercentChange(value as number)
              }
              sx={{ mt: 1, color: colors.primary }}
            />
          </Box>
        )}

        {(toolSlug === "compressor" || toolSlug === "resizer") && (
          <Box>
            <Typography
              sx={{ fontSize: 12, color: "#374151", fontWeight: 700 }}
            >
              Output format
            </Typography>
            <Box
              component="select"
              value={imageOutputFormat}
              onChange={(event) =>
                onImageOutputFormatChange(
                  event.target.value as ImageOutputFormat,
                )
              }
              sx={{
                mt: 1,
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: 1,
                px: 1,
                py: 1,
                fontSize: 13,
                color: "#1f2937",
                outline: "none",
              }}
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WEBP</option>
            </Box>
          </Box>
        )}

        {imageOutputFormat !== "image/png" &&
          (toolSlug === "compressor" || toolSlug === "resizer") && (
            <Box>
              <Typography
                sx={{ fontSize: 12, color: "#374151", fontWeight: 700 }}
              >
                Quality ({imageCompressionQuality}%)
              </Typography>
              <Slider
                value={imageCompressionQuality}
                min={10}
                max={100}
                step={5}
                valueLabelDisplay="auto"
                onChange={(_, value) =>
                  onImageCompressionQualityChange(value as number)
                }
                sx={{ mt: 1, color: colors.primary }}
              />
            </Box>
          )}


      </Paper>
    );
  },
);

WorkspaceSidebar.displayName = "WorkspaceSidebar";

export default WorkspaceSidebar;

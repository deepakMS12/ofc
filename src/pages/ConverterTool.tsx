import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { URLtoPDFHandle } from "@/components/converter/urlToPdfPayload";
import { convertUrlToPdf } from "@/store/thunks/urlToPdfThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { ChangeEvent } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { Link as RouterLink, useParams } from "react-router-dom";
import EmptyWorkspaceState from "@/components/converter/EmptyWorkspaceState";
import FileTile from "@/components/converter/FileTile";
import WorkspaceSidebar from "@/components/converter/WorkspaceSidebar";
import type { ImageOutputFormat } from "@/components/converter/types";
import { getWorkspaceVariant } from "@/components/converter/utils";
import { colors } from "@/utils/customColor";
import { converters } from "../data/converters";
import { useToast } from "@/contexts/ToastContext";
import UrlToPdfDownloadSuccess from "@/components/converter/DownloadSuccess";

const ConverterTool = () => {
  const { slug } = useParams();
  const tool = converters.find((c) => c.slug === slug);
  const dispatch = useAppDispatch();
  const { showError, showSuccess } = useToast();
  const urlToPdfLoading = useAppSelector(
    (s) => s.urlToPdf.status === "loading",
  );
  const [urlToPdfDownloadComplete, setUrlToPdfDownloadComplete] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const urlToPdfRef = useRef<URLtoPDFHandle | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [urlToPdfSource, setUrlToPdfSource] = useState("");
  const [isConvertHovered, setIsConvertHovered] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [imageResizePercent, setImageResizePercent] = useState(100);
  const [imageCompressionQuality, setImageCompressionQuality] = useState(80);
  const [imageOutputFormat, setImageOutputFormat] =
    useState<ImageOutputFormat>("image/png");

  const sourceLabel = tool?.title?.split(" TO ")[0] || "File";
  const targetLabel = tool?.title?.split(" TO ")[1] || "Output";
  const isPdfMergeTool = tool?.slug === "pdf-merge";
  const isUrlToPdfTool = tool?.slug === "url-to-pdf";
  const workspaceVariant = useMemo(
    () => getWorkspaceVariant(tool?.slug),
    [tool?.slug],
  );
  const convertButtonLabel = useMemo(() => {
    if (!tool) return "Convert";
    if (tool.title.includes(" TO ")) return `Convert to ${targetLabel}`;
    return tool.title;
  }, [targetLabel, tool]);

  const convertDisabled = useMemo(() => {
    if (!tool) return true;
    if (isPdfMergeTool) return files.length < 2;
    if (isUrlToPdfTool) return !urlToPdfSource.trim() || urlToPdfLoading;
    return !files.length;
  }, [
    tool,
    isPdfMergeTool,
    isUrlToPdfTool,
    files.length,
    urlToPdfSource,
    urlToPdfLoading,
  ]);

  const handleUrlToPdfConvert = useCallback(async () => {
    if (!tool || tool.slug !== "url-to-pdf") return;
    setUrlToPdfDownloadComplete(false);
    const handle = urlToPdfRef.current;
    if (!handle) {
      showError("Form is not ready.");
      return;
    }
    const rawUrl = handle.getSourceUrl().trim();
    if (!rawUrl) {
      showError("Enter a URL to convert.");
      return;
    }
    let downloadFileName =
      handle.getOutputFileName().trim() || "url-convert.pdf";
    if (!downloadFileName.toLowerCase().endsWith(".pdf")) {
      downloadFileName = `${downloadFileName}.pdf`;
    }
    try {
      const { queryType, body } = handle.getPayload();

      const result = await dispatch(
        convertUrlToPdf({ queryType, body, downloadFileName }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showSuccess("PDF download started.");
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showError(typeof e === "string" ? e : "Conversion failed.");
    }
  }, [dispatch, tool, showError, showSuccess]);

  useEffect(() => {
    setUrlToPdfDownloadComplete(false);
  }, [slug, urlToPdfSource]);

  useEffect(() => {
    if (!files.length) {
      setActivePageIndex(0);
      return;
    }
    if (activePageIndex >= files.length) {
      setActivePageIndex(files.length - 1);
    }
  }, [activePageIndex, files.length]);

  const handlePickFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFilesSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files ? Array.from(event.target.files) : [];
      if (!selected.length) return;
      if (workspaceVariant === "resizer" || workspaceVariant === "compressor") {
        setFiles([selected[0]]);
      } else {
        setFiles((prev) => [...prev, ...selected]);
      }
      event.target.value = "";
    },
    [isPdfMergeTool, workspaceVariant],
  );

  const handleRemoveFile = useCallback((indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 10, 170));
  }, []);
  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 10, 60));
  }, []);
  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const miniCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawMiniCanvasPlaceholder = useCallback((title: string) => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    ctx.fillStyle = "#1565c0";
    ctx.fillRect(0, 0, w, Math.max(10, Math.floor(h * 0.07)));
    ctx.fillStyle = "#111827";
    ctx.font = "700 12px Arial";
    ctx.fillText(title.slice(0, 18), 10, Math.max(18, Math.floor(h * 0.25)));
  }, []);

  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    // Keep stable dimensions so inspect always shows the same canvas size.
    canvas.width = 160;
    canvas.height = 220;

    if (!files.length) {
      drawMiniCanvasPlaceholder("No file");
      return;
    }

    if (workspaceVariant === "resizer" || workspaceVariant === "compressor") {
      const file = files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const ratio =
          workspaceVariant === "resizer" ? imageResizePercent / 100 : 1;
        const targetW = Math.max(1, Math.floor(img.width * ratio));
        const targetH = Math.max(1, Math.floor(img.height * ratio));

        // Fit into the sidebar preview box.
        const scale = Math.min(canvas.width / targetW, canvas.height / targetH);
        const drawW = Math.max(1, Math.floor(targetW * scale));
        const drawH = Math.max(1, Math.floor(targetH * scale));
        const dx = Math.floor((canvas.width - drawW) / 2);
        const dy = Math.floor((canvas.height - drawH) / 2);
        ctx.drawImage(img, dx, dy, drawW, drawH);

        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
      };
      img.src = url;
      return () => URL.revokeObjectURL(url);
    }

    // For other converters show a placeholder mini-canvas.
    drawMiniCanvasPlaceholder(files[0]?.name ?? "File");
  }, [drawMiniCanvasPlaceholder, files, imageResizePercent, workspaceVariant]);

  const urlToPdfSuccessTitle =
    tool?.title?.replace(" TO ", " to ") ?? "URL to PDF";

  const renderWorkspace = useCallback(() => {
    if (slug === "url-to-pdf") {
      if (!urlToPdfDownloadComplete) return null;
      return (
        <UrlToPdfDownloadSuccess
          title={urlToPdfSuccessTitle}
          subtitle="Your PDF download has started. Check your downloads folder."
        />
      );
    }
    // if (workspaceVariant === "pdf-canvas") {
    //   return (
    //     <>
    //       <PdfCanvasWorkspace
    //         files={files}
    //         activePageIndex={activePageIndex}
    //         zoomLevel={zoomLevel}
    //         rotation={rotation}
    //         onPickFiles={handlePickFiles}
    //         onRemoveFile={handleRemoveFile}
    //       />

    //     </>
    //   );
    // }
    // if (workspaceVariant === "resizer" || workspaceVariant === "compressor") {
    //   return (
    //     <Box
    //       sx={{
    //         width: "100%",
    //         gap: 2,
    //       }}
    //     >
    //       <ImagePreviewCanvas
    //         mode={workspaceVariant}
    //         files={files}
    //         onPickFiles={handlePickFiles}
    //         resizePercent={imageResizePercent}
    //       />
    //     </Box>
    //   );
    // }

    return (
      <Box
        sx={{
          width: "100%",

          gap: 2,
        }}
      >
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 320 }}>
          {files.length ? (
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              {files.map((file, idx) => (
                <FileTile
                  key={`${file.name}-${idx}`}
                  name={file.name}
                  onRemove={() => handleRemoveFile(idx)}
                />
              ))}
            </Stack>
          ) : (
            <EmptyWorkspaceState
              sourceLabel={sourceLabel.toLowerCase()}
              onPickFiles={handlePickFiles}
            />
          )}
        </Box>
      </Box>
    );
  }, [
    slug,
    urlToPdfDownloadComplete,
    urlToPdfSuccessTitle,
    workspaceVariant,
    files,
    sourceLabel,
    handlePickFiles,
    handleRemoveFile,
  ]);

  return (
    <Box sx={{}}>
      {tool ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
            minHeight: { xs: "auto", md: "calc(100vh - 120px)" },
            border: "1px solid #ececf2",
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: { xs: 220, md: "calc(100vh - 120px)" },
              borderRight: "1px solid #ececf2",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                color: "#2f2f33",
                borderBottom: "1px solid #ececf2",
                p: { xs: 2, md: 3 },
              }}
            >
              {tool.title.replace(" TO ", " to ")}
            </Typography>

            <Box
              sx={{
                px: { xs: 0.5, md: 1 },
                py: 2,
                flex: 1,
                overflowY: "auto",
              }}
            >
              <WorkspaceSidebar
                toolSlug={tool?.slug}
                urlToPdfRef={urlToPdfRef}
                onUrlToPdfSourceChange={setUrlToPdfSource}
                files={files}
                miniCanvasRef={miniCanvasRef}
                activePageIndex={activePageIndex}
                zoomLevel={zoomLevel}
                rotation={rotation}
                imageResizePercent={imageResizePercent}
                imageCompressionQuality={imageCompressionQuality}
                imageOutputFormat={imageOutputFormat}
                onZoomOut={handleZoomOut}
                onZoomIn={handleZoomIn}
                onRotate={handleRotate}
                onRemoveFile={handleRemoveFile}
                onImageResizePercentChange={setImageResizePercent}
                onImageCompressionQualityChange={setImageCompressionQuality}
                onImageOutputFormatChange={setImageOutputFormat}
              />
            </Box>

            <Button
              variant="contained"
              disabled={convertDisabled}
              onClick={() => {
                if (tool?.slug === "url-to-pdf") void handleUrlToPdfConvert();
              }}
              onMouseEnter={() => setIsConvertHovered(true)}
              onMouseLeave={() => setIsConvertHovered(false)}
              onFocus={() => setIsConvertHovered(true)}
              onBlur={() => setIsConvertHovered(false)}
              sx={{
                mb: { xs: 2, md: 3 },
                mx: { xs: 2, md: 3 },

                alignSelf: "stretch",
                height: 56,
                borderRadius: 2,
                textTransform: "none",
                fontSize: 18,
                fontWeight: 700,
                bgcolor: colors.primary,
                boxShadow: "none",

                "&:hover": {
                  bgcolor: "rgba(17,86,166,0.9)",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(17,86,166,0.35)",
                  color: "#fff",
                  opacity: 0.55,
                },
              }}
              endIcon={!urlToPdfLoading && <ArrowCircleRightOutlinedIcon />}
            >
              {urlToPdfLoading ? (
                <CircularProgress size={20} />
              ) : (
                convertButtonLabel
              )}
            </Button>
            {!urlToPdfLoading && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 50,
                  left: "0%",

                  width: "100%",
                  height: 0,
                  borderRadius: "50%",
                  zIndex: 10,
                  // transform: "translateX(-50%)",
                  pointerEvents: "none",
                  opacity: isConvertHovered ? 0 : 1,
                  animation: isConvertHovered
                    ? "none"
                    : "btnFloatShadow 3.2s ease infinite",
                  transition: "opacity 0.18s ease",
                  "@keyframes btnFloatShadow": {
                    "0%": {
                      WebkitBoxShadow: "0 0 0 0 rgba(17,86,166,0.20)",
                      boxShadow: "0 0 0 0 rgba(17,86,166,0.20)",
                    },
                    "30%": {
                      WebkitBoxShadow: "0 0 0 80px rgba(17,86,166,0.1)",
                      boxShadow: "0 0 0 80px rgba(17,86,166,0.1)",
                    },
                    "40%": {
                      WebkitBoxShadow: "0 0 0 60px rgba(17,86,166,0.1)",
                      boxShadow: "0 0 0 80px rgba(17,86,166,0.1)",
                    },
                    "100%": {
                      WebkitBoxShadow: "0 0 0 0 rgba(17,86,166,0.1)",
                      boxShadow: "0 0 0 0 rgba(17,86,166,0.1)",
                    },
                  },
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              bgcolor: "#f4f4fa",
              position: "relative",
              p: { xs: 2, md: 3 },
              borderRight: { xs: "none", md: "1px solid #ececf2" },
              minHeight: { xs: 380, md: "calc(100vh - 120px)" },
            }}
          >
            <Box
              sx={{
                minHeight: { xs: 340, md: "calc(100vh - 200px)" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {renderWorkspace()}
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary">
          This converter was not found.{" "}
          <RouterLink to="/home/converter">Back to list</RouterLink>
        </Typography>
      )}

      <input
        ref={fileInputRef}
        hidden
        type="file"
        multiple={
          workspaceVariant !== "resizer" && workspaceVariant !== "compressor"
        }
        accept={
          workspaceVariant === "pdf-canvas"
            ? ".pdf,application/pdf"
            : workspaceVariant === "resizer" ||
                workspaceVariant === "compressor"
              ? "image/png,image/jpeg,image/webp"
              : undefined
        }
        onChange={handleFilesSelected}
      />
    </Box>
  );
};

export default ConverterTool;

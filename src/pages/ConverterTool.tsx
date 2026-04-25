import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { URLtoPDFHandle } from "@/components/converter/urlToPdfPayload";
import type { HtmlVariableToPdfHandle } from "@/components/converter/HtmlVariableToPDF";
import type { DocxToPdfHandle } from "@/components/converter/DocxToPDF";
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
import ConverterLoadingWorkspace from "@/components/converter/ConverterLoadingWorkspace";
import UrlToPdfDownloadSuccess from "@/components/converter/DownloadSuccess";
import { useToast } from "@/hooks/useToast";

const ConverterTool = () => {
  const { slug } = useParams();
  const tool = converters.find((c) => c.slug === slug);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const urlToPdfLoading = useAppSelector(
    (s) => s.urlToPdf.status === "loading",
  );
  const [urlToPdfDownloadComplete, setUrlToPdfDownloadComplete] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const urlToPdfRef = useRef<URLtoPDFHandle | null>(null);
  const htmlVariableToPdfRef = useRef<HtmlVariableToPdfHandle | null>(null);
  const docxToPdfRef = useRef<DocxToPdfHandle | null>(null);
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
  const isHtmlCodeToPdfTool =
    tool?.slug === "html-code-to-pdf" ||
    tool?.slug === "HTML code to PDF" ||
    tool?.slug === "html-to-pdf";
  const isHtmlFileToPdfTool = tool?.slug === "html-file-to-pdf";
  const isHtmlVariableToPdfTool = tool?.slug === "html-variable-to-pdf";
  const isDocxToPdfTool = tool?.slug === "docx-to-pdf";
  const isTemplateFillToPdfTool = tool?.slug === "template-fill-to-pdf";
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
    if (isUrlToPdfTool || isHtmlCodeToPdfTool) {
      return !urlToPdfSource.trim() || urlToPdfLoading;
    }
    if (isHtmlFileToPdfTool) {
      return files.length === 0 || urlToPdfLoading;
    }
    if (isHtmlVariableToPdfTool) {
      return urlToPdfLoading;
    }
    if (isDocxToPdfTool) {
      return files.length === 0 || urlToPdfLoading;
    }
    if (isTemplateFillToPdfTool) {
      return urlToPdfLoading;
    }
    return !files.length;
  }, [
    tool,
    isPdfMergeTool,
    isUrlToPdfTool,
    isHtmlCodeToPdfTool,
    isHtmlFileToPdfTool,
    isHtmlVariableToPdfTool,
    isDocxToPdfTool,
    isTemplateFillToPdfTool,
    files.length,
    urlToPdfSource,
    urlToPdfLoading,
  ]);

  const handleUrlToPdfConvert = useCallback(async () => {
    if (
      !tool ||
      (!isUrlToPdfTool &&
        !isHtmlCodeToPdfTool &&
        !isHtmlFileToPdfTool &&
        !isHtmlVariableToPdfTool &&
        !isDocxToPdfTool &&
        !isTemplateFillToPdfTool)
    ) {
      return;
    }
    setUrlToPdfDownloadComplete(false);
    const handle = urlToPdfRef.current;
    const variableHandle = htmlVariableToPdfRef.current;
    const docxHandle = docxToPdfRef.current;
    let payloadBody: Record<string, unknown> | null = null;
    if (isHtmlVariableToPdfTool) {
      if (!variableHandle) {
        showToast("Form is not ready.", "error");
        return;
      }
    } else if (isDocxToPdfTool) {
      if (!docxHandle) {
        showToast("Form is not ready.", "error");
        return;
      }
    } else if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }

    if (isHtmlFileToPdfTool) {
      const selected = files[0];
      if (!selected) {
        showToast("Select an HTML file to convert.", "info");
        return;
      }
      const htmlText = (await selected.text()).trim();
      if (!htmlText) {
        showToast("Selected HTML file is empty.", "error");
        return;
      }
      payloadBody = { html: htmlText };
    } else if (!isDocxToPdfTool) {
      const rawSource = handle!.getSourceValue().trim();
      if (!rawSource) {
        showToast(
          isHtmlCodeToPdfTool ? "Enter HTML code to convert." : "Enter a URL to convert.",
          "info",
        );
        return;
      }
    }

    let downloadFileName =
      (isHtmlVariableToPdfTool
        ? variableHandle!.getOutputFileName()
        : isDocxToPdfTool
          ? docxHandle!.getOutputFileName()
        : handle!.getOutputFileName()
      ).trim() || "url-convert.pdf";
    if (!downloadFileName.toLowerCase().endsWith(".pdf")) {
      downloadFileName = `${downloadFileName}.pdf`;
    }
    try {
      const { queryType, body } = isHtmlVariableToPdfTool
        ? variableHandle!.getPayload()
        : isDocxToPdfTool
          ? docxHandle!.getPayload()
        : handle!.getPayload();
      const requestBody =
        payloadBody ??
        (body as Record<string, unknown>);

      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body: requestBody,
          downloadFileName,
          sourceType: isHtmlFileToPdfTool
            ? "html-file"
            : isHtmlVariableToPdfTool
              ? "html-variable"
            : isDocxToPdfTool
              ? "docx-file"
            : isHtmlCodeToPdfTool
              ? "html"
              : "url",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast("PDF download started.", "success");
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [
    dispatch,
    files,
    isHtmlCodeToPdfTool,
    isHtmlFileToPdfTool,
    isHtmlVariableToPdfTool,
    isDocxToPdfTool,
    isTemplateFillToPdfTool,
    isUrlToPdfTool,
    showToast,
    tool,
  ]);

  useEffect(() => {
    setUrlToPdfDownloadComplete(false);
  }, [files.length, isHtmlFileToPdfTool, isHtmlVariableToPdfTool, slug, urlToPdfSource]);

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
      } else if (isHtmlFileToPdfTool || isDocxToPdfTool) {
        setFiles([selected[0]]);
      } else {
        setFiles((prev) => [...prev, ...selected]);
      }
      event.target.value = "";
    },
    [isDocxToPdfTool, isHtmlFileToPdfTool, workspaceVariant],
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
  const htmlFileCanvasRef = useRef<HTMLCanvasElement | null>(null);

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

  useEffect(() => {
    if (!isHtmlFileToPdfTool) return;
    const canvas = htmlFileCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Card-like page placeholder similar to FileTile preview.
    ctx.fillStyle = "#fafbff";
    ctx.strokeStyle = "#f0f0f5";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(5, 6, w - 10, h - 12, 6);
    ctx.fill();
    ctx.stroke();

    // Simple "document" glyph.
    const pageX = Math.floor(w / 2) - 14;
    const pageY = Math.floor(h / 2) - 24;
    ctx.fillStyle = "#e8f1ff";
    ctx.strokeStyle = "#1565c0";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(pageX, pageY, 28, 36, 4);
    ctx.fill();
    ctx.stroke();

    // Folded corner.
    ctx.fillStyle = "#d7e7ff";
    ctx.beginPath();
    ctx.moveTo(pageX + 20, pageY);
    ctx.lineTo(pageX + 28, pageY + 8);
    ctx.lineTo(pageX + 20, pageY + 8);
    ctx.closePath();
    ctx.fill();

    // Text lines on document.
    ctx.strokeStyle = "#1565c0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pageX + 6, pageY + 16);
    ctx.lineTo(pageX + 22, pageY + 16);
    ctx.moveTo(pageX + 6, pageY + 22);
    ctx.lineTo(pageX + 22, pageY + 22);
    ctx.moveTo(pageX + 6, pageY + 28);
    ctx.lineTo(pageX + 18, pageY + 28);
    ctx.stroke();
  }, [files, isHtmlFileToPdfTool]);

  const urlToPdfSuccessTitle =
    tool?.title?.replace(" TO ", " to ") ?? "URL to PDF";

  const renderWorkspace = useCallback(() => {
    if (isUrlToPdfTool || isHtmlCodeToPdfTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (!urlToPdfDownloadComplete) return null;
      return (
        <UrlToPdfDownloadSuccess
          title={urlToPdfSuccessTitle}
          subtitle="Your PDF download has started. Check your downloads folder."
        />
      );
    }
    if (isHtmlFileToPdfTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your PDF download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            minHeight: 320,
            display: "grid",
            placeItems: "center",
          }}
        >
          <EmptyWorkspaceState
            sourceLabel="html file"
            onPickFiles={handlePickFiles}
            selectedFileName={files[0]?.name}
            previewCanvasRef={htmlFileCanvasRef}
            onRemoveSelectedFile={
              files.length ? () => handleRemoveFile(0) : undefined
            }
          />
        </Box>
      );
    }
    if (isHtmlVariableToPdfTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (!urlToPdfDownloadComplete) return null;
      return (
        <UrlToPdfDownloadSuccess
          title={urlToPdfSuccessTitle}
          subtitle="Your PDF download has started. Check your downloads folder."
        />
      );
    }
    if (isDocxToPdfTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your PDF download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box sx={{ width: "100%", display: "grid", placeItems: "center", minHeight: 320 }}>
          {files.length ? (
            <FileTile
              name={files[0]?.name ?? "document.docx"}
              onRemove={() => setFiles([])}
            />
          ) : (
            <EmptyWorkspaceState sourceLabel="docx / doc" onPickFiles={handlePickFiles} />
          )}
        </Box>
      );
    }
    if (isTemplateFillToPdfTool) return null;
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
    isUrlToPdfTool,
    isHtmlCodeToPdfTool,
    isHtmlFileToPdfTool,
    isHtmlVariableToPdfTool,
    isDocxToPdfTool,
    isTemplateFillToPdfTool,
    urlToPdfLoading,
    urlToPdfDownloadComplete,
    urlToPdfSuccessTitle,
    sourceLabel,
    targetLabel,
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
            overflow: "visible",
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
              zIndex: 2,
              overflow: "visible",
            }}
          >
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                color: "#2f2f33",
                borderBottom: "1px solid #ececf2",
                px: { xs: 2, md: 3 },
                pb: { xs: 2, md: 3 },
                pt: { xs: 3, md: 4 },
              }}
            >
              {tool.title.replace(" TO ", " to ")}
            </Typography>

            <Box
              sx={{
                px: { xs: 0.5, md: 1 },
                py: 2,
                flex: 1,
              }}
            >
              <WorkspaceSidebar
                toolSlug={tool?.slug}
                urlToPdfRef={urlToPdfRef}
                htmlVariableToPdfRef={htmlVariableToPdfRef}
                docxToPdfRef={docxToPdfRef}
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

            <Box
              sx={{
                position: "relative",
                alignSelf: "stretch",
                mx: { xs: 2, md: 3 },
                mb: { xs: 2, md: 3 },
              }}
            >
              <Button
                variant="contained"
                disabled={convertDisabled}
                onClick={() => {
                  if (
                    isUrlToPdfTool ||
                    isHtmlCodeToPdfTool ||
                    isHtmlFileToPdfTool ||
                    isHtmlVariableToPdfTool ||
                    isDocxToPdfTool ||
                    isTemplateFillToPdfTool
                  ) {
                    void handleUrlToPdfConvert();
                  }
                }}
                onMouseEnter={() => setIsConvertHovered(true)}
                onMouseLeave={() => setIsConvertHovered(false)}
                onFocus={() => setIsConvertHovered(true)}
                onBlur={() => setIsConvertHovered(false)}
                sx={{
                  position: "relative",
                  zIndex: 1,
                  overflow: "hidden",
                  width: "100%",
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
                  ...(isUrlToPdfTool && !urlToPdfLoading
                    ? {
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-45%",
                          width: "35%",
                          height: "100%",
                          background:
                            "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0) 100%)",
                          transform: "skewX(-20deg)",
                          pointerEvents: "none",
                          animation: "buttonShineSweep 2.8s ease-in-out infinite",
                        },
                        "@keyframes buttonShineSweep": {
                          "0%": { left: "-45%" },
                          "55%": { left: "125%" },
                          "100%": { left: "125%" },
                        },
                      }
                    : {}),
                }}
                endIcon={!urlToPdfLoading && <ArrowCircleRightOutlinedIcon />}
              >
                {urlToPdfLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  convertButtonLabel
                )}
              </Button>
            </Box>
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
          workspaceVariant !== "resizer" &&
          workspaceVariant !== "compressor" &&
          !isDocxToPdfTool &&
          !isHtmlFileToPdfTool
        }
        accept={
          workspaceVariant === "pdf-canvas"
            ? ".pdf,application/pdf"
            : workspaceVariant === "resizer" ||
                workspaceVariant === "compressor"
              ? "image/png,image/jpeg,image/webp"
              : isHtmlFileToPdfTool
                ? ".html,.htm,text/html"
              : isDocxToPdfTool
                ? ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : undefined
        }
        onChange={handleFilesSelected}
      />
    </Box>
  );
};

export default ConverterTool;

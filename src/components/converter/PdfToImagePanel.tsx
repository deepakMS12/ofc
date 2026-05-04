import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { HtmlGhostTextField } from "./pdfSettings/HtmlGhostTextField";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { colors } from "@/utils/customColor";
import {
  buildPdfToImagePayload,
  downloadFormatToFileExt,
  isDpiInRange,
  type PdfToImageDownloadFormatId,
  type PdfToImageFormFields,
} from "./pdfToImagePayload";
import type { UrlToPdfQueryType } from "./urlToPdfPayload";
import {
  WATERMARK_FONT_OPTIONS,
  WATERMARK_POSITION_OPTIONS,
  WATERMARK_STAMP_TYPE_OPTIONS,
  WATERMARK_TEXT_LAYOUT_OPTIONS,
  type WatermarkFontOption,
  type WatermarkPositionId,
  type WatermarkStampType,
  type WatermarkTextLayoutId,
} from "./watermarkStampOptions";

const PANEL_BORDER = "#ececf2";

const footerLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "#64748b",
  mb: 0.75,
  display: "block",
};

const watermarkFieldLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: 0.02,
  color: "text.secondary",
  mb: 0.5,
  display: "block",
};

const DOWNLOAD_FORMAT_OPTIONS: readonly {
  id: PdfToImageDownloadFormatId;
  label: string;
}[] = [
  { id: "jpeg", label: "JPEG (.jpg)" },
  { id: "png", label: "PNG (.png)" },
  { id: "webp", label: "WebP (.webp)" },
];

export type PdfToImageHandle = {
  getPayload: (files: File[]) => { queryType: UrlToPdfQueryType; body: FormData };
  getOutputFileName: () => string;
  getIsPreview: () => boolean;
  getOutputImageExt: () => ".jpg" | ".png" | ".webp";
};

type PdfToImagePanelProps = {
  fileCount: number;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const PdfToImagePanel = forwardRef<PdfToImageHandle, PdfToImagePanelProps>(
  function PdfToImagePanel({ fileCount, onValidityChange, onFieldsDirty }, ref) {
    const [pdfPassword, setPdfPassword] = useState("");
    const [dpi, setDpi] = useState("300");
    const [downloadFormat, setDownloadFormat] =
      useState<PdfToImageDownloadFormatId>("jpeg");
    const [outputFileName, setOutputFileName] = useState("");
    const [responseMode, setResponseMode] = useState<"download" | "preview">(
      "download",
    );
    const [watermarkType, setWatermarkType] =
      useState<WatermarkStampType>("image");
    const [watermarkPosition, setWatermarkPosition] =
      useState<WatermarkPositionId>("middle-center");
    const [watermarkImageUrl, setWatermarkImageUrl] = useState("");
    const [watermarkImageScaleX, setWatermarkImageScaleX] = useState(100);
    const [watermarkImageScaleY, setWatermarkImageScaleY] = useState(100);
    const [watermarkImageOpacity, setWatermarkImageOpacity] = useState(30);
    const [watermarkImageRotation, setWatermarkImageRotation] = useState(0);
    const [watermarkText, setWatermarkText] = useState("");
    const [watermarkTextLayout, setWatermarkTextLayout] =
      useState<WatermarkTextLayoutId>("diagonal");
    const [watermarkFont, setWatermarkFont] =
      useState<WatermarkFontOption>("Arial");
    const [watermarkTextSizePx, setWatermarkTextSizePx] = useState("64");
    const [watermarkTextColor, setWatermarkTextColor] = useState("#000000");
    const [watermarkTextOpacity, setWatermarkTextOpacity] = useState(20);
    const [stampFooter, setStampFooter] = useState("");

    const dpiOk = isDpiInRange(dpi);

    useEffect(() => {
      onValidityChange(fileCount > 0 && dpiOk);
    }, [fileCount, dpiOk, onValidityChange]);

    const dirty = useCallback(() => {
      onFieldsDirty();
    }, [onFieldsDirty]);

    const collectFields = useCallback((): PdfToImageFormFields => {
      return {
        pdfPassword,
        dpi,
        downloadFormat,
        outputFileName,
        watermarkType,
        watermarkPosition,
        watermarkImageUrl,
        watermarkImageScaleX,
        watermarkImageScaleY,
        watermarkImageOpacity,
        watermarkImageRotation,
        watermarkText,
        watermarkTextLayout,
        watermarkFont,
        watermarkTextSizePx,
        watermarkTextColor,
        watermarkTextOpacity,
        stampFooter,
      };
    }, [
      pdfPassword,
      dpi,
      downloadFormat,
      outputFileName,
      watermarkType,
      watermarkPosition,
      watermarkImageUrl,
      watermarkImageScaleX,
      watermarkImageScaleY,
      watermarkImageOpacity,
      watermarkImageRotation,
      watermarkText,
      watermarkTextLayout,
      watermarkFont,
      watermarkTextSizePx,
      watermarkTextColor,
      watermarkTextOpacity,
      stampFooter,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () => outputFileName.trim() || "export",
        getIsPreview: () => responseMode === "preview",
        getOutputImageExt: () => downloadFormatToFileExt(downloadFormat),
        getPayload: (files: File[]) => {
          const file = files[0];
          if (!file) {
            throw new Error("Select a PDF file first.");
          }
          const queryType: UrlToPdfQueryType =
            responseMode === "preview" ? "d" : "p";
          return buildPdfToImagePayload(file, collectFields(), queryType);
        },
      }),
      [collectFields, downloadFormat, outputFileName, responseMode],
    );

    const handleWatermarkTypeChange = (
      event: SelectChangeEvent<WatermarkStampType>,
    ) => {
      setWatermarkType(event.target.value as WatermarkStampType);
      dirty();
    };

    const handleWatermarkPositionChange = (
      event: SelectChangeEvent<WatermarkPositionId>,
    ) => {
      setWatermarkPosition(event.target.value as WatermarkPositionId);
      dirty();
    };

    const handleDownloadFormatChange = (
      event: SelectChangeEvent<PdfToImageDownloadFormatId>,
    ) => {
      setDownloadFormat(event.target.value as PdfToImageDownloadFormatId);
      dirty();
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 340px)",
          maxHeight: "100%",
          minHeight: 0,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            pb: 1,
          }}
        >
          <SettingsAccordion id="pdf-to-image-source" title="Source" defaultExpanded>
            <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1.5 }}>
              Choose one PDF from the workspace on the right. Multi-page PDFs return a ZIP
              of page images when the server returns an archive.
            </Typography>
            {fileCount > 0 && (
              <Typography
                sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 1 }}
              >
                {fileCount} file selected
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box>
                <HtmlGhostTextField
                  id="pdf-to-image-password"
                  label="PDF password (if encrypted)"
                  value={pdfPassword}
                  onChange={(next) => {
                    setPdfPassword(next);
                    dirty();
                  }}
                  defaultHtml="Optional"
                  rows={1}
                />
              </Box>
              <SettingsOutlinedField
                id="pdf-to-image-dpi"
                label="DPI (higher = sharper zoom)"
                type="number"
                value={dpi}
                error={!dpiOk}
                helperText={dpiOk ? "72–600" : "Enter a whole number between 72 and 600."}
                onChange={(e) => {
                  setDpi(e.target.value);
                  dirty();
                }}
                inputProps={{ min: 72, max: 600, step: 1 }}
              />
              <FormControl fullWidth size="small" error={false}>
                <InputLabel id="pdf-to-image-format-label">Download format</InputLabel>
                <Select
                  labelId="pdf-to-image-format-label"
                  id="pdf-to-image-format-select"
                  value={downloadFormat}
                  label="Download format"
                  onChange={handleDownloadFormatChange}
                >
                  {DOWNLOAD_FORMAT_OPTIONS.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
                  <Box
            sx={{
              flexShrink: 0,
              minWidth: { sm: 220 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Typography component="span" sx={footerLabelSx}>
              Response
            </Typography>
            <ToggleButtonGroup
              color="primary"
              exclusive
              fullWidth
              size="small"
              value={responseMode}
              onChange={(_, v: "download" | "preview" | null) => {
                if (v) {
                  setResponseMode(v);
                  dirty();
                }
              }}
              sx={{
                mt: 0.5,
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#64748b",
                  borderColor: PANEL_BORDER,
                  bgcolor: "#fff",
                },
                "& .MuiToggleButton-root.Mui-selected": {
                  bgcolor: `${colors.primary} !important`,
                  color: "#fff !important",
                  borderColor: `${colors.primary} !important`,
                },
                "& .MuiToggleButton-root.Mui-selected:hover": {
                  bgcolor: `${colors.primary} !important`,
                },
              }}
            >
              <ToggleButton value="download">Download</ToggleButton>
              <ToggleButton value="preview">Preview</ToggleButton>
            </ToggleButtonGroup>
          </Box>
            </Box>
          </SettingsAccordion>

          <SettingsAccordion id="pdf-to-image-watermark" title="Watermark / stamp">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: watermarkType === "image" ? "1fr 1fr" : "1fr",
                },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel id="pdf-to-image-wm-type-label">Type</InputLabel>
                <Select
                  labelId="pdf-to-image-wm-type-label"
                  id="pdf-to-image-wm-type-select"
                  value={watermarkType}
                  label="Type"
                  onChange={handleWatermarkTypeChange}
                >
                  {WATERMARK_STAMP_TYPE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="pdf-to-image-wm-position-label">
                  Position (watermark)
                </InputLabel>
                <Select
                  labelId="pdf-to-image-wm-position-label"
                  id="pdf-to-image-wm-position-select"
                  value={watermarkPosition}
                  label="Position (watermark)"
                  onChange={handleWatermarkPositionChange}
                >
                  {WATERMARK_POSITION_OPTIONS.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {watermarkType === "image" && (
              <Box sx={{ mb: 2 }}>
                <SettingsOutlinedField
                  id="pdf-to-image-wm-image-url"
                  label="Image URL (server fetches URL)"
                  placeholder="https://example.com/watermark.png"
                  fullWidth
                  value={watermarkImageUrl}
                  onChange={(e) => {
                    setWatermarkImageUrl(e.target.value);
                    dirty();
                  }}
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr 1fr",
                      md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Box>
                    <Typography component="span" sx={watermarkFieldLabelSx}>
                      Scale X
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Slider
                        value={watermarkImageScaleX}
                        min={1}
                        max={200}
                        onChange={(_, v) => {
                          setWatermarkImageScaleX(v as number);
                          dirty();
                        }}
                        sx={{ flex: 1, color: colors.primary }}
                        valueLabelDisplay="off"
                      />
                      <Typography
                        sx={{
                          minWidth: 40,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "primary.main",
                          textAlign: "right",
                        }}
                      >
                        {watermarkImageScaleX}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography component="span" sx={watermarkFieldLabelSx}>
                      Scale Y
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Slider
                        value={watermarkImageScaleY}
                        min={1}
                        max={200}
                        onChange={(_, v) => {
                          setWatermarkImageScaleY(v as number);
                          dirty();
                        }}
                        sx={{ flex: 1, color: colors.primary }}
                        valueLabelDisplay="off"
                      />
                      <Typography
                        sx={{
                          minWidth: 40,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "primary.main",
                          textAlign: "right",
                        }}
                      >
                        {watermarkImageScaleY}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography component="span" sx={watermarkFieldLabelSx}>
                      Opacity
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Slider
                        value={watermarkImageOpacity}
                        min={0}
                        max={100}
                        onChange={(_, v) => {
                          setWatermarkImageOpacity(v as number);
                          dirty();
                        }}
                        sx={{ flex: 1, color: colors.primary }}
                        valueLabelDisplay="off"
                      />
                      <Typography
                        sx={{
                          minWidth: 40,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "primary.main",
                          textAlign: "right",
                        }}
                      >
                        {watermarkImageOpacity}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography component="span" sx={watermarkFieldLabelSx}>
                      Rotation (°)
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Slider
                        value={watermarkImageRotation}
                        min={0}
                        max={360}
                        onChange={(_, v) => {
                          setWatermarkImageRotation(v as number);
                          dirty();
                        }}
                        sx={{ flex: 1, color: colors.primary }}
                        valueLabelDisplay="off"
                      />
                      <Typography
                        sx={{
                          minWidth: 40,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "primary.main",
                          textAlign: "right",
                        }}
                      >
                        {watermarkImageRotation}°
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {watermarkType === "text" && (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  mb: 2,
                }}
              >
                <SettingsOutlinedField
                  id="pdf-to-image-wm-text"
                  label="Watermark text"
                  placeholder="CONFIDENTIAL"
                  fullWidth
                  value={watermarkText}
                  onChange={(e) => {
                    setWatermarkText(e.target.value);
                    dirty();
                  }}
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <FormControl fullWidth size="small">
                    <InputLabel id="pdf-to-image-wm-text-layout-label">Layout</InputLabel>
                    <Select
                      labelId="pdf-to-image-wm-text-layout-label"
                      value={watermarkTextLayout}
                      label="Layout"
                      onChange={(e) => {
                        setWatermarkTextLayout(e.target.value as WatermarkTextLayoutId);
                        dirty();
                      }}
                    >
                      {WATERMARK_TEXT_LAYOUT_OPTIONS.map((opt) => (
                        <MenuItem key={opt.id} value={opt.id}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel id="pdf-to-image-wm-font-label">Font</InputLabel>
                    <Select
                      labelId="pdf-to-image-wm-font-label"
                      value={watermarkFont}
                      label="Font"
                      onChange={(e) => {
                        setWatermarkFont(e.target.value as WatermarkFontOption);
                        dirty();
                      }}
                    >
                      {WATERMARK_FONT_OPTIONS.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <SettingsOutlinedField
                    id="pdf-to-image-wm-text-size"
                    label="Size (px)"
                    value={watermarkTextSizePx}
                    onChange={(e) => {
                      setWatermarkTextSizePx(e.target.value);
                      dirty();
                    }}
                  />
                  <SettingsOutlinedField
                    id="pdf-to-image-wm-text-color"
                    label="Color"
                    value={watermarkTextColor}
                    onChange={(e) => {
                      setWatermarkTextColor(e.target.value);
                      dirty();
                    }}
                  />
                </Box>
                <Box>
                  <Typography component="span" sx={watermarkFieldLabelSx}>
                    Opacity
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Slider
                      value={watermarkTextOpacity}
                      min={0}
                      max={100}
                      onChange={(_, v) => {
                        setWatermarkTextOpacity(v as number);
                        dirty();
                      }}
                      sx={{ flex: 1, color: colors.primary }}
                      valueLabelDisplay="off"
                    />
                    <Typography
                      sx={{
                        minWidth: 40,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "primary.main",
                        textAlign: "right",
                      }}
                    >
                      {watermarkTextOpacity}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <SettingsOutlinedField
              id="pdf-to-image-stamp"
              label="Stamp (footer on every page image)"
              placeholder="e.g. Internal use only"
              fullWidth
              value={stampFooter}
              onChange={(e) => {
                setStampFooter(e.target.value);
                dirty();
              }}
            />
          </SettingsAccordion>
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            px: 2,
            pt: 1.5,
            pb: 0.5,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            alignItems: { sm: "flex-end" },
            justifyContent: "space-between",
            gap: 2,
            borderTop: `1px solid ${PANEL_BORDER}`,
          }}
        >
          <Box sx={{ flex: "1 1 200px", minWidth: 0 }}>
            <Typography component="span" sx={footerLabelSx}>
              Output name (optional)
            </Typography>
            <SettingsOutlinedField
              id="pdf-to-image-output"
              placeholder="export"
              value={outputFileName}
              onChange={(e) => {
                setOutputFileName(e.target.value);
                dirty();
              }}
            />
          </Box>
      
        </Box>
      </Box>
    );
  },
);

PdfToImagePanel.displayName = "PdfToImagePanel";

export default PdfToImagePanel;

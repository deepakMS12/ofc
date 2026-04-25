import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { HtmlGhostTextField } from "./pdfSettings/HtmlGhostTextField";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type ChangeEvent,
} from "react";
import {
  PDF_DIMENSION_UNIT_OPTIONS,
  type PdfDimensionUnitId,
} from "./pdfDimensionUnits";
import {
  getPresetPageSizeFields,
  PDF_PAGE_FORMAT_OPTIONS,
  type PdfPageFormatId,
} from "./pdfPageFormats";
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
import { colors } from "@/utils/customColor";
import {
  ENCRYPTION_LEVEL_OPTIONS,
  type EncryptionLevelId,
} from "./rightsEncryptionOptions";
import {
  buildUrlToPdfPayload,
  type URLtoPDFHandle,
  type UrlToPdfFormState,
} from "./urlToPdfPayload";

const DEFAULT_MARGIN = "10";

type RightsRestrictionId =
  | "disallowPrint"
  | "disallowAnnotation"
  | "disallowContentCopy"
  | "disableEditingPdf";

const DEFAULT_RIGHTS_RESTRICTIONS: Record<RightsRestrictionId, boolean> = {
  disallowPrint: false,
  disallowAnnotation: false,
  disallowContentCopy: false,
  disableEditingPdf: false,
};

const RIGHTS_RESTRICTION_LABELS: Record<RightsRestrictionId, string> = {
  disallowPrint: "Disallow print",
  disallowAnnotation: "Disallow annotation",
  disallowContentCopy: "Disallow content copy",
  disableEditingPdf: "Disable editing PDF",
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

type ConversionSettingId =
  | "usePrintLayout"
  | "optimizeLayout"
  | "removeBackground"
  | "removeHyperlinks"
  | "blockAds"
  | "hideCookieNotices";

const CONVERSION_SETTINGS_GRID: readonly {
  id: ConversionSettingId;
  label: string;
}[] = [
  { id: "usePrintLayout", label: "Use print layout" },
  { id: "optimizeLayout", label: "Optimize layout" },
  { id: "removeBackground", label: "Remove background" },
  { id: "removeHyperlinks", label: "Remove hyperlinks" },
  { id: "blockAds", label: "Block ads" },
  { id: "hideCookieNotices", label: "Hide cookie notices" },
];

const DEFAULT_CONVERSION_SETTINGS: Record<ConversionSettingId, boolean> = {
  usePrintLayout: true,
  optimizeLayout: true,
  removeBackground: true,
  removeHyperlinks: true,
  blockAds: false,
  hideCookieNotices: false,
};

const DEFAULT_HEADER_HTML = `<div style='font-size:10px;text-align:center;width:100%'>Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>`;

const DEFAULT_FOOTER_HTML = `<div style='font-size:10px;text-align:right;width:100%'>Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`;

const DEFAULT_CUSTOM_CSS = `body { font-family: Arial; }
.sidebar { display: none; }`;

type URLtoPDFProps = {
  sourceType?: "url" | "html" | "html-file";
  onSourceChange?: (value: string) => void;
};

const URLtoPDF = forwardRef<URLtoPDFHandle, URLtoPDFProps>(
  function URLtoPDF({ sourceType = "url", onSourceChange }, ref) {
  const [sourceValue, setSourceValue] = useState("");
  const [isPreview, setIsPreview] = useState(true);
  const [outputFileName, setOutputFileName] = useState("");
  const [alignment, setAlignment] = useState("web");
  const [pageFormat, setPageFormat] = useState<PdfPageFormatId>("letter");
  const [dimensionUnit, setDimensionUnit] = useState<PdfDimensionUnitId>(
    () => getPresetPageSizeFields("letter", false)!.unit,
  );
  const [pageWidth, setPageWidth] = useState(
    () => getPresetPageSizeFields("letter", false)!.width,
  );
  const [pageHeight, setPageHeight] = useState(
    () => getPresetPageSizeFields("letter", false)!.height,
  );
  const [marginTop, setMarginTop] = useState(DEFAULT_MARGIN);
  const [marginRight, setMarginRight] = useState(DEFAULT_MARGIN);
  const [marginBottom, setMarginBottom] = useState(DEFAULT_MARGIN);
  const [marginLeft, setMarginLeft] = useState(DEFAULT_MARGIN);
  const [conversionSettings, setConversionSettings] = useState(
    DEFAULT_CONVERSION_SETTINGS,
  );
  const [waitTimeMs, setWaitTimeMs] = useState("0");
  const [headerHtml, setHeaderHtml] = useState("");
  const [footerHtml, setFooterHtml] = useState("");
  const [headerEveryPage, setHeaderEveryPage] = useState(false);
  const [footerEveryPage, setFooterEveryPage] = useState(false);
  const [customCss, setCustomCss] = useState("");
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
  const [encryptionLevel, setEncryptionLevel] =
    useState<EncryptionLevelId>("none");
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [rightsRestrictions, setRightsRestrictions] = useState(
    DEFAULT_RIGHTS_RESTRICTIONS,
  );

  const handleChange = (_event: unknown, newAlignment: string | null) => {
    if (!newAlignment) return;
    setAlignment(newAlignment);
  };

  const handlePageFormatChange = (
    event: SelectChangeEvent<PdfPageFormatId>,
  ) => {
    setPageFormat(event.target.value as PdfPageFormatId);
  };

  const handleDimensionUnitChange = (
    event: SelectChangeEvent<PdfDimensionUnitId>,
  ) => {
    setDimensionUnit(event.target.value as PdfDimensionUnitId);
  };

  const handleConversionSettingChange = (id: ConversionSettingId) => {
    setConversionSettings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleWaitTimeMsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (raw === "") {
      setWaitTimeMs("");
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) {
      setWaitTimeMs("0");
      return;
    }
    setWaitTimeMs(String(Math.min(1000, Math.max(0, Math.round(n)))));
  };

  const handleWaitTimeMsBlur = () => {
    if (waitTimeMs === "") setWaitTimeMs("0");
  };

  const handleWatermarkTypeChange = (
    event: SelectChangeEvent<WatermarkStampType>,
  ) => {
    setWatermarkType(event.target.value as WatermarkStampType);
  };

  const handleWatermarkTextInput = (event: ChangeEvent<HTMLInputElement>) => {
    setWatermarkText(
      event.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 25),
    );
  };

  const handleWatermarkPositionChange = (
    event: SelectChangeEvent<WatermarkPositionId>,
  ) => {
    setWatermarkPosition(event.target.value as WatermarkPositionId);
  };

  const handleWatermarkTextLayoutChange = (
    event: SelectChangeEvent<WatermarkTextLayoutId>,
  ) => {
    setWatermarkTextLayout(event.target.value as WatermarkTextLayoutId);
  };

  const handleWatermarkFontChange = (
    event: SelectChangeEvent<WatermarkFontOption>,
  ) => {
    setWatermarkFont(event.target.value as WatermarkFontOption);
  };

  const handleWatermarkTextSizePxChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const raw = event.target.value.replace(/\D/g, "");
    setWatermarkTextSizePx(
      raw === "" ? "" : String(Math.min(500, Math.max(1, Number(raw)))),
    );
  };

  const handleWatermarkTextSizePxBlur = () => {
    if (watermarkTextSizePx === "") setWatermarkTextSizePx("64");
  };

  const handleEncryptionLevelChange = (
    event: SelectChangeEvent<EncryptionLevelId>,
  ) => {
    setEncryptionLevel(event.target.value as EncryptionLevelId);
  };

  const handleRightsRestrictionChange = (id: RightsRestrictionId) => {
    setRightsRestrictions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const collectFormState = useCallback((): UrlToPdfFormState => {
    return {
      sourceValue,
      sourceType,
      isPreview,
      alignment,
      pageFormat,
      dimensionUnit,
      pageWidth,
      pageHeight,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      conversionSettings: conversionSettings as UrlToPdfFormState["conversionSettings"],
      waitTimeMs,
      headerHtml,
      footerHtml,
      headerEveryPage,
      footerEveryPage,
      customCss,
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
      encryptionLevel,
      userPassword,
      ownerPassword,
      rightsRestrictions: rightsRestrictions as UrlToPdfFormState["rightsRestrictions"],
    };
  }, [
    sourceValue,
    sourceType,
    isPreview,
    alignment,
    pageFormat,
    dimensionUnit,
    pageWidth,
    pageHeight,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    conversionSettings,
    waitTimeMs,
    headerHtml,
    footerHtml,
    headerEveryPage,
    footerEveryPage,
    customCss,
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
    encryptionLevel,
    userPassword,
    ownerPassword,
    rightsRestrictions,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      getSourceValue: () => sourceValue,
      getOutputFileName: () => outputFileName,
      getPayload: () => buildUrlToPdfPayload(collectFormState()),
    }),
    [collectFormState, sourceValue, outputFileName],
  );

  const handleSourceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const v = event.target.value;
    setSourceValue(v);
    onSourceChange?.(v);
  };

  const isCustomFormat = pageFormat === "custom";
  const isLandscape = alignment === "android";

  useEffect(() => {
    const preset = getPresetPageSizeFields(pageFormat, isLandscape);
    if (!preset) return;
    setDimensionUnit(preset.unit);
    setPageWidth(preset.width);
    setPageHeight(preset.height);
  }, [pageFormat, isLandscape]);

  const sourceLabel = sourceType === "url" ? "URL" : "HTML code";
  const sourcePlaceholder =
    sourceType === "url" ? "https://" : "<!DOCTYPE html>";

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
        {sourceType !== "html-file" && (
          <SettingsAccordion
            id="pdf-settings-source"
            title="Source"
            defaultExpanded
          >
            <SettingsOutlinedField
              id="url-to-pdf-source-url"
              label={sourceLabel}
              fullWidth
              multiline={sourceType === "html"}
              minRows={sourceType === "html" ? 6 : undefined}
              placeholder={sourcePlaceholder}
              value={sourceValue}
              onChange={handleSourceChange}
            />
            <FormControlLabel
              sx={{ mt: 1, ml: 0, alignItems: "center" }}
              control={
                <Checkbox
                  color="primary"
                  checked={isPreview}
                  onChange={(_, checked) => setIsPreview(checked)}
                />
              }
              label="Preview"
            />
          </SettingsAccordion>
        )}
        <SettingsAccordion
          id="pdf-settings-page-size"
          title={"Page size & orientation"}
        >
          <FormControl fullWidth size="small">
            <InputLabel id="page-size-label">Format</InputLabel>
            <Select
              labelId="page-size-label"
              id="page-size-select"
              value={pageFormat}
              label="Format"
              onChange={handlePageFormatChange}
            >
              {PDF_PAGE_FORMAT_OPTIONS.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
         {
          !isCustomFormat && (
             <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            sx={{ mt: 1 }}
            onChange={handleChange}
            aria-label="Platform"
            fullWidth
          >
            <ToggleButton value="web">Portrait</ToggleButton>
            <ToggleButton value="android">Landscape</ToggleButton>
          </ToggleButtonGroup>
          )
          }

        {
          isCustomFormat && (
              <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 1,
              my: 2,
            }}
          >
            <FormControl fullWidth size="small" disabled={!isCustomFormat}>
              <InputLabel id="page-dimension-unit-label">Unit</InputLabel>
              <Select
                labelId="page-dimension-unit-label"
                id="page-dimension-unit-select"
                value={dimensionUnit}
                label="Unit"
                onChange={handleDimensionUnitChange}
              >
                {PDF_DIMENSION_UNIT_OPTIONS.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <SettingsOutlinedField
              id="page-width"
              label="Page width"
              fullWidth
              disabled={!isCustomFormat}
              value={pageWidth}
              onChange={(e) => setPageWidth(e.target.value)}
            />
            <SettingsOutlinedField
              id="page-height"
              label="Page height"
              fullWidth
              disabled={!isCustomFormat}
              value={pageHeight}
              onChange={(e) => setPageHeight(e.target.value)}
            />
          </Box>)
        }
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                sm: "1fr",
                md: "1fr 1fr",
              },
              gap: 1,
              my: 2,
            }}
          >
            <SettingsOutlinedField
              id="margin-top"
              label="Margin top"
              fullWidth
              value={marginTop}
              onChange={(e) => setMarginTop(e.target.value)}
            />
            <SettingsOutlinedField
              id="margin-right"
              label="Margin right"
              fullWidth
              value={marginRight}
              onChange={(e) => setMarginRight(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                sm: "1fr",
                md: "1fr 1fr",
              },
              gap: 1,
              my: 2,
            }}
          >
            <SettingsOutlinedField
              id="margin-bottom"
              label="Margin bottom"
              fullWidth
              value={marginBottom}
              onChange={(e) => setMarginBottom(e.target.value)}
            />
            <SettingsOutlinedField
              id="margin-left"
              label="Margin left"
              fullWidth
              value={marginLeft}
              onChange={(e) => setMarginLeft(e.target.value)}
            />
          </Box>
        </SettingsAccordion>
        <SettingsAccordion id="conversion-settings" title="Conversion settings">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              columnGap: 2,
              rowGap: 0.5,
            }}
          >
            {CONVERSION_SETTINGS_GRID.map(({ id, label }) => (
              <FormControlLabel
                key={id}
                control={
                  <Checkbox
                    color="primary"
                    checked={conversionSettings[id]}
                    onChange={() => handleConversionSettingChange(id)}
                  />
                }
                label={label}
                sx={{
                  m: 0,
                  alignItems: "center",
                  "& .MuiFormControlLabel-label": {
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.02,
                  },
                }}
              />
            ))}
          </Box>
        </SettingsAccordion>
        <SettingsAccordion id="page-completion" title="Page completion">
          <SettingsOutlinedField
            id="wait-time-ms"
            type="number"
            label="Wait time (ms)"
            helperText="0–1000, capped for fast mode"
            value={waitTimeMs}
            onChange={handleWaitTimeMsChange}
            onBlur={handleWaitTimeMsBlur}
            inputProps={{ min: 0, max: 1000, step: 1 }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mt: 2,
            }}
          >
            <HtmlGhostTextField
              id="header-html"
              label="Header HTML (optional)"
              value={headerHtml}
              onChange={setHeaderHtml}
              defaultHtml={DEFAULT_HEADER_HTML}
            />
            <HtmlGhostTextField
              id="footer-html"
              label="Footer HTML (optional)"
              value={footerHtml}
              onChange={setFooterHtml}
              defaultHtml={DEFAULT_FOOTER_HTML}
            />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <FormControlLabel
              sx={{ mt: 1, ml: 0 }}
              control={
                <Checkbox
                  color="primary"
                  checked={headerEveryPage}
                  onChange={(_, checked) => setHeaderEveryPage(checked)}
                />
              }
              label="Every page"
            />
            <FormControlLabel
              sx={{ mt: 1, ml: 0 }}
              control={
                <Checkbox
                  color="primary"
                  checked={footerEveryPage}
                  onChange={(_, checked) => setFooterEveryPage(checked)}
                />
              }
              label="Every page"
            />
          </Box>
        </SettingsAccordion>
        <SettingsAccordion
          id="custom-css-injection"
          title="Custom CSS injection"
        >
          <HtmlGhostTextField
            id="custom-css-injection"
            label="CSS code (injected before conversion)"
            value={customCss}
            onChange={setCustomCss}
            defaultHtml={DEFAULT_CUSTOM_CSS}
          />
        </SettingsAccordion>
        <SettingsAccordion id="watermark-stamp" title="Watermark / stamp">
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
              <InputLabel id="watermark-type-label">Type</InputLabel>
              <Select
                labelId="watermark-type-label"
                id="watermark-type-select"
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
            {watermarkType === "image" && (
              <FormControl fullWidth size="small">
                <InputLabel id="watermark-position-label">Position</InputLabel>
                <Select
                  labelId="watermark-position-label"
                  id="watermark-position-select"
                  value={watermarkPosition}
                  label="Position"
                  onChange={handleWatermarkPositionChange}
                >
                  {WATERMARK_POSITION_OPTIONS.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          {watermarkType === "image" && (
            <Box>
              <SettingsOutlinedField
                id="watermark-image-url"
                label="Image URL (PNG/SVG recommended)"
                placeholder="https://example.com/watermark.png"
                fullWidth
                value={watermarkImageUrl}
                onChange={(e) => setWatermarkImageUrl(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 2,
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
                      onChange={(_, v) => setWatermarkImageScaleX(v as number)}
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
                      onChange={(_, v) => setWatermarkImageScaleY(v as number)}
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
                      onChange={(_, v) => setWatermarkImageOpacity(v as number)}
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
                      onChange={(_, v) =>
                        setWatermarkImageRotation(v as number)
                      }
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
            <Box>
              <SettingsOutlinedField
                id="watermark-text"
                label="Watermark text (5–25 letters or digits, a–z A–Z 0–9)"
                placeholder="SECRET01"
                fullWidth
                value={watermarkText}
                onChange={handleWatermarkTextInput}
                helperText={`${watermarkText.length}/25`}
              />

              <FormControl fullWidth size="small" sx={{ my: 2 }}>
                <InputLabel id="watermark-layout-label">Layout</InputLabel>
                <Select
                  labelId="watermark-layout-label"
                  id="watermark-layout-select"
                  value={watermarkTextLayout}
                  label="Layout"
                  onChange={handleWatermarkTextLayoutChange}
                >
                  {WATERMARK_TEXT_LAYOUT_OPTIONS.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr 1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "1fr 1fr",
                  },
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                <FormControl fullWidth size="small">
                  <InputLabel id="watermark-font-label">Font</InputLabel>
                  <Select
                    labelId="watermark-font-label"
                    id="watermark-font-select"
                    value={watermarkFont}
                    label="Font"
                    onChange={handleWatermarkFontChange}
                  >
                    {WATERMARK_FONT_OPTIONS.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <SettingsOutlinedField
                  id="watermark-text-size"
                  label="Size (px)"
                  value={watermarkTextSizePx}
                  onChange={handleWatermarkTextSizePxChange}
                  onBlur={handleWatermarkTextSizePxBlur}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
                <Box>
                  <Typography component="span" sx={watermarkFieldLabelSx}>
                    Color
                  </Typography>
                  <Box
                    component="input"
                    type="color"
                    value={watermarkTextColor}
                    onChange={(e) =>
                      setWatermarkTextColor(
                        (e.target as HTMLInputElement).value,
                      )
                    }
                    sx={{
                      display: "block",
                      width: 40,
                      height: 32,
                      p: 0,
                      mt: 0.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      cursor: "pointer",
                      bgcolor: "transparent",
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography component="span" sx={watermarkFieldLabelSx}>
                    Opacity
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Slider
                      value={watermarkTextOpacity}
                      min={0}
                      max={100}
                      onChange={(_, v) => setWatermarkTextOpacity(v as number)}
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
            </Box>
          )}
        </SettingsAccordion>
        <SettingsAccordion
          id="rights-encryption"
          title={"Rights management & encryption"}
        >
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="encryption-level-label">
              Encryption level
            </InputLabel>
            <Select
              labelId="encryption-level-label"
              id="encryption-level-select"
              value={encryptionLevel}
              label="Encryption level"
              onChange={handleEncryptionLevelChange}
            >
              {ENCRYPTION_LEVEL_OPTIONS.map((opt) => (
                <MenuItem key={opt.id} value={opt.id}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr " },
              gap: 2,
              mb: 2,
            }}
          >
            <SettingsOutlinedField
              id="user-password"
              label="User password"
              placeholder="Open password"
              fullWidth
              type="password"
              autoComplete="new-password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <SettingsOutlinedField
              id="owner-password"
              label="Owner password"
              placeholder="Permissions password"
              fullWidth
              type="password"
              autoComplete="new-password"
              value={ownerPassword}
              onChange={(e) => setOwnerPassword(e.target.value)}
            />
          </Box>

     

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              columnGap: 2,
              rowGap: 0.5,
            }}
          >
            {(
              [
                "disallowPrint",
                "disallowContentCopy",
                "disallowAnnotation",
                "disableEditingPdf",
              ] as RightsRestrictionId[]
            ).map((id) => (
              <FormControlLabel
                key={id}
                control={
                  <Checkbox
                    color="primary"
                    checked={rightsRestrictions[id]}
                    onChange={() => handleRightsRestrictionChange(id)}
                  />
                }
                label={RIGHTS_RESTRICTION_LABELS[id]}
                sx={{
                  m: 0,
                  alignItems: "center",
                  "& .MuiFormControlLabel-label": {
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.02,
                  },
                }}
              />
            ))}
          </Box>
        </SettingsAccordion>
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          pt: 0.8,
        }}
      >
        <SettingsOutlinedField
          id="output-file"
          label="Output File (optional)"
          placeholder="document.pdf"
          value={outputFileName}
          onChange={(e) => setOutputFileName(e.target.value)}
        />
      </Box>
    </Box>
  );
  },
);

URLtoPDF.displayName = "URLtoPDF";

export default URLtoPDF;

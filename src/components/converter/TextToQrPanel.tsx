import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { colors } from "@/utils/customColor";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { HtmlGhostTextField } from "./pdfSettings/HtmlGhostTextField";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import {
  buildTextToQrFormData,
  qrExportFormatToExt,
  type QrExportFormat,
  type TextToQrFormState,
} from "./textToQrPayload";

const PANEL_BG = "#ffffff";
const PANEL_BORDER = "#ececf2";

const fieldLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "#64748b",
  mb: 0.75,
  display: "block",
};

export type TextToQrHandle = {
  getPayload: () => FormData;
  getOutputFileName: () => string;
  getIsPreview: () => boolean;
  getOutputImageExt: () => ".jpg" | ".png" | ".webp";
};

type TextToQrPanelProps = {
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const TextToQrPanel = forwardRef<TextToQrHandle, TextToQrPanelProps>(
  function TextToQrPanel({ onValidityChange, onFieldsDirty }, ref) {
    const centerIconInputRef = useRef<HTMLInputElement | null>(null);
    const [centerIconFile, setCenterIconFile] = useState<File | null>(null);
    const [qrType, setQrType] = useState("raw");
    const [rawPayload, setRawPayload] = useState("");
    const [errorCorrection, setErrorCorrection] = useState("H");
    const [moduleBoxSize, setModuleBoxSize] = useState("10");
    const [quietBorder, setQuietBorder] = useState("1");
    const [paddingPx, setPaddingPx] = useState("0");
    const [marginTop, setMarginTop] = useState("0");
    const [marginRight, setMarginRight] = useState("0");
    const [marginBottom, setMarginBottom] = useState("0");
    const [marginLeft, setMarginLeft] = useState("0");
    const [logoSizeRatio, setLogoSizeRatio] = useState("0.22");
    const [logoPaddingPx, setLogoPaddingPx] = useState("0");
    const [logoPlateColor, setLogoPlateColor] = useState("#ffffff");
    const [centerImageUrl, setCenterImageUrl] = useState("");
    const [foreground, setForeground] = useState("#000000");
    const [background, setBackground] = useState("#ffffff");
    const [gradientSecondColor, setGradientSecondColor] = useState("#000000");
    const [gradientDirection, setGradientDirection] = useState("diagonal");
    const [moduleStyle, setModuleStyle] = useState("square");
    const [scanTracking, setScanTracking] = useState(false);
    const [utmMedium, setUtmMedium] = useState("physical");
    const [utmCampaign, setUtmCampaign] = useState("scan");
    const [colorOverlaysJson, setColorOverlaysJson] = useState("");
    const [outputWidthPx, setOutputWidthPx] = useState("");
    const [outputHeightPx, setOutputHeightPx] = useState("");
    const [outputName, setOutputName] = useState("");
    const [responseMode, setResponseMode] = useState<"download" | "preview">(
      "download",
    );
    const [exportFormat, setExportFormat] = useState<QrExportFormat>("png");

    const collectState = (): TextToQrFormState => ({
      qrType,
      rawPayload,
      errorCorrection,
      moduleBoxSize,
      quietBorder,
      paddingPx,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      logoSizeRatio,
      logoPaddingPx,
      logoPlateColor,
      centerImageUrl,
      foreground,
      background,
      gradientSecondColor,
      gradientDirection,
      moduleStyle,
      scanTracking,
      utmMedium,
      utmCampaign,
      colorOverlaysJson,
      outputWidthPx,
      outputHeightPx,
      outputName: outputName.trim() || "qr-out",
      mode: responseMode,
      exportFormat,
    });

    useImperativeHandle(
      ref,
      () => ({
        getPayload: () => buildTextToQrFormData(collectState(), centerIconFile),
        getOutputFileName: () => outputName.trim() || "qr-out",
        getIsPreview: () => responseMode === "preview",
        getOutputImageExt: () => qrExportFormatToExt(exportFormat),
      }),
      [centerIconFile, exportFormat, outputName, responseMode, rawPayload],
    );

    useEffect(() => {
      onValidityChange(rawPayload.trim().length > 0);
    }, [rawPayload, onValidityChange]);

    useEffect(() => {
      onFieldsDirty();
    }, [
      qrType,
      rawPayload,
      errorCorrection,
      moduleBoxSize,
      quietBorder,
      paddingPx,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      logoSizeRatio,
      logoPaddingPx,
      logoPlateColor,
      centerImageUrl,
      foreground,
      background,
      gradientSecondColor,
      gradientDirection,
      moduleStyle,
      scanTracking,
      utmMedium,
      utmCampaign,
      colorOverlaysJson,
      outputWidthPx,
      outputHeightPx,
      outputName,
      responseMode,
      exportFormat,
      centerIconFile,
      onFieldsDirty,
    ]);

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
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pb: 1 }}>
          <SettingsAccordion id="text-to-qr-content" title="Content" defaultExpanded>
            <Typography component="span" sx={fieldLabelSx}>
              QR type
            </Typography>
            <Select size="small" fullWidth value={qrType} onChange={(e) => setQrType(e.target.value)}>
              <MenuItem value="raw">Raw data</MenuItem>
              <MenuItem value="url">URL</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="phone">Phone</MenuItem>
            </Select>

            <Typography component="span" sx={{ ...fieldLabelSx, mt: 2 }}>
              Raw payload
            </Typography>
            <SettingsOutlinedField
              multiline
              minRows={3}
              placeholder="Any text / binary-safe UTF-8 string"
              value={rawPayload}
              onChange={(e) => setRawPayload(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
            />
          </SettingsAccordion>

          <SettingsAccordion id="text-to-qr-design" title="Design & export" defaultExpanded>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Error correction</Typography>
                <Select
                  size="small"
                  fullWidth
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value)}
                >
                  <MenuItem value="L">L (~7%)</MenuItem>
                  <MenuItem value="M">M (~15%)</MenuItem>
                  <MenuItem value="Q">Q (~25%)</MenuItem>
                  <MenuItem value="H">H (~30%)</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Module box size</Typography>
                <SettingsOutlinedField value={moduleBoxSize} onChange={(e) => setModuleBoxSize(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Quiet border (modules)</Typography>
                <SettingsOutlinedField value={quietBorder} onChange={(e) => setQuietBorder(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Padding (px)</Typography>
                <SettingsOutlinedField value={paddingPx} onChange={(e) => setPaddingPx(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Margin top</Typography>
                <SettingsOutlinedField value={marginTop} onChange={(e) => setMarginTop(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Margin right</Typography>
                <SettingsOutlinedField value={marginRight} onChange={(e) => setMarginRight(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Margin bottom</Typography>
                <SettingsOutlinedField value={marginBottom} onChange={(e) => setMarginBottom(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Margin left</Typography>
                <SettingsOutlinedField value={marginLeft} onChange={(e) => setMarginLeft(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Export format</Typography>
                <Select
                  size="small"
                  fullWidth
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as QrExportFormat)}
                >
                  <MenuItem value="png">PNG</MenuItem>
                  <MenuItem value="jpeg">JPEG</MenuItem>
                  <MenuItem value="webp">WebP</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Output width (px)</Typography>
                <SettingsOutlinedField placeholder="optional" value={outputWidthPx} onChange={(e) => setOutputWidthPx(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Output height (px)</Typography>
                <SettingsOutlinedField placeholder="optional" value={outputHeightPx} onChange={(e) => setOutputHeightPx(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Logo size ratio</Typography>
                <SettingsOutlinedField value={logoSizeRatio} onChange={(e) => setLogoSizeRatio(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Logo padding (px)</Typography>
                <SettingsOutlinedField value={logoPaddingPx} onChange={(e) => setLogoPaddingPx(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Logo plate color</Typography>
                <SettingsOutlinedField type="color" value={logoPlateColor} onChange={(e) => setLogoPlateColor(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Center image URL</Typography>
                <SettingsOutlinedField placeholder="https://.../icon.png (optional)" value={centerImageUrl} onChange={(e) => setCenterImageUrl(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Foreground</Typography>
                <SettingsOutlinedField type="color" value={foreground} onChange={(e) => setForeground(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Background</Typography>
                <SettingsOutlinedField type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Gradient 2nd color</Typography>
                <SettingsOutlinedField type="color" value={gradientSecondColor} onChange={(e) => setGradientSecondColor(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Gradient direction</Typography>
                <Select size="small" fullWidth value={gradientDirection} onChange={(e) => setGradientDirection(e.target.value)}>
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="horizontal">Horizontal</MenuItem>
                  <MenuItem value="vertical">Vertical</MenuItem>
                  <MenuItem value="diagonal">Diagonal</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Module style</Typography>
                <Select size="small" fullWidth value={moduleStyle} onChange={(e) => setModuleStyle(e.target.value)}>
                  <MenuItem value="square">Square</MenuItem>
                  <MenuItem value="dots">Dots</MenuItem>
                  <MenuItem value="rounded">Rounded</MenuItem>
                </Select>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox checked={scanTracking} onChange={(e) => setScanTracking(e.target.checked)} />
                }
                label="Scan tracking (URL mode: add UTM params)"
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, mt: 1 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>UTM_medium</Typography>
                <SettingsOutlinedField value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>UTM_campaign</Typography>
                <SettingsOutlinedField value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} />
              </Box>
            </Box>

            <Typography component="span" sx={{ ...fieldLabelSx, mt: 2 }}>
              Color overlays (JSON array, optional)
            </Typography>
            <HtmlGhostTextField
              id="text-to-qr-color-overlays"
              // label="Color overlays JSON"
              value={colorOverlaysJson}
              onChange={setColorOverlaysJson}
              defaultHtml='[{"color":"#880000","opacity":0.15,"blend":"multiply"}]'
              rows={1}
            />

            <Typography component="span" sx={{ ...fieldLabelSx, mt: 2 }}>
              Center icon upload (optional)
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => centerIconInputRef.current?.click()}
            >
              {centerIconFile ? centerIconFile.name : "Choose file"}
            </Button>
            <input
              ref={centerIconInputRef}
              type="file"
              hidden
              accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setCenterIconFile(f);
                e.currentTarget.value = "";
              }}
            />

            <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Output name</Typography>
                <SettingsOutlinedField value={outputName} placeholder="qr-out" onChange={(e) => setOutputName(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Response</Typography>
                <ToggleButtonGroup
                  color="primary"
                  exclusive
                  fullWidth
                  size="small"
                  value={responseMode}
                  onChange={(_, v: "download" | "preview" | null) => {
                    if (v) setResponseMode(v);
                  }}
                  sx={{
                    "& .MuiToggleButton-root": {
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#64748b",
                      borderColor: PANEL_BORDER,
                      bgcolor: PANEL_BG,
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
        </Box>
      </Box>
    );
  },
);

TextToQrPanel.displayName = "TextToQrPanel";

export default TextToQrPanel;

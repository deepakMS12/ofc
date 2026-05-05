import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { colors } from "@/utils/customColor";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import {
  barcodeExportFormatToExt,
  buildTextToBarcodeFormData,
  type BarcodeExportFormat,
  type TextToBarcodeFormState,
} from "./textToBarcodePayload";

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

export type TextToBarcodeHandle = {
  getPayload: () => FormData;
  getOutputFileName: () => string;
  getIsPreview: () => boolean;
  getOutputImageExt: () => ".jpg" | ".png" | ".webp";
};

type TextToBarcodePanelProps = {
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const TextToBarcodePanel = forwardRef<TextToBarcodeHandle, TextToBarcodePanelProps>(
  function TextToBarcodePanel({ onValidityChange, onFieldsDirty }, ref) {
    const [symbology, setSymbology] = useState("CODE128");
    const [moduleWidth, setModuleWidth] = useState("0.25");
    const [barHeight, setBarHeight] = useState("12");
    const [quietZone, setQuietZone] = useState("2.5");
    const [foreground, setForeground] = useState("#000000");
    const [background, setBackground] = useState("#ffffff");
    const [textSize, setTextSize] = useState("11");
    const [textDistance, setTextDistance] = useState("4");
    const [hideCaptionUnderBars, setHideCaptionUnderBars] = useState(false);
    const [widthPx, setWidthPx] = useState("");
    const [heightPx, setHeightPx] = useState("");
    const [paddingPx, setPaddingPx] = useState("0");
    const [marginTop, setMarginTop] = useState("0");
    const [marginRight, setMarginRight] = useState("0");
    const [marginBottom, setMarginBottom] = useState("0");
    const [marginLeft, setMarginLeft] = useState("0");
    const [exportFormat, setExportFormat] = useState<BarcodeExportFormat>("png");
    const [data, setData] = useState("");
    const [outputName, setOutputName] = useState("");
    const [responseMode, setResponseMode] = useState<"download" | "preview">(
      "download",
    );

    const collectState = (): TextToBarcodeFormState => ({
      symbology,
      moduleWidth,
      barHeight,
      quietZone,
      foreground,
      background,
      textSize,
      textDistance,
      hideCaptionUnderBars,
      widthPx,
      heightPx,
      paddingPx,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      exportFormat,
      data,
      outputName: outputName.trim() || "barcode",
      mode: responseMode,
    });

    useImperativeHandle(
      ref,
      () => ({
        getPayload: () => buildTextToBarcodeFormData(collectState()),
        getOutputFileName: () => outputName.trim() || "barcode",
        getIsPreview: () => responseMode === "preview",
        getOutputImageExt: () => barcodeExportFormatToExt(exportFormat),
      }),
      [outputName, responseMode, exportFormat, data],
    );

    useEffect(() => {
      onValidityChange(data.trim().length > 0);
    }, [data, onValidityChange]);

    useEffect(() => {
      onFieldsDirty();
    }, [
      symbology,
      moduleWidth,
      barHeight,
      quietZone,
      foreground,
      background,
      textSize,
      textDistance,
      hideCaptionUnderBars,
      widthPx,
      heightPx,
      paddingPx,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      exportFormat,
      data,
      outputName,
      responseMode,
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
          <Box
            sx={{
              fontSize: 12,
              color: "#1d4ed8",
              bgcolor: "#eef6ff",
              borderRadius: 1.5,
              px: 1.2,
              py: 0.9,
              mb: 1.2,
              border: "1px solid #dbeafe",
            }}
          >
            Rules: CODE128 max 80 ASCII. CODE39 max 43, A-Z 0-9 and -.$/+%. EAN-13 12 or 13 digits. EAN-8 7 or 8 digits. ITF 2-42 digits, even length. Codabar max 32, must start/end with A-D.
          </Box>

          <SettingsAccordion id="text-to-barcode" title="Barcode" defaultExpanded>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Symbology</Typography>
                <Select size="small" fullWidth value={symbology} onChange={(e) => setSymbology(e.target.value)}>
                  <MenuItem value="CODE128">CODE128</MenuItem>
                  <MenuItem value="CODE39">CODE39</MenuItem>
                  <MenuItem value="EAN13">EAN-13</MenuItem>
                  <MenuItem value="EAN8">EAN-8</MenuItem>
                  <MenuItem value="ITF">ITF</MenuItem>
                  <MenuItem value="CODABAR">Codabar</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Module width</Typography>
                <SettingsOutlinedField value={moduleWidth} onChange={(e) => setModuleWidth(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Bar height</Typography>
                <SettingsOutlinedField value={barHeight} onChange={(e) => setBarHeight(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Quiet zone</Typography>
                <SettingsOutlinedField value={quietZone} onChange={(e) => setQuietZone(e.target.value)} />
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
                <Typography component="span" sx={fieldLabelSx}>Text size (caption)</Typography>
                <SettingsOutlinedField value={textSize} onChange={(e) => setTextSize(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Text distance</Typography>
                <SettingsOutlinedField value={textDistance} onChange={(e) => setTextDistance(e.target.value)} />
              </Box>
            </Box>

            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hideCaptionUnderBars}
                    onChange={(e) => setHideCaptionUnderBars(e.target.checked)}
                  />
                }
                label="Hide caption under bars"
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, mt: 1 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Width (px)</Typography>
                <SettingsOutlinedField placeholder="optional" value={widthPx} onChange={(e) => setWidthPx(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Height (px)</Typography>
                <SettingsOutlinedField placeholder="optional" value={heightPx} onChange={(e) => setHeightPx(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Padding (px)</Typography>
                <SettingsOutlinedField value={paddingPx} onChange={(e) => setPaddingPx(e.target.value)} />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Margin T/R/B/L</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                  <SettingsOutlinedField value={marginTop} onChange={(e) => setMarginTop(e.target.value)} />
                  <SettingsOutlinedField value={marginRight} onChange={(e) => setMarginRight(e.target.value)} />
                  <SettingsOutlinedField value={marginBottom} onChange={(e) => setMarginBottom(e.target.value)} />
                  <SettingsOutlinedField value={marginLeft} onChange={(e) => setMarginLeft(e.target.value)} />
                </Box>
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Export</Typography>
                <Select
                  size="small"
                  fullWidth
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as BarcodeExportFormat)}
                >
                  <MenuItem value="png">PNG</MenuItem>
                  <MenuItem value="jpeg">JPEG</MenuItem>
                  <MenuItem value="webp">WebP</MenuItem>
                </Select>
              </Box>
            </Box>

            <Typography component="span" sx={{ ...fieldLabelSx, mt: 2 }}>Data *</Typography>
            <SettingsOutlinedField
              multiline
              minRows={3}
              placeholder="e.g. HELLO or EAN digits"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>Output name</Typography>
                <SettingsOutlinedField value={outputName} placeholder="barcode" onChange={(e) => setOutputName(e.target.value)} />
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

TextToBarcodePanel.displayName = "TextToBarcodePanel";

export default TextToBarcodePanel;

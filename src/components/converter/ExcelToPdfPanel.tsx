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
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { colors } from "@/utils/customColor";
import { buildExcelToPdfFormData } from "./excelToPdfPayload";
import type { EncryptionLevelId } from "./rightsEncryptionOptions";

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

export type ExcelToPdfHandle = {
  getPayload: (files: File[]) => FormData;
  getOutputFileName: () => string;
  getIsPreview: () => boolean;
};

type ExcelToPdfPanelProps = {
  selectedFileName?: string | null;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const ExcelToPdfPanel = forwardRef<ExcelToPdfHandle, ExcelToPdfPanelProps>(
  function ExcelToPdfPanel(
    { selectedFileName, onValidityChange, onFieldsDirty },
    ref,
  ) {
    const [responseMode, setResponseMode] = useState<"download" | "preview">(
      "download",
    );
    const [outputName, setOutputName] = useState("");
    const [scaling, setScaling] = useState("default");
    const [pageSize, setPageSize] = useState("A4");
    const [orientation, setOrientation] = useState("landscape");
    const [unit, setUnit] = useState("mm");
    const [marginTop, setMarginTop] = useState("12");
    const [marginRight, setMarginRight] = useState("12");
    const [marginBottom, setMarginBottom] = useState("12");
    const [marginLeft, setMarginLeft] = useState("12");
    const [watermarkType, setWatermarkType] = useState("image");
    const [watermarkPosition, setWatermarkPosition] = useState("middle-center");
    const [watermarkUrl, setWatermarkUrl] = useState("");
    const [stampText, setStampText] = useState("");
    const [simpleOpenPassword, setSimpleOpenPassword] = useState("");
    const [encryptionLevel, setEncryptionLevel] = useState<EncryptionLevelId>("none");
    const [userPassword, setUserPassword] = useState("");
    const [ownerPassword, setOwnerPassword] = useState("");
    const [disallowPrint, setDisallowPrint] = useState(false);
    const [disallowAnnotation, setDisallowAnnotation] = useState(false);
    const [disallowContentCopy, setDisallowContentCopy] = useState(false);
    const [disableEditingPdf, setDisableEditingPdf] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () => outputName.trim() || "report",
        getIsPreview: () => responseMode === "preview",
        getPayload: (files: File[]) => {
          const file = files[0];
          if (!file) {
            throw new Error("Select an Excel file first.");
          }
          return buildExcelToPdfFormData(
            file,
            {
              outputFileName: outputName,
              scaling,
              pageSize,
              orientation,
              marginTop,
              marginRight,
              marginBottom,
              marginLeft,
              watermarkType: watermarkType === "text" ? "text" : "image",
              watermarkPosition,
              watermarkUrl,
              stampText,
              simpleOpenPassword,
              encryptionLevel,
              userPassword,
              ownerPassword,
              disallowPrint,
              disallowAnnotation,
              disallowContentCopy,
              disableEditingPdf,
            },
          );
        },
      }),
      [
        outputName,
        responseMode,
        scaling,
        pageSize,
        orientation,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        watermarkType,
        watermarkPosition,
        watermarkUrl,
        stampText,
        simpleOpenPassword,
        encryptionLevel,
        userPassword,
        ownerPassword,
        disallowPrint,
        disallowAnnotation,
        disallowContentCopy,
        disableEditingPdf,
      ],
    );

    useEffect(() => {
      onValidityChange(Boolean(selectedFileName?.trim()));
    }, [selectedFileName, onValidityChange]);

    useEffect(() => {
      onFieldsDirty();
    }, [
      outputName,
      responseMode,
      scaling,
      pageSize,
      orientation,
      unit,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      watermarkType,
      watermarkPosition,
      watermarkUrl,
      stampText,
      simpleOpenPassword,
      encryptionLevel,
      userPassword,
      ownerPassword,
      disallowPrint,
      disallowAnnotation,
      disallowContentCopy,
      disableEditingPdf,
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
       
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pb: 1 }}>
          <SettingsAccordion id="excel-to-pdf-source" title="Source" defaultExpanded>
            <Typography component="span" sx={fieldLabelSx}>
              Response
            </Typography>
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
                mb: 2.5,
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
          </SettingsAccordion>

          <SettingsAccordion id="excel-to-pdf-layout" title="Layout">
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, mb: 2 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Scaling
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={scaling}
                  onChange={(e) => setScaling(e.target.value)}
                >
                  <MenuItem value="default">Default (flow across pages)</MenuItem>
                  <MenuItem value="fit-width">Fit width</MenuItem>
                  <MenuItem value="fit-page">Fit to one page</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Page size
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                >
                  <MenuItem value="A4">A4</MenuItem>
                  <MenuItem value="Letter">Letter</MenuItem>
                  <MenuItem value="Legal">Legal</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Orientation
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                >
                  <MenuItem value="landscape">Landscape</MenuItem>
                  <MenuItem value="portrait">Portrait</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Unit
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <MenuItem value="mm">mm</MenuItem>
                  <MenuItem value="cm">cm</MenuItem>
                  <MenuItem value="in">in</MenuItem>
                </Select>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Margin top
                </Typography>
                <SettingsOutlinedField
                  size="small"
                  value={marginTop}
                  onChange={(e) => setMarginTop(e.target.value)}
                />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Margin right
                </Typography>
                <SettingsOutlinedField
                  size="small"
                  value={marginRight}
                  onChange={(e) => setMarginRight(e.target.value)}
                />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Margin bottom
                </Typography>
                <SettingsOutlinedField
                  size="small"
                  value={marginBottom}
                  onChange={(e) => setMarginBottom(e.target.value)}
                />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Margin left
                </Typography>
                <SettingsOutlinedField
                  size="small"
                  value={marginLeft}
                  onChange={(e) => setMarginLeft(e.target.value)}
                />
              </Box>
            </Box>
          </SettingsAccordion>

          <SettingsAccordion id="excel-to-pdf-watermark" title="Watermark / stamp">
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, mb: 2 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Type
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={watermarkType}
                  onChange={(e) => setWatermarkType(e.target.value)}
                >
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Position
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={watermarkPosition}
                  onChange={(e) => setWatermarkPosition(e.target.value)}
                >
                  <MenuItem value="middle-center">Middle center</MenuItem>
                  <MenuItem value="top-left">Top left</MenuItem>
                  <MenuItem value="bottom-right">Bottom right</MenuItem>
                </Select>
              </Box>
            </Box>
            <Typography component="span" sx={fieldLabelSx}>
              Image URL
            </Typography>
            <SettingsOutlinedField
              size="small"
              placeholder="https://example.com/watermark.png"
              value={watermarkUrl}
              onChange={(e) => setWatermarkUrl(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography component="span" sx={fieldLabelSx}>
              Stamp
            </Typography>
            <SettingsOutlinedField
              size="small"
              placeholder="e.g. Internal use only"
              value={stampText}
              onChange={(e) => setStampText(e.target.value)}
            />
          </SettingsAccordion>

          <SettingsAccordion id="excel-to-pdf-rights" title="Rights management & encryption">
            <Typography component="span" sx={fieldLabelSx}>
              Simple open password
            </Typography>
            <SettingsOutlinedField
              size="small"
              type="password"
              autoComplete="new-password"
              placeholder="Optional — quick lock"
              value={simpleOpenPassword}
              onChange={(e) => setSimpleOpenPassword(e.target.value)}
              sx={{ mb: 2.5 }}
            />

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.25, mb: 1 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Encryption level
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={encryptionLevel}
                  onChange={(e) => setEncryptionLevel(e.target.value)}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="aes-128">AES-128</MenuItem>
                  <MenuItem value="aes-256">AES-256</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  User password
                </Typography>
                <SettingsOutlinedField
                  size="small"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Open password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Owner password
                </Typography>
                <SettingsOutlinedField
                  size="small"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Permissions password"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                />
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disallowPrint}
                    onChange={(e) => setDisallowPrint(e.target.checked)}
                    size="small"
                  />
                }
                label="Disallow print"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disallowContentCopy}
                    onChange={(e) => setDisallowContentCopy(e.target.checked)}
                    size="small"
                  />
                }
                label="Disallow content copy"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disallowAnnotation}
                    onChange={(e) => setDisallowAnnotation(e.target.checked)}
                    size="small"
                  />
                }
                label="Disallow annotation"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disableEditingPdf}
                    onChange={(e) => setDisableEditingPdf(e.target.checked)}
                    size="small"
                  />
                }
                label="Disable editing PDF"
              />
            </Box>
          </SettingsAccordion>

        </Box>

        <Box sx={{ flexShrink: 0, px: 2, pt: 0.8 }}>
          <Typography component="span" sx={fieldLabelSx}>
            Output name
          </Typography>
          <SettingsOutlinedField
            id="excel-to-pdf-output-name"
            placeholder="report"
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
          />
        </Box>
      </Box>
    );
  },
);

ExcelToPdfPanel.displayName = "ExcelToPdfPanel";

export default ExcelToPdfPanel;

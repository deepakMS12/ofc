import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { colors } from "@/utils/customColor";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import {
  buildScanQrUploadFormData,
  buildScanQrUrlBody,
  type ScanQrSourceMode,
} from "./scanQrBarcodePayload";

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

export type ScanQrBarcodeHandle = {
  getPayload: (files: File[]) => FormData | Record<string, string>;
  getOutputFileName: () => string;
  getIsPreview: () => boolean;
};

type ScanQrBarcodePanelProps = {
  mode: ScanQrSourceMode;
  selectedFileName?: string | null;
  onRequestPickFile?: () => void;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const ScanQrBarcodePanel = forwardRef<ScanQrBarcodeHandle, ScanQrBarcodePanelProps>(
  function ScanQrBarcodePanel(
    { mode, selectedFileName, onRequestPickFile, onValidityChange, onFieldsDirty },
    ref,
  ) {
    const [imageUrl, setImageUrl] = useState("");
    const [outputName, setOutputName] = useState("");
    const [responseMode, setResponseMode] = useState<"download" | "preview">(
      "download",
    );

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () => outputName.trim() || "scan-result",
        getIsPreview: () => responseMode === "preview",
        getPayload: (files: File[]) => {
          if (mode === "upload") {
            const file = files[0];
            if (!file) throw new Error("Select an image file first.");
            return buildScanQrUploadFormData(
              file,
              outputName,
              responseMode === "preview" ? "preview" : "download",
            );
          }
          if (!imageUrl.trim()) throw new Error("Image URL is required.");
          return buildScanQrUrlBody(
            imageUrl,
            outputName,
            responseMode === "preview" ? "preview" : "download",
          );
        },
      }),
      [imageUrl, mode, outputName, responseMode],
    );

    useEffect(() => {
      if (mode === "upload") {
        onValidityChange(Boolean(selectedFileName?.trim()));
      } else {
        onValidityChange(imageUrl.trim().length > 0);
      }
    }, [imageUrl, mode, onValidityChange, selectedFileName]);

    useEffect(() => {
      onFieldsDirty();
    }, [imageUrl, outputName, responseMode, selectedFileName, onFieldsDirty]);

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
          Linux servers need libzbar0 (Debian/Ubuntu) for pyzbar. If nothing is detected, try a higher-resolution crop of the code.
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pb: 1 }}>
          <SettingsAccordion id="scan-qr-source" title="Source" defaultExpanded>
            {mode === "upload" ? (
              <Box sx={{ mb: 2 }}>
                <Typography component="span" sx={fieldLabelSx}>
                  Image file
                </Typography>
                <Button variant="outlined" size="small" onClick={onRequestPickFile}>
                  {selectedFileName?.trim() || "Choose file"}
                </Button>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Typography component="span" sx={fieldLabelSx}>
                  Image URL *
                </Typography>
                <SettingsOutlinedField
                  placeholder="https://cdn.example.com/qr.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
                />
              </Box>
            )}

            <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column",  gap: 1.25 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  JSON file name (optional)
                </Typography>
                <SettingsOutlinedField
                  placeholder="scan-result"
                  value={outputName}
                  onChange={(e) => setOutputName(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
                />
              </Box>
              <Box>
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

ScanQrBarcodePanel.displayName = "ScanQrBarcodePanel";

export default ScanQrBarcodePanel;

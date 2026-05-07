import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { buildPdfToDocxFormData } from "./pdfToDocxPayload";

const PANEL_BG = "#ffffff";

const fieldLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "#64748b",
  mb: 0.75,
  display: "block",
};

export type PdfToDocxHandle = {
  getPayload: (files: File[]) => FormData;
  getOutputFileName: () => string;
  getIsPreview: () => boolean;
};

type PdfToDocxPanelProps = {
  selectedFileName?: string | null;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const PdfToDocxPanel = forwardRef<PdfToDocxHandle, PdfToDocxPanelProps>(
  function PdfToDocxPanel(
    { selectedFileName, onValidityChange, onFieldsDirty },
    ref,
  ) {
    const [pdfPassword, setPdfPassword] = useState("");
    const [isPreview, setIsPreview] = useState(false);
    const [outputName, setOutputName] = useState("");

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () => outputName.trim() || "document",
        getIsPreview: () => isPreview,
        getPayload: (files: File[]) => {
          const file = files[0];
          if (!file) {
            throw new Error("Select a PDF file first.");
          }
          return buildPdfToDocxFormData(
            file,
            outputName,
            pdfPassword,
          );
        },
      }),
      [outputName, pdfPassword, isPreview],
    );

    useEffect(() => {
      onValidityChange(Boolean(selectedFileName?.trim()));
    }, [selectedFileName, onValidityChange]);

    useEffect(() => {
      onFieldsDirty();
    }, [outputName, pdfPassword, isPreview, onFieldsDirty]);

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
          <SettingsAccordion
            id="pdf-to-docx-options"
            title="PDF password & preview"
            defaultExpanded
          >
            <Typography component="span" sx={fieldLabelSx}>
              PDF password
            </Typography>
            <SettingsOutlinedField
              id="pdf-to-docx-password"
              type="password"
              autoComplete="new-password"
              placeholder="Optional"
              value={pdfPassword}
              onChange={(e) => setPdfPassword(e.target.value)}
              sx={{ mt: 0.5, mb: 2, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPreview}
                  onChange={(_, checked) => setIsPreview(checked)}
                  size="small"
                />
              }
              label="Preview"
              sx={{
                m: 0,
                alignItems: "center",
                "& .MuiFormControlLabel-label": {
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                  pt: 0.2,
                },
              }}
            />
          </SettingsAccordion>
        </Box>

        <Box sx={{ flexShrink: 0, px: 2, pt: 0.8 }}>
          <Typography component="span" sx={fieldLabelSx}>
            Output name
          </Typography>
          <SettingsOutlinedField
            id="pdf-to-docx-output-name"
            placeholder="document"
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
          />
        </Box>
      </Box>
    );
  },
);

PdfToDocxPanel.displayName = "PdfToDocxPanel";

export default PdfToDocxPanel;

import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { colors } from "@/utils/customColor";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { buildPdfToHtmlFormData } from "./pdfToHtmlPayload";

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

export type PdfToHtmlHandle = {
  getPayload: (files: File[]) => FormData;
  getOutputFileName: () => string;
  getIsPreview: () => boolean;
};

type PdfToHtmlPanelProps = {
  selectedFileName?: string | null;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const PdfToHtmlPanel = forwardRef<PdfToHtmlHandle, PdfToHtmlPanelProps>(
  function PdfToHtmlPanel(
    { selectedFileName, onValidityChange, onFieldsDirty },
    ref,
  ) {
    const [pdfPassword, setPdfPassword] = useState("");
    const [outputName, setOutputName] = useState("");
    const [responseMode, setResponseMode] = useState<"download" | "preview">(
      "download",
    );

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () => outputName.trim() || "pages",
        getIsPreview: () => responseMode === "preview",
        getPayload: (files: File[]) => {
          const file = files[0];
          if (!file) throw new Error("Select a PDF file first.");
          return buildPdfToHtmlFormData(
            file,
            pdfPassword,
            outputName,
            responseMode === "preview" ? "preview" : "download",
          );
        },
      }),
      [outputName, pdfPassword, responseMode],
    );

    useEffect(() => {
      onValidityChange(Boolean(selectedFileName?.trim()));
    }, [selectedFileName, onValidityChange]);

    useEffect(() => {
      onFieldsDirty();
    }, [pdfPassword, outputName, responseMode, onFieldsDirty]);

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
          <SettingsAccordion id="pdf-to-html-source" title="Source" defaultExpanded>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mb: 1.25 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  PDF password
                </Typography>
                <SettingsOutlinedField
                  id="pdf-to-html-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Optional"
                  value={pdfPassword}
                  onChange={(e) => setPdfPassword(e.target.value)}
                  sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
                />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Output name
                </Typography>
                <SettingsOutlinedField
                  id="pdf-to-html-output"
                  placeholder="pages"
                  value={outputName}
                  onChange={(e) => setOutputName(e.target.value)}
                  sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
                />
              </Box>
            </Box>

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
          </SettingsAccordion>
        </Box>
      </Box>
    );
  },
);

PdfToHtmlPanel.displayName = "PdfToHtmlPanel";

export default PdfToHtmlPanel;

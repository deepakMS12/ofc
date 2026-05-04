import { Box, Typography } from "@mui/material";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { buildLockPdfRequestBody } from "./lockPdfPayload";

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

export type LockPdfHandle = {
  getPayload: () => Record<string, string>;
  getOutputFileName: () => string;
};

type LockPdfPanelProps = {
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const LockPdfPanel = forwardRef<LockPdfHandle, LockPdfPanelProps>(
  function LockPdfPanel({ onValidityChange, onFieldsDirty }, ref) {
    const [pdfUrl, setPdfUrl] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [outputFileName, setOutputFileName] = useState("");

    const collectState = useCallback(
      () => ({
        pdfUrl,
        userPassword,
        outputFileName,
      }),
      [pdfUrl, userPassword, outputFileName],
    );

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () => outputFileName.trim() || "locked",
        getPayload: () => buildLockPdfRequestBody(collectState()),
      }),
      [collectState, outputFileName],
    );

    useEffect(() => {
      onValidityChange(pdfUrl.trim().length > 0 && userPassword.trim().length > 0);
    }, [pdfUrl, userPassword, onValidityChange]);

    useEffect(() => {
      onFieldsDirty();
    }, [pdfUrl, userPassword, outputFileName, onFieldsDirty]);

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
          <SettingsAccordion id="lock-pdf-source" title="Source PDF" defaultExpanded>
            <Typography component="span" sx={fieldLabelSx}>
              PDF URL
            </Typography>
            <SettingsOutlinedField
              id="lock-pdf-url"
              placeholder="https://example.com/file.pdf"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
            />

            <Typography component="span" sx={fieldLabelSx}>
              User password
            </Typography>
            <SettingsOutlinedField
              id="lock-pdf-user-password"
              type="password"
              autoComplete="new-password"
              placeholder="Open password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
            />
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
            id="lock-pdf-output-file"
            label="Output File (optional)"
            placeholder="locked"
            value={outputFileName}
            onChange={(e) => setOutputFileName(e.target.value)}
          />
        </Box>
      </Box>
    );
  },
);

LockPdfPanel.displayName = "LockPdfPanel";

export default LockPdfPanel;

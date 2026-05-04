import { Box, Typography } from "@mui/material";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import {
  buildPdfUnlockUploadFormData,
  buildPdfUrlSecurityBody,
  type PdfUrlSecurityFormState,
  type PdfUrlSecurityMode,
} from "./pdfUrlSecurityPayload";

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

export type PdfUrlSecurityHandle = {
  getPayload: (files: File[]) => FormData | Record<string, string>;
  getOutputFileName: () => string;
};

type PdfUrlSecurityPanelProps = {
  mode: PdfUrlSecurityMode;
  selectedFileName?: string | null;
  onRequestPickFile?: () => void;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

function lockPanelConfig() {
  return {
    accordionId: "lock-pdf-source",
    accordionTitle: "Source PDF",
    passwordLabel: "User password",
    passwordPlaceholder: "Open password",
    outputPlaceholder: "locked",
    defaultOutput: "locked",
    passwordRequired: true,
  };
}

const PdfUrlSecurityPanel = forwardRef<PdfUrlSecurityHandle, PdfUrlSecurityPanelProps>(
  function PdfUrlSecurityPanel(
    { mode, selectedFileName, onValidityChange, onFieldsDirty },
    ref,
  ) {
    const isUnlock = mode === "unlock";
    const lockCfg = useMemo(() => lockPanelConfig(), []);

    const [pdfUrl, setPdfUrl] = useState("");
    const [password, setPassword] = useState("");
    const [outputFileName, setOutputFileName] = useState("");

    const collectLockState = useCallback(
      (): PdfUrlSecurityFormState => ({
        pdfUrl,
        password,
        outputFileName,
      }),
      [pdfUrl, password, outputFileName],
    );

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () =>
          outputFileName.trim() || (isUnlock ? "unlocked" : lockCfg.defaultOutput),
        getPayload: (files: File[]) => {
          if (isUnlock) {
            const file = files[0];
            if (!file) {
              throw new Error("Select a PDF file first.");
            }
            return buildPdfUnlockUploadFormData(file, password, outputFileName);
          }
          return buildPdfUrlSecurityBody("lock", collectLockState());
        },
      }),
      [collectLockState, isUnlock, lockCfg.defaultOutput, outputFileName, password],
    );

    useEffect(() => {
      if (isUnlock) {
        onValidityChange(Boolean(selectedFileName?.trim()));
      } else {
        const urlOk = pdfUrl.trim().length > 0;
        const pwdOk = lockCfg.passwordRequired ? password.trim().length > 0 : true;
        onValidityChange(urlOk && pwdOk);
      }
    }, [
      isUnlock,
      lockCfg.passwordRequired,
      onValidityChange,
      password,
      pdfUrl,
      selectedFileName,
    ]);

    useEffect(() => {
      onFieldsDirty();
    }, [pdfUrl, password, outputFileName, selectedFileName, onFieldsDirty]);

    if (isUnlock) {
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
            bgcolor: PANEL_BG,
            borderRadius: 2,
            border: `1px solid ${PANEL_BORDER}`,
            color: "#1e293b",
            "& .MuiAccordion-root": {
              bgcolor: PANEL_BG,
              color: "#1e293b",
              "&:before": { display: "none" },
            },
            "& .MuiAccordionSummary-root": { minHeight: 48 },
            "& .MuiAccordionDetails-root": { pt: 0 },
          }}
        >
          <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pb: 1 }}>
            <SettingsAccordion id="unlock-pdf-source" title="Source PDF" defaultExpanded>
          

              <Typography component="span" sx={fieldLabelSx}>
                Unlock password (optional)
              </Typography>
              <SettingsOutlinedField
                id="unlock-pdf-password"
                type="password"
                autoComplete="new-password"
                placeholder="Current PDF password — leave blank if not encrypted"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
              />
            </SettingsAccordion>
          </Box>

          <Box sx={{ flexShrink: 0, px: 2, pt: 0.8 }}>
            <SettingsOutlinedField
              id="unlock-pdf-output-file"
              label="Output File (optional)"
              placeholder="unlocked"
              value={outputFileName}
              onChange={(e) => setOutputFileName(e.target.value)}
            />
          </Box>
        </Box>
      );
    }

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
          bgcolor: PANEL_BG,
          borderRadius: 2,
          border: `1px solid ${PANEL_BORDER}`,
          color: "#1e293b",
          "& .MuiAccordion-root": {
            bgcolor: PANEL_BG,
            color: "#1e293b",
            "&:before": { display: "none" },
          },
          "& .MuiAccordionSummary-root": { minHeight: 48 },
          "& .MuiAccordionDetails-root": { pt: 0 },
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pb: 1 }}>
          <SettingsAccordion
            id={lockCfg.accordionId}
            title={lockCfg.accordionTitle}
            defaultExpanded
          >
            <Typography component="span" sx={fieldLabelSx}>
              PDF URL
            </Typography>
            <SettingsOutlinedField
              id={`${lockCfg.accordionId}-url`}
              placeholder="https://example.com/file.pdf"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
            />

            <Typography component="span" sx={fieldLabelSx}>
              {lockCfg.passwordLabel}
            </Typography>
            <SettingsOutlinedField
              id={`${lockCfg.accordionId}-password`}
              type="password"
              autoComplete="new-password"
              placeholder={lockCfg.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
            />
          </SettingsAccordion>
        </Box>

        <Box sx={{ flexShrink: 0, px: 2, pt: 0.8 }}>
          <SettingsOutlinedField
            id={`${lockCfg.accordionId}-output-file`}
            label="Output File (optional)"
            placeholder={lockCfg.outputPlaceholder}
            value={outputFileName}
            onChange={(e) => setOutputFileName(e.target.value)}
          />
        </Box>
      </Box>
    );
  },
);

PdfUrlSecurityPanel.displayName = "PdfUrlSecurityPanel";

export default PdfUrlSecurityPanel;

export function pdfUrlSecuritySlugToMode(
  slug?: string,
): PdfUrlSecurityMode | null {
  if (slug === "lock-pdf") return "lock";
  if (slug === "unlock-pdf") return "unlock";
  return null;
}

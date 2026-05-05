import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { colors } from "@/utils/customColor";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { buildLockExcelFormData } from "./lockExcelPayload";

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

export type LockExcelHandle = {
  getPayload: (files: File[]) => FormData;
  getOutputFileName: () => string;
  getIsPreview: () => boolean;
};

type LockExcelPanelProps = {
  selectedFileName?: string | null;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const LockExcelPanel = forwardRef<LockExcelHandle, LockExcelPanelProps>(
  function LockExcelPanel(
    { selectedFileName, onValidityChange, onFieldsDirty },
    ref,
  ) {
    const [sheetPassword, setSheetPassword] = useState("");
    const [outputName, setOutputName] = useState("");
    const [responseMode, setResponseMode] = useState<"download" | "preview">(
      "download",
    );

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () => outputName.trim() || "locked",
        getIsPreview: () => responseMode === "preview",
        getPayload: (files: File[]) => {
          const file = files[0];
          if (!file) throw new Error("Select an Excel file first.");
          if (!sheetPassword.trim()) throw new Error("Sheet password is required.");
          return buildLockExcelFormData(
            file,
            sheetPassword,
            outputName,
            responseMode === "preview" ? "preview" : "download",
          );
        },
      }),
      [outputName, responseMode, sheetPassword],
    );

    useEffect(() => {
      onValidityChange(Boolean(selectedFileName?.trim()) && sheetPassword.trim().length > 0);
    }, [selectedFileName, sheetPassword, onValidityChange]);

    useEffect(() => {
      onFieldsDirty();
    }, [sheetPassword, outputName, responseMode, onFieldsDirty]);

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
          <SettingsAccordion id="lock-excel-source" title="Source" defaultExpanded>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mb: 1.25 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Sheet password
                </Typography>
                <SettingsOutlinedField
                  id="lock-excel-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Required"
                  value={sheetPassword}
                  onChange={(e) => setSheetPassword(e.target.value)}
                  sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
                />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Output name
                </Typography>
                <SettingsOutlinedField
                  id="lock-excel-output"
                  placeholder="locked"
                  value={outputName}
                  onChange={(e) => setOutputName(e.target.value)}
                  sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
                />
              </Box>
            </Box>

            <Typography sx={{ fontSize: 12, color: "#64748b", mb: 2 }}>
              Legacy sheet protection only. Unlock with the same password on the Unlock Excel page or in Excel.
            </Typography>

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

LockExcelPanel.displayName = "LockExcelPanel";

export default LockExcelPanel;

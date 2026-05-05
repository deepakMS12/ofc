import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { colors } from "@/utils/customColor";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { buildUnlockExcelFormData } from "./unlockExcelPayload";

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

export type UnlockExcelHandle = {
  getPayload: (files: File[]) => FormData;
  getOutputFileName: () => string;
  getIsPreview: () => boolean;
};

type UnlockExcelPanelProps = {
  selectedFileName?: string | null;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const UnlockExcelPanel = forwardRef<UnlockExcelHandle, UnlockExcelPanelProps>(
  function UnlockExcelPanel(
    { selectedFileName, onValidityChange, onFieldsDirty },
    ref,
  ) {
    const [currentSheetPassword, setCurrentSheetPassword] = useState("");
    const [outputName, setOutputName] = useState("");
    const [responseMode, setResponseMode] = useState<"download" | "preview">(
      "download",
    );

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () => outputName.trim() || "unlocked",
        getIsPreview: () => responseMode === "preview",
        getPayload: (files: File[]) => {
          const file = files[0];
          if (!file) throw new Error("Select an Excel file first.");
          return buildUnlockExcelFormData(
            file,
            currentSheetPassword,
            outputName,
            responseMode === "preview" ? "preview" : "download",
          );
        },
      }),
      [currentSheetPassword, outputName, responseMode],
    );

    useEffect(() => {
      onValidityChange(Boolean(selectedFileName?.trim()));
    }, [selectedFileName, onValidityChange]);

    useEffect(() => {
      onFieldsDirty();
    }, [currentSheetPassword, outputName, responseMode, onFieldsDirty]);

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
          <SettingsAccordion id="unlock-excel-source" title="Source" defaultExpanded>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mb: 1.25 }}>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Current sheet password
                </Typography>
                <SettingsOutlinedField
                  id="unlock-excel-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Leave empty if none"
                  value={currentSheetPassword}
                  onChange={(e) => setCurrentSheetPassword(e.target.value)}
                  sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG } }}
                />
              </Box>
              <Box>
                <Typography component="span" sx={fieldLabelSx}>
                  Output name
                </Typography>
                <SettingsOutlinedField
                  id="unlock-excel-output"
                  placeholder="unlocked"
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

UnlockExcelPanel.displayName = "UnlockExcelPanel";

export default UnlockExcelPanel;

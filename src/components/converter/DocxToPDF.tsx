import { forwardRef, useImperativeHandle, useState } from "react";
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";

export type DocxToPdfHandle = {
  getOutputFileName: () => string;
  getPayload: () => {
    queryType: "p";
    body: FormData;
  };
};

type DocxToPDFProps = {
  selectedFile?: File | null;
};

const DocxToPDF = forwardRef<DocxToPdfHandle, DocxToPDFProps>(function DocxToPDF(
  { selectedFile },
  ref,
) {
  const [outputFileName, setOutputFileName] = useState("converted");
  const [lockPassword, setLockPassword] = useState("");
  const [mode, setMode] = useState<"download" | "preview">("download");

  useImperativeHandle(
    ref,
    () => ({
      getOutputFileName: () => outputFileName,
      getPayload: () => {
        if (!selectedFile) throw new Error("Select a DOCX / DOC file first.");
        const formData = new FormData();
        formData.append("file", selectedFile);
        if (outputFileName.trim()) formData.append("outputFileName", outputFileName.trim());
        if (lockPassword.trim()) formData.append("lockPassword", lockPassword.trim());
        formData.append("mode", mode);
        return { queryType: "p", body: formData };
      },
    }),
    [lockPassword, mode, outputFileName, selectedFile],
  );

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
        <SettingsAccordion id="docx-settings" title="Settings" defaultExpanded>
          <Stack spacing={1.8}>
            <Typography sx={{ fontSize: 12, color: "#64748b" }}>
              DOCX / DOC FILE (max 5 MB) is selected from right-side canvas.
            </Typography>

            <SettingsOutlinedField
              id="docx-lock-password"
              label="Lock password (optional)"
              value={lockPassword}
              onChange={(e) => setLockPassword(e.target.value)}
              placeholder="Leave blank to skip"
              type="password"
              fullWidth
            />

            <ToggleButtonGroup
              size="small"
              color="primary"
              exclusive
              value={mode}
              onChange={(_, value) => {
                if (value) setMode(value);
              }}
            >
              <ToggleButton value="download">Download</ToggleButton>
              <ToggleButton value="preview">Preview</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
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
          id="docx-output-file-name"
          label="Output File (optional)"
          placeholder="converted.pdf"
          value={outputFileName}
          onChange={(e) => setOutputFileName(e.target.value)}
        />
      </Box>
    </Box>
  );
});

export default DocxToPDF;


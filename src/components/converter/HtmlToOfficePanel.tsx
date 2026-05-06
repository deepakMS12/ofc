import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { colors } from "@/utils/customColor";
import {
  buildHtmlToExcelFormData,
  buildHtmlToWordFormData,
  type HtmlOfficeTarget,
} from "./htmlToOfficePayload";

/** Light panel chrome — aligned with URLtoPDF / white sidebar (no dark theme). */
const PANEL_BG = "#ffffff";
const PANEL_BORDER = "#ececf2";


const footerLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "#64748b",
  mb: 0.75,
  display: "block",
};

export type HtmlToOfficeHandle = {
  getPayload: (files: File[]) => FormData;
  getOutputFileName: () => string;
  getIsPreview: () => boolean;
};

type HtmlToOfficePanelProps = {
  target: HtmlOfficeTarget;
  selectedFileName?: string | null;
  onRequestPickFile: () => void;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const HtmlToOfficePanel = forwardRef<
  HtmlToOfficeHandle,
  HtmlToOfficePanelProps
>(function HtmlToOfficePanel(
  {
    target,
    selectedFileName,
    onValidityChange,
    onFieldsDirty,
  },
  ref,
) {
  const [baseName, setBaseName] = useState("");
  const [responseMode, setResponseMode] = useState<"download" | "preview">(
    "download",
  );

  useImperativeHandle(
    ref,
    () => ({
      getOutputFileName: () => baseName.trim() || "output",
      getIsPreview: () => responseMode === "preview",
      getPayload: (files: File[]) => {
        const file = files[0];
        if (!file) {
          throw new Error("Select an HTML file first.");
        }
        if (target === "word") {
          return buildHtmlToWordFormData(file, baseName);
        }
        return buildHtmlToExcelFormData(file, baseName);
      },
    }),
    [baseName, responseMode, target],
  );

  useEffect(() => {
    onValidityChange(Boolean(selectedFileName?.trim()));
  }, [selectedFileName, onValidityChange]);

    useEffect(() => {
      onFieldsDirty();
    }, [baseName, responseMode, onFieldsDirty]);


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 340px)",
        maxHeight: "100%",
        minHeight: 0,
        width: "100%",
        // overflow: "hidden",
        // bgcolor: PANEL_BG,
        // borderRadius: 2,
        // border: `1px solid ${PANEL_BORDER}`,
        // color: "#1e293b",
        // "& .MuiAccordion-root": {
        //   bgcolor: PANEL_BG,
        //   color: "#1e293b",
        //   "&:before": { display: "none" },
        // },
        // "& .MuiAccordionSummary-root": { minHeight: 48 },
        // "& .MuiAccordionDetails-root": { pt: 0 },
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", px: 2, pb: 1 }}>
        <SettingsAccordion
          id={`html-office-${target}-source`}
          title={"Source"}
          defaultExpanded
        >
          <Box sx={{ flex: 1, minWidth: 0, mb: 2 }}>
            <Typography component="span" sx={footerLabelSx}>
              Base name (optional)
            </Typography>
            <SettingsOutlinedField
              id={`html-office-${target}-basename`}
              placeholder="output"
              value={baseName}
              onChange={(e) => setBaseName(e.target.value)}
              slotProps={{
                htmlInput: { "aria-label": "Base output file name" },
              }}
              sx={{
                mt: 0.5,
                "& .MuiOutlinedInput-root": { bgcolor: PANEL_BG },
              }}
            />
          </Box>
          <Box
            sx={{
              flexShrink: 0,
              minWidth: { sm: 220 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Typography component="span" sx={footerLabelSx}>
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
                mt: 0.5,
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
        </SettingsAccordion>
      </Box>
    </Box>
  );
});

HtmlToOfficePanel.displayName = "HtmlToOfficePanel";

export default HtmlToOfficePanel;

export function htmlOfficeSlugToTarget(slug?: string): HtmlOfficeTarget | null {
  if (slug === "html-to-word") return "word";
  if (slug === "html-to-excel") return "excel";
  return null;
}

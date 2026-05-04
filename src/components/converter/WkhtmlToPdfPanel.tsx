import {
  Box,
  Checkbox,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { HtmlGhostTextField } from "./pdfSettings/HtmlGhostTextField";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import {
  buildWkhtmlPayload,
  type WkhtmlFormState,
  type WkhtmlUrlLoadMode,
  type WkhtmlVariant,
} from "./wkhtmlToPdfPayload";
import type { UrlToPdfQueryType } from "./urlToPdfPayload";

export type WkhtmlToPdfHandle = {
  getPayload: (
    files: File[],
  ) => { queryType: UrlToPdfQueryType; body: Record<string, unknown> | FormData };
  getOutputFileName: () => string;
};

const fieldLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: 0.02,
  color: "text.secondary",
  mb: 0.5,
  display: "block",
};

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Typography component="span" sx={fieldLabelSx}>
      {children}
    </Typography>
  );
}

type WkhtmlToPdfPanelProps = {
  variant: WkhtmlVariant;
  selectedFileName?: string | null;
  onRequestPickFile?: () => void;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const URL_LOAD_HELP: Record<WkhtmlUrlLoadMode, string> = {
  auto: "Try server fetch first; if blocked, fall back to direct rendering when available.",
  server_fetch:
    "Let the conversion service retrieve the page (best for many public sites).",
  direct_qt:
    "Use embedded WebKit-style rendering for the URL (useful when server fetch is blocked).",
};

const DEFAULT_WKHTML_HTML_GHOST = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <h1>Hello</h1>
  </body>
</html>`;

const WkhtmlToPdfPanel = forwardRef<WkhtmlToPdfHandle, WkhtmlToPdfPanelProps>(
  function WkhtmlToPdfPanel(
    {
      variant,
      selectedFileName,
      onValidityChange,
      onFieldsDirty,
    },
    ref,
  ) {
    const [url, setUrl] = useState("");
    const [urlLoadMode, setUrlLoadMode] = useState<WkhtmlUrlLoadMode>("auto");
    const [html, setHtml] = useState("");
    const [baseUrl, setBaseUrl] = useState("");
    const [outputName, setOutputName] = useState("");
    const [pdfPassword, setPdfPassword] = useState("");
    const [isPreview, setIsPreview] = useState(true);

    const collectState = useCallback((): WkhtmlFormState => {
      return {
        variant,
        url,
        urlLoadMode,
        html,
        baseUrl,
        outputName,
        pdfPassword,
      };
    }, [variant, url, urlLoadMode, html, baseUrl, outputName, pdfPassword]);

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () => outputName.trim() || "export",
        getPayload: (files: File[]) => {
          const queryType: UrlToPdfQueryType = isPreview ? "d" : "p";
          return {
            queryType,
            body: buildWkhtmlPayload(collectState(), queryType, files),
          };
        },
      }),
      [collectState, outputName, isPreview],
    );

    useEffect(() => {
      let ok = false;
      if (variant === "url") ok = url.trim().length > 0;
      else if (variant === "html-code") ok = html.trim().length > 0;
      else ok = Boolean(selectedFileName?.trim());
      onValidityChange(ok);
    }, [variant, url, html, selectedFileName, onValidityChange]);

    useEffect(() => {
      onFieldsDirty();
    }, [
      url,
      urlLoadMode,
      html,
      baseUrl,
      outputName,
      pdfPassword,
      isPreview,
      onFieldsDirty,
    ]);

    const handleUrlLoadMode = (_: unknown, v: WkhtmlUrlLoadMode | null) => {
      if (v) setUrlLoadMode(v);
    };

    const shell = (scrollChildren: ReactNode) => (
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
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            pb: 1,
          }}
        >
          {scrollChildren}
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            px: 2,
            pt: 0.8,
          }}
        >
          <SettingsOutlinedField
            id="wkhtml-output-file"
            label="Output File (optional)"
            placeholder="document.pdf"
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
          />
        </Box>
      </Box>
    );

    const previewCheckbox = (
      <FormControlLabel
        sx={{ mt: 1, ml: 0, alignItems: "center" }}
        control={
          <Checkbox
            color="primary"
            checked={isPreview}
            onChange={(_, checked) => setIsPreview(checked)}
          />
        }
        label="Preview"
      />
    );

    if (variant === "url") {
      return shell(
        <>
          <SettingsAccordion id="wkhtml-url-source" title="Source" defaultExpanded>
            <SettingsOutlinedField
              id="wkhtml-url-value"
              label="URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Box sx={{ mt: 2 }}>
              <FieldLabel>URL load mode</FieldLabel>
              <ToggleButtonGroup
                color="primary"
                exclusive
                fullWidth
                size="small"
                value={urlLoadMode}
                onChange={handleUrlLoadMode}
                sx={{ mt: 0.5 }}
              >
                <ToggleButton value="auto">Auto</ToggleButton>
                <ToggleButton value="server_fetch">Server fetch</ToggleButton>
                <ToggleButton value="direct_qt">Direct (Qt)</ToggleButton>
              </ToggleButtonGroup>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 1.25, lineHeight: 1.55 }}
              >
                {URL_LOAD_HELP[urlLoadMode]}
              </Typography>
            </Box>
            {previewCheckbox}
            <SettingsOutlinedField
              id="wkhtml-url-pdf-password"
              sx={{ mt: 2 }}
              label="PDF password (optional)"
              type="password"
              autoComplete="new-password"
              value={pdfPassword}
              onChange={(e) => setPdfPassword(e.target.value)}
            />
          </SettingsAccordion>
        </>,
      );
    }

    if (variant === "html-code") {
      return shell(
        <>
          <SettingsAccordion id="wkhtml-html-source" title="HTML" defaultExpanded>
            <HtmlGhostTextField
              id="wkhtml-html-body"
              label="HTML"
              value={html}
              onChange={setHtml}
              defaultHtml={DEFAULT_WKHTML_HTML_GHOST}
              rows={1}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mt: 2,
              }}
            >
              <SettingsOutlinedField
                id="wkhtml-html-base-url"
                label="Base URL (optional)"
                placeholder="https://cdn.example.com/"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
              <SettingsOutlinedField
                id="wkhtml-html-pdf-password"
                label="PDF password (optional)"
                type="password"
                autoComplete="new-password"
                value={pdfPassword}
                onChange={(e) => setPdfPassword(e.target.value)}
              />
            </Box>
            {previewCheckbox}
          </SettingsAccordion>
        </>,
      );
    }

    return shell(
      <>
        <SettingsAccordion id="wkhtml-file-source" title="HTML file" defaultExpanded>
      
          <SettingsOutlinedField
            id="wkhtml-file-base-url"
            sx={{ mt: 2 }}
            label="Base URL (optional)"
            placeholder="for relative assets"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
          />
          <SettingsOutlinedField
            id="wkhtml-file-pdf-password"
            sx={{ mt: 2 }}
            label="PDF password (optional)"
            type="password"
            autoComplete="new-password"
            value={pdfPassword}
            onChange={(e) => setPdfPassword(e.target.value)}
          />
          {previewCheckbox}
        </SettingsAccordion>
      </>,
    );
  },
);

WkhtmlToPdfPanel.displayName = "WkhtmlToPdfPanel";

export default WkhtmlToPdfPanel;

export function wkhtmlSlugToVariant(slug?: string): WkhtmlVariant | null {
  if (slug === "wkhtmltopdf-by-url") return "url";
  if (slug === "wkhtmltopdf-by-html-code") return "html-code";
  if (slug === "wkhtmltopdf-by-html-file") return "html-file";
  return null;
}

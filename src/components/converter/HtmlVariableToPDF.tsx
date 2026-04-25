import { forwardRef, useImperativeHandle, useState } from "react";
import { Box, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { HtmlGhostTextField } from "./pdfSettings/HtmlGhostTextField";

export type HtmlVariableToPdfHandle = {
  getOutputFileName: () => string;
  getPayload: () => {
    queryType: "p";
    body: Record<string, unknown>;
  };
};

const DEFAULT_VARIABLES_JSON = `{
  "customerName": "John Doe",
  "invoiceNo": "INV-2026-001",
  "invoiceDate": "2026-04-23",
  "totalAmount": "75.00"
}`;

const DEFAULT_TABLES_JSON = `[
  {
    "placeholder": "itemsTable",
    "headers": ["Item", "Qty", "Price"],
    "columnStyles": {
      "Item": { "width": "260px" },
      "Qty": { "width": "80px", "height": "34px" },
      "Price": { "width": "120px" }
    },
    "headerHeight": "38px",
    "rowHeight": "32px",
    "rows": [
      { "Item": "Pen", "Qty": 2, "Price": "10.00" },
      { "Item": "Notebook", "Qty": 1, "Price": "55.00" }
    ]
  }
]`;

const HtmlVariableToPDF = forwardRef<HtmlVariableToPdfHandle>(function HtmlVariableToPDF(
  _,
  ref,
) {
  const [templateFileName, setTemplateFileName] = useState("sample-invoice.html");
  const [outputFileName, setOutputFileName] = useState("invoice-apr");
  const [lockPassword, setLockPassword] = useState("");
  const [variablesJson, setVariablesJson] = useState("");
  const [tablesJson, setTablesJson] = useState("");
  const [mode, setMode] = useState<"download" | "preview">("download");

  useImperativeHandle(
    ref,
    () => ({
      getOutputFileName: () => outputFileName,
      getPayload: () => {
        const template = templateFileName.trim();
        if (!template) {
          throw new Error("Template file name is required.");
        }

        let parsedVariables: unknown = {};
        let parsedTables: unknown = [];

        try {
          parsedVariables = variablesJson.trim() ? JSON.parse(variablesJson) : {};
        } catch {
          throw new Error("Variables JSON is invalid.");
        }
        try {
          parsedTables = tablesJson.trim() ? JSON.parse(tablesJson) : [];
        } catch {
          throw new Error("Tables JSON is invalid.");
        }

        return {
          queryType: "p" as const,
          body: {
            template,
            outputFileName: outputFileName.trim() || undefined,
            lockPassword: lockPassword.trim() || undefined,
            mode,
            variables: parsedVariables,
            tables: parsedTables,
          },
        };
      },
    }),
    [lockPassword, mode, outputFileName, tablesJson, templateFileName, variablesJson],
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
        <SettingsAccordion id="template-output" title="Template + output" defaultExpanded>
          
          <Stack spacing={1.6}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1.2,
              }}
            >
              <SettingsOutlinedField
                id="template-file-name"
                label="Template file name"
                value={templateFileName}
                onChange={(e) => setTemplateFileName(e.target.value)}
                placeholder="Doc ID"
                fullWidth
              />
            </Box>
            <SettingsOutlinedField
              id="template-lock-password"
              label="Lock password (optional)"
              value={lockPassword}
              onChange={(e) => setLockPassword(e.target.value)}
              placeholder="Leave blank to skip"
              type="password"
              fullWidth
            />
            <FormControlLabel
              sx={{ ml: 0 }}
              control={
                <Checkbox
                  color="primary"
                  checked={mode === "preview"}
                  onChange={(_, checked) =>
                    setMode(checked ? "preview" : "download")
                  }
                />
              }
              label="Preview"
            />
          </Stack>
        </SettingsAccordion>

        <SettingsAccordion id="variables-json" title="Variables JSON" >
          <HtmlGhostTextField
            id="variables-json"
            label="Variables JSON"
            value={variablesJson}
            onChange={setVariablesJson}
            defaultHtml={DEFAULT_VARIABLES_JSON}
            textareaResize="none"
      
          />
        </SettingsAccordion>

        <SettingsAccordion id="tables-json" title="Tables JSON" >
          <HtmlGhostTextField
            id="tables-json"
            label="Tables JSON"
            value={tablesJson}
            onChange={setTablesJson}
            defaultHtml={DEFAULT_TABLES_JSON}
            textareaResize="none"
            
         
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
          id="html-variable-output-file"
          label="Output File (optional)"
          placeholder="invoice-apr.pdf"
          value={outputFileName}
          onChange={(e) => setOutputFileName(e.target.value)}
        />
      </Box>
    </Box>
  );
});

export default HtmlVariableToPDF;


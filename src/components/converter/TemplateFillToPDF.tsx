import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { HtmlGhostTextField } from "./pdfSettings/HtmlGhostTextField";

const DEFAULT_VARIABLE_LINES = `COMPANY_NAME = Acme Corp
REPORT_DATE = 09 Apr 2025
AUDIT_PERIOD = Q1 2025
AUDITOR_NAME = Jane Smith
AUDIT_FIRM = TrustAudit LLP
REPORT_ID = SOC2-2025-042
OVERALL_RISK = Low`;

const DEFAULT_TABLE_ROWS_JSON = `[
  {
    "table_index": 1,
    "rows": [
      {"ControlID":"CC6.1","Category":"Access","Description":"MFA enforced","Status":"Effective","Note":"Verified"},
      {"ControlID":"CC7.1","Category":"Ops","Description":"Vuln scanning","Status":"Effective","Note":"Qualys"}
    ]
  },
  {
    "table_index": 2,
    "rows": [
      {"Risk":"R-101","Likelihood":"Low","Impact":"Medium","Owner":"SecOps"}
    ]
  }
]`;

export default function TemplateFillToPDF() {
  const [outputFileName, setOutputFileName] = useState("");
  const [variableLines, setVariableLines] = useState("");
  const [tableRowsJson, setTableRowsJson] = useState("");

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
        <SettingsAccordion id="template-fill-source" title="Source template" defaultExpanded>
          <Box sx={{ display: "grid", gap: 1.2 }}>
            <SettingsOutlinedField
              id="template-fill-docx-url"
              label="DOCX template URL"
              placeholder="https://your-server.com/template.docx"
              fullWidth
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr" },
                gap: 1.2,
              }}
            >
              <SettingsOutlinedField
                id="template-fill-lock-password"
                label="Lock password (optional)"
                placeholder="Leave blank to skip"
                type="password"
                fullWidth
              />
            </Box>
          </Box>
        </SettingsAccordion>

        <SettingsAccordion id="template-fill-variables" title="Variables" defaultExpanded>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: "1px solid #dbe2ee",
              bgcolor: "#f7f9fc",
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
              One variable per line: <strong>TOKEN_NAME = value</strong>
            </Typography>
          </Box>
          <HtmlGhostTextField
            id="template-fill-variables-lines"
            label="Variables"
            value={variableLines}
            onChange={setVariableLines}
            defaultHtml={DEFAULT_VARIABLE_LINES}
     
          />
        </SettingsAccordion>

        <SettingsAccordion id="template-fill-table-rows" title="Table rows" >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: "1px solid #dbe2ee",
              bgcolor: "#f7f9fc",
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
              JSON array of table injection specs. Each spec needs a{" "}
              <strong>table_index</strong> (0-based) and a <strong>rows</strong> array.
              The engine removes the {"{{token}}"} placeholder row automatically.
            </Typography>
          </Box>
          <HtmlGhostTextField
            id="template-fill-table-rows-json"
            label="Table rows JSON"
            value={tableRowsJson}
            onChange={setTableRowsJson}
            defaultHtml={DEFAULT_TABLE_ROWS_JSON}
         
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
          id="template-fill-output-name"
          label="Output File (optional)"
          placeholder="filled-report.pdf"
          value={outputFileName}
          onChange={(e) => setOutputFileName(e.target.value)}
        />
      </Box>
    </Box>
  );
}


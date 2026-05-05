import { Box, TextField } from "@mui/material";
import type { CSSProperties } from "react";

export type HtmlGhostTextFieldProps = {
  id: string;
  label?: string;
  value: string;
  onChange: (next: string) => void;
  defaultHtml: string;
  rows?: number;
  textareaResize?: CSSProperties["resize"];
};

/** Multiline field with non-selectable placeholder “ghost” until the user types. */
export function HtmlGhostTextField({
  id,
  label,
  value,
  onChange,
  defaultHtml,
  rows = 1,
  textareaResize = "vertical",
}: HtmlGhostTextFieldProps) {
  const showGhost = value.trim() === "";

  return (
    <Box sx={{ position: "relative" }}>
      {showGhost && (
        <Box
          aria-hidden
          component="pre"
          sx={(theme) => ({
            position: "absolute",
            inset: 0,
            pt: "8px",
            px: 1.75,
            pb: 1,
            zIndex: 0,
            m: 0,
            color: theme.palette.text.disabled,
            fontSize: 12,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            userSelect: "none",
            pointerEvents: "none",
            overflow: "hidden",
          })}
        >
          {defaultHtml}
        </Box>
      )}
      <TextField
        id={id}
        variant="outlined"
        label={label}
        fullWidth
        multiline
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        slotProps={{
          htmlInput: {
            spellCheck: false,
            autoCapitalize: "off",
            autoCorrect: "off",
          },
        }}
        sx={{
          position: "relative",
          zIndex: 1,
          "& .MuiInputBase-root": { alignItems: "flex-start" },
          "& .MuiInputBase-inputMultiline": (theme) => ({
            color: showGhost ? "transparent" : theme.palette.text.primary,
            caretColor: theme.palette.primary.main,
          }),
          "& textarea": {
            display: "block",
            resize: textareaResize,
            minHeight: 120,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: 12,
          },
        }}
      />
    </Box>
  );
}

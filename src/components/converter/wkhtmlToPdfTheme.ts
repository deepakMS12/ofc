/** Shared dark-panel tokens for wkhtmltopdf converter UIs (matches product reference). */
export const WK_BG = "#16161e";
export const WK_SURFACE = "#1e1f2a";
export const WK_INPUT_BG = "#252836";
export const WK_BORDER = "rgba(148, 163, 184, 0.22)";
export const WK_LABEL = "rgba(226, 232, 240, 0.68)";
export const WK_ACCENT = "#7c3aed";
export const WK_MUTED_TEXT = "rgba(203, 213, 225, 0.85)";

export const wkhtmlFieldLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: WK_LABEL,
  mb: 0.75,
  display: "block",
};

export const wkhtmlOutlinedInputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: WK_INPUT_BG,
    color: "#f8fafc",
    "& fieldset": { borderColor: WK_BORDER },
    "&:hover fieldset": { borderColor: "rgba(148,163,184,0.45)" },
    "&.Mui-focused fieldset": { borderColor: WK_ACCENT },
  },
  "& .MuiInputLabel-root": { color: WK_LABEL },
  "& input, & textarea": { color: "#f8fafc" },
  "& input::placeholder, & textarea::placeholder": {
    color: "rgba(148,163,184,0.75)",
    opacity: 1,
  },
};

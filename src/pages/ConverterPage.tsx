import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Stack,
  TextField,
  type SxProps,
  type Theme,
} from "@mui/material";
import Converter from "./Converter";
import { OFC_CONVERTER_AUTH_TOKEN_LS_KEY } from "@/lib/api/urlToPdfClient";
import { useConverterSearch } from "@/contexts/ConverterSearchContext";

const muiOutlinedFieldSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e5e7eb",
    },
    "&:hover:not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "primary.main",
  },
};

function normalizeStoredConverterToken(raw: string): string {
  return raw.replace(/^Bearer\s+/i, "").trim();
}

const ConverterPage = () => {
  const { query, filteredSections } = useConverterSearch();
  const [converterAuthToken, setConverterAuthToken] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(OFC_CONVERTER_AUTH_TOKEN_LS_KEY);
    setConverterAuthToken(saved ? normalizeStoredConverterToken(saved) : "");
  }, []);

  return (
    <Stack spacing={0}>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: 4,
          pt: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            maxWidth: 420,
          }}
        >
          <TextField
            size="small"
            fullWidth
            type="password"
            label="Authorization"
            value={converterAuthToken}
            onChange={(e) => {
              const next = normalizeStoredConverterToken(e.target.value);
              setConverterAuthToken(next);
              if (next) {
                localStorage.setItem(OFC_CONVERTER_AUTH_TOKEN_LS_KEY, next);
              } else {
                localStorage.removeItem(OFC_CONVERTER_AUTH_TOKEN_LS_KEY);
              }
            }}
            slotProps={{
              input: {
                onCopy: (e: React.ClipboardEvent) => {
                  e.preventDefault();
                },
                onCut: (e: React.ClipboardEvent) => {
                  e.preventDefault();
                },
                sx: {
                  fontSize: 13,
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  pl: 0.5,
                },
              },
            }}
            sx={muiOutlinedFieldSx}
          />
        </Box>
      </Box>

      {filteredSections.map((section) => (
        <Converter
          key={section.id}
          title={section.title}
          converters={section.converters}
        />
      ))}

      {filteredSections.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No converters found for "{query}". Try a different keyword.
        </Alert>
      )}
    </Stack>
  );
};

export default ConverterPage;

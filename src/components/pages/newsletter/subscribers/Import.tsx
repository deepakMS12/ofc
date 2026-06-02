import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { FileText, Upload } from "lucide-react";
import { colors } from "@/utils/customColor";

export default function SubscriberImport() {
  const [mode, setMode] = useState<"subscribe" | "blocklist">("subscribe");
  const [status, setStatus] = useState<"unconfirmed" | "confirmed">("unconfirmed");
  const [overwriteInfo, setOverwriteInfo] = useState(false);
  const [overwriteStatus, setOverwriteStatus] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  return (
    <Box sx={{ p: "20px" }}>
      <Typography variant="h5" fontWeight={700} color="#1a1a1a" mb={3}>
        Import subscribers
      </Typography>

      <Paper elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 1, p: 3, maxWidth: 860 }}>

        {/* Row 1: Mode + Status + CSV delimiter */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", gap: 4, mb: 3, alignItems: "start" }}>

          {/* Mode */}
          <Box>
            <Typography sx={{ fontSize: "0.8125rem", color: "#888", mb: 0.75 }}>Mode</Typography>
            <RadioGroup
              value={mode}
              onChange={(e) => setMode(e.target.value as typeof mode)}
            >
              <FormControlLabel
                value="subscribe"
                control={<Radio size="small" sx={{ color: colors.primary, "&.Mui-checked": { color: colors.primary } }} />}
                label={<Typography fontSize="0.875rem">Subscribe</Typography>}
              />
              <FormControlLabel
                value="blocklist"
                control={<Radio size="small" sx={{ color: colors.primary, "&.Mui-checked": { color: colors.primary } }} />}
                label={<Typography fontSize="0.875rem">Blocklist</Typography>}
              />
            </RadioGroup>
          </Box>

          {/* Status */}
          <Box>
            <Typography sx={{ fontSize: "0.8125rem", color: "#888", mb: 0.75 }}>Status</Typography>
            <RadioGroup
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              <FormControlLabel
                value="unconfirmed"
                control={<Radio size="small" sx={{ color: colors.primary, "&.Mui-checked": { color: colors.primary } }} />}
                label={<Typography fontSize="0.875rem">Unconfirmed</Typography>}
              />
              <FormControlLabel
                value="confirmed"
                control={<Radio size="small" sx={{ color: colors.primary, "&.Mui-checked": { color: colors.primary } }} />}
                label={<Typography fontSize="0.875rem">Confirmed</Typography>}
              />
            </RadioGroup>
          </Box>

          {/* CSV delimiter */}
          <Box>
            <Typography sx={{ fontSize: "0.8125rem", color: "#888", mb: 0.75 }}>CSV delimiter</Typography>
            <TextField
              size="small"
              defaultValue=","
              sx={{ width: 80 }}
              inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
            />
            <Typography sx={{ fontSize: "0.75rem", color: "#aaa", mt: 0.75 }}>
              Default delimiter is comma.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#f0f0f0", mb: 3 }} />

        {/* Row 2: Toggles */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, mb: 3 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Switch
                size="small"
                checked={overwriteInfo}
                onChange={(e) => setOverwriteInfo(e.target.checked)}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: colors.primary }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: colors.primary } }}
              />
              <Typography fontSize="0.875rem" fontWeight={500}>Overwrite user info</Typography>
            </Box>
            <Typography fontSize="0.8rem" color="#888">
              Overwrite name and attributes of existing subscribers
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Switch
                size="small"
                checked={overwriteStatus}
                onChange={(e) => setOverwriteStatus(e.target.checked)}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: colors.primary }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: colors.primary } }}
              />
              <Typography fontSize="0.875rem" fontWeight={500}>Overwrite subscription status</Typography>
            </Box>
            <Typography fontSize="0.8rem" color="#888">
              Overwrite status of existing list subscriptions
            </Typography>
          </Box>
        </Box>

        {/* Lists field */}
        <Box
          sx={{
            border: "1px solid #d0d0d0",
            borderRadius: 1,
            p: 1.5,
            mb: 3,
            position: "relative",
          }}
        >
          <Typography
            sx={{
              position: "absolute",
              top: -10,
              left: 10,
              bgcolor: "#fff",
              px: 0.75,
              fontSize: "0.8rem",
              color: "#888",
            }}
          >
            Lists (0)
          </Typography>
          <TextField
            placeholder="Lists to subscribe to."
            size="small"
            fullWidth
            variant="standard"
            slotProps={{ input: { disableUnderline: true, style: { fontSize: "0.875rem" } } }}
          />
          <Typography sx={{ fontSize: "0.75rem", color: "#888", mt: 0.5 }}>
            Lists to subscribe to.
          </Typography>
        </Box>

        {/* File upload zone */}
        <Box
          sx={{
            border: `1.5px dashed ${dragOver ? colors.primary : "#ccc"}`,
            borderRadius: 1,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: dragOver ? `${colors.primary}06` : "#fff",
            transition: "all 0.15s",
            mb: 2,
            position: "relative",
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => document.getElementById("nl-file-input")?.click()}
        >
          <input
            id="nl-file-input"
            type="file"
            accept=".csv,.zip"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {/* dashed border label */}
          <Typography
            sx={{
              position: "absolute",
              top: -10,
              left: 10,
              bgcolor: "#fff",
              px: 0.75,
              fontSize: "0.8rem",
              color: "#888",
            }}
          >
            CSV or ZIP file
          </Typography>
          <FileText size={26} color="#ccc" strokeWidth={1.25} style={{ marginBottom: 8 }} />
          {file ? (
            <Typography sx={{ fontSize: "0.875rem", color: colors.primary, fontWeight: 500 }}>
              {file.name}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: "0.875rem", color: colors.primary }}>
              Click or drag a CSV or ZIP file here
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={<Upload size={15} />}
          disabled={!file}
          sx={{
            bgcolor: colors.primary,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1,
            mb: 0.5,
            "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)" },
            "&.Mui-disabled": { bgcolor: "#e0e0e0", color: "#aaa" },
          }}
        >
          Upload
        </Button>
      </Paper>

      {/* Instructions */}
      <Box sx={{ mt: 3, maxWidth: 860 }}>
        <Typography fontWeight={700} color="#1a1a1a" mb={1}>
          Instructions
        </Typography>
        <Typography fontSize="0.875rem" color="#555" mb={1.5}>
          Upload a CSV file or a ZIP file with a single CSV file in it to bulk import subscribers.
          The CSV file should have the following headers with the exact column names.{" "}
          <Box component="span" sx={{ color: "#555" }}>
            attributes (optional) should be a valid JSON string with double escaped quotes.
          </Box>
        </Typography>
        <Box
          component="code"
          sx={{
            display: "block",
            bgcolor: "#f5f5f5",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            px: 2,
            py: 1.25,
            fontSize: "0.8125rem",
            color: "#333",
            fontFamily: "monospace",
            mb: 3,
          }}
        >
          email, name, attributes
        </Box>

        <Typography fontWeight={700} color="#1a1a1a" mb={1}>
          Example raw CSV
        </Typography>
        <Box
          component="pre"
          sx={{
            bgcolor: "#f5f5f5",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            px: 2,
            py: 1.5,
            fontSize: "0.8rem",
            color: "#333",
            fontFamily: "monospace",
            overflowX: "auto",
            m: 0,
          }}
        >
          {`email,name,attributes\nuser1@mail.com,"User One","{\\"age\\": 42, \\"planet\\": \\"Mars\\"}"\nuser2@mail.com,"User Two","{\\"age\\": 24, \\"job\\": \\"Time Traveller\\"}"`}
        </Box>
      </Box>
    </Box>
  );
}

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";
import { AlignLeft, Archive, Braces, Rocket } from "lucide-react";
import EmailBuilder from "./EmailBuilder";
import { colors } from "@/utils/customColor";

/* ── Helpers ── */
const TAG_COLORS = [
  { bg: "#e3f2fd", text: "#1565c0" },
  { bg: "#fce4ec", text: "#b71c1c" },
  { bg: "#e8f5e9", text: "#1b5e20" },
  { bg: "#fff3e0", text: "#e65100" },
  { bg: "#f3e5f5", text: "#4a148c" },
  { bg: "#e0f2f1", text: "#004d40" },
  { bg: "#fff8e1", text: "#f57f17" },
  { bg: "#e8eaf6", text: "#1a237e" },
];

function TagsInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");

  const addTag = (val: string) => {
    const tag = val.trim().replace(/,+$/, "");
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input.replace(/,$/, ""));
    } else if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid #c4c4c4",
        borderRadius: 1,
        px: 1.25,
        py: 0.625,
        display: "flex",
        flexWrap: "wrap",
        gap: 0.625,
        alignItems: "center",
        minHeight: 40,
        cursor: "text",
        "&:focus-within": { borderColor: colors.primary, borderWidth: "2px", m: "-1px" },
      }}
      onClick={() => document.getElementById("tag-input")?.focus()}
    >
      {tags.map((tag, i) => {
        const c = TAG_COLORS[i % TAG_COLORS.length];
        return (
          <Chip
            key={tag}
            label={tag}
            size="small"
            onDelete={() => onChange(tags.filter((_, idx) => idx !== i))}
            sx={{ bgcolor: c.bg, color: c.text, fontWeight: 500, fontSize: "0.78rem", height: 22, border: `1px solid ${c.text}22` }}
          />
        );
      })}
      <Box
        component="input"
        id="tag-input"
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value;
          if (v.endsWith(",")) { addTag(v.slice(0, -1)); return; }
          setInput(v);
        }}
        onKeyDown={handleKey}
        onBlur={() => { if (input.trim()) addTag(input); }}
        placeholder={tags.length === 0 ? "Add tags… press Enter or comma" : ""}
        sx={{ border: "none", outline: "none", flex: 1, minWidth: 120, fontSize: "0.875rem", bgcolor: "transparent", color: "#333", "::placeholder": { color: "#aaa" } }}
      />
    </Box>
  );
}

/* ── Tab panel ── */
function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

/* ── Campaign tab ── */
function CampaignTab({ format, onFormatChange }: { format: "rich" | "plain"; onFormatChange: (f: "rich" | "plain") => void }) {
  const [sendLater, setSendLater] = useState(false);
  const [scheduleAt, setScheduleAt] = useState<Dayjs | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, maxWidth: 680 }}>
      <TextField label="Name" placeholder="Campaign name" size="small" fullWidth InputLabelProps={{ shrink: true }} />
      <TextField label="Subject" placeholder="Email subject line" size="small" fullWidth InputLabelProps={{ shrink: true }} />
      <TextField label="From address" defaultValue="newsletter <noreply@yoursite.com>" size="small" fullWidth InputLabelProps={{ shrink: true }} />

      {/* Lists */}
      <Box sx={{ border: "1px solid #c4c4c4", borderRadius: 1, px: 1.75, py: 1, position: "relative", "&:hover": { borderColor: "#333" } }}>
        <Typography sx={{ position: "absolute", top: -9, left: 10, bgcolor: "#fff", px: 0.5, fontSize: "0.75rem", color: "#666" }}>Lists (0)</Typography>
        <TextField placeholder="Lists to send to" variant="standard" fullWidth size="small" slotProps={{ input: { disableUnderline: true, style: { fontSize: "0.875rem" } } }} />
      </Box>

      {/* Format */}
      <Box>
        <Typography sx={{ fontSize: "0.75rem", color: "#666", mb: 0.75 }}>Format</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {(["rich", "plain"] as const).map((f) => (
            <Box
              key={f}
              component="button"
              onClick={() => onFormatChange(f)}
              sx={{
                px: 2, py: 0.875, border: `1.5px solid ${format === f ? colors.primary : "#e0e0e0"}`,
                borderRadius: 1, cursor: "pointer", bgcolor: format === f ? `${colors.primary}10` : "#fff",
                color: format === f ? colors.primary : "#555", fontWeight: format === f ? 600 : 400,
                fontSize: "0.875rem", transition: "all 0.15s",
                "&:hover": { borderColor: colors.primary },
              }}
            >
              {f === "rich" ? "Rich Editor" : "Plain Text"}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Tags */}
      <Box>
        <Typography sx={{ fontSize: "0.75rem", color: "#666", mb: 0.75 }}>Tags</Typography>
        <TagsInput tags={tags} onChange={setTags} />
      </Box>

      {/* Send later */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: sendLater ? 1.5 : 0 }}>
          <Typography sx={{ fontSize: "0.875rem", color: "#444", fontWeight: 500 }}>Send later</Typography>
          <Box
            component="button"
            role="switch"
            aria-checked={sendLater}
            onClick={() => setSendLater((v) => !v)}
            sx={{
              width: 38, height: 22, borderRadius: 11, bgcolor: sendLater ? colors.primary : "#ccc",
              border: "none", cursor: "pointer", position: "relative", transition: "background-color 0.2s",
              "&::after": { content: '""', position: "absolute", top: 2, left: sendLater ? 18 : 2, width: 18, height: 18, borderRadius: "50%", bgcolor: "#fff", transition: "left 0.2s" },
            }}
          />
        </Box>

        {sendLater && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Schedule date & time"
              value={scheduleAt}
              onChange={(val) => setScheduleAt(val)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: { maxWidth: 340 },
                },
              }}
            />
          </LocalizationProvider>
        )}
      </Box>

      <Divider sx={{ borderColor: "#f0f0f0" }} />

      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{ bgcolor: colors.primary, textTransform: "none", fontWeight: 600, borderRadius: 1, px: 3, "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)" } }}
        >
          Continue
        </Button>
        <Button variant="outlined" sx={{ textTransform: "none", borderColor: "#e0e0e0", color: "#555", borderRadius: 1 }}>
          Save draft
        </Button>
      </Box>
    </Box>
  );
}

/* ── Attributes tab ── */
function AttributesTab() {
  return (
    <Box sx={{ maxWidth: 680 }}>
      <Typography color="#888" fontSize="0.875rem" mb={2}>
        Set custom attributes and headers to attach to this campaign.
      </Typography>
      <TextField label="Custom Attributes (JSON)" multiline rows={6} fullWidth placeholder="{}" size="small" />
    </Box>
  );
}

/* ── Archive tab ── */
function ArchiveTab() {
  return (
    <Box sx={{ maxWidth: 680 }}>
      <Typography color="#888" fontSize="0.875rem" mb={2}>
        Configure the public archive page settings for this campaign.
      </Typography>
      <TextField label="Archive slug" size="small" fullWidth placeholder="my-campaign" />
    </Box>
  );
}

/* ── Main ── */
export default function CreateNew() {
  const [tab, setTab] = useState(0);
  const [format, setFormat] = useState<"rich" | "plain">("rich");

  const tabs = [
    { label: "Campaign",   icon: <Rocket size={15} /> },
    { label: "Content",    icon: <AlignLeft size={15} /> },
    { label: "Attributes", icon: <Braces size={15} /> },
    { label: "Archive",    icon: <Archive size={15} /> },
  ];

  return (
    <Box sx={{ p: "20px" }}>
      <Typography variant="h5" fontWeight={700} color="#1a1a1a" mb={3}>
        New campaign
      </Typography>

      <Paper elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 1, overflow: "hidden" }}>
        {/* Tabs */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: "1px solid #e8e8e8", "& .MuiTabs-indicator": { bgcolor: colors.primary }, px: 1 }}
        >
          {tabs.map((t, i) => (
            <Tab key={t.label} value={i} label={t.label} icon={t.icon} iconPosition="start"
              sx={{ textTransform: "none", fontSize: "0.875rem", minHeight: 48, color: tab === i ? colors.primary : "#666", "&.Mui-selected": { color: colors.primary, fontWeight: 600 }, gap: 0.75 }}
            />
          ))}
        </Tabs>

        {/* Content tab: full-width builder */}
        {tab === 1 ? (
          <Box sx={{ borderTop: "1px solid #f0f0f0" }}>
            {format === "rich" ? (
              <EmailBuilder />
            ) : (
              <Box sx={{ p: 3 }}>
                <Typography fontSize="0.875rem" color="#666" mb={1.5}>Plain text content</Typography>
                <TextField
                  multiline rows={14} fullWidth size="small"
                  placeholder="Write your plain text email here…"
                  sx={{ fontFamily: "monospace" }}
                />
                <Button variant="contained" sx={{ mt: 2, bgcolor: colors.primary, textTransform: "none", fontWeight: 600, borderRadius: 1, "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)" } }}>
                  Save
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            <TabPanel value={tab} index={0}>
              <CampaignTab format={format} onFormatChange={setFormat} />
            </TabPanel>
            <TabPanel value={tab} index={2}><AttributesTab /></TabPanel>
            <TabPanel value={tab} index={3}><ArchiveTab /></TabPanel>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

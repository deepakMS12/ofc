import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import HttpsIcon from "@mui/icons-material/Https";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ArrowBigRight } from "lucide-react";
import { colors } from "@/utils/customColor";

const SSL_HEADER_BG = "#586382";
const SSL_HEADER_IMAGE = "/assets/images/ssl-header.svg";
const HERO_STEPS_IMAGE = "/assets/images/hero_steps.svg";
const HERO_BLUE = "#1156a6";
const SSL_MANAGE_PATH = "/home/ssl-manage";
const DASHBOARD_HASH = "dashboard";
const STATUS_DRAWER_PAGE_SIZE = 2;

type DummyCert = {
  domain: string;
  type: "90-Day" | "Annual";
  issued: string;
  expires: string;
};

const dummyCertsByStatus: Record<CertStatus, DummyCert[]> = {
  "Expiring Soon": [
    { domain: "shop.mystore.com", type: "90-Day", issued: "2026-02-18", expires: "2026-05-19" },
    { domain: "api.mystore.com", type: "Annual", issued: "2025-05-20", expires: "2026-05-20" },
  ],
  Draft: [
    { domain: "beta.example.com", type: "90-Day", issued: "—", expires: "—" },
  ],
  Issued: [
    { domain: "example.com", type: "90-Day", issued: "2026-03-01", expires: "2026-05-30" },
    { domain: "www.example.com", type: "Annual", issued: "2025-06-01", expires: "2026-06-01" },
    { domain: "mail.example.com", type: "90-Day", issued: "2026-04-01", expires: "2026-06-30" },
  ],
  "Pending Validation": [
    { domain: "new-site.io", type: "90-Day", issued: "—", expires: "—" },
    { domain: "*.newproject.dev", type: "Annual", issued: "—", expires: "—" },
  ],
  Expired: [
    { domain: "old-blog.net", type: "Annual", issued: "2024-05-01", expires: "2025-05-01" },
    { domain: "legacy.company.com", type: "90-Day", issued: "2025-01-10", expires: "2025-04-10" },
  ],
};

type CertStatus =
  | "Expiring Soon"
  | "Draft"
  | "Issued"
  | "Pending Validation"
  | "Expired";

type ActiveDrawer =
  | { type: "status"; status: CertStatus }
  | { type: "create" }
  | null;

const statusMeta: Record<
  CertStatus,
  { icon: ReactNode; iconBg: string; iconColor: string }
> = {
  "Expiring Soon": {
    icon: <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />,
    iconBg: "#fff3e0",
    iconColor: "#e65100",
  },
  Draft: {
    icon: <EditOutlinedIcon sx={{ fontSize: 22 }} />,
    iconBg: "#e3f2fd",
    iconColor: "#1565c0",
  },
  Issued: {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 22 }} />,
    iconBg: "#e8f5e9",
    iconColor: "#2e7d32",
  },
  "Pending Validation": {
    icon: <RemoveCircleOutlineIcon sx={{ fontSize: 22 }} />,
    iconBg: "#fff8e1",
    iconColor: "#f9a825",
  },
  Expired: {
    icon: <CancelOutlinedIcon sx={{ fontSize: 22 }} />,
    iconBg: "#ffebee",
    iconColor: "#c62828",
  },
};

const statusOrder: CertStatus[] = ["Issued", "Expiring Soon", "Expired"];

const TOOL_NAV = [
  { hash: "ssl-verify",   label: "SSL Verify"   },
  { hash: "csr-decoder",  label: "CSR Decoder"  },
  { hash: "cert-decoder", label: "Cert Decoder" },
  { hash: "key-matcher",  label: "Key Matcher"  },
] as const;

const headlineBlockSx = {
  display: "inline-block",
  bgcolor: HERO_BLUE,
  color: "#fff",
  fontWeight: 700,
  fontSize: { xs: 26, sm: 32, md: 36 },
  lineHeight: 1.15,
  px: 1.5,
  py: 0.5,
  mb: 0.75,
  borderRadius: 0.5,
} as const;

/* ── Status Card ── */

function StatusCard({
  label,
  onViewAll,
}: {
  label: CertStatus;
  onViewAll: () => void;
}) {
  const { icon, iconBg, iconColor } = statusMeta[label];
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: { xs: "100%", sm: 0 },
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: 2.5,
          pb: 2,
          flex: 1,
          minHeight: { xs: 100, md: 118 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: iconBg,
            color: iconColor,
            mb: 1.5,
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#333" }}>
          {label}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link
          component="button"
          underline="none"
          onClick={onViewAll}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            fontSize: 13,
            fontWeight: 600,
            color: colors.primary,
            cursor: "pointer",
            background: "none",
            border: "none",
            "&:hover": { color: colors.primary },
          }}
        >
          View All
          <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Link>
      </Box>
    </Box>
  );
}

/* ── Status Drawer ── */

function StatusDrawer({
  open,
  status,
  onClose,
}: {
  open: boolean;
  status: CertStatus;
  onClose: () => void;
}) {
  const { icon, iconBg, iconColor } = statusMeta[status];
  const [page, setPage] = useState(1);
  const certs = dummyCertsByStatus[status];
  const totalPages = Math.max(1, Math.ceil(certs.length / STATUS_DRAWER_PAGE_SIZE));
  const pageCerts = certs.slice(
    (page - 1) * STATUS_DRAWER_PAGE_SIZE,
    page * STATUS_DRAWER_PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [status, open]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: "75%", maxWidth: "90vw" } }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: iconBg,
                color: iconColor,
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
              {status}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#666" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", p: 4, backgroundColor: "#fafafa" }}>
          <Box sx={{ maxWidth: 900, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {certs.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  py: 6,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: iconBg,
                    color: iconColor,
                    "& svg": { fontSize: 38 },
                  }}
                >
                  {icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>
                  No {status} Certificates
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", maxWidth: 320 }}>
                  You don't have any certificates with "{status}" status right now.
                </Typography>
              </Box>
            ) : (
              pageCerts.map((cert, i) => (
                <Paper
                  key={`${cert.domain}-${(page - 1) * STATUS_DRAWER_PAGE_SIZE + i}`}
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    borderColor: "#e0e0e0",
                    p: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    bgcolor: "#fff",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: iconBg,
                        color: iconColor,
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1a1a2e",
                          fontFamily: "monospace",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cert.domain}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#888", mt: 0.25 }}>
                        Issued: {cert.issued} · Expires: {cert.expires}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      flexShrink: 0,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 0.75,
                      bgcolor: iconBg,
                      color: iconColor,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {cert.type}
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        </Box>

        {certs.length > 0 && (
          <Box
            sx={{
              flexShrink: 0,
              borderTop: "1px solid #e0e0e0",
              bgcolor: "#fff",
              px: 2,
              py: 1.5,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={0.5}
            >
            
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="small"
                siblingCount={0}
                boundaryCount={1}
                sx={{
                  "& .MuiPaginationItem-root": {
                    minWidth: 28,
                    height: 28,
                    fontSize: 13,
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    bgcolor: colors.primary,
                    color: "#fff",
                    "&:hover": { bgcolor: colors.primary },
                  },
                }}
              />
           
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

/* ── Create SSL Drawer ── */


function MonoBox({
  value,
  multiline,
}: {
  value: string;
  multiline?: boolean;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: multiline ? "flex-start" : "center", gap: 1 }}>
      <Box
        sx={{
          flex: 1,
          bgcolor: "#f5f5f5",
          border: "1px solid #e0e0e0",
          borderRadius: 0.75,
          px: 1.5,
          py: 1,
          fontFamily: "monospace",
          fontSize: 13,
          color: "#333",
          wordBreak: "break-all",
          whiteSpace: multiline ? "pre" : "normal",
        }}
      >
        {value}
      </Box>
      <IconButton
        size="small"
        onClick={() => navigator.clipboard.writeText(value)}
        sx={{ color: "#64748b", flexShrink: 0 }}
      >
        <ContentCopyIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}

function SelectionCard({
  label,
  sub,
  selected,
  onClick,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        border: "1.5px solid",
        borderColor: selected ? colors.primary : "#e0e0e0",
        borderRadius: 1,
        p: 2,
        cursor: "pointer",
        bgcolor: selected ? "#e8f0fc" : "#fff",
        transition: "all 0.15s",
        textAlign: sub ? "left" : "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: selected ? colors.primary : "#333",
        }}
      >
        {label}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: 12, color: "#888", mt: 0.25 }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

/* ── Cert Config Card ── */
function CertConfigCard({
  emoji,
  title,
  sub,
  selected,
  onClick,
}: {
  emoji: string;
  title: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        border: "2px solid",
        borderColor: selected ? colors.primary : "#e0e0e0",
        borderRadius: 1.5,
        p: 2,
        cursor: "pointer",
        bgcolor: selected ? "#eef3fb" : "#fafafa",
        transition: "all 0.15s",
      }}
    >
      <Typography sx={{ fontSize: 22, mb: 1 }}>{emoji}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: selected ? colors.primary : "#333", mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 11, color: "#888", letterSpacing: "0.04em", lineHeight: 1.5 }}>
        {sub}
      </Typography>
    </Box>
  );
}

function CreateSslDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [certType, setCertType] = useState<"lets-encrypt" | "self-signed">("lets-encrypt");
  const [domains, setDomains] = useState("");
  const [email, setEmail] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"dns" | "http">("dns");
  const [useStaging, setUseStaging] = useState(true);

  const handleClose = () => {
    setStep(0);
    setCertType("lets-encrypt");
    setDomains("");
    setEmail("");
    setVerificationMethod("dns");
    setUseStaging(true);
    onClose();
  };

  const primaryDomain = domains.split("\n")[0]?.trim() || "yourdomain.com";
  const dnsHost = `_acme-challenge.${primaryDomain}`;
  const dnsTxtValue = "_U-_iKshB9-prx_p8P6_CPvaZ5RuUNyLDK5xbY0a2M0";

  const lbl = { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#555", mb: 1 } as const;

  /* ── Step 0: Certificate Configuration ── */
  const configStep = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}>
          Certificate Configuration
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#666" }}>
          Choose a certificate type and fill in the details below.
        </Typography>
      </Box>

      {/* Cert type */}
      <Box>
        <Typography sx={lbl}>CERTIFICATE TYPE</Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <CertConfigCard emoji="🔒" title="LET'S ENCRYPT" sub="FREE TRUSTED CERT VIA ACME V2. REQUIRES DOMAIN VERIFICATION." selected={certType === "lets-encrypt"} onClick={() => setCertType("lets-encrypt")} />
          <CertConfigCard emoji="🛡️" title="SELF-SIGNED" sub="INSTANT CERT FOR INTERNAL USE. NOT TRUSTED BY BROWSERS." selected={certType === "self-signed"} onClick={() => setCertType("self-signed")} />
        </Box>
      </Box>

      {/* Domains */}
      <Box>
        <Typography sx={lbl}>DOMAIN NAME(S) / SANS</Typography>
        <TextField
          fullWidth multiline rows={4}
          placeholder={"example.com\n*.example.com\nwww.example.com"}
          value={domains} onChange={(e) => setDomains(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fafafa", fontFamily: "monospace", fontSize: 13 } }}
        />
        <Typography sx={{ fontSize: 12, color: "#888", mt: 0.75 }}>
          One per line. First entry is used as Common Name if CN is blank. Use * for wildcards.
        </Typography>
      </Box>

      {/* Email */}
      <Box>
        <Typography sx={lbl}>EMAIL ADDRESS</Typography>
        <TextField
          fullWidth type="email" placeholder="admin@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fafafa" } }}
        />
        <Typography sx={{ fontSize: 12, color: "#888", mt: 0.75 }}>
          Used for Let's Encrypt account &amp; expiry notifications.
        </Typography>
      </Box>

      {/* Verification method */}
      {certType === "lets-encrypt" && (
        <Box>
          <Typography sx={lbl}>VERIFICATION METHOD</Typography>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <CertConfigCard emoji="🔒" title="DNS CHALLENGE" sub="ADD TXT RECORDS TO YOUR DNS. REQUIRED FOR WILDCARDS." selected={verificationMethod === "dns"} onClick={() => setVerificationMethod("dns")} />
            <CertConfigCard emoji="🌐" title="HTTP CHALLENGE" sub="PLACE A FILE ON YOUR WEB SERVER. SIMPLER FOR SINGLE DOMAINS." selected={verificationMethod === "http"} onClick={() => setVerificationMethod("http")} />
          </Box>
        </Box>
      )}

      {/* Staging */}
      {certType === "lets-encrypt" && (
        <FormControlLabel
          control={<Checkbox checked={useStaging} onChange={(e) => setUseStaging(e.target.checked)} sx={{ color: colors.primary, "&.Mui-checked": { color: colors.primary } }} />}
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: "#333" }}>USE LET'S ENCRYPT STAGING</Typography>
              <Typography sx={{ fontSize: 12, color: "#999" }}>(RECOMMENDED FOR TESTING — WON'T ISSUE REAL CERTS)</Typography>
            </Box>
          }
        />
      )}

      <Button
        variant="contained" fullWidth
        disabled={!domains.trim() || (certType === "lets-encrypt" && !email.trim())}
        onClick={() => setStep(1)}
        sx={{ bgcolor: colors.primary, color: "#fff", textTransform: "none", fontWeight: 700, fontSize: 15, py: 1.5, borderRadius: 1, boxShadow: "none", "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)", boxShadow: "none" } }}
      >
        Next — Start Verification →
      </Button>
    </Box>
  );

  /* ── Step 1: Domain Verification ── */
  const verifyStep = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}>
          Domain Verification
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#666" }}>
          Add the TXT records below to your DNS provider to prove domain ownership.
        </Typography>
      </Box>

      {/* Info banner */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, bgcolor: "#f5f5f5", border: "1px solid #e0e0e0", borderRadius: 1, p: 2 }}>
        <Typography sx={{ fontSize: 20 }}>📋</Typography>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#333" }}>Add the following TXT records to your DNS</Typography>
          <Typography sx={{ fontSize: 13, color: "#666" }}>DNS propagation can take 5–30 minutes. Check status after adding records.</Typography>
        </Box>
      </Box>

      {/* DNS record card */}
      <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1, overflow: "hidden", bgcolor: "#fff" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.5, bgcolor: "#fafafa", borderBottom: "1px solid #e0e0e0" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.primary, fontFamily: "monospace" }}>{dnsHost}</Typography>
          <Box sx={{ px: 1.25, py: 0.35, bgcolor: "#333", color: "#f5a623", borderRadius: 0.5, fontSize: 12, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.04em" }}>
            TXT · TTL 300
          </Box>
        </Box>
        <Box sx={{ px: 2.5, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#aaa", mb: 0.75 }}>HOST / NAME</Typography>
            <MonoBox value={dnsHost} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#aaa", mb: 0.75 }}>TXT VALUE</Typography>
            <MonoBox value={dnsTxtValue} />
          </Box>
        </Box>
      </Box>

      {/* How-to guide */}
      <Box sx={{ borderLeft: `3px solid ${colors.primary}`, bgcolor: "#f8f9ff", border: "1px solid #e8ecf8", borderLeftWidth: 3, borderLeftColor: colors.primary, borderRadius: "0 4px 4px 0", px: 2.5, py: 2 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.primary, mb: 1.25 }}>How to add DNS TXT records</Typography>
        {[
          "Log in to your DNS provider dashboard",
          "Navigate to DNS Management / Zone Editor",
          <span key="3">Add a new <strong>TXT</strong> record for each entry above</span>,
          "Save changes and wait for propagation (5–30 min)",
          <span key="5">Click <strong>Check Verification</strong> below</span>,
        ].map((item, i) => (
          <Typography key={i} sx={{ fontSize: 13, color: "#555", mb: 0.5 }}>{i + 1}. {item}</Typography>
        ))}
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button variant="outlined" onClick={() => setStep(0)} sx={{ textTransform: "none", fontWeight: 600, color: "#555", borderColor: "#ccc", px: 3, "&:hover": { borderColor: "#999", bgcolor: "#f5f5f5" } }}>
          ← Back
        </Button>
        <Button variant="contained" fullWidth sx={{ bgcolor: colors.primary, color: "#fff", textTransform: "none", fontWeight: 700, fontSize: 15, py: 1.5, borderRadius: 1, boxShadow: "none", "&:hover": { bgcolor: colors.primary, filter: "brightness(0.92)", boxShadow: "none" } }}>
          Check Verification
        </Button>
      </Box>
    </Box>
  );

  return (
    <Drawer anchor="right" open={open} onClose={handleClose} PaperProps={{ sx: { width: "75%", maxWidth: "90vw" } }}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid #e0e0e0", backgroundColor: "#f5f5f5" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HttpsIcon sx={{ fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>Create SSL Certificate</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: "#666" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ flex: 1, overflow: "auto", p: { xs: 3, md: 4 }, bgcolor: "#fafafa" }}>
          <Box sx={{ maxWidth: 680, mx: "auto" }}>
            {step === 0 && configStep}
            {step === 1 && verifyStep}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

/* ── Tool: shared label style ── */
const fieldLabel = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: "#555",
  mb: 0.75,
} as const;

const toolCardSx = {
  bgcolor: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: 1,
  p: { xs: 3, md: 4 },
  maxWidth: 680,
} as const;

const actionBtnSx = {
  textTransform: "none",
  fontWeight: 700,
  fontSize: 15,
  py: 1.5,
  borderColor: colors.primary,
  color: colors.primary,
  "&:hover": { bgcolor: "#f0f4ff", borderColor: colors.primary },
} as const;

/* ── SSL Verify ── */
function SslVerifyPanel() {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("443");

  return (
    <Box sx={toolCardSx}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}>
        Verify SSL Certificate
      </Typography>
      <Typography sx={{ fontSize: 14, color: "#666", mb: 3 }}>
        Check the live SSL certificate of any domain or hostname.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography sx={fieldLabel}>DOMAIN / HOSTNAME</Typography>
          <TextField
            fullWidth
            placeholder="example.com"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            helperText="Hostname only — no https:// prefix required."
            sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fafafa" } }}
          />
        </Box>

        <Box>
          <Typography sx={fieldLabel}>PORT</Typography>
          <TextField
            placeholder="443"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            sx={{ width: 160, "& .MuiOutlinedInput-root": { bgcolor: "#fafafa" } }}
          />
        </Box>

        <Button variant="outlined" fullWidth sx={actionBtnSx}>
          Check SSL Certificate
        </Button>
      </Box>
    </Box>
  );
}

/* ── CSR Decoder ── */
function CsrDecoderPanel() {
  const [csr, setCsr] = useState("");

  return (
    <Box sx={toolCardSx}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}>
        CSR Decoder
      </Typography>
      <Typography sx={{ fontSize: 14, color: "#666", mb: 3 }}>
        Decode and inspect a Certificate Signing Request (CSR).
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography sx={fieldLabel}>CSR (PEM FORMAT)</Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            placeholder={"-----BEGIN CERTIFICATE REQUEST-----\n...\n-----END CERTIFICATE REQUEST-----"}
            value={csr}
            onChange={(e) => setCsr(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { bgcolor: "#fafafa", fontFamily: "monospace", fontSize: 13 },
            }}
          />
        </Box>

        <Button variant="outlined" fullWidth sx={actionBtnSx}>
          Decode CSR
        </Button>
      </Box>
    </Box>
  );
}

/* ── Cert Decoder ── */
function CertDecoderPanel() {
  const [cert, setCert] = useState("");

  return (
    <Box sx={toolCardSx}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}>
        Certificate Decoder
      </Typography>
      <Typography sx={{ fontSize: 14, color: "#666", mb: 3 }}>
        Decode and inspect a PEM-encoded X.509 certificate.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography sx={fieldLabel}>CERTIFICATE (PEM FORMAT)</Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            placeholder={"-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"}
            value={cert}
            onChange={(e) => setCert(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { bgcolor: "#fafafa", fontFamily: "monospace", fontSize: 13 },
            }}
          />
        </Box>

        <Button variant="outlined" fullWidth sx={actionBtnSx}>
          Decode Certificate
        </Button>
      </Box>
    </Box>
  );
}

/* ── Key Matcher ── */
function KeyMatcherPanel() {
  const [checkType, setCheckType] = useState<"cert-key" | "csr-cert">("cert-key");
  const [cert, setCert] = useState("");
  const [keyOrCsr, setKeyOrCsr] = useState("");
  const [passphrase, setPassphrase] = useState("");

  return (
    <Box sx={toolCardSx}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}>
        Key Matcher
      </Typography>
      <Typography sx={{ fontSize: 14, color: "#666", mb: 3 }}>
        Verify that a certificate matches a private key or a CSR.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Check type */}
        <Box>
          <Typography sx={fieldLabel}>CHECK TYPE</Typography>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <SelectionCard
              label="CERTIFICATE & PRIVATE KEY"
              sub="Does the private key belong to this certificate?"
              selected={checkType === "cert-key"}
              onClick={() => setCheckType("cert-key")}
            />
            <SelectionCard
              label="CSR & CERTIFICATE"
              sub="Was this certificate issued from this CSR?"
              selected={checkType === "csr-cert"}
              onClick={() => setCheckType("csr-cert")}
            />
          </Box>
        </Box>

        {/* Certificate */}
        <Box>
          <Typography sx={fieldLabel}>CERTIFICATE (PEM FORMAT)</Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder={"-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"}
            value={cert}
            onChange={(e) => setCert(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { bgcolor: "#fafafa", fontFamily: "monospace", fontSize: 13 },
            }}
          />
        </Box>

        {/* Private Key or CSR */}
        <Box>
          <Typography sx={fieldLabel}>
            {checkType === "cert-key" ? "PRIVATE KEY (PEM FORMAT)" : "CSR (PEM FORMAT)"}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder={
              checkType === "cert-key"
                ? "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
                : "-----BEGIN CERTIFICATE REQUEST-----\n...\n-----END CERTIFICATE REQUEST-----"
            }
            value={keyOrCsr}
            onChange={(e) => setKeyOrCsr(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { bgcolor: "#fafafa", fontFamily: "monospace", fontSize: 13 },
            }}
          />
        </Box>

        {/* Passphrase (only for cert-key) */}
        {checkType === "cert-key" && (
          <Box>
            <Typography sx={{ ...fieldLabel, mb: 0.5 }}>
              KEY PASSPHRASE{" "}
              <Box component="span" sx={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#999" }}>
                Optional
              </Box>
            </Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="Enter if key is encrypted"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              sx={{ width: 320, "& .MuiOutlinedInput-root": { bgcolor: "#fafafa" } }}
            />
          </Box>
        )}

        <Button variant="outlined" fullWidth sx={actionBtnSx}>
          Check Match
        </Button>
      </Box>
    </Box>
  );
}

/* ── Left Nav ── */
function SslLeftNav({
  activeTool,
  onOpenTool,
}: {
  activeTool: string | null;
  onOpenTool: (tool: string) => void;
}) {
  return (
    <Box
      sx={{
        width: 210,
        flexShrink: 0,
        alignSelf: "stretch",
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#fff",
        pt: 3,
        pb: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em", px: 2, mb: 0.5 }}>
        SSL TOOLS
      </Typography>
      <List disablePadding>
        {TOOL_NAV.map((item) => {
          const isActive = activeTool === item.hash;
          return (
            <ListItemButton
              key={item.hash}
              onClick={() => onOpenTool(item.hash)}
              sx={{
                px: 2,
                py: 1,
                bgcolor: isActive ? "#e8f0fc" : "transparent",
                "&:hover": { bgcolor: isActive ? "#e8f0fc" : "#f5f5f5" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <ArrowBigRight
                  size={16}
                  color={isActive ? colors.primary : "#bbb"}
                  fill={isActive ? colors.primary : "none"}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 14,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? colors.primary : "#444",
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

/* ── Tool Drawer wrapper ── */
const TOOL_TITLES: Record<string, string> = {
  "ssl-verify":   "SSL Verify",
  "csr-decoder":  "CSR Decoder",
  "cert-decoder": "Certificate Decoder",
  "key-matcher":  "Key Matcher",
};

function SslToolDrawer({
  activeTool,
  onClose,
}: {
  activeTool: string | null;
  onClose: () => void;
}) {
  return (
    <Drawer
      anchor="right"
      open={activeTool !== null}
      onClose={onClose}
      PaperProps={{ sx: { width: "75%", maxWidth: "90vw" } }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "#f5f5f5" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            {activeTool ? TOOL_TITLES[activeTool] : ""}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "#666" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflow: "auto", p: { xs: 3, md: 4 }, bgcolor: "#fafafa" }}>
          {activeTool === "ssl-verify"   && <SslVerifyPanel />}
          {activeTool === "csr-decoder"  && <CsrDecoderPanel />}
          {activeTool === "cert-decoder" && <CertDecoderPanel />}
          {activeTool === "key-matcher"  && <KeyMatcherPanel />}
        </Box>
      </Box>
    </Drawer>
  );
}

/* ── Hero Intro ── */

function SslHeroIntro({ onNext }: { onNext: () => void }) {
  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: colors.secondary,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "center",
          gap: { xs: 3, lg: 4 },
          px: { xs: 2.5, sm: 4, md: 5 },
          py: { xs: 4, md: 5 },
          maxWidth: 1280,
          mx: "auto",
          width: "100%",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2.5,
              color: "#64748b",
            }}
          >
            <VerifiedUserOutlinedIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
              Trusted Certificate Authority
            </Typography>
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Box component="span" sx={headlineBlockSx}>
              SSL Protection
            </Box>
            <br />
            <Box component="span" sx={headlineBlockSx}>
              For Anyone
            </Box>
            <br />
            <Box component="span" sx={headlineBlockSx}>
              Fast. Reliable. Free.
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: 15, md: 16 },
              color: "#64748b",
              lineHeight: 1.7,
              maxWidth: 480,
            }}
          >
            Easily secure any site by putting SSL management on autopilot,
            supporting one-step validation and renewal via REST API.
          </Typography>
        </Box>

        <Box
          sx={{
            flex: { xs: "none", lg: 1.1 },
            width: { xs: "100%", lg: "auto" },
            maxWidth: { xs: 520, lg: "none" },
            mx: { xs: "auto", lg: 0 },
          }}
        >
          <Box
            component="img"
            src={HERO_STEPS_IMAGE}
            alt="SSL certificate steps: select domain, validate, and install"
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          px: { xs: 2.5, sm: 4, md: 5 },
          pb: 4,
          pt: 1,
          maxWidth: 1280,
          mx: "auto",
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={onNext}
          sx={{
            bgcolor: colors.primary,
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: 16,
            px: 4,
            py: 1.35,
            borderRadius: 0.5,
            boxShadow: "0 2px 8px rgba(17, 86, 166, 0.3)",
            "&:hover": {
              bgcolor: colors.primary,
              boxShadow: "0 4px 14px rgba(17, 86, 166, 0.4)",
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

/* ── Dashboard ── */

function SslManageDashboard({
  activeTool,
  onOpenTool,
}: {
  activeTool: string | null;
  onOpenTool: (tool: string) => void;
}) {
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);
  const [statusDrawerStatus, setStatusDrawerStatus] =
    useState<CertStatus>("Issued");
  const closeDrawer = () => setActiveDrawer(null);

  const openStatusDrawer = (status: CertStatus) => {
    setStatusDrawerStatus(status);
    setActiveDrawer({ type: "status", status });
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        bgcolor: colors.secondary,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "relative",
          color: "#fff",
          background: `${SSL_HEADER_BG} url(${SSL_HEADER_IMAGE}) 100% / 1200px`,
          padding: { xs: "24px 20px", md: "28px 25px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1040,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            component="h1"
            sx={{ fontSize: 28, fontWeight: 700, mb: 1, lineHeight: 1.2 }}
          >
            Welcome to OFC SSL
          </Typography>
          <Typography
            sx={{
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 720,
              opacity: 0.95,
              mx: "auto",
            }}
          >
            Thank you for choosing OFC SSL. Ready to create your first SSL
            certificate? You can have a look around or get started right away
            using one of the links below.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          bgcolor: colors.secondary,
        }}
      >
        <SslLeftNav activeTool={activeTool} onOpenTool={onOpenTool} />
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1040,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Status cards */}
          <Paper
            variant="outlined"
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: 0,
              borderColor: "#e0e0e0",
              overflow: "hidden",
              bgcolor: "#fff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > *": {
                  flex: {
                    xs: "1 1 100%",
                    sm: "1 1 calc(50% - 0px)",
                    md: "1 1 0",
                  },
                },
                "& > *:not(:last-child)": {
                  borderRight: { md: "1px solid #e0e0e0" },
                },
                "& > *:not(:nth-last-of-type(-n+1))": {
                  borderBottom: { xs: "1px solid #e0e0e0", md: "none" },
                },
                "& > *:nth-last-of-type(-n+2)": {
                  borderBottom: { sm: "1px solid #e0e0e0", md: "none" },
                },
              }}
            >
              {statusOrder.map((status) => (
                <StatusCard
                  key={status}
                  label={status}
                  onViewAll={() => openStatusDrawer(status)}
                />
              ))}
            </Box>
          </Paper>

          {/* Create certificate */}
          <Paper
            variant="outlined"
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: 0,
              borderColor: "#e0e0e0",
              bgcolor: "#fff",
              p: { xs: 2.5, md: 3.5 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Box
              sx={{
                flex: 1,
                maxWidth: 560,
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <HttpsIcon sx={{ color: colors.primary, fontSize: 22 }} />
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#333" }}>
                  Create SSL Certificate
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: 14, color: "#555", lineHeight: 1.65, maxWidth: 520 }}
              >
                OFC SSL lets you create SSL certificates within just a few
                minutes, supporting both 90-day and annual certificates. To
                create a certificate, click on the right.
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => setActiveDrawer({ type: "create" })}
              sx={{
                alignSelf: "center",
                flexShrink: 0,
                bgcolor: colors.primary,
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 15,
                px: 3.5,
                py: 1.35,
                borderRadius: 0.5,
                boxShadow: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: colors.primary,
                  boxShadow: "0 2px 8px rgba(17, 86, 166, 0.35)",
                },
              }}
            >
              New Certificate
            </Button>
          </Paper>
        </Box>
        </Box>
      </Box>

      <StatusDrawer
        open={activeDrawer?.type === "status"}
        status={
          activeDrawer?.type === "status"
            ? activeDrawer.status
            : statusDrawerStatus
        }
        onClose={closeDrawer}
      />
      <CreateSslDrawer
        open={activeDrawer?.type === "create"}
        onClose={closeDrawer}
      />
    </Box>
  );
}

/* ── Root ── */

export default function SslManage() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const isHeroView = !hash || hash === "";
  const goToDashboard = () => navigate({ pathname: SSL_MANAGE_PATH, hash: DASHBOARD_HASH });

  if (isHeroView) {
    return (
      <Box sx={{ width: "100%", minHeight: "100%", bgcolor: colors.secondary }}>
        <SslHeroIntro onNext={goToDashboard} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100%", bgcolor: colors.secondary }}>
      <SslManageDashboard activeTool={activeTool} onOpenTool={setActiveTool} />
      <SslToolDrawer activeTool={activeTool} onClose={() => setActiveTool(null)} />
    </Box>
  );
}

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Link,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
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
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { colors } from "@/utils/customColor";

const SSL_HEADER_BG = "#586382";
const SSL_HEADER_IMAGE = "/assets/images/ssl-header.svg";
const HERO_STEPS_IMAGE = "/assets/images/hero_steps.svg";
const HERO_BLUE = "#1156a6";
const SSL_MANAGE_PATH = "/home/ssl-manage";
const DASHBOARD_HASH = "dashboard";
const CREATE_STEPS = ["Upload", "Verify", "Download"];

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

function isDashboardView(hash: string) {
  return hash === `#${DASHBOARD_HASH}` || hash === DASHBOARD_HASH;
}

type CertStatus =
  | "Expiring Soon"
  | "Draft"
  | "Issued"
  | "Pending Validation"
  | "Expired";

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

const statusOrder: CertStatus[] = [
  "Expiring Soon",
  "Draft",
  "Issued",
  "Pending Validation",
  "Expired",
];

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
  status,
  onClose,
}: {
  status: CertStatus | null;
  onClose: () => void;
}) {
  if (!status) return null;
  const { icon, iconBg, iconColor } = statusMeta[status];

  return (
    <Drawer
      anchor="right"
      open={Boolean(status)}
      onClose={onClose}
      PaperProps={{ sx: { width: "75%", maxWidth: "90vw" } }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
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

        <Box sx={{ flex: 1, overflow: "auto", p: 4, backgroundColor: "#fafafa" }}>
          <Box sx={{ maxWidth: 900, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {dummyCertsByStatus[status].length === 0 ? (
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
              dummyCertsByStatus[status].map((cert, i) => (
                <Paper
                  key={i}
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
      </Box>
    </Drawer>
  );
}

/* ── Create SSL Drawer ── */

function CsrUploadZone({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Box
      onClick={() => inputRef.current?.click()}
      sx={{
        border: "2px dashed #e0e0e0",
        borderRadius: 1,
        p: 4,
        textAlign: "center",
        cursor: "pointer",
        bgcolor: "#fafafa",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: colors.primary },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csr,.pem,.txt"
        style={{ display: "none" }}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: "#bdbdbd", mb: 1 }} />
      {file ? (
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333" }}>
          {file.name}
        </Typography>
      ) : (
        <>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#555" }}>
            Click to upload CSR file
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#aaa", mt: 0.5 }}>
            .csr, .pem, or .txt
          </Typography>
        </>
      )}
    </Box>
  );
}

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

function CreateSslDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [domain, setDomain] = useState("");
  const [certType, setCertType] = useState<"90-Day" | "Annual">("90-Day");
  const [validationMethod, setValidationMethod] = useState<"DNS" | "HTTP" | "Email">("DNS");
  const [csrTab, setCsrTab] = useState(0);
  const [csrFile, setCsrFile] = useState<File | null>(null);
  const [org, setOrg] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const handleClose = () => {
    setStep(0);
    setDomain("");
    setCertType("90-Day");
    setValidationMethod("DNS");
    setCsrTab(0);
    setCsrFile(null);
    setOrg("");
    setCountry("");
    setState("");
    setCity("");
    onClose();
  };

  const dnsRecord = {
    hostname: `_acme-challenge.${domain || "yourdomain.com"}`,
    type: "TXT",
    value: "xK9mN2pQrT7vL4wJ8sY1eA5bF3hD6cU0",
  };

  const httpFile = {
    path: `/.well-known/pki-validation/ABC123DEF456.txt`,
    content: "xK9mN2pQrT7vL4wJ8sY1eA5bF3hD6cU0\ncomodoca.com\n4567890",
  };

  /* ── Step 0: Upload / Configure ── */
  const stepUpload = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Domain */}
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#555", mb: 1 }}>
          Domain Name *
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1.5px solid #e0e0e0",
            borderRadius: "8px",
            overflow: "hidden",
            bgcolor: "#fff",
            transition: "border-color 0.2s, box-shadow 0.2s",
            "&:focus-within": {
              borderColor: "#2e7d32",
              boxShadow: "0 0 0 3px rgba(46,125,50,0.12)",
            },
          }}
        >
          {/* Lock + Secure label */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              pl: 1.5,
              pr: 1,
              py: 1.1,
              borderRight: "1.5px solid #e0e0e0",
              flexShrink: 0,
              userSelect: "none",
            }}
          >
            <Box
              component="img"
              src="/assets/images/lock_icon_green.svg"
              alt="secure"
              sx={{ width: 16, height: 16, display: "block" }}
            />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: "#2e7d32",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              Secure
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                color: "#2e7d32",
                fontWeight: 400,
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              | https://
            </Typography>
          </Box>

          {/* Plain input */}
          <Box
            component="input"
            type="text"
            placeholder="Enter website to secure (Example: domain.com)"
            value={domain}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDomain(e.target.value)
            }
            sx={{
              flex: 1,
              border: "none",
              outline: "none",
              px: 1.5,
              py: 1.1,
              fontSize: 14,
              color: "#333",
              bgcolor: "transparent",
              fontFamily: "inherit",
              "::placeholder": { color: "#aaa" },
            }}
          />
        </Box>
      </Box>

      {/* Certificate type */}
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#555", mb: 1 }}>
          Certificate Type
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <SelectionCard
            label="90-Day"
            sub="Free · Auto-renewable"
            selected={certType === "90-Day"}
            onClick={() => setCertType("90-Day")}
          />
          <SelectionCard
            label="Annual"
            sub="Paid · 1-year validity"
            selected={certType === "Annual"}
            onClick={() => setCertType("Annual")}
          />
        </Box>
      </Box>

      {/* Validation method */}
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#555", mb: 1 }}>
          Domain Validation Method
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {(["DNS", "HTTP", "Email"] as const).map((m) => (
            <SelectionCard
              key={m}
              label={m}
              selected={validationMethod === m}
              onClick={() => setValidationMethod(m)}
            />
          ))}
        </Box>
      </Box>

      {/* CSR */}
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#555", mb: 1.5 }}>
          Certificate Signing Request (CSR)
        </Typography>
        <Tabs
          value={csrTab}
          onChange={(_, v) => setCsrTab(v)}
          sx={{
            mb: 2,
            minHeight: 36,
            "& .MuiTab-root": {
              minHeight: 36,
              fontSize: 13,
              textTransform: "none",
              py: 0,
            },
            "& .MuiTabs-indicator": { backgroundColor: colors.primary },
            "& .Mui-selected": { color: `${colors.primary} !important` },
          }}
        >
          <Tab label="Generate CSR" />
          <Tab label="Upload CSR" />
        </Tabs>

        {csrTab === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555", mb: 0.75 }}>
                  Organization
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Acme Corp"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fff" } }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555", mb: 0.75 }}>
                  Country (2-letter)
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="US"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fff" } }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555", mb: 0.75 }}>
                  State / Province
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="California"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fff" } }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555", mb: 0.75 }}>
                  City / Locality
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fff" } }}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <CsrUploadZone file={csrFile} onChange={setCsrFile} />
        )}
      </Box>
    </Box>
  );

  /* ── Step 1: Verify ── */
  const stepVerify = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          p: 2.5,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#333", mb: 0.5 }}>
          Verifying:{" "}
          <Box component="span" sx={{ color: colors.primary }}>
            {domain || "your-domain.com"}
          </Box>
        </Typography>
        <Typography sx={{ fontSize: 13, color: "#666" }}>
          {validationMethod === "DNS"
            ? "Add the TXT record below to your DNS provider to verify domain ownership."
            : validationMethod === "HTTP"
              ? "Upload the file below to your web server to verify domain ownership."
              : "Click the verification link sent to the admin email for this domain."}
        </Typography>
      </Box>

      {validationMethod === "DNS" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { label: "Hostname", value: dnsRecord.hostname },
            { label: "Record Type", value: dnsRecord.type },
            { label: "Value", value: dnsRecord.value },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555", mb: 0.5 }}>
                {label}
              </Typography>
              <MonoBox value={value} />
            </Box>
          ))}
        </Box>
      )}

      {validationMethod === "HTTP" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555", mb: 0.5 }}>
              File Path
            </Typography>
            <MonoBox value={httpFile.path} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555", mb: 0.5 }}>
              File Contents
            </Typography>
            <MonoBox value={httpFile.content} multiline />
          </Box>
        </Box>
      )}

      {validationMethod === "Email" && (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: "#e3f2fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1565c0",
            }}
          >
            <EmailOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#333" }}>
            Check your inbox
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#666", maxWidth: 340 }}>
            A verification email was sent to the admin email for{" "}
            <strong>{domain || "your-domain.com"}</strong>. Click the link to
            verify ownership.
          </Typography>
        </Box>
      )}
    </Box>
  );

  /* ── Step 2: Download ── */
  const stepDownload = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        py: 2,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "#e8f5e9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2e7d32",
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 44 }} />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#2e7d32", mb: 0.75 }}>
          Certificate Issued!
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#666" }}>
          Your SSL certificate for{" "}
          <strong>{domain || "your-domain.com"}</strong> is ready to download.
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {[
          { label: "Download Certificate (.crt)", primary: true },
          { label: "Download Private Key (.key)", primary: false },
          { label: "Download CA Bundle (.ca-bundle)", primary: false },
        ].map(({ label, primary }) => (
          <Button
            key={label}
            variant="outlined"
            startIcon={<DownloadOutlinedIcon />}
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderColor: primary ? colors.primary : "#e0e0e0",
              color: primary ? colors.primary : "#555",
              justifyContent: "flex-start",
              py: 1.5,
              px: 2.5,
              bgcolor: "#fff",
              "&:hover": {
                borderColor: colors.primary,
                bgcolor: "#f0f4ff",
              },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: "75%", maxWidth: "90vw" } }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {/* Header */}
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
            <HttpsIcon sx={{ fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
              Create SSL Certificate
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: "#666" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{ flex: 1, overflow: "auto", p: 4, backgroundColor: "#fafafa" }}
        >
          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            {/* Stepper */}
            <Stepper activeStep={step} sx={{ mb: 4 }}>
              {CREATE_STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step content */}
            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                p: { xs: 2.5, md: 4 },
              }}
            >
              {step === 0 && stepUpload}
              {step === 1 && stepVerify}
              {step === 2 && stepDownload}
            </Box>

            {/* Navigation */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
              }}
            >
              <Button
                onClick={() =>
                  step === 0 ? handleClose() : setStep((s) => s - 1)
                }
                sx={{
                  textTransform: "none",
                  color: "#555",
                  fontWeight: 600,
                }}
              >
                {step === 0 ? "Cancel" : "Back"}
              </Button>

              {step < 2 ? (
                <Button
                  variant="contained"
                  disabled={step === 0 && !domain.trim()}
                  onClick={() => setStep((s) => s + 1)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    bgcolor: colors.primary,
                    px: 4,
                    "&:hover": { bgcolor: colors.primary },
                  }}
                >
                  {step === 1 ? "Verify & Continue" : "Next"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleClose}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    bgcolor: "#2e7d32",
                    px: 4,
                    "&:hover": { bgcolor: "#1b5e20" },
                  }}
                >
                  Done
                </Button>
              )}
            </Box>
          </Box>
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
        bgcolor: "#f4f6f8",
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

function SslManageDashboard() {
  const [drawerStatus, setDrawerStatus] = useState<CertStatus | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        bgcolor: "#fff",
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
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, md: 4 },
          bgcolor: "#f7f8fa",
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
                  onViewAll={() => setDrawerStatus(status)}
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
              onClick={() => setCreateOpen(true)}
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

      <StatusDrawer
        status={drawerStatus}
        onClose={() => setDrawerStatus(null)}
      />
      <CreateSslDrawer open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
}

/* ── Root ── */

export default function SslManage() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const showDashboard = isDashboardView(hash);

  const goToDashboard = () => {
    navigate({ pathname: SSL_MANAGE_PATH, hash: DASHBOARD_HASH });
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100%", bgcolor: "#fff" }}>
      {showDashboard ? (
        <SslManageDashboard />
      ) : (
        <SslHeroIntro onNext={goToDashboard} />
      )}
    </Box>
  );
}

import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const sections = [
  {
    title: "Introduction",
    paragraphs: [
      "OFC respects your privacy and is committed to protecting personal information processed through the dashboard, API, and supporting services. This policy explains the types of data we collect, why we collect it, and how we keep it safe.",
    ],
  },
  {
    title: "Information We Collect",
    bullets: [
      "Account data: name, email, WhatsApp number, optional company name, billing address.",
      "Security data: hashed passwords, login history, device information, IP addresses.",
      "Usage data: message counts, API call counts, delivery analytics (never content).",
      "Diagnostics: error logs, performance metrics, crash reports.",
    ],
  },
  {
    title: "Data We Never Store",
    bullets: [
      "Message body text or media files.",
      "Contact names or chat history.",
      "GPS or precise location data.",
      "WhatsApp profile metadata.",
    ],
  },
  {
    title: "How We Use Your Data",
    bullets: [
      "Create and secure your account.",
      "Deliver dashboard and API functionality.",
      "Provide customer support and incident response.",
      "Improve reliability, security, and performance of the platform.",
      "Comply with legal obligations and enforce our policies.",
    ],
  },
  {
    title: "Data Sharing & Processors",
    paragraphs: [
      "We never sell personal data. Limited sharing occurs with payment gateways, hosting providers, email delivery services, and analytics tools that meet our security standards. All processors are bound by data processing agreements and may only use information to provide their specific service.",
    ],
  },
  {
    title: "Security Measures",
    bullets: [
      "TLS 1.2+ encryption in transit and AES‑256 at rest.",
      "Bcrypt hashing for passwords and API credentials.",
      "Role-based access control and MFA for administrators.",
      "Firewall, intrusion detection, and DDoS mitigation.",
      "Regular security audits and penetration testing.",
    ],
  },
  {
    title: "Data Retention",
    paragraphs: [
      "While an account is active we retain data needed to provide the service. Usage logs are kept for 90 days. Deleted accounts are purged immediately with backups expiring inside 30 days. Financial and compliance records may be stored for up to seven years, as required by law.",
    ],
  },
  {
    title: "Your Rights",
    bullets: [
      "Correct inaccurate or incomplete information.",
      "Delete your account and all associated data at any time.",
    ],
  },
  {
    title: "Regional Compliance",
    paragraphs: [
      "OFC complies with GDPR, CCPA, CAN-SPAM, TRAI DND, PDPA, and other regional statutes wherever applicable. Data may be processed in India; by using the service you consent to such transfers, and we ensure appropriate safeguards for cross-border processing.",
    ],
  },
  {
    title: "Cookies & Tracking",
    bullets: [
      "Essential cookies maintain sessions, prevent fraud, and balance load.",
      "Functional cookies remember preferences and locale.",
      "Optional analytics cookies provide aggregated usage statistics.",
      "You can manage cookies via your browser, but disabling essentials may impact functionality.",
    ],
  },
  {
    title: "Children’s Privacy",
    paragraphs: [
      "OFC is not directed toward children under 18. We do not knowingly collect data from minors; if we become aware of such data, it is deleted immediately.",
    ],
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy periodically. Material updates are communicated via email or in-app banners at least 15 days before they take effect. Continued use of the service constitutes acceptance of the revised policy.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "For privacy questions or to exercise your rights, email privacy@ajaxter.com or open a secure ticket from the dashboard.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <Box
      sx={{
        backgroundColor: "#f7f7f7",
        width: "100%",
        maxHeight: "calc(100vh - 225px)",
        overflow: "auto",
        py: 1.5,
        px: 2,
      }}
    >
      {sections.map((section) => {
        return (
          <Accordion
            key={section.title}
            sx={{
              mb: 2,
              minWidth: "100%",
              "& .MuiAccordionSummary-root.Mui-expanded": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${section.title}-content`}
              id={`${section.title}-header`}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#233044" }}
              >
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#fff" }}>
              {section.paragraphs?.map((paragraph, idx) => (
                <Typography
                  variant="body1"
                  sx={{ mb: 1.5 }}
                  key={paragraph.slice(0, 32) + idx}
                >
                  {paragraph}
                </Typography>
              ))}
              {section.bullets && (
                <List dense>
                  {section.bullets.map((bullet) => (
                    <ListItem key={bullet} sx={{ pl: 0 }}>
                      <ListItemText primary={bullet} />
                    </ListItem>
                  ))}
                </List>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

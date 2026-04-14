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
    title: "Prohibited Content",
    bullets: [
      "Spam or unsolicited bulk advertising.",
      "Fraudulent, deceptive, or phishing content.",
      "Illegal, hateful, harassing, or violent material.",
      "Adult content without explicit consent.",
      "Child exploitation in any form.",
      "Malware, spyware, or malicious links.",
      "Copyright- or trademark-infringing material.",
      "Deliberate misinformation that causes harm.",
      "Impersonation of individuals, brands, or institutions.",
    ],
  },
  {
    title: "Prohibited Behavior",
    bullets: [
      "Using automation to bypass limits or evade controls.",
      "Scraping or harvesting data without permission.",
      "Attempting to hack, exploit, or reverse engineer the platform.",
      "Launching DDoS attacks or disrupting service availability.",
      "Creating multiple accounts or sharing credentials.",
      "Reselling OFC access without authorization.",
      "Sending to purchased or scraped contact lists.",
      "Ignoring unsubscribe or opt-out requests.",
    ],
  },
  {
    title: "Bulk Messaging Rules",
    bullets: [
      "Must have explicit opt-in consent for marketing traffic.",
      "Provide a clear opt-out mechanism in every campaign.",
      "Honor opt-out requests immediately.",
      "Identify your business/legal name in bulk messages.",
      "Respect daily sending limits and send at reasonable hours.",
      "Segment recipients to avoid irrelevant or spammy content.",
    ],
  },
  {
    title: "Consent Requirements",
    paragraphs: [
      "You must document recipient consent (express for marketing, implied for transactional, or based on prior business relationship). Consent must be freely given, specific to the purpose, and revocable at any time. Keep records (screenshots, forms, timestamps) to defend against complaints.",
    ],
  },
  {
    title: "Legal & Regulatory Compliance",
    bullets: [
      "GDPR (EU), CCPA (California), CAN-SPAM (US), TCPA, TRAI DND (India), PDPA (Singapore/Malaysia), and any other jurisdictional requirements.",
      "Industry-specific laws such as HIPAA (health), FERPA (education), or financial regulations if you handle sensitive data.",
    ],
  },
  {
    title: "Enforcement",
    paragraphs: [
      "OFC may issue warnings, temporarily suspend, or permanently terminate accounts for AUP violations. Severe or repeated misconduct can lead to immediate termination without refund, referral to law enforcement, and permanent bans.",
    ],
  },
  {
    title: "Reporting Violations",
    paragraphs: [
      "If you believe another user is violating this policy, contact support with evidence such as message samples, timestamps, and recipient details. We review every report confidentially.",
    ],
  },
  {
    title: "Good Faith Use",
    paragraphs: [
      "Even when operating within limits, you must exercise good judgment: send relevant, opted-in communications, respect recipients, and avoid tactics that may trigger carrier or WhatsApp enforcement. OFC reserves the right to intervene if usage patterns threaten platform stability or compliance.",
    ],
  },
];

export default function AcceptableUsePage() {
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
                "& .MuiTypography-root": {
                  color: "#999",
                },
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
                  key={paragraph.slice(0, 32) + idx}
                  variant="body1"
                  sx={{ mb: 1.5 }}
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

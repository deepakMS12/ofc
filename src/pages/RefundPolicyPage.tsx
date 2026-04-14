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
    title: "No-Refund Principle",
    paragraphs: [
      "All OFC subscription payments are final and non-refundable. This applies to every plan tier, billing period, and payment method, including situations involving WhatsApp bans, dissatisfaction, intermittent downtime, or account deletion before the billing cycle ends.",
    ],
  },
  {
    title: "Before You Purchase",
    bullets: [
      "Review plan features and limits carefully.",
      "Use the free tier to validate your workflow.",
      "Contact support with questions prior to upgrading.",
      "Understand that unofficial WhatsApp connectivity carries ban risks outside our control.",
    ],
  },
  {
    title: "Subscription Management",
    paragraphs: [
      "You may upgrade at any time (with prorated charges). Downgrades take effect at the next billing cycle. Cancelling prevents future renewals but does not refund the active period—you retain access until the current term expires.",
    ],
  },
  {
    title: "Billing Errors & Disputes",
    bullets: [
      "Report billing discrepancies within 7 days of the charge.",
      "Provide transaction IDs, dates, and supporting screenshots.",
      "Legitimate errors will be corrected or credited.",
      "This process does not override the no-refund policy for valid charges.",
    ],
  },
  {
    title: "Chargebacks",
    paragraphs: [
      "Unauthorized chargebacks immediately suspend and may permanently ban your account. We reserve the right to pursue collection efforts and legal remedies for fraudulent disputes. Always contact support first to resolve payment issues.",
    ],
  },
  {
    title: "Exceptional Credits",
    paragraphs: [
      "Service credits are granted only when explicitly defined in our SLA (e.g., uptime falling below 95% and a request submitted within five days of the affected month). Credits apply toward future invoices and are not redeemable as cash refunds.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <Box sx={{
      backgroundColor: "#f7f7f7",
      width: "100%",
      maxHeight: "calc(100vh - 225px)",
      overflow: "auto",
       py: 1.5,
            px:2
    }}>

   
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
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#233044" }}>
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#fff" }}>

              {section.paragraphs?.map((paragraph, idx) => (
                <Typography key={paragraph.slice(0, 30) + idx} variant="body1" sx={{ mb: 1.5 }}>
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




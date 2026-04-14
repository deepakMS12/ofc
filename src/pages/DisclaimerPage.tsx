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
    title: 'Service Provided "As Is"',
    paragraphs: [
      'OFC delivers its dashboard, API, and related services on an "as is" and "as available" basis. We expressly disclaim any warranties, whether express or implied, including merchantability, fitness for a particular purpose, non-infringement, availability, accuracy, or freedom from errors and vulnerabilities.',
      "We do not guarantee compatibility with all environments, uninterrupted access, or successful delivery of every message.",
    ],
  },
  {
    title: "No Affiliation with WhatsApp or Meta",
    paragraphs: [
      "OFC is not affiliated with, endorsed by, or connected to WhatsApp LLC or Meta Platforms, Inc. References to these entities are purely descriptive. OFC is not an official WhatsApp Business Solution Provider and uses reverse-engineered protocols at your risk.",
    ],
  },
  {
    title: "Unofficial API & Ban Risks",
    bullets: [
      "Connecting through OFC likely violates WhatsApp Terms of Service.",
      "WhatsApp may throttle, restrict, or permanently ban connected numbers at any time without warning.",
      "Bans can result in loss of chats, contacts, and the ability to reuse phone numbers.",
      "Use of the Service is entirely at your own risk; OFC cannot restore banned accounts or intervene with WhatsApp/Meta.",
    ],
  },
  {
    title: "Limitation of Responsibility",
    bullets: [
      "OFC is not liable for business interruption, revenue or data loss, reputational harm, regulatory penalties, litigation, or costs arising from your use of the Service.",
      "We are not responsible for compliance with WhatsApp, Meta, or other third-party policies.",
      "You bear full responsibility for ensuring your messaging practices comply with applicable laws and regulations.",
    ],
  },
  {
    title: "Third-Party Dependencies",
    paragraphs: [
      "We rely on WhatsApp, hosting providers, payment processors, and network partners. Failures or outages in any third-party system may impact the Service, and OFC is not liable for such disruptions.",
    ],
  },
  {
    title: "No Professional Advice",
    paragraphs: [
      "The information provided through OFC (including documentation, analytics, or support responses) does not constitute legal, financial, or professional advice. You should consult qualified professionals for guidance specific to your business.",
    ],
  },
  {
    title: "User Responsibility & Indemnity Reminder",
    paragraphs: [
      "You remain fully responsible for the legality of your message content, compliance with anti-spam rules, and fulfillment of recipient permissions. Under the Terms, you agree to defend and indemnify OFC from all claims arising from your use of the Service.",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <Box
      sx={{
        backgroundColor: "#f7f7f7",
        width: "100%",
        maxHeight: "calc(100vh - 225px)",
        overflow: "auto",
        py: 1.5,
            px:2
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
                  key={paragraph.slice(0, 28) + idx}
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



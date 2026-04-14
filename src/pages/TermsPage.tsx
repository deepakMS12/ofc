import {
  Box,

  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {  useEffect, useState } from "react";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import DisclaimerPage from "./DisclaimerPage";
import RefundPolicyPage from "./RefundPolicyPage";
import AcceptableUsePage from "./AcceptableUsePage";



// Terms of Service sections
const tosSections = [
  {
    id: "introduction",
    title: "Introduction & Definitions",
    paragraphs: [
      `"OFC", "we", "us", or "our" refers to the single-owner Indian business that operates https://wa.ajaxter.com.`,
      `"Service" refers to the OFC web dashboard and REST API that allow you to send WhatsApp messages through an unofficial WebSocket session.`,
      `"Content" includes any text, media, file, template, contact list, or payload you upload or send via the Service.`,
      `"WhatsApp" refers to the consumer and business messaging products owned by Meta Platforms Inc.`,
      `"Beta Feature" denotes any module labelled "beta", "labs", "preview", or "experimental" inside the dashboard.`,
    ],
  },
  {
    id: "service-nature",
    title: "Service Nature & Responsibility",
    paragraphs: [
      "OFC is a personal, non-registered project created for the community. It is not incorporated, backed, or sponsored by any company, and it is provided purely on a best-effort basis.",
      "We connect to WhatsApp using popular open-source libraries such as Baileys and whatsapp-web.js. This approach is unofficial and may violate WhatsApp or Meta policies. Use of the Service is entirely at your own risk.",
      "OFC only collects the minimum information required to provision an account—typically name, email address, and mobile number. No WhatsApp messages, contact lists, or media payloads are stored on our servers.",
      "Because the connectivity layer is unofficial, any WhatsApp ban, throttle, or enforcement action remains the sole responsibility of the user. OFC cannot prevent, reverse, or appeal such bans.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility & Account Creation",
    bullets: [
      "You must be an individual aged 18+ or a validly existing business entity.",
      "One human may not control more than one free-tier account.",
      "Corporate users must appoint an Authorised Representative who can legally bind the entity.",
      "We may request government photo-ID if fraud risk is detected.",
    ],
  },
  {
    id: "service-description",
    title: "Service Description & Plans",
    bullets: [
      "Free Plan: 50 outbound messages/day, 1 device, 3-day analytics retention, community support.",
      "Pro Plan: 15,000 messages/month, 2 devices, 30-day analytics, webhook access, email support.",
      "Business Plan: 100,000 messages/month, 5 devices, unlimited retention, priority support, API 5 req/s.",
      "All limits are soft. We queue messages rather than drop them, but queue times over 60s count as downtime for SLA purposes.",
    ],
  },
  {
    id: "sla",
    title: "SLA & Service Credits",
    bullets: [
      "Monthly Uptime = (total minutes – downtime) ÷ total minutes.",
      "If uptime < 99% we credit 5% of the monthly fee; < 95% = 10%; < 90% = 25%.",
      "Downtime excludes WhatsApp outages, customer ISP issues, scheduled maintenance announced 24h ahead, Beta Features, and force majeure.",
    ],
  },
  {
    id: "unofficial",
    title: "Unofficial WhatsApp Connection – Risk Acknowledgement",
    bullets: [
      "You personally scan the QR code; we never store the QR secret.",
      "WhatsApp may throttle, rate-limit, or permanently ban the connected number.",
      "You waive claims against OFC for any resulting loss of chats, customer data, or business revenue.",
    ],
  },
  {
    id: "acceptable-use",
    title: "User Responsibilities & Acceptable Use",
    bullets: [
      "Maintain opt-in proof for every recipient (screenshot or CSV with timestamp).",
      "Include your legal business name and an opt-out sentence in the first message of any bulk campaign.",
      "Do not spoof sender ID, harvest random numbers, or evade caps by creating multiple accounts.",
      "Comply with TRAI (India), CAN-SPAM (US), CASL (Canada), GDPR (EU), PDPA (Malaysia), and any other applicable regulation.",
    ],
  },
  {
    id: "third-party",
    title: "Third-Party Integrations",
    paragraphs: [
      "If you connect Zapier, Pabbly, Make, or our REST API you remain the data controller; we act as the processor. Message payloads are only retained for 6 hours inside an error-debug queue.",
    ],
  },
  {
    id: "payments",
    title: "Payment, Tax & Invoicing",
    bullets: [
      "All plans are prepaid; once paid, amounts are non-refundable under any circumstance.",
      "Payment details collected at checkout are limited to payer name, plan name, billing address, email, and mobile number. We do not request GST information.",
      "Plans never auto-upgrade or auto-downgrade. Switching tiers requires a manual request; non-compliant usage may be suspended until the change is completed.",
      "Cards auto-renew; failure after 3 retries suspends the account. Reactivation requires addressing the outstanding balance manually.",
    ],
  },
  {
    id: "refund",
    title: "Refunds & Chargebacks",
    paragraphs: [
      "Refund window: 7 days after the first-ever payment OR until 50% of quota is consumed (whichever happens first).",
      "After that we refund only if SLA uptime in that month drops below 95% and you request it in writing within 5 days of month end.",
      "Chargebacks automatically freeze the account until the payment gateway closes the dispute; re-activation fee is $15.",
    ],
  },
  {
    id: "termination",
    title: "Termination & Suspension",
    bullets: [
      "We may suspend without notice if WhatsApp flags your number for spam, if law-enforcement requests it, or if bounce/block rate exceeds 5% in 24h.",
      "You may delete your account at any time; deletion wipes keys, analytics, and webhook endpoints. Cold backups purge within 30 days.",
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention After Termination",
    bullets: [
      "When you delete your account, the profile, WhatsApp session keys, analytics, webhooks, and stored metadata are destroyed immediately and cannot be recovered.",
      "Backups containing your information automatically expire within 30 days.",
      "Email correspondences or support tickets may persist longer if required by law, but are disassociated from active services.",
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimer & Limitation of Liability",
    paragraphs: [
      "Maximum aggregate liability is limited to the fees you paid us in the 12 months preceding any event.",
      "We are not liable for indirect, special, or consequential loss, including WhatsApp bans, ad spend, or lost profits.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Integrations",
    paragraphs: [
      "You remain responsible for compliance with global privacy regulations. OFC handles data only as required to provide the Service and in accordance with our Privacy Policy.",
    ],
  },
  {
    id: "law",
    title: "Governing Law & Dispute Resolution",
    paragraphs: [
      "Indian laws govern these Terms. Courts at Kolkata, West Bengal have exclusive jurisdiction.",
      "Parties agree to attempt 30 days of good-faith negotiation, followed by mediation under the Indian Arbitration & Conciliation Act (seat: Kolkata) before initiating litigation.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    paragraphs: [
      "We will notify you by email or in-dashboard banner 15 days before material changes. Continued use signifies acceptance. If you do not agree, you may export your data and delete the account.",
    ],
  },
];


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 0.5 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface TermsPageProps {
  initialTab?: number;
  onTabChange?: (tabIndex: number) => void;
}

export default function TermsPage({ initialTab = 0, onTabChange }: TermsPageProps) {
  const [value, setValue] = useState(initialTab);


  // Update tab when initialTab prop changes
  useEffect(() => {
    setValue(initialTab);
  }, [initialTab]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event)
    setValue(newValue);
    // Notify parent component about tab change
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  return (
    <Box sx={{ bgcolor: "transparent", display: "flex", overflow: "hidden" }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          height: "calc(100vh - 220px)",
          overflow: "hidden",
          minWidth: "20%",
          textAlign: "left",

          // Move indicator to the left
          "& .MuiTabs-indicator": {
            left: 0,
            right: "auto",
            width: "6px",
            textAlign: "left",

            backgroundColor: "primary.main",
          },
          "& .MuiTab-root.Mui-selected": {
            backgroundColor: "#fff",
            color: "#000",
            fontWeight: "bold",
          },
        }}
      >
        <Tab
          sx={{ alignItems: "flex-start" }}
          label="Terms of Service (ToS)"
          {...a11yProps(0)}
        />
        <Tab
          label="Privacy Policy"
          sx={{ alignItems: "flex-start" }}
          {...a11yProps(1)}
        />
        <Tab
          label="Disclaimer"
          sx={{ alignItems: "flex-start" }}
          {...a11yProps(2)}
        />
        <Tab
          label="Refund Policy"
          sx={{ alignItems: "flex-start" }}
          {...a11yProps(3)}
        />
        <Tab
          label="Acceptable Use Policy"
          sx={{ alignItems: "flex-start" }}
          {...a11yProps(4)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
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
        
          {tosSections.map((section) => {
            return (
              <Accordion
                key={section.id}
                id={section.id}
                sx={{
                  mb: 2,

                     minWidth: "100%",
                  "& .MuiAccordionSummary-root.Mui-expanded": {
                    backgroundColor: "#f5f5f5",
                    width: "100%",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${section.id}-content`}
                  id={`${section.id}-header`}
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
                      key={paragraph.slice(0, 25) + idx}
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PrivacyPolicyPage />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DisclaimerPage />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <RefundPolicyPage />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <AcceptableUsePage />
      </TabPanel>
    </Box>
  );
}


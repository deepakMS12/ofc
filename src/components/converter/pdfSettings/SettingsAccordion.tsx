import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

export type SettingsAccordionProps = {
  /** Stable id for a11y (`${id}-content`, `${id}-header`). */
  id: string;
  title: string;
  defaultExpanded?: boolean;
  children: ReactNode;
};

/** Shared accordion shell for converter tool panels (outlined, subtitle title). */
export function SettingsAccordion({
  id,
  title,
  defaultExpanded,
  children,
}: SettingsAccordionProps) {
  return (
    <Accordion elevation={0} defaultExpanded={defaultExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`${id}-content`}
        id={`${id}-header`}
      >
        <Typography sx={{ fontSize: 16 }} variant="subtitle2">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

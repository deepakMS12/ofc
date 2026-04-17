import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  TextField,
  Typography,
} from "@mui/material";

const PDFMerge = () => {
  return (
    <div style={{ minHeight: "100%", position: "relative", maxHeight: 400, overflow: "auto"}}>
        <Alert severity="warning">Upload at least two .pdf files. Merge order matches the order shown in the file picker.</Alert>
      <Accordion elevation={0} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{ fontSize: 16 }} variant="subtitle2">
            Passwords for inputs <span style={{ fontSize: 12 }}>(optional JSON array, one string per file)</span>
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
          />
        </AccordionDetails>
      </Accordion>
          <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{ fontSize: 16 }} variant="subtitle2">
            Simple open password <span style={{ fontSize: 12 }}>(merged PDF only)</span>
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
          />
        </AccordionDetails>
      </Accordion>
 
      <div
        style={{
          position: "absolute",
          bottom: 4,
          width: "100%",
          padding: "0 18px",
        }}
      >
        <TextField
          id="outlined-basic"
          variant="outlined"
          label="Output File (optional)"
          fullWidth
          size="small"
        />
      </div>
    </div>
  );
};

export default PDFMerge;

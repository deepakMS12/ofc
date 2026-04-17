import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  TextField,
  Typography,
} from "@mui/material";

const URLtoPDF = () => {
  return (
    <div style={{ minHeight: "100%", position: "relative", maxHeight: 400, overflow: "auto"}}>
    
      <Accordion elevation={0} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{ fontSize: 16 }} variant="subtitle2">
           Source
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
    
           <TextField
            id="outlined-basic"
            variant="outlined"
            label="URL"
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
          Page size & orientation
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
        <Box>
              <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
          />
        </Box>
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

export default URLtoPDF;

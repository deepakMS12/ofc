import { Box, TextField, Typography } from "@mui/material";

const PDFCompress = () => {
  return (
    <div style={{ minHeight: "100%", position: "relative" }}>
      <Box sx={{ px: 2 }}>
        <Typography gutterBottom sx={{ fontSize: 16 }} variant="subtitle2">
          PDF Password (optional)
        </Typography>

        <TextField
          id="outlined-basic"
          variant="outlined"
          fullWidth
          size="small"
        />
      </Box>
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
          label="Output name"
          fullWidth
          size="small"
        />
      </div>
    </div>
  );
};

export default PDFCompress;

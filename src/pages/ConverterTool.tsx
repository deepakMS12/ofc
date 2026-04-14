import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { converters } from "../data/converters";

const ConverterTool = () => {
  const { slug } = useParams();
  const tool = converters.find((c) => c.slug === slug);

  return (
    <Box sx={{ p: 4 }}>
      <Button
        component={RouterLink}
        to="/home/converter"
        variant="text"
        size="small"
        sx={{ mb: 2, px: 0 }}
      >
        ← All converters
      </Button>
      {tool ? (
        <>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            {tool.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {tool.description}
          </Typography>
          <Box
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              bgcolor: "action.hover",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Drop files here or click to upload — converter UI coming next.
            </Typography>
          </Box>
        </>
      ) : (
        <Typography color="text.secondary">
          This converter was not found.{" "}
          <RouterLink to="/home/converter">Back to list</RouterLink>
        </Typography>
      )}
    </Box>
  );
};

export default ConverterTool;

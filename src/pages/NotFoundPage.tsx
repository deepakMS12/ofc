import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import buildings from '@/assets/buildings.png';
export default function NotFoundPage() {
  const navigate = useNavigate();



  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      bgcolor="background.default"
      p={4}
    >
      <img
        src={buildings}
        alt="Not Found Illustration"
        style={{ width: 180, marginBottom: 32, opacity: 0.85 }}
      />
      <Typography
        variant="h1"
        color="primary"
        gutterBottom
        sx={{ fontWeight: 700, fontSize: { xs: 60, md: 96 } }}
      >
        404
      </Typography>
      <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 400, mb: 3 }}>
        Sorry, the page you are looking for doesn&apos;t exist or has been moved. Please check the URL
        or return to the homepage.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/home/dashboard")} sx={{ mt: 2, px: 4, py: 1 }}>
        Go to Home
      </Button>
    </Box>
  );
}

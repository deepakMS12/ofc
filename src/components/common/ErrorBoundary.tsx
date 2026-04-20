import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { colors } from '@/utils/customColor';
const errorImg = '../../assets/images/error.webp';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const DASHBOARD_PATH = '/home/dashboard';

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

 
  /** Full page navigation so the app remounts and this boundary’s error state is cleared. */
  private handleGoToDashboard = () => {
    window.location.assign(DASHBOARD_PATH);
  };

  private handleReset = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
       <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "calc(100vh - 0px)",
      }}
    >
      <Box
        component="img"
        src={errorImg}
        alt="Error"
        sx={{
          width: { xs: 100, sm: 200, md: 300 },
          height: { xs: 100, sm: 180, md: 250 },
          opacity: 0.8,
          mb: 1,
        }}
      />

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1.5,
          color: "text.primary",
        }}
      >
        Oops! Something didn’t go as planned
      </Typography>

      <Typography
        variant="body1"
        sx={{
          maxWidth: 520,

          color: "text.secondary",
          lineHeight: 1.6,
          animation: "fadeIn 0.4s ease-in",
        }}
      >
        We ran into an unexpected issue while loading this page. Don’t worry —
        your data is safe. You can try refreshing the page or return to the home
        screen to continue.
      </Typography>
      <Typography variant="caption" sx={{ my: 2, color: "text.disabled" }}>
        If the issue persists, please contact support.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
       
      <Button
          variant="contained"
          onClick={this.handleReset}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: colors.primary,
          }}
        >
          Try Again
        </Button>
        <Button
          variant="outlined"
          onClick={this.handleGoToDashboard}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
            color: colors.primary,
            borderColor: colors.primary,
          }}
          endIcon={<ArrowForward />}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


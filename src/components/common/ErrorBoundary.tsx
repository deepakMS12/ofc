import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { Home as HomeIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const PAGE_CRASH_IMAGE = '/assets/images/page-crash.webp';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

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

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            py: 4,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ pr: { md: 4 } }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      mb: 2,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                  >
                    Oops!
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      color: '#34495e',
                      mb: 2,
                      fontWeight: 500,
                    }}
                  >
                    Well, this is unexpected...
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: '#2566b0',
                      mb: 3,
                      fontWeight: 600,
                      fontStyle: 'italic',
                    }}
                  >
                    Sorry, it&apos;s not you. It&apos;s us.
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: '#2c3e50',
                      mb: 3,
                      lineHeight: 1.6,
                      fontSize: '1.1rem',
                    }}
                  >
                    An error has occurred and we&apos;re working to fix the problem!
                    <br />
                    We&apos;ll be up and running shortly.
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#7f8c8d',
                      mb: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    Our team has been notified and is working to fix the problem.
                    <br />
                    Thanks for your patience!
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleReload}
                      startIcon={<RefreshIcon />}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      Reload Page
                    </Button>

                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        window.location.href = '/';
                      }}
                      startIcon={<HomeIcon />}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      Go Home
                    </Button>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: { xs: '300px', md: '500px' },
                  }}
                >
                  <Box
                    component="img"
                    src={PAGE_CRASH_IMAGE}
                    alt="Page crashed illustration"
                    sx={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '500px',
                      maxHeight: '500px',
                      objectFit: 'contain',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

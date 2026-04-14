import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import ThemeProvider from '@/components/providers/ThemeProvider';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { ErrorBoundary, ScrollToTop, SimpleErrorBoundary } from '@/components/common';
import HomeLayout from '@/pages/HomeLayout';
import TermsPage from '@/pages/TermsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import DisclaimerPage from '@/pages/DisclaimerPage';
import RefundPolicyPage from '@/pages/RefundPolicyPage';
import AcceptableUsePage from '@/pages/AcceptableUsePage';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import VerifyEmailChangePage from '@/pages/VerifyEmailChangePage';
import {
  Dashboard,
  RegisterDevice,
  SendMessageOptions,
  History,
  Settings,
  ApiPortal,
  UploadLink,
  FileManager,
  Plans,
} from '@/components/pages';
import SignInPage from './pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import ConverterPage from '@/pages/ConverterPage';
import ConverterTool from '@/pages/ConverterTool';

export default function App() {
  return (
    <SimpleErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop />
          <ThemeProvider>
            <SnackbarProvider>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/singup" element={<Navigate to="/signup" replace />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/disclaimer" element={<DisclaimerPage />} />
                  <Route path="/refund" element={<RefundPolicyPage />} />
                  <Route path="/acceptable-use" element={<AcceptableUsePage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email-change" element={<VerifyEmailChangePage />} />
                  <Route path="/home" element={<HomeLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="devices/register" element={<RegisterDevice />} />
                    <Route path="send-message" element={<SendMessageOptions />} />
                    <Route path="history" element={<History />} />
                    <Route path="upload-link" element={<UploadLink />} />
                    <Route path="file-manager" element={<FileManager />} />
                    <Route path="converter" element={<ConverterPage />} />
                    <Route path="converter/:slug" element={<ConverterTool />} />
                    <Route path="transactions" element={<Navigate to="/home/converter" replace />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="api" element={<ApiPortal />} />
                    <Route path="plans" element={<Plans />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </ErrorBoundary>
            </SnackbarProvider>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </SimpleErrorBoundary>
  );
}



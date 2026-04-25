import { useState } from "react";
import type { FormEvent } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AuthOrDivider,
  AuthSplitLayout,
  BRAND_GREEN,
  SocialAuthButtons,
} from "../components/auth/AuthUi";
import { AuthActionButton, ValidatedTextField } from "@/components/common";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/thunks/authThunks";
import { useToast } from "@/hooks/useToast";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((s) => s.auth.isLoading);
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmailOrUsername = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "Email or username is required.";
    if (trimmed.includes("@")) {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      if (!validEmail) return "Enter a valid email address.";
    }
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextEmailError = validateEmailOrUsername(email);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) return;

    try {
      const response = await dispatch(
        loginUser({ username: email.trim(), password }),
      ).unwrap();

      if (!response?.success) {
        showToast(response?.message || "Login failed. Please try again.", "error");
        return;
      }

      if (response?.message) {
        showToast(response.message, "success");
      }

      const from =
        (location.state as { from?: string } | null)?.from ?? "/home/dashboard";
      navigate(from.startsWith("/") ? from : "/home/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Login failed. Please try again.";
      showToast(errorMessage, "error");
    }
  };
  const hasCredentials = !!email.trim() && !!password;
  return (
    <AuthSplitLayout maxWidth={420}>
      <Stack sx={{ width: "100%", maxWidth: 420 }}>
        <Typography
          sx={{ fontSize: 33, fontWeight: 700, mb: 1, color: "#404040" }}
        >
          Welcome to OFC
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#6b7280", mb: 1 }}>
          Sign in with your OFC account email and password.
        </Typography>

        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <ValidatedTextField
            required
            type="text"
            placeholder="Email/username *"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) {
                setEmailError(validateEmailOrUsername(event.target.value));
              }
            }}
            onBlur={() => setEmailError(validateEmailOrUsername(email))}
            autoComplete="email"
            size="small"
            errorMessage={emailError}
          />
          <ValidatedTextField
            required
            type={showPassword ? "text" : "password"}
            placeholder="Password *"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (passwordError) {
                setPasswordError(validatePassword(event.target.value));
              }
            }}
            onBlur={() => setPasswordError(validatePassword(password))}
            autoComplete="current-password"
            size="small"
            errorMessage={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              mt: -0.5,
            }}
          >
            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="none"
              sx={{ fontSize: 12, color: BRAND_GREEN, fontWeight: 600 }}
            >
              Forgot password?
            </Link>
          </Box>

          <AuthActionButton
            type="submit"
            isActive={hasCredentials}
            isLoading={isLoading}
            label="SIGN IN"
            loadingLabel="SIGNING IN…"
          />
        </Stack>

        <Typography
          sx={{ mt: 2, fontSize: 12, color: "#6b7280", textAlign: "center" }}
        >
          Don't have an OFC account?{" "}
          <Link
            component={RouterLink}
            to="/signup"
            underline="none"
            sx={{ fontSize: 12, color: BRAND_GREEN, fontWeight: 700 }}
          >
            Sign up
          </Link>
        </Typography>

        <AuthOrDivider />
        <SocialAuthButtons />
      </Stack>
    </AuthSplitLayout>
  );
};

export default SignInPage;

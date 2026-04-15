import { useState } from "react";
import type { FormEvent } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AuthOrDivider,
  AuthSplitLayout,
  BRAND_GREEN,
  SocialAuthButtons,
} from "../components/auth/AuthUi";
import { AuthActionButton } from "@/components/common";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/thunks/authThunks";
import { useSnackbar } from "@/contexts/SnackbarContext";

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.auth.isLoading);
  const { showError } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await dispatch(loginUser({ username: email.trim(), password })).unwrap();
      navigate("/home", { replace: true });
    } catch (err) {
      showError(typeof err === "string" ? err : "Sign in failed.");
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
          Demo mode: enter any email/username and password (no server). Example:{" "}
          <Box component="span" sx={{ fontWeight: 700 }}>
            demo@ofc.local
          </Box>{" "}
          /{" "}
          <Box component="span" sx={{ fontWeight: 700 }}>
            demo123
          </Box>
        </Typography>

        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            required
            placeholder="Email/username *"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            size="small"
          />
          <TextField
            required
            type={showPassword ? "text" : "password"}
            placeholder="Password *"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            size="small"
            slotProps={{
              input: {
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
              },
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

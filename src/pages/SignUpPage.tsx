import { useState } from "react";
import type { FormEvent } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { EmailOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import {
  AuthOrDivider,
  AuthSplitLayout,
  BRAND_GREEN,
  SocialAuthButtons,
} from "../components/auth/AuthUi";
import { AuthActionButton, ValidatedTextField } from "@/components/common";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("method");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newsChecked, setNewsChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const canContinue = !!email.trim() && !!name.trim() && !!password && termsChecked;

  const validateEmail = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "Enter a valid email address.";
    }
    return "";
  };

  const validateName = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "Name is required.";
    if (trimmed.length < 2) return "Name must be at least 2 characters.";
    return "";
  };

  const validatePhone = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (!/^[0-9+\-\s()]{7,}$/.test(trimmed))
      return "Enter a valid phone number.";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextEmailError = validateEmail(email);
    const nextNameError = validateName(name);
    const nextPhoneError = validatePhone(phone);
    const nextPasswordError = validatePassword(password);

    setEmailError(nextEmailError);
    setNameError(nextNameError);
    setPhoneError(nextPhoneError);
    setPasswordError(nextPasswordError);

    if (
      nextEmailError ||
      nextNameError ||
      nextPhoneError ||
      nextPasswordError
    ) {
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <AuthSplitLayout maxWidth={560}>
      <Stack sx={{ width: "100%", maxWidth: 560 }}>
        {step === "method" ? (
          <>
            <Typography
              sx={{
                fontSize: 33,
                fontWeight: 700,
                mb: 2,
                color: "#49566a",
                lineHeight: 1.1,
              }}
            >
              Create a OFC account
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                startIcon={<EmailOutlined />}
                onClick={() => setStep("form")}
                sx={{
                  justifyContent: "flex-start",
                  color: BRAND_GREEN,
                  borderColor: "#b0b0b0",
                  py: 1.4,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                REGISTER WITH EMAIL
              </Button>
              <AuthOrDivider />
              <SocialAuthButtons />
            </Stack>
          </>
        ) : (
          <Stack component="form" spacing={2.8} onSubmit={handleSubmit}>
            <Button
              variant="text"
              onClick={() => navigate("/signin")}
              sx={{
                mt: 2,
                alignSelf: "flex-start",
                p: 0,
                minWidth: 0,
                color: "#4b5563",
              }}
            >
              Back to sign in
            </Button>
            <Typography
              sx={{ fontSize: 33, fontWeight: 700, color: "#49566a", lineHeight: 1.1 }}
            >
              Create your account
            </Typography>

            <ValidatedTextField
              required
              type="email"
              placeholder="Email address *"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) {
                  setEmailError(validateEmail(event.target.value));
                }
              }}
              onBlur={() => setEmailError(validateEmail(email))}
              autoComplete="email"
              size="small"
              errorMessage={emailError}
            />
            <ValidatedTextField
              required
              type="text"
              placeholder="Name *"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (nameError) {
                  setNameError(validateName(event.target.value));
                }
              }}
              onBlur={() => setNameError(validateName(name))}
              autoComplete="name"
              size="small"
              errorMessage={nameError}
            />
            <ValidatedTextField
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                if (phoneError) {
                  setPhoneError(validatePhone(event.target.value));
                }
              }}
              onBlur={() => setPhoneError(validatePhone(phone))}
              autoComplete="tel"
              size="small"
              errorMessage={phoneError}
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
              autoComplete="new-password"
              size="small"
              errorMessage={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newsChecked}
                  onChange={(event) => setNewsChecked(event.target.checked)}
                />
              }
              label="Email me news about updates and information related to OFC"
              sx={{ color: "#475569" }}
            />
            <FormControlLabel
              required
              control={
                <Checkbox
                  checked={termsChecked}
                  onChange={(event) => setTermsChecked(event.target.checked)}
                />
              }
              label={
                <Typography sx={{ color: "#475569" }}>
                  I agree to the{" "}
                  <Box component="span" sx={{ color: BRAND_GREEN, fontWeight: 700 }}>
                    terms of use
                  </Box>{" "}
                  and handling of{" "}
                  <Box component="span" sx={{ color: BRAND_GREEN, fontWeight: 700 }}>
                    personal data.
                  </Box>
                </Typography>
              }
            />

            <AuthActionButton
              type="submit"
              isActive={canContinue}
              label="CONTINUE"
            />
          </Stack>
        )}

      </Stack>
    </AuthSplitLayout>
  );
};

export default SignUpPage;


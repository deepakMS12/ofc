import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { EmailOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { AuthOrDivider, AuthSplitLayout, BRAND_GREEN, SocialAuthButtons } from "../components/auth/AuthUi";
import { AuthActionButton } from "@/components/common";

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
  const canContinue = !!email.trim() && !!name.trim() && !!password && termsChecked;

  const handleSubmit = (event:any) => {
    event.preventDefault();
    navigate("/", { replace: true });
  };

  return (
    <AuthSplitLayout maxWidth={560}>
      <Stack sx={{ width: "100%", maxWidth: 560 }}>
        {step === "method" ? (
          <>
            <Typography sx={{ fontSize: 33, fontWeight: 700, mb: 2, color: "#49566a", lineHeight: 1.1 }}>
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
          sx={{ mt: 2, alignSelf: "flex-start", p: 0, minWidth: 0, color: "#4b5563" }}
        >
          Back to sign in
        </Button>
            <Typography sx={{ fontSize: 33, fontWeight: 700, color: "#49566a", lineHeight: 1.1 }}>
              Create your account
            </Typography>

            <TextField
              required
              placeholder="Email address *"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              size="small"
            />
            <TextField
              required
              placeholder="Name *"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              size="small"
            />
            <TextField
              placeholder="Phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              size="small"
            />
            <TextField
              required
              type={showPassword ? "text" : "password"}
              placeholder="Password *"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormControlLabel
              control={<Checkbox checked={newsChecked} onChange={(event) => setNewsChecked(event.target.checked)} />}
              label="Email me news about updates and information related to OFC"
              sx={{ color: "#475569" }}
            />
            <FormControlLabel
              required
              control={<Checkbox checked={termsChecked} onChange={(event) => setTermsChecked(event.target.checked)} />}
              label={
                <Typography sx={{ color: "#475569" }}>
                  I agree to the <Box component="span" sx={{ color: BRAND_GREEN, fontWeight: 700 }}>terms of use</Box>{" "}
                  and handling of <Box component="span" sx={{ color: BRAND_GREEN, fontWeight: 700 }}>personal data.</Box>
                </Typography>
              }
            />

            <AuthActionButton type="submit" isActive={canContinue} label="CONTINUE" />
          </Stack>
        )}

      </Stack>
    </AuthSplitLayout>
  );
};

export default SignUpPage;


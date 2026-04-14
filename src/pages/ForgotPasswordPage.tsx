import { useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthSplitLayout, BRAND_GREEN } from "../components/auth/AuthUi";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event:any) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <AuthSplitLayout maxWidth={520}>
      <Stack sx={{ width: "100%", maxWidth: 520 }} component="form" spacing={2.2} onSubmit={handleSubmit}>
        <Typography sx={{ fontSize: 33, fontWeight: 700, color: "#49566a", lineHeight: 1.1 }}>
          Forgot your password?
        </Typography>

        <TextField
          required
          placeholder="Email/username *"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          size="small"
        />
        <Typography sx={{ color: "#475569", fontSize: 15, maxWidth: 440 }}>
          Enter your email/username address and we will send you instructions to reset your password.
        </Typography>
        {sent ? (
          <Typography sx={{ color: BRAND_GREEN, fontWeight: 700 }}>
            Reset instructions sent successfully.
          </Typography>
        ) : null}

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/signin")}
            sx={{ borderColor: "#9ca3af", color: BRAND_GREEN, minWidth: 120 }}
          >
            CANCEL
          </Button>
          <Button
            type="submit"
            variant="text"
            disabled={!email}
            sx={{ color: "#9ca3af", fontSize: 12, fontWeight: 700 }}
          >
            CONTINUE
          </Button>
        </Stack>
      </Stack>
    </AuthSplitLayout>
  );
};

export default ForgotPasswordPage;


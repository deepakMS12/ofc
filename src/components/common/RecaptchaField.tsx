import { forwardRef, useImperativeHandle, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Box } from "@mui/material";
import { isRecaptchaEnabled, RECAPTCHA_SITE_KEY } from "@/lib/env";

export type RecaptchaFieldRef = {
  reset: () => void;
};

type RecaptchaFieldProps = {
  onChange: (token: string | null) => void;
  onExpired?: () => void;
};

const RecaptchaField = forwardRef<RecaptchaFieldRef, RecaptchaFieldProps>(
  ({ onChange, onExpired }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      reset: () => recaptchaRef.current?.reset(),
    }));

    if (!isRecaptchaEnabled) {
      return null;
    }

    return (
      <Box sx={{ display: "flex", justifyContent: "left" }}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={(token) => onChange(token)}
          onExpired={() => {
            onChange(null);
            onExpired?.();
          }}
        />
      </Box>
    );
  },
);

RecaptchaField.displayName = "RecaptchaField";

export default RecaptchaField;

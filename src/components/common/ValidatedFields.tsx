import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import {
  InputAdornment,
  MenuItem,
  TextField,
  type SxProps,
  type TextFieldProps,
  type Theme,
} from "@mui/material";
import type { ReactNode } from "react";

type BaseValidatedProps = Omit<TextFieldProps, "error" | "helperText"> & {
  errorMessage?: string;
  helperText?: ReactNode;
};

type SelectOption = {
  value: string | number;
  label: string;
};

type SelectValidatedProps = BaseValidatedProps & {
  options: SelectOption[];
};

const errorFieldSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: (theme) => theme.palette.error.main,
      borderWidth: 1.5,
    },
    "&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: (theme) => theme.palette.error.main,
      borderWidth: 1.5,
    },
  },
};

const buildEndAdornment = (
  hasError: boolean,
  existingEndAdornment?: ReactNode,
) => {
  if (!hasError) return existingEndAdornment;

  return (
    <>
      {existingEndAdornment}
      <InputAdornment position="end">
        <ErrorOutlineRoundedIcon color="error" fontSize="small" />
      </InputAdornment>
    </>
  );
};

export function ValidatedTextField({
  errorMessage,
  helperText,
  InputProps,
  sx,
  ...rest
}: BaseValidatedProps) {
  const hasError = Boolean(errorMessage);
  const mergedEndAdornment = buildEndAdornment(
    hasError,
    InputProps?.endAdornment,
  );

  return (
    <TextField
      {...rest}
      fullWidth={rest.fullWidth ?? true}
      error={hasError}
      helperText={errorMessage || helperText}
      sx={[errorFieldSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      InputProps={{
        ...InputProps,
        endAdornment: mergedEndAdornment,
      }}
    />
  );
}

export function ValidatedTextAreaField({
  errorMessage,
  helperText,
  rows = 4,
  multiline = true,
  InputProps,
  sx,
  ...rest
}: BaseValidatedProps) {
  const hasError = Boolean(errorMessage);

  return (
    <TextField
      {...rest}
      fullWidth={rest.fullWidth ?? true}
      multiline={multiline}
      rows={rows}
      error={hasError}
      helperText={errorMessage || helperText}
      sx={[errorFieldSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      InputProps={{
        ...InputProps,
        endAdornment: buildEndAdornment(hasError, InputProps?.endAdornment),
      }}
    />
  );
}

export function ValidatedSelectField({
  options,
  errorMessage,
  helperText,
  InputProps,
  sx,
  ...rest
}: SelectValidatedProps) {
  const hasError = Boolean(errorMessage);

  return (
    <TextField
      {...rest}
      select
      fullWidth={rest.fullWidth ?? true}
      error={hasError}
      helperText={errorMessage || helperText}
      sx={[errorFieldSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      InputProps={{
        ...InputProps,
        endAdornment: buildEndAdornment(hasError, InputProps?.endAdornment),
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

import { TextField, type TextFieldProps } from "@mui/material";

export type SettingsOutlinedFieldProps = Omit<
  TextFieldProps,
  "variant" | "size"
> & {
  variant?: TextFieldProps["variant"];
  size?: TextFieldProps["size"];
};

/** Small outlined full-width field — default styling for converter sidebars. */
export function SettingsOutlinedField({
  variant = "outlined",
  size = "small",
  fullWidth = true,
  ...rest
}: SettingsOutlinedFieldProps) {
  return (
    <TextField
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...rest}
    />
  );
}

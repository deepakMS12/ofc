import { Button } from "@mui/material";

interface AuthActionButtonProps {
  label: string;
  isActive: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  type?: "button" | "submit" | "reset";
}

export default function AuthActionButton({
  label,
  isActive,
  isLoading = false,
  loadingLabel = "PROCESSING…",
  type = "submit",
}: AuthActionButtonProps) {
  const isDisabled = !isActive || isLoading;

  return (
    <Button
      key={isActive ? "auth-btn-active" : "auth-btn-inactive"}
      type={type}
      variant={isActive ? "contained" : "text"}
      disabled={isDisabled}
      sx={{
        "&&": {
        alignSelf: "flex-start",
        minWidth: 116,
        height: 52,
        px: 3,
        borderRadius: 1.5,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        transition: "all 0.2s ease",
        ...(isActive
          ? {
              backgroundColor: "#57b746 !important",
              color: "#ffffff !important",
              borderColor: "#57b746 !important",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#4da53f !important",
                borderColor: "#4da53f !important",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.22)",
              },
            }
          : {
              backgroundColor: "transparent !important",
              color: "#9ca3af !important",
              borderColor: "#d1d5db !important",
              boxShadow: "none !important",
              "&:hover": {
                backgroundColor: "transparent !important",
                borderColor: "#d1d5db !important",
                boxShadow: "none !important",
              },
            }),
          "&.Mui-disabled": {
            opacity: isActive ? 0.9 : 1,
            backgroundColor: isActive ? "#57b746 !important" : "transparent !important",
            color: isActive ? "#ffffff !important" : "#9ca3af !important",
            borderColor: isActive ? "#57b746 !important" : "#d1d5db !important",
          },
        },
      }}
    >
      {isLoading ? loadingLabel : label}
    </Button>
  );
}

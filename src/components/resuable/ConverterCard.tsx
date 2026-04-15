import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
import { Link as RouterLink } from "react-router-dom";

const PDF_RED = "#d32f2f";

/**
 * @param {'to-pdf' | 'from-pdf' | 'single'} layout
 */
const ConverterCard = ({
  title,
  description,
  layout = "to-pdf",
  SourceIcon,
  sourceColor,
  TargetIcon,
  targetColor,
  to,
  disabled = false,
 
}:any) => {
  const renderHeader = () => {
    if (layout === "single" && SourceIcon) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <SourceIcon
            sx={{
              fontSize: 42,
              color: sourceColor,
              flexShrink: 0,
            }}
          />
        </Box>
      );
    }

    if (layout === "from-pdf" && TargetIcon) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            mb: 2,
          }}
        >
          <PictureAsPdfOutlined
            sx={{
              fontSize: 36,
              color: PDF_RED,
              flexShrink: 0,
            }}
          />
          <ChevronRightOutlined
            sx={{
              fontSize: 20,
              color: "text.disabled",
              flexShrink: 0,
            }}
          />
          <TargetIcon
            sx={{
              fontSize: 36,
              color: targetColor,
              flexShrink: 0,
            }}
          />
        </Box>
      );
    }

    /* to-pdf */
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          mb: 2,
        }}
      >
        <SourceIcon
          sx={{
            fontSize: 36,
            color: sourceColor,
            flexShrink: 0,
          }}
        />
        <ChevronRightOutlined
          sx={{
            fontSize: 20,
            color: "text.disabled",
            flexShrink: 0,
          }}
        />
        <PictureAsPdfOutlined
          sx={{
            fontSize: 36,
            color: PDF_RED,
            flexShrink: 0,
          }}
        />
      </Box>
    );
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        opacity: disabled ? 0.55 : 1,
        boxShadow: "0 2px 4px #1151a680",
        transition: "box-shadow 0.2s, border-color 0.2s, opacity 0.2s",
        "&:hover": disabled
          ? {}
          : {
              boxShadow: 2,
              borderColor: "action.disabledBackground",
            },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2 } }}>
        <Box
          component={disabled ? "div" : RouterLink}
          {...(disabled ? {} : { to })}
          sx={{
            textDecoration: "none",
            color: "inherit",
            display: "block",
            mb: 1.5,
            cursor: disabled ? "default" : "pointer",
          }}
        >
          {renderHeader()}
          <Typography
            component="h3"
            sx={{
              fontWeight: 800,
              fontSize: "0.95rem",
              letterSpacing: "0.04em",
              lineHeight: 1.3,
              mb: 1.25,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.65,
              fontSize: "0.8125rem",
            }}
          >
            {description}
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );
};

export default ConverterCard;

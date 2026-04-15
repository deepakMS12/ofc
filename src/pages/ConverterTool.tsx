import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useParams } from "react-router-dom";
import { converters } from "../data/converters";
import { colors } from "@/utils/customColor";

const ConverterTool = () => {
  const { slug } = useParams();
  const tool = converters.find((c) => c.slug === slug);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isConvertHovered, setIsConvertHovered] = useState(false);

  const sourceLabel = tool?.title?.split(" TO ")[0] || "File";

  const handlePickFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files ? Array.from(event.target.files) : [];
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    event.target.value = "";
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Box sx={{}}>
      {tool ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
            minHeight: { xs: "auto", md: "calc(100vh - 120px)" },
            border: "1px solid #ececf2",
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: { xs: 220, md: "calc(100vh - 120px)" },
              borderRight: "1px solid #ececf2",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
                color: "#2f2f33",
                borderBottom: "1px solid #ececf2",
                p: { xs: 2, md: 3 },
              }}
            >
              {tool.title.replace(" TO ", " to ")}
            </Typography>

            <Button
              variant="contained"
              onMouseEnter={() => setIsConvertHovered(true)}
              onMouseLeave={() => setIsConvertHovered(false)}
              onFocus={() => setIsConvertHovered(true)}
              onBlur={() => setIsConvertHovered(false)}
              sx={{
                m: { xs: 2, md: 3 },

                alignSelf: "stretch",
                height: 56,
                borderRadius: 2,
                textTransform: "none",
                fontSize: 18,
                fontWeight: 700,
                bgcolor: colors.primary,
                boxShadow: "none",

                "&:hover": {
                  bgcolor: "rgba(17,86,166,0.9)",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(17,86,166,0.35)",
                  color: "#fff",
                  opacity: 0.55,
                },
              }}
              endIcon={<ArrowCircleRightOutlinedIcon />}
            >
              Convert to PDF
            </Button>
            <Box
              sx={{
                position: "absolute",
                bottom: 50,
                left: "0%",

                width: "100%",
                height: 0,
                borderRadius: "50%",
                zIndex: 10,
                // transform: "translateX(-50%)",
                pointerEvents: "none",
                opacity: isConvertHovered ? 0 : 1,
                animation: isConvertHovered
                  ? "none"
                  : "btnFloatShadow 3.2s ease infinite",
                transition: "opacity 0.18s ease",
                "@keyframes btnFloatShadow": {
                  "0%": {
                    WebkitBoxShadow: "0 0 0 0 rgba(17,86,166,0.20)",
                    boxShadow: "0 0 0 0 rgba(17,86,166,0.20)",
                  },
                  "30%": {
                  
                    WebkitBoxShadow: "0 0 0 80px rgba(17,86,166,0.1)",
                    boxShadow: "0 0 0 80px rgba(17,86,166,0.1)",
                   
                  },
                  "40%": {
                    WebkitBoxShadow: "0 0 0 60px rgba(17,86,166,0.1)",
                    boxShadow: "0 0 0 80px rgba(17,86,166,0.1)",
                  },
                  "100%": {
                    WebkitBoxShadow: "0 0 0 0 rgba(17,86,166,0.1)",
                    boxShadow: "0 0 0 0 rgba(17,86,166,0.1)",
                  },
                },
              }}
            />
          </Box>
          <Box
            sx={{
              bgcolor: "#f4f4fa",
              position: "relative",
              p: { xs: 2, md: 3 },
              borderRight: { xs: "none", md: "1px solid #ececf2" },
              minHeight: { xs: 380, md: "calc(100vh - 150px)" },
            }}
          >
            <Box
              sx={{
                minHeight: { xs: 340, md: "calc(100vh - 240px)" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {files.length ? (
                <Stack
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  justifyContent="center"
                  sx={{ width: "100%" }}
                >
                  {files.map((file, idx) => (
                    <Paper
                      key={`${file.name}-${idx}`}
                      elevation={0}
                      sx={{
                        width: 144,
                        border: "1px solid #ececf2",
                        borderRadius: 2,
                        p: 1.5,
                        textAlign: "center",
                        bgcolor: "#fff",
                        position: "relative",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          borderColor: "#57b746",
                          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
                        },
                        "&:hover .remove-file-btn": {
                          opacity: 1,
                          transform: "scale(1)",
                        },
                      }}
                    >
                      <IconButton
                        className="remove-file-btn"
                        size="small"
                        onClick={() => handleRemoveFile(idx)}
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          width: 22,
                          height: 22,
                          bgcolor: "#fff",
                          border: "1px solid #e5e7eb",
                          color: "#ef4444",
                          opacity: 0,
                          transform: "scale(0.85)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "#fee2e2",
                            borderColor: "#fecaca",
                          },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Box
                        sx={{
                          width: 88,
                          height: 116,
                          mx: "auto",
                          mb: 1.5,
                          border: "1px solid #f0f0f5",
                          borderRadius: 1,
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "#fafbff",
                        }}
                      >
                        <DescriptionOutlinedIcon
                          sx={{ color: "#1565c0", fontSize: 40 }}
                        />
                      </Box>
                      <Typography
                        noWrap
                        sx={{ fontSize: 12, color: "#5f6368" }}
                      >
                        {file.name}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box
                  onClick={handlePickFiles}
                  sx={{
                    width: 225,
                    height: 270,
                    border: "1px dashed #c7c7d8",
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "#fff",
                    cursor: "pointer",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      borderColor: "#57b746",
                      boxShadow: "0 0 0 3px rgba(87, 183, 70, 0.12)",
                    },
                  }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <DescriptionOutlinedIcon
                      sx={{ color: "#1565c0", fontSize: 42 }}
                    />
                    <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                      Select {sourceLabel} file
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary">
          This converter was not found.{" "}
          <RouterLink to="/home/converter">Back to list</RouterLink>
        </Typography>
      )}

      <input
        ref={fileInputRef}
        hidden
        type="file"
        multiple
        onChange={handleFilesSelected}
      />
    </Box>
  );
};

export default ConverterTool;

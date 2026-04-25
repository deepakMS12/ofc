"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Skeleton,
  Switch,
} from "@mui/material";
import { RefreshCw, FileText, X, Key } from "lucide-react";
import LaunchIcon from "@mui/icons-material/Launch";
import { apiKeyApi } from "@/lib/api/apiKey";
import { showConfirm } from "@/lib/utils/sweetalert";
import { colors } from "@/utils/customColor";
import { useToast } from "@/hooks/useToast";

interface ApiDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ApiDrawer({ open, onClose }: ApiDrawerProps) {
 const { showToast } = useToast();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyEnabled, setApiKeyEnabled] = useState(true);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadApiKey();
    }
  }, [open]);

  const loadApiKey = async () => {
    setLoading(true);
    try {
      const data = await apiKeyApi.getApiKey();
      if (!data.success) {
        showToast(data.message || "Failed to load API key. Please try again.", "error");
        return;
      }
      setApiKey(data.apiKey || null);
      setApiKeyEnabled(data.enabled ?? false);
      setCreatedAt(data.createdAt || null);
      if (data.message) showToast(data.message, "success");
    } catch (error) {
      console.error("Failed to load API key:", error);
      showToast("Failed to load API key. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyApiKey = async () => {
    if (apiKey && apiKeyEnabled) {
      try {
        await navigator.clipboard.writeText(apiKey);
        showToast("API key copied to clipboard", "success");
      } catch (error) {
        console.error("Failed to copy:", error);
        showToast("Failed to copy API key", "error");
      }
    }
  };

  const handleEnable = async () => {
    setLoading(true);
    try {
      const response = await apiKeyApi.enableApiKey();
      if (response.success) {
        setApiKeyEnabled(true);
        if (response.apiKey) setApiKey(response.apiKey);
        if (response.createdAt) setCreatedAt(response.createdAt);
        showToast(response.message || "API key enabled successfully", "success");
      } else {
        setApiKeyEnabled(false);
        showToast(response.message || "Failed to enable API key. Please try again.", "error");
      }
    } catch (error) {
      console.error("Failed to enable API key:", error);
      showToast("Failed to enable API key. Please try again.", "error");
      setApiKeyEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      const response = await apiKeyApi.disableApiKey();
      if (response.success) {
        setApiKeyEnabled(false);
        if (response.apiKey) setApiKey(response.apiKey);
        if (response.createdAt) setCreatedAt(response.createdAt);
        showToast(response.message || "API key disabled successfully", "success");
      } else {
        setApiKeyEnabled(true);
        showToast(response.message || "Failed to disable API key. Please try again.", "error");
      }
    } catch (error) {
      console.error("Failed to disable API key:", error);
      showToast("Failed to disable API key. Please try again.", "error" );
      setApiKeyEnabled(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    const confirmed = await showConfirm({
      title: "Regenerate API Key?",
      text: "<strong>Are you sure you want to regenerate your API key? The old key will be invalidated.</strong>",
      icon: "warning",
      confirmButtonText: "<strong>Yes, regenerate it</strong>",
      cancelButtonText: '<span style="color:#555;">Cancel</span>',
      confirmButtonColor: "#f05443",
      cancelButtonColor: "#e0e0e0",
      reverseButtons: true,
    });

    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiKeyApi.regenerateApiKey();
      if (response.success && response.apiKey) {
        setApiKey(response.apiKey);
        if (response.createdAt) {
          setCreatedAt(response.createdAt);
        }
        showToast(response.message || "API key regenerated successfully", "success");
      } else {
        showToast(response.message || "Failed to regenerate API key. Please try again.", "error");
      }
    } catch (error) {
      console.error("Failed to regenerate API key:", error);
      showToast("Failed to regenerate API key. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocumentation = () => {
    window.open("http://wa-api-ajaxter.readme.io/", "_blank");
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "75%",
          maxWidth: "90vw",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Key size={22} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
              API Authorization Key
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#666" }}>
            <X size={20} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{ flex: 1, overflow: "auto", p: 4, backgroundColor: "#fafafa" }}
        >
          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              {/* Icon - API Key SVG */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Box
                    component="img"
                    src="/api.webp"
                    alt="API Key"
                    sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </Box>
              </Box>

              {loading ? (
                <Box>
                  <Skeleton
                    variant="text"
                    width={200}
                    height={20}
                    sx={{ mx: "auto", mb: 3 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={56}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={36}
                    sx={{ mx: "auto", mb: 4, borderRadius: 1 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 4,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Skeleton
                        variant="text"
                        width={200}
                        height={24}
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={36}
                          sx={{ borderRadius: 1 }}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={36}
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>
                    </Box>
                    <Skeleton
                      variant="rectangular"
                      width={140}
                      height={36}
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                </Box>
              ) : (
                <>
                  {/* Created At */}
                  {createdAt && (
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Created at: {createdAt}
                      </Typography>
                    </Box>
                  )}

                  {/* API Key Field */}
                  <Box
                    sx={{
                      mb: 4,
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      fullWidth
                      value={apiKey || ""}
                      onClick={handleCopyApiKey}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fafafa",
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleRegenerateApiKey}
                      startIcon={<RefreshCw size={18} />}
                      disabled={loading || !apiKeyEnabled}
                      sx={{
                        borderColor: "#e0e0e0",
                        color: "#666",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#bdbdbd",
                          backgroundColor: "#fafafa",
                        },
                      }}
                    >
                    </Button>
                  </Box>

                  <Divider sx={{ my: 4 }} />

                  {/* Management Controls */}
                  <Box sx={{ mb: 4 }}>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, mb: 2, color: "#333" }}
                      >
                        API Key Status :{" "}
                        {apiKeyEnabled ? "Enabled" : "Disabled"}
                      </Typography>
                      <Switch
                        checked={apiKeyEnabled}
                        onChange={(event) => {
                          if (event.target.checked) {
                            handleEnable();
                          } else {
                            handleDisable();
                          }
                        }}
                        disabled={loading}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: colors.switch,
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: colors.switch,
                            },
                          "& .MuiSwitch-switchBase": {
                            color: "#d32f2f",
                          },
                          "& .MuiSwitch-track": {
                            backgroundColor: "#f5b5b5",
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  {apiKeyEnabled && (
                    <>
                      <Divider sx={{ my: 4 }} />

                      {/* API Documentation */}
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600, mb: 2, color: "#333" }}
                        >
                          To Read API Documentation
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={handleViewDocumentation}
                          startIcon={<FileText size={20} />}
                          endIcon={<LaunchIcon />}
                          sx={{
                            backgroundColor: colors.primary,
                            color: "white",
                            textTransform: "none",
                            px: 4,
                            py: 1.5,
                            fontSize: "16px",
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: colors.primary,
                            },
                          }}
                        >
                          CLICK HERE
                        </Button>
                      </Box>
                    </>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

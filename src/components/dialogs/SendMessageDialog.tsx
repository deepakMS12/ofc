"use client";

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Chip,
  Divider,
  Link,
} from "@mui/material";
import {
  X,
  Info,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  HelpCircle,
  MessageSquareLock,
} from "lucide-react";
import { devicesApi } from "@/lib/api/devices";
import type { Device } from "@/lib/api/devices";
import { messageApi } from "@/lib/api/message";
import { applyFormatting, formatText } from "@/lib/utils/textFormatter";
import { useSnackbar } from "@/contexts/SnackbarContext";
import FormattingHelpDialog from "./FormattingHelpDialog";
import ResuableDialog from "./ResuableDialog";
import TermsPage from "@/pages/TermsPage";
import { PhoneInputField } from "@/components/common";

interface SendMessageDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SendMessageDialog({
  open,
  onClose,
}: SendMessageDialogProps) {
   const lastUpdated = "25 Nov 2025";
  const { showSuccess, showError, showWarning } = useSnackbar();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("selected");
  const [mobileNumber, setMobileNumber] = useState("");
  const [rawMessage, setRawMessage] = useState(""); // Raw markdown text
  const [attachMedia, setAttachMedia] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [formattingHelpOpen, setFormattingHelpOpen] = useState(false);
  const [openTermsDialog, setOpenTermsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const messageEditorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      loadDevices();
      setRawMessage("");
      if (messageEditorRef.current) {
        messageEditorRef.current.innerHTML = "";
        messageEditorRef.current.textContent = "";
      }
    }
  }, [open]);

  const loadDevices = async () => {
    try {
      const data = await devicesApi.getDevices();
      setDevices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load devices:", error);
      setDevices([]);
    } finally {
      setLoadingDevices(false);
    }
  };

  const handleSend = async () => {
    let messageToSend = rawMessage;
    if (!messageToSend && messageEditorRef.current) {
      const editorContent = messageEditorRef.current.textContent || "";
      messageToSend = editorContent;
    }

    if (!selectedDevice || !mobileNumber || !messageToSend.trim()) {
      showWarning("Please fill in all required fields");
      return;
    }

    // Validate mobile number format
    const mobileNumberClean = mobileNumber
      .trim()
      .replace(/\s/g, "")
      .replace(/^\+/, "");
    if (!/^[1-9]\d{1,14}$/.test(mobileNumberClean)) {
      showWarning(
        "Please enter a valid mobile number with country code (e.g., 919876543210)"
      );
      return;
    }

    setLoading(true);
    try {
      // Use deviceId directly
      const deviceId = selectedDevice === "selected" ? "" : selectedDevice;

      // Send single message
      let response;
      if (attachMedia && selectedFiles.length > 0) {
        // For media messages, we need to upload files first
        // For now, send as text with media URL placeholder
        // TODO: Implement file upload to get media URL
        response = await messageApi.sendMedia({
          deviceId,
          mobileNumber: mobileNumberClean,
          mediaUrl: "", // TODO: Upload file and get URL
          caption: messageToSend,
          mediaType: "document",
        });
      } else {
        response = await messageApi.sendText({
          deviceId,
          mobileNumber: mobileNumberClean,
          message: messageToSend,
        });
      }

      // Format success message with messageId and timestamp
      let successMessage = "Message sent successfully";
      if (response.messageId) {
        successMessage += `\nRef-ID: ${response.messageId}`;
      }
      if (response.timestamp) {
        const timestamp = new Date(response.timestamp);
        const formattedDate = timestamp.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        successMessage += `\nSent: ${formattedDate}`;
      }

      showSuccess(successMessage);
      // Small delay to ensure snackbar is visible before closing dialog
      setTimeout(() => {
        handleClose();
      }, 100);
    } catch (error: any) {
      console.error("Failed to send message:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send message. Please try again.";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMobileNumber("");
    setRawMessage("");
    setSelectedDevice("");
    setAttachMedia(false);
    setSelectedFiles([]);
    setTosAccepted(false);
    if (messageEditorRef.current) {
      messageEditorRef.current.innerHTML = "";
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    Array.from(files).forEach((file) => {
      if (validFiles.length >= 3) {
        showWarning("Maximum 3 files allowed");
        return;
      }

      if (file.size > maxSize) {
        showWarning(`File ${file.name} exceeds 5MB limit`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        showWarning(
          `File ${file.name} is not a valid office file format. Only PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX are allowed.`
        );
        return;
      }

      validFiles.push(file);
    });

    setSelectedFiles([...selectedFiles, ...validFiles].slice(0, 3));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleFormatClick = (
    formatType:
      | "bold"
      | "italic"
      | "strikethrough"
      | "code"
      | "quote"
      | "list"
      | "orderedList"
  ) => {
    if (messageEditorRef.current) {
      messageEditorRef.current.focus();
      applyFormatting(messageEditorRef.current, formatType);
      // Update raw message from editor content
      if (messageEditorRef.current.textContent) {
        setRawMessage(messageEditorRef.current.textContent);
      }
    }
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const rawText = e.currentTarget.textContent || "";
    setRawMessage(rawText);
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          maxHeight: "calc(100vh - 164px)",
          overflowY: "hidden",

          backgroundColor: "white",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MessageSquareLock size={22} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
              Send Single Message
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: "#666" }}>
            <X size={20} />
          </IconButton>
        </Box>
        <Divider />

        <Box sx={{ maxHeight: "calc(100vh - 240px)", overflowY: "scroll" }}>
          <Box sx={{ p: 3 }}>
            {/* To Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "#333", mr: 1, mb: 2 }}
                >
                  To
                </Typography>
                <PhoneInputField
                  value={mobileNumber}
                  onChange={setMobileNumber}
                  placeholder="Enter mobile number with country code"
                  defaultCountry="ua"
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ color: "#666", fontSize: "12px" }}
                >
                  Enter mobile number with country code excluding the + sign
                  (e.g., 919876543210).
                </Typography>
                <Tooltip title="Mobile number should include country code without + sign">
                  <IconButton size="small" sx={{ p: 0.5, ml: 0.5 }}>
                    <Info size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Message Section */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "#333", mr: 1 }}
                >
                  Message
                </Typography>
                <Tooltip title="Character count and message segments">
                  <IconButton size="small" sx={{ p: 0.5 }}>
                    <Info size={14} />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Device Selection */}
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  {/* <InputLabel>Device</InputLabel> */}
                  <Select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    // label="Device"
                    sx={{
                      zIndex: 0,
                    }}
                    disabled={loadingDevices}
                  >
                    <MenuItem
                      value="selected"
                      defaultValue={"Select Device"}
                      disabled
                    >
                      <em>Select Device</em>
                    </MenuItem>
                    {devices.map((device) => (
                      <MenuItem key={device.deviceId} value={device.deviceId}>
                        {device.alias || device.deviceId}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Choose one of your connected WhatsApp devices.
                  </FormHelperText>
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ color: "#666", fontSize: "12px" }}
                >
                  For India: Add correct Template ID that is approved on DLT
                  platform.
                </Typography>
              </Box>
              {/* Rich Text Editor Toolbar */}
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderBottom: "none",
                  borderRadius: "4px 4px 0 0",
                  p: 1,
                  display: "flex",
                  gap: 1,
                  backgroundColor: "#fffdf5",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Button
                  size="small"
                  sx={{ minWidth: 32, p: 0.5 }}
                  onClick={() => handleFormatClick("bold")}
                  title="Bold (*text*)"
                >
                  <Bold size={16} />
                </Button>
                <Button
                  size="small"
                  sx={{ minWidth: 32, p: 0.5 }}
                  onClick={() => handleFormatClick("italic")}
                  title="Italic (_text_)"
                >
                  <Italic size={16} />
                </Button>
                <Button
                  size="small"
                  sx={{ minWidth: 32, p: 0.5 }}
                  onClick={() => handleFormatClick("strikethrough")}
                  title="Strikethrough (~text~)"
                >
                  <Strikethrough size={16} />
                </Button>
                <Button
                  size="small"
                  sx={{ minWidth: 32, p: 0.5 }}
                  onClick={() => handleFormatClick("code")}
                  title="Inline Code (`text`)"
                >
                  <Code size={16} />
                </Button>
                <Button
                  size="small"
                  sx={{ minWidth: 32, p: 0.5 }}
                  onClick={() => handleFormatClick("quote")}
                  title="Quote (> text)"
                >
                  <Quote size={16} />
                </Button>
                <Button
                  size="small"
                  sx={{ minWidth: 32, p: 0.5 }}
                  onClick={() => handleFormatClick("list")}
                  title="Bulleted List (- text or * text)"
                >
                  <List size={16} />
                </Button>
                <Button
                  size="small"
                  sx={{ minWidth: 32, p: 0.5 }}
                  onClick={() => handleFormatClick("orderedList")}
                  title="Numbered List (1. text)"
                >
                  <ListOrdered size={16} />
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title="Formatting Help">
                  <IconButton
                    size="small"
                    sx={{ p: 0.5 }}
                    onClick={() => setFormattingHelpOpen(true)}
                  >
                    <HelpCircle size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box
                component="div"
                ref={messageEditorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                onBlur={(e) => {
                  // Update formatted display when editor loses focus
                  const rawText =
                    e.currentTarget.textContent || rawMessage || "";
                  setRawMessage(rawText);
                  const formatted = formatText(rawText);
                  e.currentTarget.innerHTML = formatted || "";
                }}
                onFocus={(e) => {
                  // Show raw markdown when focused for editing
                  // Get current raw text (from textContent if available, otherwise from rawMessage)
                  const currentRaw =
                    e.currentTarget.textContent || rawMessage || "";
                  e.currentTarget.textContent = currentRaw;
                }}
                sx={{
                  minHeight: "150px",
                  padding: "14px",
                  border: "1px solid #e0e0e0",
                  borderTop: "none",
                  borderRadius: "0 0 4px 4px",
                  outline: "none",
                  backgroundColor: "#fff",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  lineHeight: "1.5",
                  "&:empty:before": {
                    content:
                      '"Type your message here... Use formatting buttons or markdown syntax..."',
                    color: "#999",
                    pointerEvents: "none",
                  },
                  "& code": {
                    fontFamily: "monospace",
                    backgroundColor: "#f5f5f5",
                    padding: "2px 4px",
                    borderRadius: "3px",
                  },
                  "& strong": {
                    fontWeight: "bold",
                  },
                  "& em": {
                    fontStyle: "italic",
                  },
                  "& del": {
                    textDecoration: "line-through",
                  },
                  "& blockquote": {
                    borderLeft: "3px solid #ccc",
                    paddingLeft: "10px",
                    margin: "5px 0",
                    color: "#666",
                    fontStyle: "italic",
                  },
                  "& ul, & ol": {
                    margin: "5px 0",
                    paddingLeft: "20px",
                  },
                }}
              />

              {/* Attach Media Checkbox */}
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={attachMedia}
                      onChange={(e) => {
                        setAttachMedia(e.target.checked);
                        if (!e.target.checked) {
                          setSelectedFiles([]);
                        }
                      }}
                      sx={{
                        color: "#0b996e",
                        "&.Mui-checked": {
                          color: "#0b996e",
                        },
                      }}
                    />
                  }
                  label="Attach media"
                />
              </Box>

              {/* Media Files */}
              {attachMedia && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    backgroundColor: "#fffdf5",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />

                  <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={selectedFiles.length >= 3}
                    sx={{
                      mb: 2,
                      borderColor: "#0b996e",
                      color: "#0b996e",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#0a7a5a",
                        backgroundColor: "rgba(11, 153, 110, 0.04)",
                      },
                    }}
                  >
                    Select Files (Max 3, 5MB each)
                  </Button>

                  {selectedFiles.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: 500 }}
                      >
                        Selected Files ({selectedFiles.length}/3):
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedFiles.map((file, index) => (
                          <Chip
                            key={index}
                            label={`${file.name} (${(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(2)}MB)`}
                            onDelete={() => handleRemoveFile(index)}
                            sx={{
                              backgroundColor: "#e8f5f0",
                              color: "#0b996e",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    sx={{ color: "#666", fontSize: "11px" }}
                  >
                    Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX | Max 3 files
                    | 5MB per file
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Divider />
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={tosAccepted}
                  onChange={(e) => setTosAccepted(e.target.checked)}
                  sx={{ color: "#0b996e" }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#333" }}>
                  I have read and agree to the{" "}
                  <Link
                    component="span"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(0);

                      setOpenTermsDialog(true);
                    }}
                    sx={{
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Terms of Service
                  </Link>{" "}
                  &{" "}
                  <Link
                    component="span"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(2);
                      setOpenTermsDialog(true);
                    }}
                    sx={{
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Disclaimer
                  </Link>
                </Typography>
              }
              sx={{ alignItems: "center", mr: { xs: 0, sm: "auto" } }}
            />
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                borderColor: "#e0e0e0",
                color: "#666",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#bdbdbd",
                  backgroundColor: "#fffdf5",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              variant="contained"
              disabled={loading || !tosAccepted}
              sx={{
                backgroundColor: tosAccepted ? "#0b996e" : "#bdbdbd",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: tosAccepted ? "#0a7a5a" : "#bdbdbd",
                },
              }}
            >
              {loading ? "Sending..." : "Review & Send"}
            </Button>
          </Box>
        </Box>
      </Box>

      <FormattingHelpDialog
        open={formattingHelpOpen}
        onClose={() => setFormattingHelpOpen(false)}
      />

      <ResuableDialog
        open={openTermsDialog}
        close={() => setOpenTermsDialog(false)}
        children={<TermsPage initialTab={activeTab} onTabChange={(tabIndex) => setActiveTab(tabIndex)} />}
        title={
          activeTab === 0
            ? "Terms of Service"
            : activeTab === 1
            ? "Privacy Policy"
            : activeTab === 2
            ? "Disclaimer"
            : activeTab === 3
            ? "Refund Policy"
            : activeTab === 4
            ? "Acceptable Use Policy"
            : ""
        }
 
        subTitle={lastUpdated}
      />
    </>
  );
}

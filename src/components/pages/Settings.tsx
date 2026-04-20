"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Chip,
  InputAdornment,
  IconButton,
  LinearProgress,
  Checkbox,
  MenuItem,
  Divider,
} from "@mui/material";
import { Activity, Edit2, User, LockKeyhole, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import { authApi, type LoginActivityEntry } from "@/lib/api/auth";
import { useToast } from "@/contexts/ToastContext";
import { showConfirm, showSuccessAlert } from "@/lib/utils/sweetalert";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, setUser } from "@/store/slices/userSlice";
import { colors } from "@/utils/customColor";

type SettingsTab = "personal" | "password" | "activity" | "delete";

const tabHashMap: Record<SettingsTab, string> = {
  personal: "personal-detail",
  password: "change-password",
  activity: "login-logs",
  delete: "delete-ac",
};

const hashToTabMap: Record<string, SettingsTab> = Object.entries(
  tabHashMap,
).reduce(
  (acc, [tabKey, hashValue]) => {
    acc[hashValue.toLowerCase()] = tabKey as SettingsTab;
    return acc;
  },
  {} as Record<string, SettingsTab>,
);

const getInitialTabFromHash = (): SettingsTab => {
  if (typeof window === "undefined") {
    return "personal";
  }
  const normalized = window.location.hash.replace(/^#/, "").toLowerCase();
  return hashToTabMap[normalized] || "personal";
};

const tabConfig: { key: SettingsTab; label: string; icon: React.ReactNode }[] =
  [
    { key: "personal", label: "Personal Details", icon: <User size={16} /> },
    {
      key: "password",
      label: "Change Password",
      icon: <LockKeyhole size={16} />,
    },
    { key: "activity", label: "Login Activity", icon: <Activity size={16} /> },
    { key: "delete", label: "Delete Account", icon: <Trash2 size={16} /> },
  ];

const deleteWarnings = [
  "Your OFC subscription and all connected numbers will be cancelled immediately.",
  "Any remaining balance or credits are non-refundable after deletion.",
  "All API integrations, webhooks, and QR/device sessions will be terminated.",
  "This email address cannot be reused to create a new OFC account.",
  "Historical logs and message history will be permanently removed.",
];

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not updated yet";
  }
  const parsed = dayjs(value);
  if (!parsed.isValid()) {
    return "Not updated yet";
  }
  return parsed.format("DD-MM-YYYY HH:mm:ss");
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.user.profile);
  const { showSuccess, showError, showWarning } = useToast();
  const [tab, setTab] = useState<SettingsTab>(getInitialTabFromHash);
  const [emailEditable, setEmailEditable] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteChecklist, setDeleteChecklist] = useState(() =>
    deleteWarnings.map(() => false),
  );
  const deletePasswordRef = useRef<HTMLInputElement | null>(null);
  const [activityFilter, setActivityFilter] = useState<"all" | "web" | "api">(
    "all",
  );
  const [activityRange, setActivityRange] = useState<"7" | "30" | "90">("90");
  const [activityLogs, setActivityLogs] = useState<LoginActivityEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [activityLastLoaded, setActivityLastLoaded] = useState<string | null>(
    null,
  );

  const allWarningsAcknowledged = deleteChecklist.every(Boolean);

  const pendingEmail = userProfile?.pendingEmail || null;
  const pendingEmailRequestedAt = userProfile?.pendingEmailRequestedAt || null;
  const lastPasswordChange = userProfile?.lastPasswordChange || null;
  const lastEmailChange = userProfile?.lastEmailChange || null;
  const lastEmailChangeLabel = formatDateTime(lastEmailChange);
  const lastPasswordChangeLabel = formatDateTime(lastPasswordChange);
  const pendingEmailRequestedLabel = pendingEmailRequestedAt
    ? formatDateTime(pendingEmailRequestedAt)
    : null;

  useEffect(() => {
    if (!emailEditable) {
      setEmailInput(userProfile?.email || "");
    }
  }, [userProfile?.email, emailEditable]);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await authApi.getProfile();
      if (response.profile) {
        dispatch(setUser(response.profile));
      }
    } catch (error) {
      console.error("Failed to refresh profile data", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!pendingEmail) {
      return;
    }
    const interval = setInterval(() => {
      fetchProfile();
    }, 5000);
    return () => clearInterval(interval);
  }, [pendingEmail, fetchProfile]);

  // useEffect(() => {
  //   const normalized = (location.hash || "").replace(/^#/, "").toLowerCase();
  //   if (!normalized && tab !== "personal") {
  //     setTab("personal");
  //     return;
  //   }
  //   const matchedTab = hashToTabMap[normalized];
  //   if (matchedTab && matchedTab !== tab) {
  //     setTab(matchedTab);
  //   }
  // }, [location.hash, tab]);

  const loadLoginActivity = useCallback(async () => {
    if (tab !== "activity") {
      return;
    }
    setActivityLoading(true);
    try {
      const response = await authApi.getLoginActivity({
        channel: activityFilter,
        days: Number(activityRange),
        limit: 50,
        page: 1,
      });
      setActivityLogs(response.entries || []);
      setActivityError(null);
      setActivityLastLoaded(new Date().toISOString());
    } catch (error) {
      console.error("Failed to load login activity", error);
      setActivityError("Unable to load login activity right now.");
    } finally {
      setActivityLoading(false);
    }
  }, [tab, activityFilter, activityRange]);

  useEffect(() => {
    if (tab === "activity") {
      loadLoginActivity();
    }
  }, [tab, loadLoginActivity]);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: SettingsTab) => {
      setTab(newValue);
      const hashValue = tabHashMap[newValue];
      navigate(
        {
          pathname: location.pathname,
          search: location.search,
          hash: hashValue ? `#${hashValue}` : "",
        },
        { replace: true },
      );
    },
    [navigate, location.pathname, location.search],
  );

  const baseInputStyles = {
    backgroundColor: "#f4f4f4",
    borderRadius: 0.5,
    "& fieldset": {
      borderColor: "#d9d9d9",
    },
    "&:hover fieldset": {
      borderColor: "#c0c0c0",
    },
    "&.Mui-focused fieldset": {
      borderColor: colors.primary,
    },
  };

  const renderPersonalForm = () => (
    <Box
      sx={{
        maxWidth: 700,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "calc(100vh - 280px)",
        mx: "auto",
      }}
    >
      <Box sx={{ textAlign: "left", mb: 3 }}>
        <Typography sx={{ mb: 1, color: "#5c5c5c", fontWeight: 500 }}>
          Full Name
        </Typography>
        <Typography sx={{ color: "#333", fontSize: "1rem", fontWeight: 600 }}>
          {userProfile?.name || "Not provided"}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "left", mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            value={emailEditable ? emailInput : userProfile?.email || ""}
            onChange={(e) => setEmailInput(e.target.value)}
            label="E-mail"
            InputProps={{
              sx: baseInputStyles,
              readOnly: !emailEditable,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleStartEditEmail}>
                    <Edit2 size={16} color="#888" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputRef={emailRef}
          />
          {emailEditable ? (
            <Button
              variant="contained"
              disabled={emailLoading}
              onClick={handleSendEmailVerification}
              sx={{
                backgroundColor: colors.primary,
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,

                minWidth: 150,
                "&:hover": { backgroundColor: "#08855d" },
              }}
            >
              {emailLoading ? "Sending..." : "Send Link"}
            </Button>
          ) : pendingEmail ? (
            <Chip
              label="Pending verification"
              sx={{
                backgroundColor: "#ffe0b2",
                color: "#a15c00",
                fontWeight: 600,
                px: 2,
              }}
            />
          ) : (
            <Chip
              label="✔ Verified"
              sx={{
                backgroundColor: "#1f9c39",
                color: "white",
                fontWeight: 600,
                px: 2,
              }}
            />
          )}
        </Box>
        {pendingEmail && !emailEditable && (
          <Typography
            variant="caption"
            sx={{ color: "#a15c00", display: "block", mt: 1 }}
          >
            Verification pending for: {pendingEmail}
            {pendingEmailRequestedLabel
              ? ` • Requested ${pendingEmailRequestedLabel}`
              : ". Please check your inbox."}
          </Typography>
        )}
        <Typography
          variant="caption"
          sx={{ color: "#6b6b6b", display: "block", mt: 1 }}
        >
          Last email change: {lastEmailChangeLabel}
        </Typography>
      </Box>
    </Box>
  );

  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (newPassword.length >= 8) strength += 30;
    if (/[A-Z]/.test(newPassword)) strength += 20;
    if (/[0-9]/.test(newPassword)) strength += 20;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 30;
    return Math.min(strength, 100);
  }, [newPassword]);

  const activitySummary = useMemo(() => {
    const success = activityLogs.filter(
      (entry) => entry.status === "SUCCESS",
    ).length;
    const total = activityLogs.length;
    const failed = total - success;
    return { success, failed, total };
  }, [activityLogs]);

  const handlePasswordSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showWarning("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showWarning("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 6) {
      showWarning("New password must be at least 6 characters long.");
      return;
    }

    setPasswordLoading(true);
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      showSuccessAlert({
        title: "Password updated successfully",
        text: "For security reasons, please log in again with your new password.",
        showConfirmButton: true,
      });
      dispatch(clearUser());
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Unable to change password. Please try again.";
      showError(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showWarning("Please enter your password to confirm.");
      return;
    }

    const confirmed = await showConfirm({
      title: "Delete Account?",
      text: "<strong>action is irreversible & will remove all your data</strong>",
      icon: "warning",
      confirmButtonText: "<strong>Yes, delete my account</strong>",
      cancelButtonText: '<span style="color:#555;">Cancel</span>',
      confirmButtonColor: "#f05443",
      cancelButtonColor: "#e0e0e0",
      reverseButtons: true,
    });

    if (!confirmed) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await authApi.deleteAccount({
        password: deletePassword,
      });
      showSuccess(response.message || "Account deleted successfully.");
      setDeletePassword("");
      setDeleteChecklist(deleteWarnings.map(() => false));
      localStorage.clear();
      dispatch(clearUser());
      sessionStorage.clear();
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Unable to delete account. Please try again.";
      showError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleWarning = (index: number) => {
    setDeleteChecklist((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  useEffect(() => {
    if (allWarningsAcknowledged && !deletePassword) {
      deletePasswordRef.current?.focus();
    }
  }, [allWarningsAcknowledged, deletePassword]);

  const handleStartEditEmail = () => {
    setEmailInput(userProfile?.email || "");
    setEmailEditable(true);
    setTimeout(() => emailRef.current?.focus(), 0);
  };

  const handleSendEmailVerification = async () => {
    const trimmed = emailInput.trim();
    if (!trimmed) {
      showWarning("Please enter a new email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      showWarning("Please enter a valid email address.");
      return;
    }
    if (trimmed.toLowerCase() === (userProfile?.email || "").toLowerCase()) {
      showWarning("Please enter a different email address.");
      return;
    }

    setEmailLoading(true);
    try {
      const response = await authApi.requestEmailChange(trimmed);
      showSuccess(
        response.message || "Verification link sent to the new email address.",
      );
      setEmailEditable(false);
      await fetchProfile();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Unable to send verification email.";
      showError(message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleResetPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const renderPasswordForm = () => {
    const strengthLabel =
      passwordStrength >= 80
        ? "Strong"
        : passwordStrength >= 50
          ? "Medium"
          : passwordStrength > 0
            ? "Weak"
            : "";

    return (
      <Box sx={{ px: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <Paper elevation={0}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              InputProps={{ sx: baseInputStyles }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{ sx: baseInputStyles }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        passwordStrength >= 80
                          ? "#1f9c39"
                          : passwordStrength >= 50
                            ? "#ff9800"
                            : "#f44336",
                    },
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "#5c5c5c", minWidth: 90, textAlign: "right" }}
              >
                {strengthLabel}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{ sx: baseInputStyles }}
            />
            <Box
              sx={{
                mt: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "flex-start",
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleResetPassword}
                  sx={{
                    textTransform: "none",
                    px: 4,
                    borderColor: "#b0b0b0",
                    color: "#6b6b6b",
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.primary,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    letterSpacing: 1,
                    px: 5,
                    "&:hover": { backgroundColor: colors.primary },
                  }}
                  disabled={
                    passwordLoading ||
                    !currentPassword ||
                    !newPassword ||
                    newPassword !== confirmPassword
                  }
                  onClick={handlePasswordSave}
                >
                  {passwordLoading ? "Saving..." : "Save"}
                </Button>
              </Box>
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "#5c5c5c", display: "block", mt: 2 }}
            >
              Last password change: {lastPasswordChangeLabel}
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              flex: 1,
              border: "1px solid #d7e3ff",
              backgroundColor: "#f1f6ff",
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "#1f3f72", mb: 0.6 }}>
              Tips for a Secure Password
            </Typography>
            <Box
              component="ul"
              sx={{ pl: 3, m: 0, color: "#505a6b", "& li": { mb: 0.75 } }}
            >
              <li>Use at least 8 characters.</li>
              <li>
                Include uppercase, lowercase, numbers, and special symbols.
              </li>
              <li>Avoid obvious patterns like qwerty or 123456.</li>
              <li>Do not include personal details (name, DOB, etc.).</li>
              <li>Never reuse passwords across services.</li>
              <li>
                Avoid repeating identical characters three times in a row.
              </li>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  };

  const renderDeleteSection = () => (
    <Box sx={{ maxWidth: 700, px: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid #ffdc6c",
          backgroundColor: "#fff1c4",
          textAlign: "left",
          color: "#5d1c1c",
          fontWeight: 600,
          mb: 4,
          mt: 2,
        }}
      >
        <Typography
          sx={{ fontWeight: 600, mb: 1, fontSize: "1.25rem", color: "#d32f2f" }}
        >
          Before you proceed
        </Typography>
        <Box
          component="ul"
          sx={{
            pl: 0,
            m: 0,
            listStyle: "none",
            "& li": {
              mb: 0.5,
              fontSize: "0.875rem",
              lineHeight: 2,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            },
          }}
        >
          {deleteWarnings.map((warning, index) => (
            <Box component="li" key={warning}>
              <Checkbox
                checked={deleteChecklist[index]}
                onChange={() => handleToggleWarning(index)}
                disabled={deleteLoading}
                color="error"
                sx={{ p: 0.5 }}
                inputProps={{
                  "aria-label": `Acknowledge warning ${index + 1}`,
                }}
              />
              <Typography component="span">{warning}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Typography sx={{ mb: 1, color: "#d32f2f", fontWeight: 500 }}>
          Confirm with your password to delete the account.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            type="password"
            fullWidth
            placeholder="Enter your password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            disabled={!allWarningsAcknowledged || deleteLoading}
            inputRef={deletePasswordRef}
            sx={{
              maxWidth: 400,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleDeleteAccount}
            disabled={
              !allWarningsAcknowledged || deleteLoading || !deletePassword
            }
            sx={{
              backgroundColor: "#f05444",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: 1,
              px: 5,
              "&:hover": { backgroundColor: "#d64939" },
            }}
          >
            {deleteLoading ? "Deleting..." : "Delete Account"}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const renderLoginActivity = () => (
    <Box sx={{}}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          px: 3,
          alignItems: "center",
        }}
      >
        <TextField
          select
          label="Channel"
          value={activityFilter}
          onChange={(e) =>
            setActivityFilter(e.target.value as "all" | "web" | "api")
          }
          sx={{ minWidth: 200 }}
          InputProps={{ sx: baseInputStyles }}
        >
          <MenuItem value="all">Web + API</MenuItem>
          <MenuItem value="web">Web only</MenuItem>
          <MenuItem value="api">API only</MenuItem>
        </TextField>
        <TextField
          select
          label="Date Range"
          value={activityRange}
          onChange={(e) =>
            setActivityRange(e.target.value as "7" | "30" | "90")
          }
          sx={{ minWidth: 200 }}
          InputProps={{ sx: baseInputStyles }}
        >
          <MenuItem value="7">Last 7 days</MenuItem>
          <MenuItem value="30">Last 30 days</MenuItem>
          <MenuItem value="90">Last 90 days</MenuItem>
        </TextField>
        <Button
          variant="outlined"
          onClick={loadLoginActivity}
          disabled={activityLoading}
          sx={{ textTransform: "none", minWidth: 120 }}
        >
          {activityLoading ? "Loading..." : "Refresh"}
        </Button>
        {activityLastLoaded && (
          <Typography
            variant="caption"
            sx={{ color: "#5c5c5c", fontWeight: 500 }}
          >
            Last synced: {formatDateTime(activityLastLoaded)}
          </Typography>
        )}
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            px: 3,
            py: 2,
            backgroundColor: "#f7f9fc",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Chip
            label={`Total: ${activitySummary.total}`}
            sx={{
              backgroundColor: "#e3f2fd",
              color: "#1565c0",
              fontWeight: 600,
            }}
          />
          <Chip
            label={`Success: ${activitySummary.success}`}
            sx={{
              backgroundColor: "#e8f5e9",
              color: "#1b5e20",
              fontWeight: 600,
            }}
          />
          <Chip
            label={`Failed: ${activitySummary.failed}`}
            sx={{
              backgroundColor: "#ffebee",
              color: "#b71c1c",
              fontWeight: 600,
            }}
          />
        </Box>

        {activityLoading && <LinearProgress sx={{ height: 4 }} />}

        <Box sx={{ p: 3 }}>
          {activityError ? (
            <Typography sx={{ color: "#b71c1c", fontWeight: 500 }}>
              {activityError}
            </Typography>
          ) : activityLogs.length === 0 ? (
            <Typography sx={{ color: "#5c5c5c" }}>
              No login activity found for the selected filters.
            </Typography>
          ) : (
            activityLogs.map((entry, index) => (
              <Box key={entry.id} sx={{ py: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: "#1f2937" }}>
                      {entry.channel === "API" ? "API Login" : "Web Login"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#5c5c5c" }}>
                      {formatDateTime(entry.loggedAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={entry.channel}
                      sx={{
                        backgroundColor:
                          entry.channel === "API" ? "#e0f7fa" : "#ede7f6",
                        color: entry.channel === "API" ? "#006064" : "#4527a0",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={entry.status === "SUCCESS" ? "Success" : "Failed"}
                      sx={{
                        backgroundColor:
                          entry.status === "SUCCESS" ? "#e8f5e9" : "#ffebee",
                        color:
                          entry.status === "SUCCESS" ? "#2e7d32" : "#c62828",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                    color: "#374151",
                  }}
                >
                  <Typography variant="body2">
                    <strong>Username:</strong> {entry.username}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {entry.email || "Not recorded"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>IP:</strong> {entry.ip}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Agent:</strong> {entry.userAgent}
                  </Typography>
                </Box>
                {entry.reason && (
                  <Typography variant="body2" sx={{ mt: 1, color: "#a15c00" }}>
                    Reason: {entry.reason}
                  </Typography>
                )}

                {index < activityLogs.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  );

  const renderTabContent = () => {
    switch (tab) {
      case "personal":
        return renderPersonalForm();
      case "password":
        return renderPasswordForm();
      case "activity":
        return renderLoginActivity();
      case "delete":
        return renderDeleteSection();
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        p: 0,
        backgroundColor: "#fffdf5",
        minHeight: "calc(100vh - 164px)",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #e5e7eb",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              py: 2,
            },
            "& .Mui-selected": {
              color:
                tab === "delete"
                  ? "#ffdc6c !important"
                  : `${colors.primary} !important`,
            },
            "& .MuiTabs-indicator": {
              backgroundColor:
                tab === "delete" ? "#ffdc6c" : `${colors.primary}`,
              height: 3,
            },
          }}
        >
          {tabConfig.map((item) => (
            <Tab
              key={item.key}
              value={item.key}
              iconPosition="start"
              icon={
                <Box sx={{ display: "flex", alignItems: "center", paddingTop: 1 }}>
                  {item.icon}
                </Box>
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", paddingTop: 1 }}>
                  {item.label}
                </Box>
              }
         
              sx={{
                gap: 1,
                "& svg": { color: "inherit" },
                ...(item.key === "delete"
                  ? {
                      ml: { xs: 0, md: "auto" },
                      color: "#c62828",
                      fontWeight: 700,
                      borderLeft: { md: "1px solid #fdeaea" },
                      borderRadius: 1,
                      "&.Mui-selected": {
                        color: "#fff !important",
                        backgroundColor: "#c62828",
                        ".MuiTab-iconWrapper": { color: "#fff !important" },
                      },
                    }
                  : {}),
              }}
            />
          ))}
        </Tabs>

        <Box
          sx={{
            py: 3,
            maxHeight: "calc(100vh - 200px)",
            minHeight: "calc(100vh - 190px)",
            overflow: "auto",
          }}
        >
          {renderTabContent()}
        </Box>
      </Paper>
    </Box>
  );
}

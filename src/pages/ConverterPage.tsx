import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import Converter from "./Converter";
import { converterSections } from "../data/converterSections";
import { OFC_CONVERTER_AUTH_TOKEN_LS_KEY } from "@/lib/api/urlToPdfClient";

const RECENT_SEARCHES_KEY = "converterRecentSearches";
const FAVORITE_SEARCHES_KEY = "converterFavoriteSearches";

function normalizeStoredConverterToken(raw: string): string {
  return raw.replace(/^Bearer\s+/i, "").trim();
}

const ConverterPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favoriteSearches, setFavoriteSearches] = useState<string[]>([]);
  const [converterAuthToken, setConverterAuthToken] = useState("");

  const saveRecentSearch = (value: string) => {
    const term = value.trim();
    if (!term) {
      return;
    }
    setRecentSearches((prev) => {
      const next = [term, ...prev.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 6);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const closeSearchModal = () => {
    saveRecentSearch(query);
    setSearchOpen(false);
  };

  const toggleFavoriteSearch = (value: string) => {
    setFavoriteSearches((prev) => {
      const exists = prev.some((item) => item.toLowerCase() === value.toLowerCase());
      const next = exists
        ? prev.filter((item) => item.toLowerCase() !== value.toLowerCase())
        : [value, ...prev.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 10);
      localStorage.setItem(FAVORITE_SEARCHES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeRecentSearch = (value: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((item) => item.toLowerCase() !== value.toLowerCase());
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const openSearch = () => setSearchOpen(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("open-converter-search", openSearch as EventListener);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("open-converter-search", openSearch as EventListener);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const shouldAutoOpen = sessionStorage.getItem("openConverterSearchOnLoad") === "1";
    if (shouldAutoOpen) {
      setSearchOpen(true);
      sessionStorage.removeItem("openConverterSearchOnLoad");
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(OFC_CONVERTER_AUTH_TOKEN_LS_KEY);
    setConverterAuthToken(saved ? normalizeStoredConverterToken(saved) : "");
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item) => typeof item === "string").slice(0, 6));
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(FAVORITE_SEARCHES_KEY);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        setFavoriteSearches(parsed.filter((item) => typeof item === "string").slice(0, 10));
      }
    } catch {
      setFavoriteSearches([]);
    }
  }, []);

  const filteredSections = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return converterSections;
    }

    return converterSections
      .map((section) => ({
        ...section,
        converters: section.converters.filter((converter) => {
          const haystack = `${converter.title} ${converter.description} ${converter.slug}`.toLowerCase();
          return haystack.includes(trimmed);
        }),
      }))
      .filter((section) => section.converters.length > 0);
  }, [query]);

  return (
    <Stack spacing={0}>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px:4,
          pt:3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            maxWidth: 420,
          }}
        >
          <TextField
            size="small"
            fullWidth
            type="password"
            label="Authorization"
            value={converterAuthToken}
            onChange={(e) => {
              const next = normalizeStoredConverterToken(e.target.value);
              setConverterAuthToken(next);
              if (next) {
                localStorage.setItem(OFC_CONVERTER_AUTH_TOKEN_LS_KEY, next);
              } else {
                localStorage.removeItem(OFC_CONVERTER_AUTH_TOKEN_LS_KEY);
              }
            }}
            slotProps={{
              input: {
                onCopy: (e: React.ClipboardEvent) => {
                  e.preventDefault();
                },
                onCut: (e: React.ClipboardEvent) => {
                  e.preventDefault();
                },
                sx: {
                  fontSize: 13,
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  pl: 0.5,
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderColor: "#e5e7eb",
              },
            }}
          />
        </Box>
      </Box>

      {filteredSections.map((section) => (
        <Converter
          key={section.id}
          title={section.title}
          converters={section.converters}
        />
      ))}

      {filteredSections.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No converters found for "{query}". Try a different keyword.
        </Alert>
      )}

      <Dialog
        open={searchOpen}
        onClose={closeSearchModal}
        fullWidth
        maxWidth={false}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(15, 23, 42, 0.35)",
            },
          },
          paper: {
            sx: {
              maxWidth: "640px",
              width: "100%",
              boxShadow: "0px 4px 16px hsla(200, 10%, 4%, 0.2)",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "hsla(215, 15%, 92%, 0.9)",
              overflow: "hidden",
            },
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "white",
            }}
          >
            <SearchIcon sx={{ color: "#2563eb" }} />
            <TextField
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  saveRecentSearch(query);
                }
              }}
              placeholder="What are you looking for?"
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 24,
                  fontWeight: 500,
                  py: 0.2,
                },
              }}
            />
            <Chip
              label="esc"
              size="small"
              onClick={closeSearchModal}
              sx={{
                fontWeight: 700,
                backgroundColor: "#f3f4f6",
                color: "#475569",
                cursor: "pointer",
              }}
            />
          </Box>

          <Box sx={{ p: 2.2, maxHeight: "60vh", overflowY: "auto" }}>
            <Stack spacing={2}>
              {recentSearches.length > 0 && (
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: "#6b7280", fontWeight: 700, letterSpacing: "0.1em" }}
                  >
                    Recent
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {recentSearches.map((item) => {
                      const isFavorite = favoriteSearches.some(
                        (favorite) => favorite.toLowerCase() === item.toLowerCase()
                      );
                      return (
                        <Paper
                          key={`recent-${item}`}
                          elevation={0}
                          onClick={() => setQuery(item)}
                          sx={{
                            border: "1px solid transparent",
                            borderRadius: "12px",
                            backgroundColor: "hsla(215, 15%, 97%, 0.4)",
                            borderColor: "hsla(215, 15%, 92%, 0.5)",
                            p: 1.2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            "&:hover": {
                              backgroundColor: "#eaf3ff",
                              borderColor: "#60a5fa",
                            },
                          }}
                        >
                          <HistoryIcon sx={{ color: "#3b82f6", fontSize: 18 }} />
                          <Typography sx={{ color: "#0f172a", fontWeight: 600, flex: 1 }}>{item}</Typography>
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleFavoriteSearch(item);
                            }}
                            aria-label={isFavorite ? "Unfavorite search" : "Favorite search"}
                          >
                            {isFavorite ? (
                              <StarIcon sx={{ color: "#2563eb", fontSize: 18 }} />
                            ) : (
                              <StarBorderIcon sx={{ color: "#64748b", fontSize: 18 }} />
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              removeRecentSearch(item);
                            }}
                            aria-label="Remove from recent"
                          >
                            <CloseIcon sx={{ color: "#64748b", fontSize: 18 }} />
                          </IconButton>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {filteredSections.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  No converters found for "{query}".
                </Typography>
              ) : (
                filteredSections.map((section) => (
                  <Box key={section.id}>
                    
                    <Box
                      sx={{
                        mt: 1,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 1,
                      }}
                    >
                      {section.converters.map((converter) => (
                        <Paper
                          key={converter.slug}
                          elevation={0}
                          onClick={() => {
                            saveRecentSearch(converter.title);
                            closeSearchModal();
                            navigate(`/home/converter/${converter.slug}`);
                          }}
                          sx={{
                            border: "1px solid transparent",
                            borderRadius: "12px",
                            backgroundColor: "hsla(215, 15%, 97%, 0.4)",
                            borderColor: "hsla(215, 15%, 92%, 0.5)",
                            p: 1.2,
                            fontWeight: 600,
                            color: "#1d4ed8",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            "&:hover": {
                              backgroundColor: "#eaf3ff",
                              borderColor: "#60a5fa",
                            },
                          }}
                        >
                          {converter.title}
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                ))
              )}
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default ConverterPage;

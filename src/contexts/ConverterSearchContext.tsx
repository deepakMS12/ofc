import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Slide,
  Stack,
  TextField,
  Typography,
  type SlideProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
import { converterSections } from "@/data/converterSections";

const RECENT_SEARCHES_KEY = "converterRecentSearches";
const FAVORITE_SEARCHES_KEY = "converterFavoriteSearches";
const OPEN_SEARCH_SESSION_KEY = "openConverterSearchOnLoad";

const muiInputShellSx: SxProps<Theme> = {
  border: "1px solid transparent",
  borderRadius: 1,
  transition: (theme) => theme.transitions.create("border-color"),
  "&:hover": {
    borderColor: "primary.main",
  },
  "&:focus-within": {
    borderColor: "primary.main",
  },
};

const searchResultCardSx = {
  border: "1px solid",
  borderColor: "hsla(215, 15%, 92%, 0.9)",
  borderRadius: "12px",
  backgroundColor: "#fff",
  p: 1.2,
  display: "flex",
  alignItems: "center",
  gap: 1.25,
  cursor: "pointer",
  transition: "all 0.15s ease",
  "&:hover": {
    backgroundColor: "#eaf3ff",
    borderColor: "#60a5fa",
    boxShadow: "0 0 0 1px rgba(96, 165, 250, 0.2)",
  },
} as const;

const searchResultIconSx = {
  width: 28,
  height: 28,
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "hsla(215, 15%, 92%, 0.9)",
  backgroundColor: "#f8fafc",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
} as const;

function resolveSearchListIcon(converter: {
  layout?: string;
  SourceIcon?: ComponentType<{ sx?: object }>;
}): ComponentType<{ sx?: object }> {
  if (converter.layout === "from-pdf") {
    return PictureAsPdfOutlined;
  }
  return converter.SourceIcon ?? PictureAsPdfOutlined;
}

function SearchResultIcon({ Icon }: { Icon: ComponentType<{ sx?: object }> }) {
  return (
    <Box sx={searchResultIconSx}>
      <Icon sx={{ color: "#2563eb", fontSize: 16 }} />
    </Box>
  );
}

export type ConverterSearchContextValue = {
  query: string;
  filteredSections: typeof converterSections;
  openSearch: () => void;
};

const ConverterSearchContext = createContext<ConverterSearchContextValue | undefined>(undefined);

const SearchPanelSlideDown = forwardRef(function SearchPanelSlideDown(
  props: SlideProps,
  ref: React.Ref<unknown>,
) {
  return <Slide {...props} direction="down" ref={ref} />;
});

export function useConverterSearch(): ConverterSearchContextValue {
  const ctx = useContext(ConverterSearchContext);
  if (!ctx) {
    throw new Error("useConverterSearch must be used within ConverterSearchProvider");
  }
  return ctx;
}

function ConverterSearchDialogShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isConverterSearchSpotlight =
    location.pathname === "/home/doc-forge" || location.pathname.startsWith("/home/doc-forge/");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favoriteSearches, setFavoriteSearches] = useState<string[]>([]);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
  }, []);

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
    const onOpen = () => openSearch();
    window.addEventListener("open-converter-search", onOpen);
    return () => window.removeEventListener("open-converter-search", onOpen);
  }, [openSearch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  useEffect(() => {
    if (sessionStorage.getItem(OPEN_SEARCH_SESSION_KEY) === "1") {
      setSearchOpen(true);
      sessionStorage.removeItem(OPEN_SEARCH_SESSION_KEY);
    }
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

  const converterByTitle = useMemo(() => {
    const map = new Map<string, (typeof converterSections)[number]["converters"][number]>();
    for (const section of converterSections) {
      for (const converter of section.converters) {
        map.set(converter.title.toLowerCase(), converter);
      }
    }
    return map;
  }, []);

  const contextValue = useMemo<ConverterSearchContextValue>(
    () => ({
      query,
      filteredSections,
      openSearch,
    }),
    [query, filteredSections, openSearch]
  );

  const paperSlotSx = useMemo(() => {
    const shared = {
      boxShadow: "0px 16px 48px hsla(200, 10%, 4%, 0.18)",
      borderRadius: "16px",
      border: "1px solid",
      borderColor: "hsla(215, 15%, 92%, 0.9)",
      overflow: "hidden",
    };
    if (!isConverterSearchSpotlight) {
      return {
        ...shared,
        width: "100%",
        maxWidth: "720px",
      };
    }
    /** Avoid `fullWidth` + width:100% here — they stretch to the viewport and read as “stuck” on one side inside the flex container. */
    return {
      ...shared,
      width: "min(94vw, 720px)",
      maxWidth: "min(94vw, 300px)",
      margin: "24px auto",
      alignSelf: "center",
      "@keyframes converterSearchPaperGrow": {
        from: {
          maxWidth: "min(94vw, 300px)",
          opacity: 0.94,
        },
        to: {
          maxWidth: "min(94vw, 720px)",
          opacity: 1,
        },
      },
      animation: "converterSearchPaperGrow 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards",
    };
  }, [isConverterSearchSpotlight]);

  return (
    <ConverterSearchContext.Provider value={contextValue}>
      {children}
      <Dialog
        open={searchOpen}
        onClose={closeSearchModal}
        fullWidth={!isConverterSearchSpotlight}
        maxWidth={false}
        {...(isConverterSearchSpotlight
          ? {
              slots: { transition: SearchPanelSlideDown },
              transitionDuration: { enter: 420, exit: 240 },
            }
          : {})}
        sx={
          isConverterSearchSpotlight
            ? {
                "& .MuiDialog-container": {
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  pt: { xs: "clamp(72px, 12vh, 140px)", md: "clamp(80px, 11vh, 150px)" },
                },
              }
            : undefined
        }
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(15, 23, 42, 0.35)",
            },
          },
          paper: {
            sx: paperSlotSx,
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
            <SearchIcon sx={{ color: "#2563eb", fontSize: 22 }} />
            <Box sx={{ ...muiInputShellSx, flex: 1, minWidth: 0, px: 0.5 }}>
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
                    fontSize: 18,
                    fontWeight: 500,
                    py: 0.2,
                    color: "#0f172a",
                    "&::placeholder": {
                      color: "#94a3b8",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
            <Chip
              label="esc"
              size="small"
              onClick={closeSearchModal}
              sx={{
                height: 24,
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: 12,
                backgroundColor: "#f8fafc",
                color: "#475569",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#eef2ff",
                  borderColor: "#bfdbfe",
                  color: "#1d4ed8",
                },
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
                      const matchedConverter = converterByTitle.get(item.toLowerCase());
                      const RecentIcon = matchedConverter
                        ? resolveSearchListIcon(matchedConverter)
                        : HistoryIcon;
                      return (
                        <Paper
                          key={`recent-${item}`}
                          elevation={0}
                          onClick={() => setQuery(item)}
                          sx={searchResultCardSx}
                        >
                          <SearchResultIcon Icon={RecentIcon} />
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
                    <Typography
                      variant="overline"
                      sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.12em" }}
                    >
                      {section.title}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 1,
                      }}
                    >
                      {section.converters.map((converter) => {
                        const ConverterIcon = resolveSearchListIcon(converter);
                        return (
                          <Paper
                            key={converter.slug}
                            elevation={0}
                            onClick={() => {
                              saveRecentSearch(converter.title);
                              closeSearchModal();
                              navigate(`/home/doc-forge/${converter.slug}`);
                            }}
                            sx={searchResultCardSx}
                          >
                            <SearchResultIcon Icon={ConverterIcon} />
                            <Typography sx={{ color: "#1d4ed8", fontWeight: 600 }}>
                              {converter.title}
                            </Typography>
                          </Paper>
                        );
                      })}
                    </Box>
                  </Box>
                ))
              )}
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </ConverterSearchContext.Provider>
  );
}

export function ConverterSearchProvider({ children }: { children: ReactNode }) {
  return <ConverterSearchDialogShell>{children}</ConverterSearchDialogShell>;
}

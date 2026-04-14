import { useCallback, useMemo, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import ConverterCard from "../components/resuable/ConverterCard";

const Converter = ({ title, converters: convertersProp = [] }:any) => {
  const [visibleSlugs, setVisibleSlugs] = useState(
    () => new Set(convertersProp.map((c:any) => c.slug))
  );
  const [disabledSlugs, setDisabledSlugs] = useState(() => new Set());

  const visibleList = useMemo(
    () => convertersProp.filter((c:any) => visibleSlugs.has(c.slug)),
    [visibleSlugs, convertersProp]
  );

  const handleDelete = useCallback((slug:any) => {
    setVisibleSlugs((prev) => {
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
    setDisabledSlugs((prev) => {
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
  }, []);

  const handleToggleDisable = useCallback((slug:any) => {
    setDisabledSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          width: "100%",

        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "text.primary",
            flexShrink: 0,
          }}
        >
          {title}
        </Typography>

        <Divider
          sx={{
            flex: 1,
            minWidth: 0,
            borderColor: "divider",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
            xl: "repeat(5, minmax(0, 1fr))",
          },
        }}
      >
        {visibleList.map((item:any) => (
          <ConverterCard
            key={item.slug}
            title={item.title}
            description={item.description}
            layout={item.layout}
            SourceIcon={item.SourceIcon}
            sourceColor={item.sourceColor}
            TargetIcon={item.TargetIcon}
            targetColor={item.targetColor}
            to={`/home/converter/${item.slug}`}
            disabled={disabledSlugs.has(item.slug)}
            onDelete={() => handleDelete(item.slug)}
            onDisable={() => handleToggleDisable(item.slug)}
          />
        ))}
      </Box>

      {visibleList.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No converters in this section. Refresh the page to restore the list.
        </Typography>
      )}
    </Box>
  );
};

export default Converter;

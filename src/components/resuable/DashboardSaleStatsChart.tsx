import { useId, useMemo } from "react";
import { LineChart, lineClasses } from "@mui/x-charts/LineChart";
import { chartsGridClasses } from "@mui/x-charts/ChartsGrid";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DEFAULT_IN_STORE = [
  3000, 1500, 3500, 2500, 3200, 7000, 2200, 3500, 3400, 6000, 6100, 8000,
];
const DEFAULT_ONLINE = [
  2500, 4200, 3000, 4000, 5500, 4800, 4500, 5900, 5700, 8900, 8200, 9000,
];

const COLOR_IN_STORE = "#58b9da";
const COLOR_ONLINE = "#82ca9d";

const formatYAxis = (value:any) => {
  if (value === 0) return "0";
  if (value >= 1000) return `${value / 1000}k`;
  return String(value);
};

const DashboardSaleStatsChart = ({
  height = 300,
  inStoreData = DEFAULT_IN_STORE,
  onlineData = DEFAULT_ONLINE,
  inStoreColor = COLOR_IN_STORE,
  onlineColor = COLOR_ONLINE,
}) => {
  const rawId = useId();
  const base = useMemo(() => rawId.replace(/:/g, ""), [rawId]);
  const gradIn = `sale-in-${base}`;
  const gradOn = `sale-on-${base}`;

  return (
    <LineChart
      height={height}
      grid={{ vertical: true, horizontal: true }}
      xAxis={[
        {
          scaleType: "point",
          data: MONTHS,
          tickLabelStyle: { fontSize: 11, fill: "rgba(0,0,0,0.55)" },
        },
      ]}
      yAxis={[
        {
          min: 0,
          max: 10_000,
          tickNumber: 6,
          valueFormatter: formatYAxis,
          tickLabelStyle: { fontSize: 11, fill: "rgba(0,0,0,0.55)" },
        },
      ]}
      series={[
        {
          id: "in-store",
          type: "line",
          label: "Test",
          data: inStoreData,
          area: true,
          curve: "natural",
          showMark: false,
          color: inStoreColor,
        },
        {
          id: "online",
          type: "line",
          label: "Online",
          data: onlineData,
          area: true,
          curve: "natural",
          showMark: false,
          color: onlineColor,
        },
      ]}
      slotProps={{
        legend: {
          //@ts-ignore
          direction: "row",
          position: { vertical: "top", horizontal: "center" },
          sx: {
            justifyContent: "center",
            "& .MuiChartsLegend-series": { gap: 2.5 },
          },
        },
      }}
      sx={{
        width: "100%",
        [`& .${lineClasses.area}[data-series="in-store"]`]: {
          fill: `url(#${gradIn})`,
          filter: "none",
        },
        [`& .${lineClasses.area}[data-series="online"]`]: {
          fill: `url(#${gradOn})`,
          filter: "none",
        },
        [`& .${lineClasses.line}`]: { strokeWidth: 2 },
        [`& .${chartsGridClasses.horizontalLine}`]: {
          stroke: "rgba(0,0,0,0.07)",
        },
        [`& .${chartsGridClasses.verticalLine}`]: {
          stroke: "rgba(0,0,0,0.12)",
          strokeDasharray: "2 4",
        },
      }}
    >
      <defs>
        <linearGradient
          id={gradIn}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor={inStoreColor} stopOpacity={0.42} />
          <stop offset="100%" stopColor={inStoreColor} stopOpacity={0.06} />
        </linearGradient>
        <linearGradient
          id={gradOn}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor={onlineColor} stopOpacity={0.42} />
          <stop offset="100%" stopColor={onlineColor} stopOpacity={0.06} />
        </linearGradient>
      </defs>
    </LineChart>
  );
};

export default DashboardSaleStatsChart;

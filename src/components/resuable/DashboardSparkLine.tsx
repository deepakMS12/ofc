import { useId, useMemo } from "react";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { lineClasses } from "@mui/x-charts/LineChart";

const defaultProfitColor = "#43a047";
const defaultLossColor = "#e53935";
const defaultNeutralColor = "#757575";

const DashboardSparkLine = ({
  data,
  height = 100,
  trend = "neutral",
  color,
  area = true,
  areaGradient = true,
  areaTopOpacity = 0.42,
  areaBottomOpacity = 0.08,
  curve = "natural",
  sx,
  ...rest
}:any) => {
  const rawId = useId();
  const areaGradientId = useMemo(
    () => `dash-spark-area-${rawId.replace(/:/g, "")}`,
    [rawId],
  );

  const lineColor =
    color ??
    (trend === "up"
      ? defaultProfitColor
      : trend === "down"
        ? defaultLossColor
        : defaultNeutralColor);

  const gradientFill =
    area && areaGradient ? `url(#${areaGradientId})` : undefined;

  return (
    <SparkLineChart
      data={data}
      height={height}
      area={area}
      curve={curve}
      color={lineColor}
      margin={2}
      sx={[
        area &&
          areaGradient && {
            [`& .${lineClasses.area}`]: {
              fill: gradientFill,
              filter: "none",
            },
          },
        ...(Array.isArray(sx) ? sx : sx != null ? [sx] : []),
      ]}
      {...rest}
    >
      {area && areaGradient ? (
        <defs>
          <linearGradient
            id={areaGradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop
              offset="0%"
              stopColor={lineColor}
              stopOpacity={areaTopOpacity}
            />
            <stop
              offset="100%"
              stopColor={lineColor}
              stopOpacity={areaBottomOpacity}
            />
          </linearGradient>
        </defs>
      ) : null}
    </SparkLineChart>
  );
};

export default DashboardSparkLine;

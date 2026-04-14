import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

const defaultValueArc = "#52b202";

const defaultPercentText = ({ value }:any) =>
  value == null ? null : `${Math.round(value)}%`;

const DashboardGauge = ({
  width = 200,
  height = 160,
  value = 0,
  cornerRadius = "50%",
  valueArcColor = defaultValueArc,
  valueFontSize = 35,
  text,
  sx,
  ...rest
}:any) => {
  return (
    <Gauge
      width={width}
      height={height}
      value={value}
      cornerRadius={cornerRadius}
      text={text ?? defaultPercentText}
      sx={[
        (theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: valueFontSize,
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: valueArcColor,
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        }),
        ...(Array.isArray(sx) ? sx : sx != null ? [sx] : []),
      ]}
      {...rest}
    />
  );
};

export default DashboardGauge;

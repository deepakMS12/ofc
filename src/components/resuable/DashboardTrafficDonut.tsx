import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const defaultSlices = [
  { id: "a", value: 38, color: "#51A5AD" },
  { id: "b", value: 27, color: "#F28F5F" },
  { id: "c", value: 15, color: "#E8779B" },
  { id: "d", value: 15, color: "#24BBE3" },
  { id: "e", value: 5, color: "#E0E0E0" },
];

const DashboardTrafficDonut = ({
  width = 160,
  height = 150,
  innerRadius = "72%",
  outerRadius = "100%",
  paddingAngle = 4,
  cornerRadius = 4,
  centerTitle = "total",
  centerValue = "730k",
  slices = defaultSlices,
  sx,
}:any) => {
  return (
    <Box
      sx={{
        position: "relative",
        width,
        height,
        mx: "auto",
        ...sx,
      }}
    >
      <PieChart
        width={width}
        height={height}
        hideLegend
        series={[
          {
            type: "pie",
            data: slices,
            innerRadius,
            outerRadius,
            paddingAngle,
            cornerRadius,
            sortingValues: "none",
            arcLabelMinAngle: 360,
          },
        ]}
        margin={{ top: 8, bottom: 8, left: 8, right: 8 }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          pt: 0.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            textTransform: "lowercase",
            lineHeight: 1.2,
          }}
        >
          {centerTitle}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          {centerValue}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardTrafficDonut;

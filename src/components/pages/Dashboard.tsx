
import { Box, Typography, Button } from "@mui/material";
import DashboardCard from "../resuable/DashboardCard";
import DashboardSparkLine from "../resuable/DashboardSparkLine";
import DashboardGauge from "../resuable/DashboardGauge";
import DashboardTrafficDonut from "../resuable/DashboardTrafficDonut";
import DashboardSaleStatsChart from "../resuable/DashboardSaleStatsChart";
import DashboardProductTable from "../resuable/DashboardProductTable";

const formatInrAmount = (value:any) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const trendFromPercent = (pct:any) => {
  if (pct > 0) return "up";
  if (pct < 0) return "down";
  return "neutral";
};

const Dashboard = () => {
  const amount = 1700;
  const changePercent:any = 5;

  const trend = trendFromPercent(changePercent);
  const pctLabel =
    changePercent === 0
      ? "0%"
      : `${changePercent > 0 ? "+" : ""}${changePercent}%`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "20px",
      
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "16px",
        }}
      >
        <DashboardCard>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              Total
            </Typography>
            <Box
              sx={{
                textAlign: "center",
                my: 0.5,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 0.75,
              }}
            >
              <Typography variant="h6" fontWeight={700} component="span">
                INR {formatInrAmount(amount)}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                component="span"
                sx={{
                  color:
                    trend === "up"
                      ? "success.main"
                      : trend === "down"
                        ? "error.main"
                        : "text.secondary",
                }}
              >
                ({pctLabel})
              </Typography>
            </Box>
            <Button variant="outlined" sx={{borderRadius: 50,  my: 2}}>View Report</Button>
          </Box>
        </DashboardCard>
        <DashboardCard>
          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              Graph
            </Typography>
            <Box
              sx={{
                textAlign: "center",
                my: 0.5,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 0.75,
              }}
            >
              <Typography variant="h6" fontWeight={700} component="span">
                INR {formatInrAmount(amount)}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                component="span"
                sx={{
                  color:
                    trend === "up"
                      ? "success.main"
                      : trend === "down"
                        ? "error.main"
                        : "text.secondary",
                }}
              >
                ({pctLabel})
              </Typography>
            </Box>
            <DashboardSparkLine
              data={[1, 4, 2, 5, 7, 2, 4, 6]}
              height={100}
              trend={trend}
            />
          </Box>
        </DashboardCard>
        <DashboardCard>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              Graph
            </Typography>
            <DashboardGauge width={150} value={60} />
          </Box>
        </DashboardCard>
        <DashboardCard>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              Graph
            </Typography>

            <DashboardTrafficDonut />
          </Box>
        </DashboardCard>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 335px",
          gap: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            height: "100%",
            width: "100%",
            minHeight: "300px",
            borderRadius: "12px",
            border: "1px solid #bdbdbd",
          }}
        >
          <Box sx={{ p: 2, width: "100%", boxSizing: "border-box" }}>
            <DashboardSaleStatsChart height={300} />
          </Box>
        </div>
        <div>
          <div
            style={{
              backgroundColor: "white",
              height: "100%",
              width: "100%",
              minHeight: "350px",
              borderRadius: "12px",
              border: "1px solid #bdbdbd",
            }}
          >
            <Box sx={{ p: 2, width: "100%", boxSizing: "border-box" }}>
              <DashboardProductTable />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

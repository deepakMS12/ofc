import { Box, Divider, Paper, Typography } from "@mui/material";
import { List, Users, Megaphone, Mail } from "lucide-react";

/* ── tiny SVG line chart ── */
function MiniLineChart({
  data,
  color = "#1156a6",
  labels,
}: {
  data: number[];
  color?: string;
  labels: string[];
}) {
  const W = 500;
  const H = 140;
  const PX = 46;
  const PY = 16;
  const cw = W - PX * 2;
  const ch = H - PY * 2 - 20; // leave room for x labels

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data
    .map((v, i) => {
      const x = PX + (i / (data.length - 1)) * cw;
      const y = PY + ch - ((v - min) / range) * ch;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // y-axis ticks (5 steps)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = min + (range * i) / 4;
    const y = PY + ch - (i / 4) * ch;
    return { val: Math.round(val), y };
  });

  // x-axis labels — show every ~3rd
  const step = Math.ceil(data.length / 6);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      {/* grid lines */}
      {yTicks.map(({ y }, i) => (
        <line
          key={i}
          x1={PX}
          y1={y}
          x2={W - PX}
          y2={y}
          stroke="#e8e8e8"
          strokeWidth="1"
        />
      ))}

      {/* y-axis labels */}
      {yTicks.map(({ val, y }, i) => (
        <text
          key={i}
          x={PX - 6}
          y={y + 4}
          textAnchor="end"
          fontSize="10"
          fill="#aaa"
        >
          {val}
        </text>
      ))}

      {/* x-axis labels */}
      {data.map((_, i) => {
        if (i % step !== 0 && i !== data.length - 1) return null;
        const x = PX + (i / (data.length - 1)) * cw;
        return (
          <text
            key={i}
            x={x}
            y={H - 2}
            textAnchor="middle"
            fontSize="10"
            fill="#aaa"
          >
            {labels[i]}
          </text>
        );
      })}

      {/* line */}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.75" />

      {/* dots */}
      {data.map((v, i) => {
        const x = PX + (i / (data.length - 1)) * cw;
        const y = PY + ch - ((v - min) / range) * ch;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill={color}
            stroke="#fff"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}

/* ── dates ── */
const dates = [
  "18 May","19 May","20 May","21 May","22 May","23 May","24 May",
  "25 May","26 May","27 May","28 May","29 May","30 May","31 May","01 Jun",
];

const viewsData   = [208,204,198,196,170,168,175,178,195,192,168,186,188,175,170];
const clicksData  = [170,155,151,150,175,195,191,182,170,168,170,165,186,182,170];

/* ── stat card ── */
type StatRow = { label: string; value: string };
function StatCard({
  icon: Icon,
  count,
  label,
  rows,
  iconColor,
}: {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  count: string | number;
  label: string;
  rows?: StatRow[];
  iconColor?: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{ border: "1px solid #e8e8e8", borderRadius: 1, p: 2.5, display: "flex", gap: 3 }}
    >
      {/* left */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 80 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Icon size={18} color={iconColor ?? "#444"} strokeWidth={1.5} />
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>
            {count}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "0.8125rem", color: "#888" }}>{label}</Typography>
      </Box>

      {/* right — detail rows */}
      {rows && rows.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem sx={{ borderColor: "#f0f0f0" }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, justifyContent: "center" }}>
            {rows.map((r) => (
              <Typography key={r.label} sx={{ fontSize: "0.8rem", color: "#666" }}>
                {r.value}{" "}
                <Box component="span" sx={{ color: "#1156a6" }}>
                  {r.label}
                </Box>
              </Typography>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}

export default function NewsletterDashboard() {
  return (
    <Box sx={{ p: "20px", display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Stat cards — 2×2 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        <StatCard
          icon={List}
          count={2}
          label="Lists"
          iconColor="#1156a6"
          rows={[
            { value: "1", label: "Public" },
            { value: "1", label: "Private" },
            { value: "1", label: "Single opt-in" },
            { value: "1", label: "Double opt-in" },
          ]}
        />
        <StatCard
          icon={Users}
          count={102}
          label="Subscribers"
          iconColor="#1156a6"
          rows={[
            { value: "0", label: "Blocklisted" },
            { value: "0", label: "Orphans" },
          ]}
        />
        <StatCard
          icon={Megaphone}
          count={2}
          label="Campaigns"
          iconColor="#1156a6"
          rows={[
            { value: "1", label: "Draft" },
            { value: "1", label: "Finished" },
          ]}
        />
        <StatCard
          icon={Mail}
          count={1}
          label="Messages sent"
          iconColor="#1156a6"
        />
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Paper elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 1, p: 2 }}>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#444", mb: 1 }}>
            Campaign views
          </Typography>
          <Box sx={{ height: 160 }}>
            <MiniLineChart data={viewsData} labels={dates} color="#1156a6" />
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ border: "1px solid #e8e8e8", borderRadius: 1, p: 2 }}>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#444", mb: 1 }}>
            Link clicks
          </Typography>
          <Box sx={{ height: 160 }}>
            <MiniLineChart data={clicksData} labels={dates} color="#1156a6" />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

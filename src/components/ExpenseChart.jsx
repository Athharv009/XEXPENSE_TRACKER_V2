import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const RADIAN = Math.PI / 180;
const COLORS = ["#A000FF", "#FF9304", "#FDE006"];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" style={{ fontSize: 12, fontWeight: 600 }}>
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ExpenseChart({ data = [] }) {
  const allZero = data.length === 0 || data.every((d) => !d.value);
  if (allZero) return null;

  return (
    <div style={{ position: "relative", width: "199px", height: "199px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} labelLine={false} label={renderCustomizedLabel} dataKey="value">
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

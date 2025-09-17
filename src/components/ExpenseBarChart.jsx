import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#8076d1", "#8076d1", "#8076d1"];

export default function ExpenseBarChart({ data = [] }) {
  const orderedData = [
    {
      name: "Entertainment",
      value: data.find((d) => d.name === "Entertainment")?.value || 0,
    },
    {
      name: "Food",
      value: data.find((d) => d.name === "Food")?.value || 0,
    },
    {
      name: "Travel",
      value: data.find((d) => d.name === "Travel")?.value || 0,
    },
  ];

  const allZero = orderedData.every((d) => !d.value);

  return (
    <div style={{ width: "100%", height: 250 }}>
      {allZero ? (
        <div style={{ padding: "20px", fontSize: "16px", lineHeight: "2"}}>
          {orderedData.map((item) => (
            <div style={{marginBottom: "50px"}} key={item.name}>{item.name} -</div>
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={orderedData}
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 14 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={20}>
              {orderedData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

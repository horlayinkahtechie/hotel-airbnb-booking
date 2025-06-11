import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

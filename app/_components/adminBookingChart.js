import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BookingsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value) => [value, "Bookings"]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar dataKey="bookings" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

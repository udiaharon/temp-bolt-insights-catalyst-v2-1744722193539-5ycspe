
import { TooltipProps } from "recharts";

export const ChartTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
        <p className="text-gray-900 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-gray-800" style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

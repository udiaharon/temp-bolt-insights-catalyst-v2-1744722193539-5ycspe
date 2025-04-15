
import React from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Legend, Line } from 'recharts';
import { COMPETITOR_COLORS } from '../../../components/analysis/constants/chartColors';

interface ChartData {
  date: string;
  [key: string]: string | number;
}

interface BrandAwarenessChartProps {
  data: ChartData[];
  brands: string[];
}

export const BrandAwarenessChart: React.FC<BrandAwarenessChartProps> = ({ data, brands }) => {
  return (
    <ResponsiveContainer width={800} height={400}>
      <LineChart 
        data={data}
        margin={{ top: 5, right: 30, left: 30, bottom: 15 }}
      >
        <XAxis 
          dataKey="date" 
          padding={{ left: 30, right: 30 }}
          tick={{ fill: '#1A1F2C' }}
        />
        <YAxis hide={true} />
        <Legend 
          verticalAlign="bottom"
          height={36}
          iconType="circle"
        />
        {brands.map((brandName, index) => (
          <Line
            key={brandName}
            type="monotone"
            dataKey={brandName}
            name={brandName}
            stroke={COMPETITOR_COLORS[index]}
            strokeWidth={index === 0 ? 3 : 2}
            dot={{ fill: COMPETITOR_COLORS[index], r: index === 0 ? 4 : 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

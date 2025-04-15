
import React from 'react';
import { TrendItem } from '../TrendItem';

interface TrendItemDisplayProps {
  trends: string[];
}

export const TrendItemDisplay: React.FC<TrendItemDisplayProps> = ({ trends }) => {
  // Skip the first item as it contains category info
  const actualTrends = trends.slice(1);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actualTrends.map((trend, index) => (
        <TrendItem key={`trend-${index}`} trend={trend} index={index} />
      ))}
    </div>
  );
};

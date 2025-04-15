
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface TrendRefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TrendRefreshButton: React.FC<TrendRefreshButtonProps> = ({
  onRefresh,
  isRefreshing
}) => {
  return (
    <Button 
      onClick={onRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Refresh Trends
    </Button>
  );
};

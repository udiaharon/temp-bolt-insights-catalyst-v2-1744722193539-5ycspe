
import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { clearPerplexityCache, cancelAllPerplexityRequests } from "@/utils/perplexityApi";
import { StorageService } from "@/utils/services/StorageService";

interface TrendsButtonProps {
  onClick: () => void;
  isAnalyzing: boolean;
  currentTheme: string;
}

export const TrendsButton: React.FC<TrendsButtonProps> = ({ 
  onClick, 
  isAnalyzing, 
  currentTheme 
}) => {
  const handleClick = () => {
    // Cancel any ongoing requests
    cancelAllPerplexityRequests();
    
    // Clear only trends-related caches
    StorageService.clearAnalysisCache('trends');
    clearPerplexityCache();
    
    onClick();
  };
  
  if (currentTheme === 'default') {
    return (
      <Button 
        onClick={handleClick}
        disabled={isAnalyzing}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl text-lg font-semibold tracking-wide flex items-center justify-center"
      >
        <span className="relative flex items-center" style={{ marginRight: '-8px' }}>
          <Star 
            strokeWidth={2}
            className="animate-pulse !w-8 !h-8" 
            style={{ 
              stroke: "url(#trendsGradient)",
              verticalAlign: "middle" 
            }}
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="trendsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="50%" stopColor="#93C5FD" />
                <stop offset="100%" stopColor="#FDA4AF" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span>{isAnalyzing ? "Analyzing..." : "Latest Trends"}</span>
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={handleClick}
      disabled={isAnalyzing}
      className="w-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary hover:from-primary/30 hover:via-primary/50 hover:to-primary text-white py-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl text-lg font-semibold tracking-wide flex items-center justify-center"
    >
      <span className="relative flex items-center mr-2">
        <Star 
          strokeWidth={1.5}
          className="animate-pulse !w-8 !h-8" 
          style={{ 
            verticalAlign: "middle" 
          }}
        />
      </span>
      <span>{isAnalyzing ? "Analyzing..." : "Latest Trends"}</span>
    </Button>
  );
};

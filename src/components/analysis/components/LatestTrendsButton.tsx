
import { useEffect } from "react";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { LatestTrendsGrid } from "./LatestTrendsGrid";
import { useLatestTrends } from "@/hooks/use-latest-trends";
import { TrendsButton } from "./trends/TrendsButton";
import { useToast } from "@/components/ui/use-toast";

interface LatestTrendsButtonProps {
  brand: string;
}

export const LatestTrendsButton = ({ brand }: LatestTrendsButtonProps) => {
  const currentTheme = useThemeDetection();
  const { toast } = useToast();
  const { 
    isAnalyzing, 
    trends, 
    showTrends, 
    toggleTrendsVisibility,
    fetchTrends, 
    updateTrends, 
    checkBrandChange 
  } = useLatestTrends(brand);

  // Check if brand changed
  useEffect(() => {
    checkBrandChange();
  }, [brand, checkBrandChange]);

  const handleClick = async () => {
    console.log('Latest Trends button clicked for brand:', brand);
    
    // First try to toggle visibility of existing trends
    const hasExistingTrends = toggleTrendsVisibility();
    if (hasExistingTrends) return;
    
    // If no existing trends, fetch new ones
    await fetchTrends();
  };

  const handleTrendsRefresh = (newTrends: string[]) => {
    const success = updateTrends(newTrends);
    if (!success) {
      toast({
        title: "Error",
        description: "Received invalid data while refreshing trends.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <TrendsButton 
        onClick={handleClick}
        isAnalyzing={isAnalyzing}
        currentTheme={currentTheme}
      />
      
      {showTrends && (
        <LatestTrendsGrid 
          trends={trends} 
          isLoading={isAnalyzing} 
          brand={brand}
          onRefresh={handleTrendsRefresh}
        />
      )}
    </div>
  );
};

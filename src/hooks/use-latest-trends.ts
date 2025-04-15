import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchLatestTrends } from "@/utils/perplexity/trendAnalysis";

export function useLatestTrends(brand: string) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trends, setTrends] = useState<string[]>([]);
  const [showTrends, setShowTrends] = useState(false);
  const [currentAnalysisBrand, setCurrentAnalysisBrand] = useState("");
  const { toast } = useToast();

  const toggleTrendsVisibility = useCallback(() => {
    if (trends.length > 0) {
      setShowTrends(!showTrends);
      return true; // Indicates we just toggled visibility of existing trends
    }
    return false; // Indicates we need to fetch new trends
  }, [trends.length, showTrends]);

  const fetchTrends = useCallback(async () => {
    console.log('Fetching latest trends for brand:', brand);
    
    setIsAnalyzing(true);
    setShowTrends(true);
    
    try {
      const storedCategory = localStorage.getItem('category');
      const cachedTrends = localStorage.getItem('currentTrends');
      const cachedBrand = localStorage.getItem('currentTrendsBrand');
      
      if (cachedTrends && cachedBrand === brand) {
        try {
          const parsedTrends = JSON.parse(cachedTrends);
          if (Array.isArray(parsedTrends) && parsedTrends.length > 0) {
            console.log('Using cached trends for the current brand:', brand);
            setTrends(parsedTrends);
            setIsAnalyzing(false);
            return parsedTrends;
          }
        } catch (e) {
          console.error('Error parsing cached trends:', e);
        }
      }
      
      const latestTrends = await fetchLatestTrends(brand);
      setTrends(latestTrends);
      console.log('Successfully fetched trends:', latestTrends);
      
      localStorage.setItem('currentTrends', JSON.stringify(latestTrends));
      localStorage.setItem('currentTrendsBrand', brand);
      
      return latestTrends;
    } catch (error) {
      console.error('Error fetching latest trends:', error);
      toast({
        title: "Error",
        description: "Failed to fetch latest trends. Please try again later.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  }, [brand, toast]);

  const updateTrends = useCallback((newTrends: string[]) => {
    console.log('Trends refreshed with new data:', newTrends);
    if (Array.isArray(newTrends) && newTrends.length > 0) {
      setTrends(newTrends);
      
      localStorage.setItem('currentTrends', JSON.stringify(newTrends));
      localStorage.setItem('currentTrendsBrand', brand);
      return true;
    } else {
      console.error('Invalid trend data received for refresh:', newTrends);
      return false;
    }
  }, [brand]);

  const checkBrandChange = useCallback(() => {
    if (brand !== currentAnalysisBrand && currentAnalysisBrand !== "") {
      setTrends([]);
      setShowTrends(false);
    }
    
    setCurrentAnalysisBrand(brand);
  }, [brand, currentAnalysisBrand]);

  return {
    isAnalyzing,
    trends,
    showTrends,
    toggleTrendsVisibility,
    fetchTrends,
    updateTrends,
    checkBrandChange
  };
}

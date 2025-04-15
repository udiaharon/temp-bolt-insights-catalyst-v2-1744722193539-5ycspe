
import { AnalysisResults } from "@/components/AnalysisResults";
import { BrandContent, MarketingC, NewsItem } from "@/types/analysis";
import { useToast } from "@/components/ui/use-toast";
import { StorageService } from "@/utils/services/StorageService";

interface AnalysisResultsHandlerProps {
  brand: string;
  competitors: string[];
  marketingCs: MarketingC[];
  brandContent: BrandContent | null;
  newsItems: NewsItem[];
  latestTrends: string[];
  onReset: () => void;
  onTrendsRefresh: (trends: string[]) => void;
}

export const AnalysisResultsHandler = ({
  brand,
  competitors,
  marketingCs,
  brandContent,
  newsItems,
  latestTrends,
  onReset,
  onTrendsRefresh
}: AnalysisResultsHandlerProps) => {
  const { toast } = useToast();

  const handleReset = () => {
    onReset();
    
    // Clear ALL session flags
    StorageService.clearAnalysisCache();
    localStorage.removeItem('currentTrends');
    
    // Remove document attributes
    document.documentElement.removeAttribute('data-citation-click');
    document.documentElement.removeAttribute('data-analysis-active');
    
    toast({
      title: "Reset Complete",
      description: "Analysis results have been cleared.",
    });
  };

  const handleTrendsRefresh = (newTrends: string[]) => {
    onTrendsRefresh(newTrends);
    localStorage.setItem('currentTrends', JSON.stringify(newTrends));
  };

  return (
    <AnalysisResults
      brand={brand}
      competitors={competitors}
      marketingCs={marketingCs}
      brandContent={brandContent}
      newsItems={newsItems}
      latestTrends={latestTrends}
      onReset={handleReset}
      onTrendsRefresh={handleTrendsRefresh}
    />
  );
};

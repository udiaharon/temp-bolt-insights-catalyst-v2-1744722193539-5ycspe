
import { motion } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { InsightDialog } from "./InsightDialog";
import { fetchInsightData } from "@/utils/insightUtils";
import { InsightContent } from "./analysis/InsightContent";
import { ChatBox } from "./ChatBox";
import { ExportActions } from "./analysis/ExportActions";
import { BrandAnalysisHeader } from "./analysis/components/BrandAnalysisHeader";
import { AnalysisStateProvider } from "./analysis/components/AnalysisStateProvider";
import { useAnalysisDataPersistence } from "./analysis/components/UseAnalysisDataPersistence";
import { brandContentService } from "@/services/brandContentService";

interface Topic {
  headline: string;
  insights: string[];
}

interface MarketingC {
  title: string;
  topics: Topic[];
}

interface BrandContent {
  marketPosition: string;
  keyProducts: string;
  recentPerformance: string;
  notableAchievements: string;
}

interface NewsItem {
  title: string;
  url: string;
  date: string;
}

interface AnalysisResultsProps {
  brand: string;
  competitors: string[];
  marketingCs: MarketingC[];
  brandContent: BrandContent | null;
  newsItems: NewsItem[];
  onReset: () => void;
  latestTrends?: string[];
  isLoadingTrends?: boolean;
  onTrendsRefresh?: (trends: string[]) => void;
}

export const AnalysisResults = ({
  brand,
  competitors,
  marketingCs,
  brandContent,
  newsItems,
  onReset,
  latestTrends = [],
  isLoadingTrends = false,
  onTrendsRefresh,
}: AnalysisResultsProps) => {
  const { toast } = useToast();
  const [selectedInsight, setSelectedInsight] = useState<{
    title: string;
    insight: string;
    detailedAnalysis?: string;
    marketImpact?: string;
    competitorComparison?: string;
    futureTrends?: string;
    isLoading: boolean;
  } | null>(null);
  
  // Use our custom hook to persist data
  useAnalysisDataPersistence({
    brand,
    competitors,
    marketingCs,
    brandContent,
    newsItems
  });
  
  // Persist data for PowerPoint export immediately when component mounts
  useEffect(() => {
    // Log what we're about to persist
    console.log('AnalysisResults: Persisting data for PowerPoint export');
    console.log('Brand content:', brandContent ? Object.keys(brandContent).filter(key => !!brandContent[key]) : 'none');
    console.log('News items:', newsItems?.length || 0);
    
    // Persist brand content and news items for PowerPoint export
    if (brandContent) {
      brandContentService.persistBrandContent(brandContent);
    }
    
    if (newsItems && newsItems.length > 0) {
      brandContentService.persistNewsItems(newsItems);
    }
  }, [brandContent, newsItems]);

  const handleInsightClick = useCallback(async (title: string, insight: string) => {
    setSelectedInsight({
      title,
      insight,
      isLoading: true,
    });

    try {
      const insightData = await fetchInsightData(
        brand,
        insight,
        competitors[0] || "competitors"
      );

      setSelectedInsight({
        title,
        insight,
        ...insightData,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching detailed insight:", error);
      toast({
        title: "Error",
        description: "Failed to fetch detailed analysis. Please try again.",
        variant: "destructive",
      });
      setSelectedInsight(null);
    }
  }, [brand, competitors, toast]);

  // Handle trends refresh
  const handleTrendsRefresh = useCallback((newTrends: string[]) => {
    if (onTrendsRefresh) {
      onTrendsRefresh(newTrends);
    }
  }, [onTrendsRefresh]);

  return (
    <AnalysisStateProvider>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ 
          y: "-100%",
          transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
          }
        }}
        className="w-full"
      >
        <div className="w-full">
          <BrandAnalysisHeader 
            brand={brand}
            competitors={competitors}
            onReset={onReset}
            brandContent={brandContent}
            newsItems={newsItems}
          />

          <div className="space-y-6">
            <InsightContent 
              marketingCs={marketingCs} 
              onInsightClick={handleInsightClick} 
              brand={brand}
              competitors={competitors}
            />
          </div>

          <Dialog open={!!selectedInsight} onOpenChange={() => setSelectedInsight(null)}>
            <InsightDialog selectedInsight={selectedInsight} />
          </Dialog>

          <div className="mt-8">
            <ChatBox brand={brand} insights={marketingCs} />
          </div>

          <ExportActions 
            brand={brand}
            competitors={competitors}
            marketingCs={marketingCs}
          />
        </div>
      </motion.div>
    </AnalysisStateProvider>
  );
};

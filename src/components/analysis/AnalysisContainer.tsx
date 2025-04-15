
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAnalysisState } from "@/hooks/use-analysis-state";
import { usePreventFocusRerenders } from "@/hooks/use-prevent-focus-rerenders";
import { DataInitializer } from "./components/DataInitializer";
import { setPreventRerenderFlags } from "@/utils/presentation/utils/citations/preventRerenderUtils";
import { BrandContent, MarketingC, NewsItem } from "@/types/analysis";
import { AnalysisProcessing } from "./components/AnalysisProcessing";
import { AnalysisFormHandler } from "./components/AnalysisFormHandler";
import { AnalysisResultsHandler } from "./components/AnalysisResultsHandler";
import { StorageService } from "@/utils/services/StorageService";

declare global {
  interface Window {
    CITATION_LINK_CLICK_TIMESTAMP?: number;
    PREVENT_STATE_SAVE?: boolean;
  }
}

window.PREVENT_STATE_SAVE = false;

interface AnalysisContainerProps {
  initialState?: {
    brand: string;
    competitors: string[];
    marketingCs: MarketingC[];
    brandContent?: any;
    newsItems?: any[];
  };
}

export const AnalysisContainer = ({ initialState }: AnalysisContainerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [brandContent, setBrandContent] = useState<BrandContent | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [localBrand, setLocalBrand] = useState("");
  const [localCompetitors, setLocalCompetitors] = useState<string[]>([]);
  const [localMarketingCs, setLocalMarketingCs] = useState<MarketingC[]>([]);
  const [dataInitialized, setDataInitialized] = useState(false);
  const [latestTrends, setLatestTrends] = useState<string[]>([]);
  
  // Use our hook to prevent re-renders on focus changes
  usePreventFocusRerenders({
    debug: true,
    onFocus: () => {
      setPreventRerenderFlags();
    }
  });
  
  const {
    isAnalyzing,
    currentBrand,
    currentCompetitors,
    analysisResults,
    handleAnalysis,
    handleReset: resetAnalysisState
  } = useAnalysisState();

  // Set active session flags immediately
  useEffect(() => {
    setPreventRerenderFlags();
    
    // Clear any cached analysis data when component mounts on the main page
    if (window.location.pathname === '/') {
      StorageService.clearAnalysisCache();
    }
  }, []);

  const handleInitializedData = (data: {
    brand: string;
    competitors: string[];
    marketingCs: MarketingC[];
    brandContent: BrandContent | null;
    newsItems: NewsItem[];
    showResults: boolean;
  }) => {
    setLocalBrand(data.brand);
    setLocalCompetitors(data.competitors);
    setLocalMarketingCs(data.marketingCs);
    setBrandContent(data.brandContent);
    setNewsItems(data.newsItems);
    setShowResults(data.showResults);
    setDataInitialized(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setLocalBrand("");
    setLocalCompetitors([]);
    setLocalMarketingCs([]);
    setBrandContent(null);
    setNewsItems([]);
    setLatestTrends([]);
    resetAnalysisState();
  };

  const handleTrendsRefresh = (newTrends: string[]) => {
    setLatestTrends(newTrends);
  };

  if (!dataInitialized) {
    return <DataInitializer initialState={initialState} onInitialized={handleInitializedData} />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <AnalysisProcessing 
          isProcessing={isProcessing} 
          isLoadingContent={false} 
          isAnalyzing={isAnalyzing} 
        />

        {!showResults && !isProcessing && !isAnalyzing && (
          <AnalysisFormHandler
            isLoading={isAnalyzing}
            handleAnalysis={handleAnalysis}
            setIsProcessing={setIsProcessing}
            setLocalBrand={setLocalBrand}
            setLocalCompetitors={setLocalCompetitors}
            setShowResults={setShowResults}
            setBrandContent={setBrandContent}
            setNewsItems={setNewsItems}
            setLatestTrends={setLatestTrends}
            analysisResults={analysisResults}
            setLocalMarketingCs={setLocalMarketingCs}
          />
        )}

        {showResults && !isProcessing && !isAnalyzing && (
          <AnalysisResultsHandler
            brand={localBrand || currentBrand}
            competitors={localCompetitors.length > 0 ? localCompetitors : currentCompetitors}
            marketingCs={localMarketingCs.length > 0 ? localMarketingCs : Object.values(analysisResults || {})}
            brandContent={brandContent}
            newsItems={newsItems}
            latestTrends={latestTrends}
            onReset={handleReset}
            onTrendsRefresh={handleTrendsRefresh}
          />
        )}
      </AnimatePresence>
    </>
  );
};

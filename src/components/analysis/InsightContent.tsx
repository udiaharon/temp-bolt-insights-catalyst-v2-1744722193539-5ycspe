
import { memo, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronDown, FileText } from "lucide-react";
import { SwatAnalysis } from "./SwatAnalysis";
import { MarketingGrid } from "./components/MarketingGrid";
import { SwotButton } from "./components/SwotButton";
import { BrandAwarenessButton } from "./components/BrandAwarenessButton";
import { LatestTrendsButton } from "./components/LatestTrendsButton";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { useBrandCompetitors } from "@/hooks/use-brand-competitors";
import { useSwotAnalysis } from "@/hooks/use-swot-analysis";

interface Topic {
  headline: string;
  insights: string[];
}

interface MarketingC {
  title: string;
  topics: Topic[];
}

interface InsightContentProps {
  marketingCs: MarketingC[];
  onInsightClick: (title: string, insight: string) => void;
  brand?: string; // Make this optional for backward compatibility
  competitors?: string[]; // Make this optional for backward compatibility
}

export const InsightContent = memo(({ 
  marketingCs, 
  onInsightClick, 
  brand: propsBrand, 
  competitors: propsCompetitors 
}: InsightContentProps) => {
  const [expandAll, setExpandAll] = useState(false);
  const currentTheme = useThemeDetection();
  const { brand, competitors } = useBrandCompetitors(propsBrand, propsCompetitors);
  const { isAnalyzing, swotAnalysis, performSwotAnalysis, loadSavedAnalysis } = useSwotAnalysis();

  // Load saved SWOT analysis on component mount
  useEffect(() => {
    loadSavedAnalysis();
  }, [loadSavedAnalysis]);

  const handleSwatAnalysis = async () => {
    await performSwotAnalysis(brand);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 mt-6">
        <div className="flex items-center gap-2 ml-3">
          <span data-theme="default">
            <FileText className="w-5 h-5 text-purple-500" />
          </span>
          <span data-theme="theme2" className="hidden">
            <FileText className="w-5 h-5 text-[#3E66FB]" />
          </span>
          <h2 className="text-xl font-semibold">
            <span data-theme="default" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Additional Analysis
            </span>
            <span data-theme="theme2" className="text-[#3E66FB] hidden">
              Additional Analysis
            </span>
          </h2>
        </div>
        <Button
          variant="outline"
          onClick={() => setExpandAll(!expandAll)}
          className="gap-2 h-8 text-sm border-gray-400 bg-white/90 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100 data-[theme=theme2]:bg-white data-[theme=theme2]:text-primary data-[theme=theme2]:border-primary/20 data-[theme=theme2]:hover:bg-blue-50"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandAll ? "rotate-180" : ""}`} />
          {expandAll ? "Collapse All" : "Expand All"}
        </Button>
      </div>

      <MarketingGrid 
        marketingCs={marketingCs}
        onInsightClick={onInsightClick}
        expandAll={expandAll}
        currentTheme={currentTheme}
      />

      {/* Restored the original order with SWOT analysis first, then Latest Trends */}
      <div className="mt-8">
        <SwotButton onClick={handleSwatAnalysis} isAnalyzing={isAnalyzing} />
      </div>

      <div className="mt-2">
        <SwatAnalysis analysis={swotAnalysis} isLoading={isAnalyzing} />
      </div>

      <div className="mt-8">
        <LatestTrendsButton brand={brand} />
      </div>

      <div className="mt-8" data-theme="inherit">
        <BrandAwarenessButton 
          brand={brand}
          competitors={competitors}
        />
      </div>
    </div>
  );
});

InsightContent.displayName = 'InsightContent';

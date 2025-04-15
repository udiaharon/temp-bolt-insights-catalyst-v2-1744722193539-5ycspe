
import { AnalysisHeader } from "@/components/analysis/AnalysisHeader";
import { BrandOverview } from "@/components/analysis/BrandOverview";
import { BrandContent, NewsItem } from "@/types/analysis";
import { useState } from "react";

interface BrandAnalysisHeaderProps {
  brand: string;
  competitors: string[];
  onReset: () => void;
  brandContent: BrandContent | null;
  newsItems: NewsItem[];
}

export const BrandAnalysisHeader = ({ 
  brand, 
  competitors, 
  onReset, 
  brandContent, 
  newsItems 
}: BrandAnalysisHeaderProps) => {
  const [showAllNews, setShowAllNews] = useState(false);
  
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <AnalysisHeader brand={brand} competitors={competitors} onReset={onReset} />
      </div>

      <BrandOverview 
        brand={brand} 
        content={brandContent}
        newsItems={newsItems}
        showAllNews={showAllNews}
        onToggleShowAllNews={() => setShowAllNews(!showAllNews)}
      />
    </>
  );
};

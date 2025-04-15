
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrandHeader } from "@/components/header/BrandHeader";
import { AnalysisContainer } from "@/components/analysis/AnalysisContainer";
import { motion } from "framer-motion";
import { MarketingC } from "@/types/analysis";
import { useEffect } from "react";
import { HeaderControls } from "./HeaderControls";

interface IndexContentProps {
  state: any;
  storedAnalysis: {
    brand: string;
    competitors: string[];
    marketingCs: MarketingC[];
    brandContent?: any;
    newsItems?: any[];
  } | null;
}

export const IndexContent = ({ state, storedAnalysis }: IndexContentProps) => {
  const analysisData = state?.showResults 
    ? {
        brand: state.brand,
        competitors: state.competitors,
        marketingCs: state.marketingCs,
        brandContent: state.brandContent,
        newsItems: state.newsItems
      } 
    : storedAnalysis;

  const hasValidData = analysisData && 
      analysisData.brand && 
      analysisData.competitors && 
      Array.isArray(analysisData.competitors) &&
      analysisData.marketingCs && 
      Array.isArray(analysisData.marketingCs) &&
      analysisData.marketingCs.length > 0;
      
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "theme2");
  }, []);

  return (
    <>
      <HeaderControls showLanguageSelector={!hasValidData} />
      <div className="absolute inset-0 [html[data-theme=theme2]_&]:bg-background/95 backdrop-blur-sm">
        <div className="relative w-full h-full shadow-lg border border-border/50">
          <ScrollArea className="h-screen w-screen">
            <div className="w-full min-h-screen flex flex-col px-4 pt-2 pb-8">
              <div className="flex items-center justify-center flex-1">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-6xl rounded-lg relative
                    [html[data-theme=default]_&]:shadow-[0_8px_32px_rgba(0,0,0,0.4)] 
                    [html[data-theme=default]_&]:border-gray-800/50
                    data-[theme=theme2]:bg-white 
                    data-[theme=theme2]:shadow-[0_8px_30px_rgb(62,102,251,0.2)]
                    data-[theme=theme2]:border-[#3E66FB]/30
                    data-[theme=theme2]:border-2
                    data-[theme=theme2]:border"
                >
                  <div className="px-8 pt-4 pb-8 w-full relative data-[theme=theme2]:bg-gradient-to-b data-[theme=theme2]:from-white data-[theme=theme2]:to-[#3E66FB]/5 rounded-lg">
                    {!hasValidData && <BrandHeader showSubheader={true} />}
                    <AnalysisContainer 
                      initialState={hasValidData ? analysisData : undefined}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};


import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { swotService } from "@/services/swotService";
import { clearPerplexityCache, cancelAllPerplexityRequests } from "@/utils/perplexityApi";
import type { SwotAnalysis } from "@/api/swotApi";
import { StorageService } from "@/utils/services/StorageService";

export const useSwotAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [swotAnalysis, setSwotAnalysis] = useState<SwotAnalysis | null>(null);
  const { toast } = useToast();
  const activeAnalysisRef = useRef<boolean>(false);

  // Load saved analysis from localStorage
  const loadSavedAnalysis = () => {
    const savedAnalysis = swotService.getStoredSwotAnalysis();
    if (savedAnalysis) {
      setSwotAnalysis(savedAnalysis);
    }
  };

  // Perform SWOT analysis
  const performSwotAnalysis = async (brand: string) => {
    if (isAnalyzing || activeAnalysisRef.current) return;
    
    try {
      setIsAnalyzing(true);
      activeAnalysisRef.current = true;
      
      // Cancel any ongoing Perplexity requests
      cancelAllPerplexityRequests();
      
      // Clear only SWOT-related caches
      StorageService.clearAnalysisCache('swot');
      clearPerplexityCache();
      
      if (!brand) {
        toast({
          title: "Error",
          description: "Brand information not found. Please ensure you've entered a brand name.",
          variant: "destructive",
        });
        return;
      }

      console.log('Starting SWOT analysis for brand:', brand);

      const data = await swotService.analyzeSwot(brand);
      setSwotAnalysis(data);
      
      toast({
        title: "Analysis Complete",
        description: "SWOT analysis has been generated successfully.",
      });
    } catch (error) {
      console.error('SWOT analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate SWOT analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      activeAnalysisRef.current = false;
    }
  };

  return {
    isAnalyzing,
    swotAnalysis,
    performSwotAnalysis,
    loadSavedAnalysis
  };
};

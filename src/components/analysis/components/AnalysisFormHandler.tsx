
import { useState, useRef } from "react";
import { BrandAnalysisForm } from "@/components/BrandAnalysisForm";
import { useToast } from "@/components/ui/use-toast";
import { BrandContent, NewsItem } from "@/types/analysis";
import { useBrandContentFetcher } from "./BrandContentFetcher";
import { setPreventRerenderFlags } from "@/utils/presentation/utils/citations/preventRerenderUtils";
import { clearPerplexityCache, cancelAllPerplexityRequests } from "@/utils/perplexityApi";
import { StorageService } from "@/utils/services/StorageService";

interface AnalysisFormHandlerProps {
  isLoading: boolean;
  handleAnalysis: (data: { brand: string; competitors: string[] }) => Promise<void>;
  setIsProcessing: (isProcessing: boolean) => void;
  setLocalBrand: (brand: string) => void;
  setLocalCompetitors: (competitors: string[]) => void;
  setShowResults: (showResults: boolean) => void;
  setBrandContent: (content: BrandContent | null) => void;
  setNewsItems: (newsItems: NewsItem[]) => void;
  setLatestTrends: (trends: string[]) => void;
  analysisResults: any;
  setLocalMarketingCs: (marketingCs: any[]) => void;
}

export const AnalysisFormHandler = ({
  isLoading,
  handleAnalysis,
  setIsProcessing,
  setLocalBrand,
  setLocalCompetitors,
  setShowResults,
  setBrandContent,
  setNewsItems,
  setLatestTrends,
  analysisResults,
  setLocalMarketingCs
}: AnalysisFormHandlerProps) => {
  const { toast } = useToast();
  const { fetchBrandInfo, isLoading: isLoadingContent } = useBrandContentFetcher();
  const analysisInProgressRef = useRef(false);

  const handleAnalysisSubmit = async (data: {
    brand: string;
    category: string;
    country: string;
    competitors: string[];
  }) => {
    // Prevent multiple concurrent submissions
    if (analysisInProgressRef.current) {
      console.log('Analysis already in progress, ignoring duplicate submission');
      return;
    }
    
    analysisInProgressRef.current = true;
    setIsProcessing(true);
    
    try {
      // Cancel any ongoing API requests
      cancelAllPerplexityRequests();
      
      // Clear brand-specific caches
      StorageService.clearAnalysisCache('brand');
      
      setLocalBrand(data.brand);
      setLocalCompetitors(data.competitors);
      
      // Clear any existing trends and ensure fresh API responses
      setLatestTrends([]);
      
      // Make sure we're using a fresh Perplexity cache
      clearPerplexityCache();
      
      // Log category and country for future use
      console.log('Brand analysis for:', data.brand, 'Category:', data.category, 'Country:', data.country);
      
      // Fetch brand content and news
      console.log('Fetching brand content for:', data.brand);
      const brandInfoResult = await fetchBrandInfo(data.brand);
      setBrandContent(brandInfoResult.content);
      setNewsItems(brandInfoResult.newsItems);
      
      // Get marketing insights - with fresh data
      console.log('Starting brand analysis with fresh data');
      await handleAnalysis({ brand: data.brand, competitors: data.competitors });
      
      if (analysisResults) {
        const marketingCsArray = Object.values(analysisResults);
        setLocalMarketingCs(marketingCsArray);
        
        const analysisData = {
          brand: data.brand,
          category: data.category,
          country: data.country,
          competitors: data.competitors,
          marketingCs: marketingCsArray
        };
        localStorage.setItem('analysisData', JSON.stringify(analysisData));
        
        // Mark that we have an active session
        setPreventRerenderFlags();
      }
      
      setShowResults(true);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      analysisInProgressRef.current = false;
    }
  };

  return (
    <BrandAnalysisForm
      onSubmit={handleAnalysisSubmit}
      isLoading={isLoadingContent || isLoading}
    />
  );
};

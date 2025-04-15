
import { useState, useRef, useCallback, useEffect } from 'react';
import { AnalysisState, BrandContent, NewsItem } from '@/types/analysis';
import { analyzeBrand } from "@/utils/analysis";
import { useBrandContent, clearBrandContentCache, clearNewsCache } from '@/hooks/use-brand-content';
import { useToast } from '@/hooks/use-toast';
import { clearSearchVolumeCache } from '@/components/analysis/utils/searchVolume';
import { clearPerplexityCache, cancelAllPerplexityRequests } from '@/utils/perplexityApi';
import { StorageService } from '@/utils/services/StorageService';

// Add in-memory cache for analysis results
const analysisCache = new Map<string, AnalysisState>();

export const useAnalysisProcess = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisState | null>(null);
  const [brandContent, setBrandContent] = useState<BrandContent | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [currentBrand, setCurrentBrand] = useState("");
  const [currentCompetitors, setCurrentCompetitors] = useState<string[]>([]);

  const analysisInProgressRef = useRef(false);
  const { fetchBrandContent, clearCache } = useBrandContent();
  const { toast } = useToast();

  // Clear cache on component mount to ensure fresh data
  useEffect(() => {
    // Only clear cache on component mount if there's no current analysis
    if (!currentBrand && !analysisResults) {
      clearAllCaches();
    }
    // Cancel any pending requests when component unmounts
    return () => {
      cancelAllPerplexityRequests();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to clear all caches
  const clearAllCaches = useCallback(() => {
    clearCache();
    clearSearchVolumeCache();
    clearPerplexityCache();
    cancelAllPerplexityRequests();
    analysisCache.clear();
    StorageService.clearAnalysisCache('all');
    console.log('All caches cleared');
  }, [clearCache]);

  const handleAnalysis = useCallback(async (data: { brand: string; competitors: string[] }) => {
    // Prevent concurrent analyses
    if (analysisInProgressRef.current) {
      console.log('Analysis already in progress, ignoring new request');
      return;
    }

    // ALWAYS clear all perplexity requests before starting a new analysis
    cancelAllPerplexityRequests();
    
    // Clear brand-specific caches
    StorageService.clearAnalysisCache('brand');
    clearPerplexityCache();
    
    console.log('Starting analysis for:', data.brand);
    setIsAnalyzing(true);
    analysisInProgressRef.current = true;
    setCurrentBrand(data.brand);
    setCurrentCompetitors(data.competitors);
    
    try {
      // Skip brand content fetching here as it's now handled in AnalysisFormHandler
      // Just focus on the core analysis
      console.log('Proceeding with core brand analysis');
      const analysisResults = await analyzeBrand(data.brand, data.competitors);

      if (!analysisInProgressRef.current) {
        console.log('Analysis was cancelled, not updating state');
        return;
      }

      console.log('Analysis results received for:', data.brand);
      setAnalysisResults(analysisResults);
      
      // Cache the analysis results
      analysisCache.set(`${data.brand}-${data.competitors.join(',')}`, analysisResults);

      try {
        localStorage.setItem('analysisData', JSON.stringify({
          brand: data.brand,
          competitors: data.competitors,
          marketingCs: Object.values(analysisResults)
        }));
      } catch (err) {
        console.error('Error storing analysis data in localStorage:', err);
      }

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to generate brand insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (analysisInProgressRef.current) {
        setIsAnalyzing(false);
        analysisInProgressRef.current = false;
      }
    }
  }, [toast]);

  return {
    isAnalyzing,
    analysisResults,
    brandContent,
    newsItems,
    currentBrand,
    currentCompetitors,
    setCurrentBrand,
    setCurrentCompetitors,
    setAnalysisResults,
    setBrandContent,
    setNewsItems,
    handleAnalysis,
    analysisInProgressRef,
    clearAllCaches
  };
};

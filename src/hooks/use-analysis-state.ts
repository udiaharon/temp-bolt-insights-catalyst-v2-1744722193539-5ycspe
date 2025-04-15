
import { useCallback, useEffect } from 'react';
import { InitialState } from '@/types/analysis';
import { useToast } from '@/hooks/use-toast';
import { clearSearchVolumeCache } from '@/components/analysis/utils/searchVolume';
import { usePreventFocusRerenders } from './use-prevent-focus-rerenders';
import { useAnalysisProcess } from './analysis/use-analysis-process';
import { useAnalysisStorage } from './analysis/use-analysis-storage';
import { useInitialStateLoader } from './analysis/use-initial-state-loader';

export const useAnalysisState = (initialState?: InitialState) => {
  const {
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
    handleAnalysis: processAnalysis,
    analysisInProgressRef
  } = useAnalysisProcess();

  const {
    hasInitialStateLoaded,
    initialStateLoadedRef
  } = useInitialStateLoader(initialState);

  const { persistAnalysisData, clearAnalysisData } = useAnalysisStorage();
  const { toast } = useToast();

  const { startExternalNavigation } = usePreventFocusRerenders({
    onBlur: () => {
      persistAnalysisData(currentBrand, currentCompetitors, analysisResults, brandContent, newsItems);
    }
  });

  useEffect(() => {
    return () => {
      analysisInProgressRef.current = false;
    };
  }, [analysisInProgressRef]);

  useEffect(() => {
    if (initialState && !hasInitialStateLoaded && !initialStateLoadedRef.current) {
      console.log('Loading initial state:', initialState);
      initialStateLoadedRef.current = true;
      
      if (initialState.brand && initialState.competitors && initialState.marketingCs) {
        setCurrentBrand(initialState.brand || "");
        setCurrentCompetitors(initialState.competitors || []);
        
        if (initialState.marketingCs) {
          const [consumer, cost, convenience, communication, competitive, media, product, industry, technology] = initialState.marketingCs;
          setAnalysisResults({
            consumer,
            cost,
            convenience,
            communication,
            competitive,
            media,
            product,
            industry,
            technology
          });
        }
        
        if (initialState.brandContent) {
          setBrandContent(initialState.brandContent);
        }
        
        if (initialState.newsItems) {
          setNewsItems(initialState.newsItems);
        }
      } else {
        console.warn('Initial state is incomplete, not loading');
      }
    }
  }, [
    initialState, hasInitialStateLoaded, initialStateLoadedRef,
    setCurrentBrand, setCurrentCompetitors, setAnalysisResults, 
    setBrandContent, setNewsItems
  ]);

  useEffect(() => {
    if (!initialState) {
      console.log('Clearing search volume cache');
      clearSearchVolumeCache();
    }
  }, [initialState]);

  const handleAnalysis = async (data: { brand: string; competitors: string[] }) => {
    await processAnalysis(data);
  };

  const handleReset = useCallback(() => {
    console.log('Resetting analysis state');
    startExternalNavigation();
    
    analysisInProgressRef.current = false;
    setAnalysisResults(null);
    setBrandContent(null);
    setNewsItems([]);
    setCurrentBrand("");
    setCurrentCompetitors([]);
    
    // Clear ALL session-related flags
    clearAnalysisData();
    clearSearchVolumeCache();
    
    toast({
      title: "Reset Complete",
      description: "Analysis results have been cleared.",
    });
  }, [
    toast, startExternalNavigation, analysisInProgressRef,
    setAnalysisResults, setBrandContent, setNewsItems, 
    setCurrentBrand, setCurrentCompetitors, clearAnalysisData
  ]);

  return {
    isAnalyzing,
    analysisResults,
    brandContent,
    newsItems,
    currentBrand,
    currentCompetitors,
    hasInitialStateLoaded,
    handleAnalysis,
    handleReset
  };
};


import { useCallback, useRef } from "react";
import { MarketingC } from "@/types/analysis";
import { setPreventRerenderFlags } from "@/utils/presentation/utils/citations/preventRerenderUtils";
import { analysisService } from "@/services/analysisService";
import { brandContentService } from "@/services/brandContentService";

export const useStoredAnalysisLoader = () => {
  const lastLoadTimeRef = useRef(Date.now());
  const preventDataLoadRef = useRef(false);
  
  // CRITICAL FIX: Memoized function and add more safeguards
  const loadStoredData = useCallback(() => {
    try {
      // Skip duplicate loading if we just loaded data less than 2 seconds ago
      // This prevents multiple loads on focus changes
      if (Date.now() - lastLoadTimeRef.current < 2000) {
        console.log('Skipping duplicate data load, too recent');
        return { loaded: false, data: null };
      }
      
      // Check if we should skip loading based on flags
      if (preventDataLoadRef.current || 
          localStorage.getItem('NO_RERENDER_ON_FOCUS') === 'true' ||
          localStorage.getItem('PREVENT_FIRST_RERENDER') === 'true' ||
          document.documentElement.hasAttribute('data-analysis-active') ||
          document.documentElement.hasAttribute('data-prevent-rerender') ||
          // Skip loading on the main page to ensure fresh data on each analysis
          window.location.pathname === '/') {
        console.log('Skipping data load due to active analysis session flags or main page load');
        preventDataLoadRef.current = true;
        return { loaded: false, data: null };
      }
      
      lastLoadTimeRef.current = Date.now();
      
      // Check if we have an active analysis session from local storage flags
      const hasActiveSession = localStorage.getItem('ACTIVE_ANALYSIS_SESSION') === 'true';
      const sessionTimestamp = localStorage.getItem('ANALYSIS_SESSION_TIMESTAMP');
      const isValidSession = sessionTimestamp && (Date.now() - parseInt(sessionTimestamp)) < 3600000; // 1 hour
      
      // Check if this is a return from a citation link
      const isCitationLinkActive = localStorage.getItem('CITATION_LINK_ACTIVE') === 'true';
      const isPreservingState = localStorage.getItem('CITATION_LINK_PRESERVING_STATE') === 'true';
      
      if (isCitationLinkActive || isPreservingState || (hasActiveSession && isValidSession)) {
        console.log('Detected active session or return from citation link, preserving state');
        
        // Set the prevention flag to ensure we don't reload on subsequent focus events
        preventDataLoadRef.current = true;
        setPreventRerenderFlags();
        
        // Don't reload data - it would cause a re-render
        return { loaded: false, data: null };
      }

      const storedData = analysisService.getStoredAnalysisData();
      if (storedData) {
        if (storedData.brand && 
            storedData.competitors && 
            Array.isArray(storedData.competitors) &&
            storedData.marketingCs && 
            Array.isArray(storedData.marketingCs) &&
            storedData.marketingCs.length > 0) {
          
          console.log('Found valid data, setting storedAnalysis');
          
          // Mark that we have an active session
          setPreventRerenderFlags();
          preventDataLoadRef.current = true;
          
          try {
            const brandContent = brandContentService.getBrandContent();
            const newsItems = brandContentService.getNewsItems();
            
            return { 
              loaded: true, 
              data: {
                ...storedData,
                brandContent,
                newsItems
              }
            };
          } catch (error) {
            console.error("Error parsing stored content:", error);
            return { 
              loaded: true, 
              data: storedData
            };
          }
        }
      }
      return { loaded: false, data: null };
    } catch (error) {
      console.error("Error processing stored data:", error);
      return { loaded: false, data: null };
    }
  }, []);
  
  return { loadStoredData, setPreventDataLoad: () => { preventDataLoadRef.current = true; } };
};

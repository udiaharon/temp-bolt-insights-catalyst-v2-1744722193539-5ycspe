
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useStoredAnalysisLoader } from "@/components/analysis/components/StoredAnalysisLoader";
import { StorageService } from "@/utils/services/StorageService";
import { setPreventRerenderFlags } from "@/utils/presentation/utils/citations/preventRerenderUtils";

export const useStoredAnalysis = () => {
  const location = useLocation();
  const state = location.state;
  const [hasProcessedStoredData, setHasProcessedStoredData] = useState(false);
  const [storedAnalysis, setStoredAnalysis] = useState(null);
  const initialRenderRef = useRef(true);
  const processingRef = useRef(false);
  const firstFocusHandledRef = useRef(false);
  
  // Use our custom hook to load stored analysis data
  const { loadStoredData, setPreventDataLoad } = useStoredAnalysisLoader();
  
  // Check for and set session active flags immediately
  useEffect(() => {
    // If this is the main index page (not coming from router state),
    // clear analysis cache to ensure fresh data
    if (!state && window.location.pathname === '/') {
      StorageService.clearAnalysisCache();
    }
    
    // If we're coming back to a session, set the prevention flags immediately
    if (localStorage.getItem('ACTIVE_ANALYSIS_SESSION') === 'true' ||
        localStorage.getItem('CITATION_LINK_ACTIVE') === 'true' ||
        localStorage.getItem('CITATION_LINK_PRESERVING_STATE') === 'true') {
      setPreventRerenderFlags();
      setPreventDataLoad();
      firstFocusHandledRef.current = true;
    }
  }, [state, setPreventDataLoad]);

  // Handle initialization and data loading
  useEffect(() => {
    // Only load data on initial render
    if (!initialRenderRef.current || processingRef.current) return;
    
    initialRenderRef.current = false;
    processingRef.current = true;

    try {
      // Check for analysis active flags
      if (localStorage.getItem('NO_RERENDER_ON_FOCUS') === 'true' ||
          localStorage.getItem('PREVENT_FIRST_RERENDER') === 'true' ||
          document.documentElement.hasAttribute('data-analysis-active') ||
          document.documentElement.hasAttribute('data-prevent-rerender')) {
        setPreventDataLoad();
        firstFocusHandledRef.current = true;
      }
      
      // If we're on the main page, we want fresh data, so don't use stored data
      if (window.location.pathname === '/' && !state?.showResults) {
        StorageService.clearAnalysisCache();
        setHasProcessedStoredData(true);
        processingRef.current = false;
        return;
      }
      
      if (state?.showResults) {
        // Mark that we have an active session when coming from router state
        setPreventRerenderFlags();
        setPreventDataLoad();
        firstFocusHandledRef.current = true;
        
        setHasProcessedStoredData(true);
        processingRef.current = false;
        return;
      }

      // Try to load stored data if no prevention flags are set
      const { loaded, data } = loadStoredData();
      if (loaded && data) {
        setStoredAnalysis(data);
      }
      
      setHasProcessedStoredData(true);
    } finally {
      processingRef.current = false;
    }
  }, [state, loadStoredData, setPreventDataLoad]);

  return {
    state,
    storedAnalysis,
    hasProcessedStoredData,
    setPreventFocusRerenders: () => {
      // Handle focus events more carefully
      if (!firstFocusHandledRef.current) {
        firstFocusHandledRef.current = true;
        // On first focus, set the prevention flags
        setPreventRerenderFlags();
        setPreventDataLoad();
      }
    }
  };
};


import { useCallback, useRef } from 'react';
import { AnalysisState, BrandContent, NewsItem } from '@/types/analysis';

/**
 * Hook to handle storage and persistence of analysis data
 */
export const useAnalysisStorage = () => {
  const hasSetActiveSessionRef = useRef(false);

  const persistAnalysisData = useCallback((currentBrand: string, currentCompetitors: string[], analysisResults: AnalysisState | null, brandContent: BrandContent | null, newsItems: NewsItem[]) => {
    if (currentBrand && currentCompetitors.length > 0 && !window.PREVENT_STATE_SAVE) {
      try {
        localStorage.setItem('currentBrand', currentBrand);
        localStorage.setItem('currentCompetitors', JSON.stringify(currentCompetitors));
        
        // Set session flags to prevent re-renders
        if (!hasSetActiveSessionRef.current) {
          localStorage.setItem('ACTIVE_ANALYSIS_SESSION', 'true');
          localStorage.setItem('ANALYSIS_SESSION_TIMESTAMP', Date.now().toString());
          localStorage.setItem('NO_RERENDER_ON_FOCUS', 'true');
          document.documentElement.setAttribute('data-analysis-active', 'true');
          hasSetActiveSessionRef.current = true;
        }
        
        if (analysisResults) {
          localStorage.setItem('analysisData', JSON.stringify({
            brand: currentBrand,
            competitors: currentCompetitors,
            marketingCs: Object.values(analysisResults)
          }));
        }
        
        if (brandContent) {
          localStorage.setItem('currentBrandContent', JSON.stringify(brandContent));
        }
        
        if (newsItems && newsItems.length > 0) {
          localStorage.setItem('currentNewsItems', JSON.stringify(newsItems));
        }
      } catch (err) {
        console.error('Error storing analysis data in localStorage:', err);
      }
    }
  }, []);

  const clearAnalysisData = useCallback(() => {
    // Clear ALL session-related flags
    localStorage.removeItem('analysisData');
    localStorage.removeItem('swotAnalysis');
    localStorage.removeItem('brandAwarenessData');
    localStorage.removeItem('brandAwarenessDateRange');
    localStorage.removeItem('currentBrand');
    localStorage.removeItem('currentCompetitors');
    localStorage.removeItem('currentBrandContent');
    localStorage.removeItem('currentNewsItems');
    localStorage.removeItem('ACTIVE_ANALYSIS_SESSION');
    localStorage.removeItem('ANALYSIS_SESSION_TIMESTAMP');
    localStorage.removeItem('NO_RERENDER_ON_FOCUS');
    localStorage.removeItem('CITATION_LINK_ACTIVE');
    localStorage.removeItem('CITATION_LINK_TIMESTAMP');
    localStorage.removeItem('CITATION_LINK_PRESERVING_STATE');
    
    // Remove document attributes
    document.documentElement.removeAttribute('data-citation-click');
    document.documentElement.removeAttribute('data-analysis-active');
  }, []);

  return {
    persistAnalysisData,
    clearAnalysisData,
    hasSetActiveSession: hasSetActiveSessionRef.current
  };
};


/**
 * Utility service for managing localStorage items
 */
export const StorageService = {
  // Selective clearing based on analysis type
  clearAnalysisCache: (type?: 'all' | 'brand' | 'swot' | 'trends') => {
    const cacheType = type || 'all';
    console.log(`Clearing cache: ${cacheType}`);
    
    // Common items to clear in all scenarios
    localStorage.removeItem('ANALYSIS_SESSION_TIMESTAMP');
    localStorage.removeItem('CITATION_LINK_ACTIVE');
    localStorage.removeItem('CITATION_LINK_PRESERVING_STATE');
    
    if (cacheType === 'all' || cacheType === 'brand') {
      localStorage.removeItem('analysisData');
      localStorage.removeItem('currentBrand');
      localStorage.removeItem('currentCompetitors');
      localStorage.removeItem('currentBrandContent');
      localStorage.removeItem('currentNewsItems');
      localStorage.removeItem('ACTIVE_ANALYSIS_SESSION');
      localStorage.removeItem('NO_RERENDER_ON_FOCUS');
      localStorage.removeItem('PREVENT_FIRST_RERENDER');
    }
    
    if (cacheType === 'all' || cacheType === 'swot') {
      localStorage.removeItem('swotAnalysis');
    }
    
    if (cacheType === 'all' || cacheType === 'trends') {
      localStorage.removeItem('currentTrends');
      localStorage.removeItem('currentTrendsBrand');
    }
    
    if (cacheType === 'all') {
      localStorage.removeItem('brandAwarenessData');
      
      // Remove data attributes from document
      document.documentElement.removeAttribute('data-citation-click');
      document.documentElement.removeAttribute('data-analysis-active');
      document.documentElement.removeAttribute('data-prevent-rerender');
      
      // Clear window cache flags
      if (typeof window !== 'undefined') {
        if (window.searchVolumeCache) {
          window.searchVolumeCache = {};
        }
      }
    }
  },
  
  // Add the missing methods
  saveApiKey: (apiKey: string) => {
    localStorage.setItem('firecrawl_api_key', apiKey);
  },
  
  getApiKey: (): string | null => {
    return localStorage.getItem('firecrawl_api_key');
  }
};

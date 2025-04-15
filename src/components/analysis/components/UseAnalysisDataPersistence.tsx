
import { useEffect, useRef } from "react";
import { BrandContent, MarketingC, NewsItem } from "@/types/analysis";
import { analysisService } from "@/services/analysisService";
import { brandContentService } from "@/services/brandContentService";

interface UseAnalysisDataPersistenceProps {
  brand: string;
  competitors: string[];
  marketingCs: MarketingC[];
  brandContent: BrandContent | null;
  newsItems: NewsItem[];
}

export const useAnalysisDataPersistence = ({
  brand,
  competitors,
  marketingCs,
  brandContent, 
  newsItems
}: UseAnalysisDataPersistenceProps) => {
  const initialDataPersistedRef = useRef(false);
  const persistTitleRef = useRef(false);
  
  // Store brand, competitors, marketing Cs only on initial mount
  // This prevents re-renders when coming back to the app
  useEffect(() => {
    // Check if we have already persisted the data
    if (initialDataPersistedRef.current) {
      console.log("Initial data already persisted, skipping");
      return;
    }
    
    // Check if we should persist data now
    const isCitationActive = localStorage.getItem('CITATION_LINK_ACTIVE') === 'true';
    const isPreservingState = localStorage.getItem('CITATION_LINK_PRESERVING_STATE') === 'true';
    
    // Only persist data once and not on every re-render or focus
    // AND don't persist if we're in a citation navigation flow
    if (!initialDataPersistedRef.current && !isCitationActive && !isPreservingState) {
      console.log("Persisting initial data to localStorage");
      
      // Persist only if we have valid data and we're not in a citation navigation
      if (brand && 
          competitors && Array.isArray(competitors) && competitors.length > 0 &&
          marketingCs && Array.isArray(marketingCs) && marketingCs.length > 0 &&
          window.PREVENT_STATE_SAVE !== true) {
        
        // Store brand
        localStorage.setItem('currentBrand', brand);
        
        // Store competitors
        localStorage.setItem('currentCompetitors', JSON.stringify(competitors));
        
        // Store analysis data
        analysisService.persistAnalysisData(brand, competitors, marketingCs);
        
        // Store brand content if available
        if (brandContent) {
          brandContentService.persistBrandContent(brandContent);
        }
        
        // Store news items if available
        if (newsItems && Array.isArray(newsItems) && newsItems.length > 0) {
          brandContentService.persistNewsItems(newsItems);
        }
        
        // Mark as persisted
        initialDataPersistedRef.current = true;
        
        // Set document title with brand name for better UX
        if (!persistTitleRef.current) {
          document.title = `${brand} Analysis Results`;
          persistTitleRef.current = true;
        }
      }
    }
  }, [brand, competitors, marketingCs, brandContent, newsItems]);
};

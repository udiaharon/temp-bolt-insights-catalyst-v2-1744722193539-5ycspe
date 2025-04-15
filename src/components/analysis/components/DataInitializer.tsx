
import { useState, useEffect, useRef } from "react";
import { MarketingC, BrandContent, NewsItem } from "@/types/analysis";
import { setPreventRerenderFlags } from "@/utils/presentation/utils/citations/preventRerenderUtils";

interface DataInitializerProps {
  initialState?: {
    brand: string;
    competitors: string[];
    marketingCs: MarketingC[];
    brandContent?: any;
    newsItems?: NewsItem[];
  };
  onInitialized: (data: {
    brand: string;
    competitors: string[];
    marketingCs: MarketingC[];
    brandContent: BrandContent | null;
    newsItems: NewsItem[];
    showResults: boolean;
  }) => void;
}

export const DataInitializer = ({ initialState, onInitialized }: DataInitializerProps) => {
  const initializedRef = useRef(false);
  const hasSetActiveSessionRef = useRef(false);
  
  // Set active session flags immediately on component mount
  useEffect(() => {
    if (!hasSetActiveSessionRef.current) {
      setPreventRerenderFlags();
      hasSetActiveSessionRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (initializedRef.current) return;
    
    // Mark this session as active for all cases
    if (!hasSetActiveSessionRef.current) {
      setPreventRerenderFlags();
      hasSetActiveSessionRef.current = true;
    }
    
    if (initialState) {
      const { brand, competitors, marketingCs, brandContent: initialBrandContent, newsItems: initialNewsItems } = initialState;
      
      let brandContentData = initialBrandContent || null;
      let newsItemsData: NewsItem[] = initialNewsItems || [];
      
      if (!initialBrandContent) {
        try {
          const storedBrandContent = localStorage.getItem('currentBrandContent');
          if (storedBrandContent) {
            brandContentData = JSON.parse(storedBrandContent);
          }
        } catch (error) {
          console.error('Error retrieving brand content from localStorage:', error);
        }
      }
      
      if (!initialNewsItems || initialNewsItems.length === 0) {
        try {
          const storedNewsItems = localStorage.getItem('currentNewsItems');
          if (storedNewsItems) {
            newsItemsData = JSON.parse(storedNewsItems);
          }
        } catch (error) {
          console.error('Error retrieving news items from localStorage:', error);
        }
      }
      
      // When initializing a new analysis, clear any existing trends data
      localStorage.removeItem('currentTrends');
      localStorage.removeItem('currentTrendsBrand');
      
      onInitialized({
        brand,
        competitors,
        marketingCs,
        brandContent: brandContentData,
        newsItems: newsItemsData,
        showResults: true
      });
      
      initializedRef.current = true;
    } else {
      // Check if we have an active session
      const hasActiveSession = localStorage.getItem('ACTIVE_ANALYSIS_SESSION') === 'true';
      const sessionTimestamp = localStorage.getItem('ANALYSIS_SESSION_TIMESTAMP');
      const isValidSession = sessionTimestamp && (Date.now() - parseInt(sessionTimestamp)) < 3600000; // 1 hour
      
      if (hasActiveSession && isValidSession) {
        // Try to load stored analysis data
        try {
          const storedData = localStorage.getItem('analysisData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.brand && 
                parsedData.competitors && 
                Array.isArray(parsedData.competitors) &&
                parsedData.marketingCs && 
                Array.isArray(parsedData.marketingCs) &&
                parsedData.marketingCs.length > 0) {
              
              let brandContentData = null;
              let newsItemsData: NewsItem[] = [];
              
              try {
                const storedBrandContent = localStorage.getItem('currentBrandContent');
                if (storedBrandContent) {
                  brandContentData = JSON.parse(storedBrandContent);
                }
              } catch (error) {
                console.error('Error retrieving brand content from localStorage:', error);
              }
              
              try {
                const storedNewsItems = localStorage.getItem('currentNewsItems');
                if (storedNewsItems) {
                  newsItemsData = JSON.parse(storedNewsItems);
                }
              } catch (error) {
                console.error('Error retrieving news items from localStorage:', error);
              }
              
              onInitialized({
                brand: parsedData.brand,
                competitors: parsedData.competitors,
                marketingCs: parsedData.marketingCs,
                brandContent: brandContentData,
                newsItems: newsItemsData,
                showResults: true
              });
              
              initializedRef.current = true;
              console.log("Restored analysis session from localStorage");
            } else {
              onInitialized({
                brand: "",
                competitors: [],
                marketingCs: [],
                brandContent: null,
                newsItems: [],
                showResults: false
              });
            }
          } else {
            onInitialized({
              brand: "",
              competitors: [],
              marketingCs: [],
              brandContent: null,
              newsItems: [],
              showResults: false
            });
          }
        } catch (error) {
          console.error("Error processing stored data:", error);
          onInitialized({
            brand: "",
            competitors: [],
            marketingCs: [],
            brandContent: null,
            newsItems: [],
            showResults: false
          });
        }
      } else {
        onInitialized({
          brand: "",
          competitors: [],
          marketingCs: [],
          brandContent: null,
          newsItems: [],
          showResults: false
        });
      }
    }
  }, [initialState, onInitialized]);
  
  return null;
};

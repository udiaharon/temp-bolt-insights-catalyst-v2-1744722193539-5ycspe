
import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useBrandContent, clearBrandContentCache, clearNewsCache } from "@/hooks/use-brand-content";
import { trendsService } from "@/services/trendsService";
import { brandContentService } from "@/services/brandContentService";
import { clearPerplexityCache, cancelAllPerplexityRequests } from "@/utils/perplexityApi";
import { StorageService } from "@/utils/services/StorageService";

export const useBrandContentFetcher = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchBrandContent, isLoading: isFetchLoading, clearCache } = useBrandContent();
  const { toast } = useToast();
  const fetchInProgressRef = useRef(false);
  
  const fetchBrandInfo = async (brandName: string) => {
    // Prevent concurrent fetches
    if (fetchInProgressRef.current) {
      console.log('Brand content fetch already in progress, ignoring duplicate request');
      return { content: null, newsItems: [] };
    }
    
    fetchInProgressRef.current = true;
    setIsLoading(true);
    
    try {
      // Cancel any ongoing Perplexity requests
      cancelAllPerplexityRequests();
      
      // Clear caches for fresh brand content
      clearCache();
      clearPerplexityCache();
      
      // Get category and country from localStorage if available
      const category = localStorage.getItem('category') || '';
      const country = localStorage.getItem('country') || '';
      
      console.log(`Fetching brand content for: ${brandName}${category ? ` in category: ${category}` : ''}${country ? ` in country: ${country}` : ''}`);
      const result = await fetchBrandContent(brandName, category, country);
      console.log('Content fetched:', result);
      
      if (result && result.content) {
        brandContentService.persistBrandContent(result.content);
      }
      
      if (result && result.newsItems && result.newsItems.length > 0) {
        console.log(`Setting ${result.newsItems.length} news items`);
        brandContentService.persistNewsItems(result.newsItems);
      } else {
        console.warn('No news items received in brand content response');
      }
      
      return {
        content: result?.content || null,
        newsItems: result?.newsItems || []
      };
    } catch (error) {
      console.error('Error fetching brand content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch brand information. Please try again.",
        variant: "destructive",
      });
      
      return {
        content: null,
        newsItems: []
      };
    } finally {
      setIsLoading(false);
      fetchInProgressRef.current = false;
    }
  };
  
  // Add custom trends fetching function
  const refreshTrends = async (
    brand: string, 
    customCategories: { primary: string, related: string[] }
  ) => {
    try {
      // Cancel ongoing requests
      cancelAllPerplexityRequests();
      
      // Clear only trends-related caches
      StorageService.clearAnalysisCache('trends');
      clearPerplexityCache();
      
      console.log(`Refreshing trends for ${brand} with categories:`, customCategories);
      
      // Log the actual API call params for debugging
      console.log('API call parameters:', {
        brand,
        primaryCategory: customCategories.primary,
        relatedCategories: customCategories.related.join(', ')
      });
      
      const results = await trendsService.fetchLatestTrends(brand, customCategories);
      console.log('Refreshed trends results:', results);
      
      // Validate the response format
      if (!results || !Array.isArray(results) || results.length === 0) {
        console.error('Invalid trends response format:', results);
        throw new Error('Invalid response format from trends API');
      }
      
      // Log the first item which should contain categories
      console.log('Category information from response:', results[0]);
      
      // Cache the trends to localStorage for persistence
      if (results && results.length > 0) {
        trendsService.persistTrends(results);
      }
      
      return results;
    } catch (error) {
      console.error('Error refreshing trends:', error);
      toast({
        title: "Error refreshing trends",
        description: "Failed to refresh trends with custom categories. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    fetchBrandInfo,
    refreshTrends,
    isLoading: isLoading || isFetchLoading
  };
};

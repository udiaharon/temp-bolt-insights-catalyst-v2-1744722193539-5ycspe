
import { useState, useCallback, useRef } from 'react';
import { BrandContent, NewsItem } from "@/types/analysis";
import { fetchBrandContent, clearBrandContentCache } from './fetch-brand-content';
import { fetchNewsItems, clearNewsCache } from './fetch-news-items';
import { brandContentService } from '@/services/brandContentService';

// In-memory cache for brand content results
const brandContentCache = new Map<string, { content: BrandContent, newsItems: NewsItem[] }>();

export const useBrandContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchBrandInfo = useCallback(async (brand: string, category?: string, country?: string) => {
    // Cancel any in-progress requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    
    // Create a cache key that includes category and country
    const cacheKey = `${brand}-${category || ''}-${country || ''}`;
    
    // Check if we have cached results
    if (brandContentCache.has(cacheKey)) {
      console.log(`Using cached brand content for ${brand}`);
      const cachedData = brandContentCache.get(cacheKey)!;
      
      // Also persist the cached data for PowerPoint export
      brandContentService.persistBrandContent(cachedData.content);
      brandContentService.persistNewsItems(cachedData.newsItems);
      
      setIsLoading(false);
      return cachedData;
    }
    
    try {
      console.log(`Fetching brand content for ${brand}${category ? ` in ${category}` : ''}${country ? ` in ${country}` : ''}`);
      
      // Fetch all content in parallel for better performance
      const [marketPosition, keyProducts, recentPerformance, notableAchievements, newsItems] = await Promise.all([
        fetchBrandContent("market position", brand, category, country),
        fetchBrandContent("products and services", brand, category, country),
        fetchBrandContent("recent performance", brand, category, country),
        fetchBrandContent("achievements", brand, category, country),
        fetchNewsItems(brand)
      ]);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('Request was aborted, not updating state');
        return { content: null, newsItems: [] };
      }

      const content = {
        marketPosition,
        keyProducts,
        recentPerformance,
        notableAchievements
      };

      const result = {
        content,
        newsItems
      };
      
      // Cache the result
      brandContentCache.set(cacheKey, result);
      
      // Also persist data for PowerPoint export
      brandContentService.persistBrandContent(content);
      brandContentService.persistNewsItems(newsItems);
      
      return result;
    } catch (error) {
      // Don't update state if the request was aborted
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Request was aborted');
        return { content: null, newsItems: [] };
      }
      
      const err = error instanceof Error ? error : new Error('Failed to fetch brand content');
      setError(err);
      throw err;
    } finally {
      // Only update loading state if the request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  // Add a function to clear the cache
  const clearCache = useCallback(() => {
    brandContentCache.clear();
    clearBrandContentCache();
    clearNewsCache();
    console.log('All brand content caches cleared');
  }, []);

  return {
    fetchBrandContent: fetchBrandInfo,
    clearCache,
    isLoading,
    error
  };
};

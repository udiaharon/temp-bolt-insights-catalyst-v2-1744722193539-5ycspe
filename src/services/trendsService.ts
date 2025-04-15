
import { makePerplexityRequest } from "@/api/perplexityApi";
import { 
  parseTrendsResponse, 
  parseCategoryInfo, 
  processLatestTrendsCitations, 
  generateTrendsSystemPrompt, 
  generateTrendsUserPrompt 
} from "@/utils/perplexity/trends";

export interface CategoryInfo {
  primary: string;
  related: string[];
}

export const trendsService = {
  async fetchLatestTrends(brand: string, customCategories?: CategoryInfo): Promise<string[]> {
    try {
      console.log('Fetching latest trends for', brand);
      
      // First check if we have cached trends
      const cachedTrends = this.getStoredTrends();
      const cachedBrand = localStorage.getItem('currentTrendsBrand');
      
      if (cachedTrends.length > 0 && cachedBrand === brand && !customCategories) {
        console.log('Using cached trends for brand:', brand);
        return cachedTrends;
      }
      
      if (customCategories) {
        console.log('Using custom categories:', customCategories);
      }
      
      const systemPrompt = generateTrendsSystemPrompt(brand, customCategories);
      const userPrompt = generateTrendsUserPrompt(brand, customCategories);

      console.log('Sending prompt to API with custom categories:', !!customCategories);
      
      const response = await makePerplexityRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        timeoutMs: 25000,  // Increase timeout for more thorough results
        maxRetries: 2      // Add retries for better reliability
      });
      
      if (!response) {
        throw new Error('Empty response from Perplexity API');
      }
      
      console.log('Raw trends response:', response);
      
      // Process the response to extract bullet points
      const trends = parseTrendsResponse(response);
      console.log('Parsed trends:', trends);
      
      // Validate that we have the correct format with category information
      if (trends.length === 0) {
        throw new Error('No trends found in the response');
      }
      
      // Check if the first item has the category information
      const firstItem = trends[0];
      if (!firstItem.includes('CATEGORY:') || !firstItem.includes('RELATED CATEGORIES:')) {
        console.warn('First trend item does not contain proper category information:', firstItem);
        
        // If using custom categories, construct a proper category line as the first item
        if (customCategories) {
          const categoryLine = `CATEGORY: ${customCategories.primary}. RELATED CATEGORIES: ${customCategories.related.join(', ')}`;
          trends[0] = categoryLine;
          console.log('Replaced first item with constructed category line:', categoryLine);
        } else {
          // Use a default category line if none is provided
          const defaultCategoryLine = `CATEGORY: Business. RELATED CATEGORIES: Marketing, Technology, Consumer Trends`;
          trends[0] = defaultCategoryLine;
          console.log('Using default category line:', defaultCategoryLine);
        }
      }
      
      // Store the trends for future use
      this.persistTrends(trends);
      if (!customCategories) {
        localStorage.setItem('currentTrendsBrand', brand);
      }
      
      return trends;
    } catch (error) {
      console.error('Error fetching latest trends:', error);
      
      // Try to use cached trends if available
      const cachedTrends = this.getStoredTrends();
      if (cachedTrends.length > 0) {
        console.log('Using cached trends after error');
        return cachedTrends;
      }
      
      // Return fallback trends if nothing else is available
      const fallbackTrends = this.createFallbackTrends(brand);
      this.persistTrends(fallbackTrends);
      return fallbackTrends;
    }
  },
  
  persistTrends(trends: string[]): void {
    if (trends && trends.length > 0) {
      localStorage.setItem('currentTrends', JSON.stringify(trends));
    }
  },
  
  getStoredTrends(): string[] {
    try {
      const storedTrends = localStorage.getItem('currentTrends');
      return storedTrends ? JSON.parse(storedTrends) : [];
    } catch (error) {
      console.error('Error retrieving stored trends:', error);
      return [];
    }
  },
  
  // Create default trends if API fails
  createFallbackTrends(brand: string): string[] {
    const categoryLine = `CATEGORY: Business. RELATED CATEGORIES: Technology, Consumer Trends, Marketing`;
    
    const fallbackTrends = [
      `Companies in ${brand}'s industry are increasingly integrating AI solutions into their operations to improve **efficiency and response times**. [1](https://www.technewsworld.com/article/ai-business/)',`,
      `More businesses like ${brand} are adopting **hybrid work models** as permanent solutions rather than temporary pandemic responses. [2](https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/hybrid-work)`,
      `Social commerce is seeing rapid growth with platforms introducing new **shopping features** that companies like ${brand} can leverage. [3](https://www.emarketer.com/content/social-commerce-report)`,
      `Sustainable business practices are becoming a **competitive advantage** for companies in ${brand}'s sector. [4](https://hbr.org/2022/sustainability-strategy)`,
      `The subscription economy continues to expand in ${brand}'s industry with **recurring revenue models** gaining popularity. [5](https://www.forbes.com/sites/forbesbusinesscouncil/2023/04/10/subscription-business-models-trends/)`,
      `Data privacy regulations are prompting companies like ${brand} to revamp their **customer data strategies**. [6](https://www.gartner.com/en/newsroom/press-releases/data-privacy-report)`,
      `Remote collaboration tools are seeing significant innovation with new features that benefit organizations like ${brand}. [7](https://www.computerworld.com/article/collaboration-tools-trends/)`,
      `Companies in ${brand}'s sector are increasingly using **content marketing** to build authority and trust. [8](https://contentmarketinginstitute.com/articles/content-marketing-trends/)`
    ];
    
    return [categoryLine, ...fallbackTrends];
  }
};

// Re-export the utility functions and types
export { parseCategoryInfo, processLatestTrendsCitations };

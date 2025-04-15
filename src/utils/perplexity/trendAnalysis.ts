
import { makePerplexityRequest } from "../perplexityApi";
import { parseTrendsResponse } from "./trends/trendParser";
import { parseCategoryInfo, CategoryInfo } from "./trends/categoryParser";
import { processLatestTrendsCitations } from "./trends/citationProcessor";
import { generateTrendsSystemPrompt, generateTrendsUserPrompt } from "./trends/trendPrompts";

export interface TrendSegment {
  type: 'text' | 'citation';
  content?: string;
  number?: string;
  url?: string;
}

export const fetchLatestTrends = async (brand: string, customCategories?: { primary: string, related: string[] }): Promise<string[]> => {
  try {
    console.log('Fetching latest trends for', brand);
    
    // If custom categories are provided, use them in the prompt
    if (customCategories) {
      console.log('Using custom categories:', {
        primary: customCategories.primary,
        related: customCategories.related
      });
    }
    
    const systemPrompt = generateTrendsSystemPrompt(brand, customCategories);
    const userPrompt = generateTrendsUserPrompt(brand, customCategories);

    console.log('Sending prompt to API with custom categories:', !!customCategories);
    
    const response = await makePerplexityRequest([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
    
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
      }
    }
    
    return trends;
  } catch (error) {
    console.error('Error fetching latest trends:', error);
    throw error;
  }
};

// Re-export the utility functions
export { parseCategoryInfo } from "./trends/categoryParser";
export { processLatestTrendsCitations } from "./trends/citationProcessor";
export type { CategoryInfo } from "./trends/categoryParser";

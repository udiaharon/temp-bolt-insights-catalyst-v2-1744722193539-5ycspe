
import { makePerplexityRequest } from "@/utils/perplexityApi";
import { getSystemPrompt, getSectionPrompt, getSectionInstructions } from './prompt-generators';

// Add caching to reduce redundant API calls
const responseCache = new Map<string, string>();

export const fetchBrandContent = async (
  section: string, 
  brand: string, 
  category?: string, 
  country?: string
): Promise<string> => {
  try {
    // Create a cache key based on section, brand, and optional parameters
    const cacheKey = `${section}-${brand}-${category || ''}-${country || ''}`;
    
    // Check if we have a cached response
    if (responseCache.has(cacheKey)) {
      console.log(`Using cached ${section} content for ${brand}`);
      return responseCache.get(cacheKey)!;
    }
    
    const specificInstructions = getSectionInstructions(section);
    const sectionPrompt = getSectionPrompt(section, brand, specificInstructions, category, country);
    
    const response = await makePerplexityRequest([
      {
        role: 'system',
        content: getSystemPrompt(section, brand, category, country)
      },
      {
        role: 'user',
        content: sectionPrompt
      }
    ]);
    
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/```json\n|\n```|```/g, '').trim();
    
    // Log only in development to reduce console noise
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Raw ${section} response:`, response);
      console.log(`Cleaned ${section} response:`, cleanedResponse);
    }
    
    // Cache the response
    responseCache.set(cacheKey, cleanedResponse);
    
    return cleanedResponse;
  } catch (error) {
    console.error(`Error fetching ${section} content:`, error);
    throw error;
  }
};

// Add a function to clear the cache if needed
export const clearBrandContentCache = () => {
  responseCache.clear();
  console.log('Brand content cache cleared');
};

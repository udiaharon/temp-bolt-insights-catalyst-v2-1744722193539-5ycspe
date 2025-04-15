
import { makePerplexityRequest } from "./perplexityApi";

// In-memory cache for competitor results
const competitorsCache = new Map<string, string[]>();

// Helper function to generate a cache key
const getCacheKey = (brand: string, category?: string, country?: string): string => {
  return `${brand.toLowerCase()}|${category || ''}|${country || ''}`;
};

// Function to clear the competitors cache
export const clearCompetitorsCache = (): void => {
  competitorsCache.clear();
  console.log('Competitors cache cleared');
};

const normalizeBrandName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/['']s$/, '') // Remove 's at the end
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
};

export const fetchCompetitors = async (
  brand: string, 
  category?: string, 
  country?: string
): Promise<string[]> => {
  console.log('Fetching competitors for:', brand, 
    category ? `in category: ${category}` : '', 
    country ? `in market: ${country}` : '');
  
  try {
    // Build the context part of the prompt based on provided parameters
    let contextPart = "";
    if (category && category.trim()) {
      contextPart += ` in the ${category.trim()} category`;
    }
    if (country && country.trim()) {
      contextPart += ` within the ${country.trim()} market`;
    }

    // Generate a custom cache key for the Perplexity request to force a fresh request
    const cacheKey = `competitors_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    const response = await makePerplexityRequest([
      {
        role: 'system',
        content: `You are a market research expert. Your task is to list ONLY the most dominant and significant direct competitors of ${brand}${contextPart}, focusing on market share, revenue, and brand recognition.

STRICT RULES:
1. Return ONLY a comma-separated list of brand names, nothing else
2. NO introductory text, explanations, or citations
3. NO square brackets or reference numbers
4. NO text like "are competitors of" or "such as"
5. NO suffixes (Inc, Corp, Ltd)
6. NO articles (the, a, an)
7. ONLY the official brand name as it appears in their marketing
8. Return between 5-9 most dominant competitors, ordered by market significance
9. Focus on competitors with:
   - Highest market share
   - Largest revenue
   - Strongest brand recognition
   - Direct competition in the same market segment${category ? `\n   - Specifically for the ${category} category` : ''}${country ? `\n   - Specifically in the ${country} market` : ''}
10. NEVER include ${brand} itself in the list of competitors

CORRECT FORMAT:
Nike, Adidas, Puma, Under Armour, Reebok, New Balance

INCORRECT FORMATS:
- The main competitors are Nike, Adidas
- Nike Inc., Adidas Corp and Puma
- [1] Nike, Adidas [2] Puma
- Companies like Nike and Adidas`
      },
      {
        role: 'user',
        content: `List only the most dominant direct competitor brand names for ${brand}${contextPart}, focusing on market share, revenue, and brand recognition. Return between 5-9 most significant competitors. IMPORTANT: Do NOT include ${brand} itself in the list.`
      }
    ], {
      cacheKey, // Force a unique cache key each time
      useCache: false // Disable caching completely
    });

    // Clean up the response
    const cleanedResponse = response
      .replace(/\[\d+\]/g, '') // Remove citation numbers [1], [2], etc
      .replace(/^.*?(?=[\w\s-]+(?:,|$))/g, '') // Remove introductory text
      .replace(/\s+and\s+/g, ',') // Replace " and " with comma
      .replace(/\.$/, '') // Remove trailing period
      .replace(/\b(Inc\.|Corp\.|Corporation|Company|Ltd\.|LLC)\b/gi, '') // Remove company suffixes
      .replace(/\b(The|A|An)\s+/gi, '') // Remove articles
      .replace(/are\s+competitors\s+of.*$/i, '') // Remove "are competitors of" phrases
      .replace(/such\s+as.*$/i, '') // Remove "such as" phrases
      .replace(/companies\s+like.*$/i, '') // Remove "companies like" phrases
      .replace(/\[.*?\]/g, ''); // Remove any remaining square brackets

    // Create a Map to store normalized names and their original forms
    const brandMap = new Map<string, string>();
    
    // Normalize the input brand name for comparison
    const normalizedBrandName = normalizeBrandName(brand);
    
    cleanedResponse
      .split(',')
      .map(comp => comp.trim())
      .filter(comp => {
        // Only allow valid brand names:
        // - Must be 2-30 characters long
        // - Can only contain letters, numbers, spaces, hyphens, and &
        // - Must start with a letter
        // - Cannot contain common text indicators
        // - Cannot match the input brand name (case-insensitive)
        return (
          comp.length >= 2 &&
          comp.length <= 30 &&
          /^[A-Za-z][A-Za-z0-9\s\-&]+$/.test(comp) &&
          !comp.toLowerCase().includes('competitor') &&
          !comp.toLowerCase().includes('brand') &&
          !comp.toLowerCase().includes('company') &&
          normalizeBrandName(comp) !== normalizedBrandName // Filter out the brand itself
        );
      })
      .forEach(comp => {
        const normalized = normalizeBrandName(comp);
        // Keep the first occurrence of a brand name
        if (!brandMap.has(normalized)) {
          brandMap.set(normalized, comp);
        }
      });

    const uniqueCompetitors = Array.from(brandMap.values()).slice(0, 9);
    
    if (uniqueCompetitors.length < 5) {
      console.warn('Found less than 5 valid competitors:', uniqueCompetitors.length);
    }

    console.log('Found competitors:', uniqueCompetitors);
    return uniqueCompetitors;
  } catch (error) {
    console.error('Error fetching competitors:', error);
    throw error;
  }
};

import { NewsItem } from "@/types/analysis";

/**
 * Enhanced deduplication that checks both URLs and similar titles
 * This is the central implementation to be used across the application
 */
export const deduplicateNewsByUrl = (newsItems: NewsItem[]): NewsItem[] => {
  if (!newsItems || !Array.isArray(newsItems)) {
    console.warn('deduplicateNewsByUrl received invalid newsItems:', newsItems);
    return [];
  }
  
  console.log(`Deduplicating ${newsItems.length} news items`);
  
  const seenUrls = new Set<string>();
  const seenTitleSignatures = new Set<string>();
  const seenTitleFragments = new Set<string>();
  
  const result = newsItems.filter(item => {
    if (!item || !item.url || !item.title) return false;
    
    // Normalize URL by removing trailing slashes and query parameters
    const url = normalizeUrl(item.url);
    
    // Create a signature for the title by keeping only alphanumeric characters
    // and converting to lowercase
    const titleSignature = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 50); // First 50 chars for comparison
    
    // Also create a set of meaningful fragments from the title to catch
    // rewrites of the same story with different wording
    const titleWords = item.title.toLowerCase().split(/\s+/);
    const significantWords = titleWords.filter(word => 
      word.length > 4 && !commonWords.includes(word)
    );
    
    // For a title to be considered a duplicate, it needs to share at least 
    // 3 significant words with an existing title
    let isDuplicateByWords = false;
    if (significantWords.length >= 3) {
      // Check for at least 3 matching significant words with any previously seen title
      let matchingWords = 0;
      for (const word of significantWords) {
        if (seenTitleFragments.has(word)) {
          matchingWords++;
          if (matchingWords >= 3) {
            isDuplicateByWords = true;
            break;
          }
        }
      }
    }
    
    // Check if we've seen this URL, a very similar title, or similar content
    if (!seenUrls.has(url) && !seenTitleSignatures.has(titleSignature) && !isDuplicateByWords) {
      seenUrls.add(url);
      seenTitleSignatures.add(titleSignature);
      
      // Add all significant words to the set for future comparison
      significantWords.forEach(word => seenTitleFragments.add(word));
      
      return true;
    }
    return false;
  });
  
  console.log(`After deduplication: ${result.length} news items`);
  return result;
};

// Helper function to normalize URLs for better comparison
const normalizeUrl = (url: string): string => {
  try {
    // Remove trailing slashes and lowercase
    let normalized = url.toLowerCase().replace(/\/+$/, '');
    
    // Try to remove query parameters if present
    try {
      const urlObj = new URL(normalized);
      normalized = urlObj.origin + urlObj.pathname;
    } catch (e) {
      // If URL parsing fails, just use the string as is
    }
    
    return normalized;
  } catch (error) {
    return url.toLowerCase();
  }
};

// List of common words to ignore when comparing titles
const commonWords = [
  'about', 'after', 'again', 'also', 'another', 'before', 'being', 'between',
  'both', 'could', 'during', 'each', 'either', 'every', 'from', 'have', 
  'having', 'here', 'itself', 'many', 'more', 'most', 'much', 'other', 
  'says', 'some', 'such', 'than', 'that', 'their', 'them', 'then', 'there',
  'these', 'they', 'this', 'those', 'through', 'under', 'very', 'were', 
  'what', 'when', 'where', 'which', 'while', 'with', 'would', 'your'
];

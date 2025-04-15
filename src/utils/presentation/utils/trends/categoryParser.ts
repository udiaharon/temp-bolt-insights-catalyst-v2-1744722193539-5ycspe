
/**
 * Parses category information from trend data
 * 
 * @param trends The array of trend strings
 * @returns Object containing primary category and related categories
 */
export interface TrendCategories {
  primaryCategory: string;
  relatedCategories: string[];
}

export const parseTrendCategories = (trends: string[]): TrendCategories => {
  // Default values
  let primaryCategory = "Industry Trends";
  let relatedCategories: string[] = [];
  
  try {
    const categoryInfo = trends[0];
    if (categoryInfo && categoryInfo.includes("CATEGORY:")) {
      const categoryMatch = categoryInfo.match(/CATEGORY:\s*([^.]+)/);
      if (categoryMatch && categoryMatch[1]) {
        primaryCategory = categoryMatch[1].trim();
      }
      
      const relatedMatch = categoryInfo.match(/RELATED CATEGORIES:\s*([^.]+)/);
      if (relatedMatch && relatedMatch[1]) {
        relatedCategories = relatedMatch[1].split(',').map(cat => cat.trim());
      }
    }
  } catch (error) {
    console.warn("Error parsing trend categories:", error);
  }
  
  return {
    primaryCategory,
    relatedCategories
  };
};

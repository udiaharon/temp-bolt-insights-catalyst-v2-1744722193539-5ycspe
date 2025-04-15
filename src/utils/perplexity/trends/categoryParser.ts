
export interface CategoryInfo {
  primary: string;
  related: string[];
}

// Parse category information from the first trend line
export const parseCategoryInfo = (categoryLine: string): CategoryInfo => {
  try {
    // Default values
    let primaryCategory = '';
    let relatedCategories: string[] = [];
    
    // Extract primary category
    const primaryMatch = categoryLine.match(/CATEGORY:\s*([^.]+?)(?:\.|\s+RELATED)/i);
    if (primaryMatch && primaryMatch[1]) {
      primaryCategory = primaryMatch[1].trim();
    }
    
    // Extract related categories
    const relatedMatch = categoryLine.match(/RELATED CATEGORIES:\s*([^.]+)(?:\.|\s*$)/i);
    if (relatedMatch && relatedMatch[1]) {
      relatedCategories = relatedMatch[1]
        .split(/,\s*/)
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0);
    }
    
    return { primary: primaryCategory, related: relatedCategories };
  } catch (error) {
    console.error('Error parsing category info:', error);
    return { primary: '', related: [] };
  }
};


import { format } from "date-fns";
import { NewsItem } from "@/types/analysis";
import { deduplicateNewsByUrl } from "@/utils/deduplication";

export const formatNewsDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return format(date, 'dd-MMM-yy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return format(new Date(), 'dd-MMM-yy');
  }
};

export const getBrandIndustryContext = (brand: string): string => {
  const brandContextMap: Record<string, string> = {
    'apple': 'technology company Apple Inc.',
    'amazon': 'e-commerce and technology company Amazon',
    'google': 'technology company Google',
    'microsoft': 'technology company Microsoft',
    'facebook': 'social media company Facebook',
    'meta': 'technology company Meta (formerly Facebook)',
    'twitter': 'social media platform Twitter',
    'x': 'social media platform X (formerly Twitter)',
    'visa': 'payment technology company Visa Inc.',
    'mastercard': 'payment technology company Mastercard',
    'american express': 'financial services company American Express',
    'amex': 'financial services company American Express',
    'delta': 'airline company Delta Air Lines',
    'united': 'airline company United Airlines',
    'shell': 'energy company Shell',
    'bp': 'energy company BP',
    'ford': 'automotive manufacturer Ford',
    'toyota': 'automotive manufacturer Toyota',
    'honda': 'automotive manufacturer Honda',
    'subway': 'restaurant chain Subway',
    'domino\'s': 'restaurant chain Domino\'s Pizza',
    'dominos': 'restaurant chain Domino\'s Pizza',
    'target': 'retail corporation Target',
    'walmart': 'retail corporation Walmart'
  };
  
  const lowercaseBrand = brand.toLowerCase();
  return brandContextMap[lowercaseBrand] || `company or business entity "${brand}"`;
};

// Export the deduplication function for backward compatibility
export { deduplicateNewsByUrl } from "@/utils/deduplication";

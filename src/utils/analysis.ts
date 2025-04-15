
import { MarketingC, NewsItem } from "@/types/analysis";
import { analysisService } from "@/services/analysisService";
import { deduplicateNewsByUrl } from "@/utils/deduplication";

export const convertObjectToArray = (obj: { [key: string]: any }): MarketingC[] => {
  return Object.keys(obj).map(key => ({
    title: key,
    topics: Array.isArray(obj[key]) ? obj[key] : [],
    content: obj[key]
  }));
};

// Export the deduplication function for backward compatibility
export { deduplicateNewsByUrl } from "@/utils/deduplication";

// Export analyzeBrand function
export const analyzeBrand = async (brand: string, competitors: string[]) => {
  return await analysisService.analyzeBrand(brand, competitors);
};

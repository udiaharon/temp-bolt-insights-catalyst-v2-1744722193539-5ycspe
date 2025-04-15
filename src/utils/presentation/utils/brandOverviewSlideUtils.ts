
import PptxGenJS from "pptxgenjs";
import { BrandContent } from "@/types/analysis";
import { createBrandContentSlide } from "./slides/brandContentSlide";

/**
 * Creates slides for brand overview information
 */
export const createBrandOverviewSlides = (
  pptx: PptxGenJS,
  brandContent: BrandContent,
  brand: string
) => {
  console.log(`Creating brand overview slides for ${brand} with content:`, 
    Object.keys(brandContent).filter(key => !!brandContent[key]));
  
  if (!brandContent) {
    console.error("No brand content provided for slides");
    return;
  }
  
  // Create a slide for each non-empty section
  if (brandContent.marketPosition && brandContent.marketPosition.trim()) {
    createBrandContentSlide(pptx, brand, "Market Position", brandContent.marketPosition);
  }
  
  if (brandContent.keyProducts && brandContent.keyProducts.trim()) {
    createBrandContentSlide(pptx, brand, "Key Products & Services", brandContent.keyProducts);
  }
  
  if (brandContent.recentPerformance && brandContent.recentPerformance.trim()) {
    createBrandContentSlide(pptx, brand, "Recent Performance", brandContent.recentPerformance);
  }
  
  if (brandContent.notableAchievements && brandContent.notableAchievements.trim()) {
    createBrandContentSlide(pptx, brand, "Notable Achievements", brandContent.notableAchievements);
  }
  
  console.log("Brand overview slides creation completed");
};

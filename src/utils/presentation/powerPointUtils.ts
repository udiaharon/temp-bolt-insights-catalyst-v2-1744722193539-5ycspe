
import pptxgen from "pptxgenjs";
import { MarketingC, SwotAnalysis } from "./types/presentationTypes";
import { createTitleSlide } from "./utils/titleSlideUtils";
import { createMarketingCSlides } from "./utils/marketingSlideUtils";
import { createBrandAwarenessSlide } from "./utils/brandAwarenessSlideUtils";
import { createSwotSlide } from "./utils/swotSlideUtils";
import { BrandContent, NewsItem } from "@/types/analysis";
import { createBrandOverviewSlides } from "./utils/brandOverviewSlideUtils";
import { createNewsSlide } from "./utils/news";
import { createTrendsSlide } from "./utils/trendSlideUtils";

export const generatePowerPoint = async (
  brand: string,
  marketingCs: MarketingC[],
  swotAnalysis: SwotAnalysis | null,
  brandLogoUrl?: string | null,
  brandContent?: BrandContent | null,
  newsItems?: NewsItem[]
) => {
  console.log("Starting PowerPoint generation with:", {
    brand,
    marketingCsCount: marketingCs.length,
    hasSwot: !!swotAnalysis,
    hasLogo: !!brandLogoUrl,
    hasBrandContent: !!brandContent,
    newsItemsCount: newsItems?.length || 0
  });

  const pptx = new pptxgen();
  
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "730.ai Analysis";
  pptx.title = `${brand} Market Analysis`;

  try {
    // Create title slide
    await createTitleSlide(pptx, brand, brandLogoUrl);
    
    // Add Brand Overview slides if brand content is available
    if (brandContent) {
      console.log("Creating Brand Overview slides with content:", 
        Object.keys(brandContent).filter(key => !!brandContent[key]));
      createBrandOverviewSlides(pptx, brandContent, brand);
    } else {
      console.log("No brand content available for slides");
    }
    
    // Add News slide if news items are available
    if (newsItems && newsItems.length > 0) {
      console.log("Creating News slide with", newsItems.length, "items");
      createNewsSlide(pptx, newsItems, brand);
    } else {
      console.log("No news items available for slides");
    }
    
    // Get the latest trends from localStorage to include in the presentation
    let latestTrends: string[] | undefined;
    try {
      const trendsData = localStorage.getItem('currentTrends');
      if (trendsData) {
        latestTrends = JSON.parse(trendsData);
        console.log("Found trends data for inclusion in PowerPoint:", latestTrends?.length);
      }
    } catch (error) {
      console.error("Error parsing trends data from localStorage:", error);
    }
    
    // Add latest trends slide if available (after brand overview)
    if (latestTrends && latestTrends.length > 0) {
      await createTrendsSlide(pptx, latestTrends, brand);
    }
    
    // Add Marketing C slides
    createMarketingCSlides(pptx, marketingCs);
    
    // Add SWOT analysis slide if available
    if (swotAnalysis) {
      createSwotSlide(pptx, swotAnalysis);
    }
  
    // Check if brand awareness analysis exists in localStorage
    const chartElement = document.querySelector('.brand-awareness-chart');
    if (chartElement) {
      console.log('Brand awareness chart found, adding slide');
      await createBrandAwarenessSlide(pptx, brand);
    } else {
      console.log('No brand awareness chart found, skipping slide');
    }
  
    // Save the presentation
    sessionStorage.setItem('pptDownloadInProgress', 'true');
    
    await pptx.writeFile({ fileName: `${brand}_Market_Analysis.pptx` });
    console.log("PowerPoint file saved successfully");
    
    // Keep the flag alive for a short time after download completes
    setTimeout(() => {
      sessionStorage.removeItem('pptDownloadInProgress');
    }, 5000);
  } catch (error) {
    console.error("Error during PowerPoint generation:", error);
    sessionStorage.removeItem('pptDownloadInProgress');
    throw error;
  }
};

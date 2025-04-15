
import PptxGenJS from "pptxgenjs";
import { NewsItem } from "@/types/analysis";
import { deduplicateNewsByUrl } from "@/utils/deduplication";
import { createNewsSlideLayout } from "./newsSlideLayout";

/**
 * Creates a slide with news articles
 */
export const createNewsSlide = (
  pptx: PptxGenJS,
  newsItems: NewsItem[],
  brand: string
) => {
  console.log(`Creating news slide with ${newsItems?.length || 0} items for ${brand}`);
  
  // Skip if no news items
  if (!newsItems || !Array.isArray(newsItems) || newsItems.length === 0) {
    console.log("No news items available, skipping news slide");
    return;
  }
  
  // Create a new slide
  const slide = pptx.addSlide();
  slide.background = { color: "F1F5F9" };
  
  // Add slide title with consistent formatting
  slide.addText(
    "Latest News",
    {
      x: 0.5,
      y: 0.2,
      w: "90%",
      h: 0.5,
      fontSize: 24,
      color: "2563EB",
      bold: true,
      fontFace: "Arial",
    }
  );
  
  // Remove duplicate news items using the standard deduplication function
  const uniqueItems = deduplicateNewsByUrl(newsItems);
  console.log(`After deduplication: ${uniqueItems.length} news items`);
  
  // Sort news items by date (newest first) with simpler sorting
  const sortedNewsItems = [...uniqueItems].sort((a, b) => {
    // Simple string comparison for dates in format DD-MMM-YY
    // This will work for consistent date formatting
    return b.date.localeCompare(a.date);
  });
  
  // Limit to 20 news items for the slide
  const limitedNewsItems = sortedNewsItems.slice(0, 20);
  console.log(`Using ${limitedNewsItems.length} news items for the slide`);
  
  // Create the news slide layout with the items
  createNewsSlideLayout(slide, limitedNewsItems);
  
  console.log("News slide creation completed");
};

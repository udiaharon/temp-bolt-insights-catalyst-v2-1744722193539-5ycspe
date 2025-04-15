
import PptxGenJS from "pptxgenjs";
import { NewsItem } from "@/types/analysis";
import { addNewsItem } from "./newsItemUtils";

/**
 * Creates the layout for the news items on a slide
 */
export const createNewsSlideLayout = (
  slide: PptxGenJS.Slide, 
  newsItems: NewsItem[]
) => {
  // Define positioning and dimensions for dual column layout if we have enough items
  const useDoubleColumn = newsItems.length > 8;
  
  // Adjust layout based on number of items
  if (useDoubleColumn) {
    createTwoColumnLayout(slide, newsItems);
  } else {
    createSingleColumnLayout(slide, newsItems);
  }
};

/**
 * Creates a two-column layout for news items
 */
const createTwoColumnLayout = (
  slide: PptxGenJS.Slide, 
  newsItems: NewsItem[]
) => {
  // Create a two-column layout
  const col1X = 0.5;
  const col2X = 5.5;
  const startY = 0.8;
  const itemSpacing = 0.25;
  
  // Distribute items between columns
  const firstColumnCount = Math.ceil(newsItems.length / 2);
  const firstColumnItems = newsItems.slice(0, firstColumnCount);
  const secondColumnItems = newsItems.slice(firstColumnCount);
  
  // Add items to first column
  firstColumnItems.forEach((item, idx) => {
    const y = startY + (idx * itemSpacing);
    addNewsItem(slide, item, col1X, y);
  });
  
  // Add items to second column
  secondColumnItems.forEach((item, idx) => {
    const y = startY + (idx * itemSpacing);
    addNewsItem(slide, item, col2X, y);
  });
};

/**
 * Creates a single-column layout for news items
 */
const createSingleColumnLayout = (
  slide: PptxGenJS.Slide, 
  newsItems: NewsItem[]
) => {
  // Single column layout for fewer items
  const colX = 0.5;
  const startY = 0.8;
  const itemSpacing = 0.25;
  
  // Add all items in a single column
  newsItems.forEach((item, idx) => {
    const y = startY + (idx * itemSpacing);
    addNewsItem(slide, item, colX, y);
  });
};

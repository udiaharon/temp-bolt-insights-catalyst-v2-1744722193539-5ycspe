
import PptxGenJS from "pptxgenjs";
import { NewsItem } from "@/types/analysis";

/**
 * Adds a single news item to the slide
 */
export const addNewsItem = (
  slide: PptxGenJS.Slide, 
  item: NewsItem, 
  x: number, 
  y: number
) => {
  const bulletWidth = 0.15;
  const textWidth = x < 5 ? 4.5 : 4.5;  // Adjust width based on column
  
  // Add globe icon
  slide.addText(
    "🌐",
    {
      x,
      y,
      w: bulletWidth,
      h: 0.15,
      fontSize: 9,
      color: "0000CC",
      fontFace: "Arial",
    }
  );
  
  // Add news title with hyperlink
  slide.addText(
    `${item.title} (${item.date})`,
    {
      x: x + bulletWidth,
      y,
      w: textWidth,
      h: 0.15,
      fontSize: 8,
      color: "0000FF",
      fontFace: "Arial",
      hyperlink: { url: item.url, tooltip: item.url }
    }
  );
};

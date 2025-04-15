
import PptxGenJS from "pptxgenjs";
import { trendSlideLayout } from "./layoutConfig";
import { addFormattedTextToSlide } from "./textFormatter";
import { getTrendCategoryIcon } from "./trendIconUtils";
import { parseTrendCategories } from "./categoryParser";

/**
 * Creates a slide showing the latest industry trends in a 2x4 grid
 * 
 * @param pptx The PowerPoint presentation object
 * @param trends Array of trends data
 * @param brand Brand name for the footer
 */
export const createTrendsSlide = async (pptx: PptxGenJS, trends: string[] | undefined, brand: string) => {
  // Skip if no trends data available
  if (!trends || trends.length < 5) {
    console.log("Skipping trends slide - insufficient trend data");
    return;
  }

  // Get actual trends (skip the first item which contains category info)
  const actualTrends = trends.slice(1, 9);
  
  // Parse category information from the first trend item
  const { primaryCategory, relatedCategories } = parseTrendCategories(trends);
  
  // Create the slide with the same background as other slides
  const slide = pptx.addSlide();
  slide.background = { color: "F1F5F9" };  // Match background color with other slides

  // Get the icon for the title
  const categoryIcon = getTrendCategoryIcon(primaryCategory);
  
  // Add slide title with icon prefix
  slide.addText(`${categoryIcon} Latest Trends: ${primaryCategory}`, {
    x: trendSlideLayout.slideTitle.x,
    y: trendSlideLayout.slideTitle.y,
    w: trendSlideLayout.slideTitle.width,
    h: trendSlideLayout.slideTitle.height,
    fontSize: trendSlideLayout.slideTitle.fontSize,
    color: trendSlideLayout.slideTitle.color,
    bold: trendSlideLayout.slideTitle.bold,
    fontFace: trendSlideLayout.slideTitle.fontFace,
    fit: "shrink"  // Use "shrink" to ensure title fits on one line
  });
  
  // Add related categories if available
  if (relatedCategories.length > 0) {
    slide.addText(`Related Categories: ${relatedCategories.join(", ")}`, {
      x: trendSlideLayout.relatedCategories.x,
      y: trendSlideLayout.relatedCategories.y,      
      w: trendSlideLayout.relatedCategories.width,
      h: trendSlideLayout.relatedCategories.height,      
      fontSize: trendSlideLayout.relatedCategories.fontSize, 
      italic: true,
      color: trendSlideLayout.relatedCategories.color
    });
  }
  
  // Get layout values from config
  const { grid, cell } = trendSlideLayout;
  
  // Add trends to the grid with proper formatting
  actualTrends.forEach((trend, index) => {
    const col = index % grid.columns;
    const row = Math.floor(index / grid.columns);
    
    const x = grid.startX + (col * (grid.cellWidth + grid.gapX));
    const y = grid.startY + (row * (grid.cellHeight + grid.gapY));
    
    // Create a shape as the background for the trend cell
    slide.addShape("rect", {
      x: x,
      y: y,
      w: grid.cellWidth,
      h: grid.cellHeight,
      fill: { color: cell.backgroundColor },
      line: { color: cell.borderColor, width: cell.borderWidth },
      rectRadius: cell.cornerRadius
    });
    
    // Add formatted text to the cell
    addFormattedTextToSlide(
      slide,
      trend,
      x + cell.padding,
      y + cell.padding,
      grid.cellWidth - (cell.padding * 2),
      grid.cellHeight - (cell.padding * 2),
      cell.fontSize,
      cell.textColor
    );
  });
  
  // Add brand name and date at the bottom
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  slide.addText(`${brand} Market Analysis - ${currentDate}`, {
    x: trendSlideLayout.footer.x,
    y: trendSlideLayout.footer.y,
    w: trendSlideLayout.footer.width,
    h: trendSlideLayout.footer.height,
    fontSize: trendSlideLayout.footer.fontSize,
    color: trendSlideLayout.footer.color,
    italic: true,
    align: "center"
  });
};

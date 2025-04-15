
import PptxGenJS from "pptxgenjs";

export interface Citation {
  number: string;
  url: string;
}

/**
 * Adds a citations section to a slide
 */
export const addCitationsToSlide = (
  slide: PptxGenJS.Slide,
  citations: Citation[]
) => {
  if (citations.length === 0) return;

  const sourcesStartY = 4.6;
  
  // Add "Sources:" header
  slide.addText("Sources:", {
    x: 0.5,
    y: sourcesStartY,
    w: 1.0,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color: "334155"
  });
  
  // Add each citation with proper positioning
  const citatonsToShow = citations.slice(0, 10);
  citatonsToShow.forEach((citation, index) => {
    // Ensure URL has proper protocol
    let url = citation.url || '';
    if (url && !url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    slide.addText(
      `[${citation.number}] ${url}`,
      {
        x: 0.5,
        y: sourcesStartY + 0.2 + (index * 0.15),
        w: 9.0,
        h: 0.15,
        fontSize: 8,
        color: "0000FF",
        fontFace: "Arial",
        underline: { color: "0000FF" },
        hyperlink: { url: url }
      }
    );
  });
  
  if (citations.length > 10) {
    slide.addText(
      `+ ${citations.length - 10} more sources (see full report)`,
      {
        x: 0.5,
        y: sourcesStartY + 0.2 + (10 * 0.15),
        w: 9.0,
        h: 0.15,
        fontSize: 8,
        color: "666666",
        fontFace: "Arial",
        italic: true
      }
    );
  }
};

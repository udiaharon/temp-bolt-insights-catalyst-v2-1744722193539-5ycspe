
import PptxGenJS from "pptxgenjs";

/**
 * Processes text with markdown-style bold markers (**text**) and formats it for PowerPoint
 * 
 * @param slide The PowerPoint slide to add text to
 * @param text The text content to format
 * @param x X position for the text
 * @param y Y position for the text
 * @param width Width of the text box
 * @param height Height of the text box
 * @param fontSize Font size for the text
 * @param color Text color
 */
export const addFormattedTextToSlide = (
  slide: PptxGenJS.Slide,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize: number,
  color: string
): void => {
  // Check if this is just a header (text wrapped in ** on both sides with no other content)
  const headerMatch = text.match(/^\s*\*\*(.*?)\*\*\s*$/);
  if (headerMatch && headerMatch[1]) {
    // Add header text with appropriate formatting
    slide.addText(headerMatch[1].trim(), {
      x,
      y,
      w: width,
      h: height,
      fontSize: fontSize + 1, // Slightly larger font for headers
      color,
      bold: true,
      align: "center"
    });
    return;
  }

  // Remove any citation markers like [1], [2], etc.
  const cleanText = text.replace(/\[\d+\]/g, '').trim();
  
  // Check if text has bold formatting
  if (cleanText.includes("**")) {
    const segments = [];
    let currentPosition = 0;
    let boldStart = cleanText.indexOf("**", currentPosition);
    
    while (boldStart !== -1) {
      // Add text before the bold part
      if (boldStart > currentPosition) {
        segments.push({
          text: cleanText.substring(currentPosition, boldStart),
          options: { bold: false }
        });
      }
      
      // Find the end of the bold section
      const boldEnd = cleanText.indexOf("**", boldStart + 2);
      if (boldEnd === -1) break; // No closing ** found
      
      // Add the bold text
      segments.push({
        text: cleanText.substring(boldStart + 2, boldEnd),
        options: { bold: true }
      });
      
      currentPosition = boldEnd + 2;
      boldStart = cleanText.indexOf("**", currentPosition);
    }
    
    // Add any remaining text
    if (currentPosition < cleanText.length) {
      segments.push({
        text: cleanText.substring(currentPosition),
        options: { bold: false }
      });
    }
    
    // Add formatted text to slide
    slide.addText(segments, {
      x,
      y,
      w: width,
      h: height,
      fontSize,
      color
    });
  } else {
    // No bold formatting needed
    slide.addText(cleanText, {
      x,
      y,
      w: width,
      h: height,
      fontSize,
      color
    });
  }
};

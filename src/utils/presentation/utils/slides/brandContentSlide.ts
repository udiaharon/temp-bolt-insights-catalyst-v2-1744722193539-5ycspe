
import PptxGenJS from "pptxgenjs";
import { formatSlideText } from "../text/slideTextFormatter";
import { addCitationsToSlide } from "../citations/slideCitationUtils";

/**
 * Creates a single brand content slide
 */
export const createBrandContentSlide = (
  pptx: PptxGenJS,
  brand: string,
  sectionTitle: string,
  content: string
) => {
  console.log(`Creating brand content slide: ${sectionTitle} for ${brand}`);
  
  // Skip creation if content is empty
  if (!content || content.trim() === "") {
    console.log(`Skipping empty ${sectionTitle} slide`);
    return;
  }
  
  // Create a new slide
  const slide = pptx.addSlide();
  slide.background = { color: "F1F5F9" };
  
  // Add slide title with consistent formatting
  slide.addText(
    sectionTitle,
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
  
  // Format text and extract citations
  const { textContent, citations } = formatSlideText(content, sectionTitle);
  
  // Log text content for debugging
  console.log(`Content for ${sectionTitle} slide - length: ${textContent.length}`);
  
  // Add the content to the slide as a single text object with bullet points
  slide.addText(textContent, {
    x: 0.3,
    y: 0.8,
    w: "95%",
    h: 3.5,
    align: "left",
    valign: "top",
    bullet: { type: "bullet" },
    paraSpaceAfter: 3,
    lineSpacing: 10,
    fontSize: 8.5,
  });
  
  // Add citations section
  addCitationsToSlide(slide, citations);
  
  console.log(`Completed brand content slide: ${sectionTitle}`);
};

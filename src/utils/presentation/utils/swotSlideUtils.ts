
import pptxgen from "pptxgenjs";
import { SwotAnalysis } from "../types/presentationTypes";

interface QuadrantConfig {
  title: string;
  items: string[];
  color: string;
  bgColor: string;
}

export const createSwotSlide = (pptx: pptxgen, swotAnalysis: SwotAnalysis) => {
  // Check if SWOT analysis exists
  if (!swotAnalysis || !swotAnalysis.strengths || !swotAnalysis.weaknesses || 
      !swotAnalysis.opportunities || !swotAnalysis.threats) {
    console.error('Invalid SWOT analysis data', swotAnalysis);
    return;
  }

  console.log('Creating SWOT slide with data:', swotAnalysis);
  
  const swotSlide = pptx.addSlide();
  swotSlide.background = { color: "F1F5F9" };

  const iconSize = 0.2;
  const iconX = 0.5;
  const iconY = 0.2;
  const gap = 0.02;

  // Create SWOT icon
  const quadrantColors = ["22C55E", "F97316", "3B82F6", "EF4444"];
  const positions = [
    { x: iconX, y: iconY },
    { x: iconX + iconSize + gap, y: iconY },
    { x: iconX, y: iconY + iconSize + gap },
    { x: iconX + iconSize + gap, y: iconY + iconSize + gap }
  ];

  positions.forEach((pos, index) => {
    swotSlide.addShape("rect", {
      x: pos.x,
      y: pos.y,
      w: iconSize,
      h: iconSize,
      fill: { color: quadrantColors[index] },
      line: { color: "FFFFFF", width: 1 }, // Added white border
      shadow: { type: "outer", blur: 3, offset: 2, angle: 45, color: "808080", opacity: 0.4 } // Changed transparency to opacity
    });
  });

  // Add title
  swotSlide.addText("SWOT Analysis", {
    x: iconX + (iconSize * 2) + (gap * 2) + 0.2,
    y: 0.2,
    w: 7,
    h: 0.5,
    fontSize: 24,
    color: "2563EB",
    bold: true,
  });

  // Add quadrants with subtle background colors
  const quadrants: QuadrantConfig[] = [
    { title: "Strengths", items: swotAnalysis.strengths || [], color: "22C55E", bgColor: "F2FCE2" }, // Soft green
    { title: "Weaknesses", items: swotAnalysis.weaknesses || [], color: "F97316", bgColor: "FDE1D3" }, // Soft peach
    { title: "Opportunities", items: swotAnalysis.opportunities || [], color: "3B82F6", bgColor: "D3E4FD" }, // Soft blue
    { title: "Threats", items: swotAnalysis.threats || [], color: "EF4444", bgColor: "FFDEE2" }, // Soft pink
  ];

  const slideWidth = 10;
  const slideHeight = 5.6;
  const contentWidth = 9;
  const contentHeight = 4;
  const startX = (slideWidth - contentWidth) / 2;
  const startY = 1.2;

  quadrants.forEach((quadrant, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    
    const x = startX + (col * 4.5);
    const y = startY + (row * 2.0);

    // Add background rectangle for each quadrant
    swotSlide.addShape("rect", {
      x,
      y,
      w: 4.41, // Changed from 4.33 to 4.41 (11.2 cm)
      h: 1.92, // Height to cover both title and content (0.25 + 1.67)
      fill: { color: quadrant.bgColor },
      line: { color: quadrant.bgColor },
    });

    swotSlide.addText(quadrant.title, {
      x,
      y,
      w: 4.41, // Changed from 4.33 to 4.41 (11.2 cm)
      h: 0.25,
      fontSize: 16,
      color: quadrant.color,
      bold: true,
    });

    const bulletPoints = quadrant.items.map(item => ({
      text: item,
      options: {
        bullet: { indent: 12 },
        fontSize: 10,
        color: "475569",
        breakLine: true,
        paragraphSpacing: 2
      }
    }));

    swotSlide.addText(bulletPoints, {
      x,
      y: y + 0.25,
      w: 4.41, // Changed from 4.33 to 4.41 (11.2 cm)
      h: 1.67,
      align: "left",
      valign: "top"
    });
  });
};

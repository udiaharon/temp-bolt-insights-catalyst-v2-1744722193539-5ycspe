
import { processCitations } from "@/components/analysis/utils/citationUtils";
import { Citation } from "../citations/slideCitationUtils";

interface FormattedTextSegment {
  text: string;
  options: {
    bold?: boolean;
    color?: string;
    fontSize?: number;
    breakLine?: boolean;
    paragraphSpacing?: number;
  };
}

/**
 * Process text with citations and format it for slides
 */
export const formatSlideText = (content: string, sectionTitle: string): {
  textContent: FormattedTextSegment[];
  citations: Citation[];
} => {
  // Process citations
  const segments = processCitations(content, sectionTitle);
  
  // Extract text and citations
  let cleanText = "";
  const citations: Citation[] = [];
  
  segments.forEach(segment => {
    if (segment.type === 'text' && segment.content) {
      cleanText += segment.content;
    } else if (segment.type === 'citation' && segment.number && segment.url) {
      cleanText += ` [${segment.number}]`;
      
      // Only add the citation if it has a valid URL (not example.com)
      const isValidUrl = segment.url && !segment.url.includes('example.com');
      
      // Only add the citation if this number+url combination doesn't already exist
      const existingCitation = citations.find(
        c => c.number === segment.number && c.url === segment.url
      );
      
      if (!existingCitation && isValidUrl) {
        citations.push({
          number: segment.number,
          url: segment.url
        });
      } else if (!existingCitation && !isValidUrl) {
        // If URL is invalid, try to create a default one
        citations.push({
          number: segment.number,
          url: `https://example.com/citation/${segment.number}`
        });
      }
    }
  });
  
  // Split text into paragraphs
  const paragraphs = cleanText.split('\n').filter(para => para.trim().length > 0);
  
  // Create formatted text objects with minimal line breaks between paragraphs
  const textContent: FormattedTextSegment[] = [];
  
  // Process each paragraph
  paragraphs.forEach((para, index) => {
    // Add line break before paragraphs (except the first one)
    if (index > 0) {
      textContent.push({
        text: "\n", // Line break between paragraphs
        options: {}
      });
    }
    
    // Process bold formatting for this paragraph by replacing **text** with a special marker
    // Use a more comprehensive regex that handles spaces properly
    const boldPattern = /\*\*(.*?)\*\*/g;
    
    if (!boldPattern.test(para)) {
      // No bold text in this paragraph
      textContent.push({
        text: para.trim(),
        options: { 
          bold: false,
          color: "475569",
          fontSize: 9
        }
      });
    } else {
      // Split the paragraph around bold sections to preserve spacing
      let currentPos = 0;
      let result = '';
      const segments: Array<{text: string, isBold: boolean}> = [];
      
      // Reset regex state
      boldPattern.lastIndex = 0;
      
      let match;
      while ((match = boldPattern.exec(para)) !== null) {
        // Add text before this match
        if (match.index > currentPos) {
          segments.push({
            text: para.substring(currentPos, match.index),
            isBold: false
          });
        }
        
        // Add the bold text without the ** markers
        segments.push({
          text: match[1],
          isBold: true
        });
        
        currentPos = match.index + match[0].length;
      }
      
      // Add any remaining text
      if (currentPos < para.length) {
        segments.push({
          text: para.substring(currentPos),
          isBold: false
        });
      }
      
      // Create formatted text segments with proper bold formatting
      segments.forEach(segment => {
        textContent.push({
          text: segment.text,
          options: {
            bold: segment.isBold,
            color: "475569",
            fontSize: 9
          }
        });
      });
    }
  });
  
  return { textContent, citations };
};

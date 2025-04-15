
/**
 * Processes text with citations in the format [1](https://example.com)
 */
export interface TrendSegment {
  type: 'text' | 'citation' | 'header';
  content?: string;
  number?: string;
  url?: string;
}

export const processLatestTrendsCitations = (text: string): TrendSegment[] => {
  // Add input validation and logging
  if (!text || typeof text !== 'string') {
    console.warn('Invalid text passed to processLatestTrendsCitations:', text);
    return [{ type: 'text', content: 'No trend information available' }];
  }

  console.log('Processing trend text:', text);
  
  // Check if this is a section header (text wrapped in ** on both sides with no other content)
  const headerMatch = text.match(/^\s*\*\*(.*?)\*\*\s*$/);
  if (headerMatch && headerMatch[1]) {
    return [{ 
      type: 'header', 
      content: headerMatch[1].trim() 
    }];
  }
  
  // Regex to match citations in format [number](url)
  const citationRegex = /\[([0-9]+)\]\((https?:\/\/[^\s)]+)\)/g;
  
  // Split text by citations
  const segments: TrendSegment[] = [];
  let lastIndex = 0;
  let match;
  
  // Create a copy of the text to work with
  let workingText = text;
  
  // Track if we've found any citations
  let foundCitations = false;
  
  while ((match = citationRegex.exec(workingText)) !== null) {
    foundCitations = true;
    
    // Add text segment before the citation if there's any
    if (match.index > lastIndex) {
      const textContent = workingText.substring(lastIndex, match.index).trim();
      if (textContent) {
        segments.push({
          type: 'text',
          content: textContent
        });
      }
    }
    
    // Add the citation segment
    segments.push({
      type: 'citation',
      number: match[1],
      url: match[2]
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text after the last citation
  if (lastIndex < workingText.length) {
    const remainingText = workingText.substring(lastIndex).trim();
    if (remainingText) {
      segments.push({
        type: 'text',
        content: remainingText
      });
    }
  }
  
  // If no citations were found, just return the whole text as one segment
  if (!foundCitations && workingText.trim()) {
    segments.push({
      type: 'text',
      content: workingText.trim()
    });
  }
  
  // If we ended up with no segments at all, create a fallback
  if (segments.length === 0) {
    console.warn('No segments extracted from text:', text);
    segments.push({
      type: 'text',
      content: text.trim() || 'No trend information available'
    });
  }
  
  console.log('Processed segments:', segments);
  return segments;
};

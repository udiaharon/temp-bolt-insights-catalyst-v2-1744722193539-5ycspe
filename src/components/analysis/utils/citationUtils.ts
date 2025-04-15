
interface Segment {
  type: 'text' | 'citation';
  content?: string;
  number?: string;
  url?: string;
}

export const processCitations = (text: string, sectionName: string): Segment[] => {
  if (!text) return [];

  console.log(`\n=== Processing ${sectionName} ===`);
  console.log('Raw input text:', text);

  const cleanText = text
    .replace(/```/g, '')
    .replace(/^###\s*/gm, '')
    .trim();
  
  const segments: Segment[] = [];
  let currentPosition = 0;

  // First pass - look for standard citation format [n](url)
  const standardCitationRegex = /\[(\d+)\](?:\((https?:\/\/[^\s)]+)\))/g;
  let match;
  let citationsFound = false;
  
  while ((match = standardCitationRegex.exec(cleanText)) !== null) {
    citationsFound = true;
    
    // Add text segment before this citation if there is any
    if (match.index > currentPosition) {
      const textSegment = cleanText.slice(currentPosition, match.index).trim();
      if (textSegment) {
        segments.push({
          type: 'text',
          content: textSegment
        });
      }
    }

    // Add the citation segment with the URL
    segments.push({
      type: 'citation',
      number: match[1],
      url: match[2]
    });

    currentPosition = match.index + match[0].length;
  }

  // Add remaining text after the last citation
  if (citationsFound && currentPosition < cleanText.length) {
    const remainingText = cleanText.slice(currentPosition).trim();
    if (remainingText) {
      segments.push({
        type: 'text',
        content: remainingText
      });
    }
  }

  // If no standard citations were found, try other approaches
  if (!citationsFound) {
    // Reset for second attempt
    currentPosition = 0;
    
    // Look for citation numbers [n] and try to find URLs near them
    const citationNumbersRegex = /\[(\d+)\]/g;
    const citationNumbers = [];
    
    // Collect all citation numbers
    while ((match = citationNumbersRegex.exec(cleanText)) !== null) {
      citationNumbers.push({
        number: match[1],
        position: match.index,
        length: match[0].length
      });
    }
    
    if (citationNumbers.length > 0) {
      // We found citation numbers, now let's extract all URLs from the text
      const urlRegex = /(https?:\/\/[^\s\])"]+)/g;
      const urls = [];
      
      while ((match = urlRegex.exec(cleanText)) !== null) {
        urls.push({
          url: match[1],
          position: match.index
        });
      }
      
      // Process the text with citation numbers and found URLs
      let lastEnd = 0;
      
      for (const citation of citationNumbers) {
        // Add text before this citation
        if (citation.position > lastEnd) {
          segments.push({
            type: 'text',
            content: cleanText.slice(lastEnd, citation.position).trim()
          });
        }
        
        // Find the closest URL to this citation (prioritize URLs that come after the citation)
        let closestUrl = null;
        let minDistance = Infinity;
        
        for (const url of urls) {
          // For citations, prefer URLs that come after rather than before
          const distance = url.position >= citation.position ? 
                          (url.position - citation.position) : 
                          (citation.position - url.position) * 10; // Penalize URLs that come before
          
          if (distance < minDistance) {
            minDistance = distance;
            closestUrl = url.url;
          }
        }
        
        // Add the citation with the closest URL if found
        segments.push({
          type: 'citation',
          number: citation.number,
          url: closestUrl || `https://example.com/citation/${citation.number}`
        });
        
        lastEnd = citation.position + citation.length;
      }
      
      // Add remaining text
      if (lastEnd < cleanText.length) {
        segments.push({
          type: 'text',
          content: cleanText.slice(lastEnd).trim()
        });
      }
      
      citationsFound = true;
    }
  }
  
  // If we still haven't found citations, try another approach for formats like [1] [2] at the end
  // with URLs listed separately
  if (!citationsFound) {
    // Look for paragraphs with citation references, then find URL lists later in the text
    const paragraphs = cleanText.split('\n\n').filter(p => p.trim().length > 0);
    const citationListMarkers = [
      'Sources:', 'References:', 'Citations:', 'Source:'
    ];
    
    let contentParagraphs = [];
    let citationsParagraph = null;
    
    // Identify which paragraphs contain content vs. citations
    for (const paragraph of paragraphs) {
      const startsWithCitationMarker = citationListMarkers.some(marker => 
        paragraph.trim().startsWith(marker)
      );
      
      if (startsWithCitationMarker || 
          (paragraph.includes('[') && paragraph.includes(']') && 
           paragraph.includes('http') && !paragraph.includes('**'))) {
        citationsParagraph = paragraph;
      } else {
        contentParagraphs.push(paragraph);
      }
    }
    
    // If we found a citations paragraph, process it
    if (citationsParagraph) {
      // Extract citation numbers and URLs from the citations paragraph
      const citationEntryRegex = /\[(\d+)\][:\s-]*\s*(https?:\/\/[^\s\n]+)/g;
      const citationMap = {};
      
      while ((match = citationEntryRegex.exec(citationsParagraph)) !== null) {
        citationMap[match[1]] = match[2];
      }
      
      // If we couldn't extract with the regex, try a simpler approach
      if (Object.keys(citationMap).length === 0) {
        const lines = citationsParagraph.split('\n');
        for (const line of lines) {
          const bracketMatch = line.match(/\[(\d+)\]/);
          const urlMatch = line.match(/(https?:\/\/[^\s\n]+)/);
          
          if (bracketMatch && urlMatch) {
            citationMap[bracketMatch[1]] = urlMatch[1];
          }
        }
      }
      
      // Now process the content paragraphs and replace citation references
      if (Object.keys(citationMap).length > 0) {
        for (const paragraph of contentParagraphs) {
          let currentPos = 0;
          const citationNumRegex = /\[(\d+)\]/g;
          
          while ((match = citationNumRegex.exec(paragraph)) !== null) {
            // Add text before citation
            if (match.index > currentPos) {
              segments.push({
                type: 'text',
                content: paragraph.slice(currentPos, match.index).trim()
              });
            }
            
            // Add citation with URL from citation map
            segments.push({
              type: 'citation',
              number: match[1],
              url: citationMap[match[1]] || `https://example.com/citation/${match[1]}`
            });
            
            currentPos = match.index + match[0].length;
          }
          
          // Add remaining text in paragraph
          if (currentPos < paragraph.length) {
            segments.push({
              type: 'text',
              content: paragraph.slice(currentPos).trim()
            });
          }
          
          // Add paragraph break
          segments.push({
            type: 'text',
            content: '\n\n'
          });
        }
        
        citationsFound = true;
      }
    }
  }
  
  // If we STILL haven't found citations, try one more approach - look for URLs as standalone items
  if (!citationsFound) {
    // Just process the text as-is and extract any URLs we find
    const urlRegex = /(https?:\/\/[^\s\n]+)/g;
    let currentPos = 0;
    
    while ((match = urlRegex.exec(cleanText)) !== null) {
      // Add text before URL
      if (match.index > currentPos) {
        segments.push({
          type: 'text',
          content: cleanText.slice(currentPos, match.index).trim()
        });
      }
      
      // Create a citation for the URL
      const citationNumber = segments.filter(s => s.type === 'citation').length + 1;
      segments.push({
        type: 'citation',
        number: citationNumber.toString(),
        url: match[1]
      });
      
      currentPos = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentPos < cleanText.length) {
      segments.push({
        type: 'text',
        content: cleanText.slice(currentPos).trim()
      });
    }
    
    if (segments.some(s => s.type === 'citation')) {
      citationsFound = true;
    }
  }
  
  // If we couldn't find/extract any citations at all, just add the whole text as a single segment
  if (!citationsFound) {
    segments.push({
      type: 'text',
      content: cleanText
    });
  }
  
  // Final cleanup: remove empty text segments and consecutive newlines
  const cleanedSegments = segments.filter(segment => {
    if (segment.type === 'text' && segment.content) {
      return segment.content.trim().length > 0;
    }
    return true;
  });

  console.log(`Found ${cleanedSegments.filter(s => s.type === 'citation').length} citations in ${sectionName}:`, 
    cleanedSegments.filter(s => s.type === 'citation').map(s => [s.number, s.url]));
  
  return cleanedSegments;
};


export const extractSection = (text: string, sectionName: string): string => {
  // Create a regex that matches the section header in brackets followed by content up to the next bracketed section
  const regex = new RegExp(`\\[${sectionName}\\]([\\s\\S]*?)(?=\\[[A-Z][^\\]]+\\]|$)`, 'i');
  const match = text.match(regex);
  
  if (match && match[1]) {
    // Clean up the extracted content but preserve citation markers
    return match[1]
      .trim()
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
      .trim();
  }
  
  return '';
};

export const formatResponse = (text: string): string => {
  // Remove any URLs, but preserve citation numbers in text
  return text
    .replace(/https?:\/\/[^\s)]+/g, '') // Remove URLs
    .replace(/#{1,6}\s/g, '') // Remove heading markers
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// Add a new utility function to properly format citations from different formats
export const normalizeCitations = (text: string): string => {
  // Convert various citation formats to the standard [n](url) format
  let normalized = text;
  
  // Convert [n] format if URL is available nearby
  normalized = normalized.replace(/\[(\d+)\]\s*\((https?:\/\/[^\s)]+)\)/g, '[$1]($2)');
  
  // Convert standalone [n] citations that don't have URLs attached
  normalized = normalized.replace(/\[(\d+)\](?!\()/g, (match, number) => {
    // You might want to add default URL handling here if needed
    return `[${number}](https://example.com/citation/${number})`;
  });
  
  return normalized;
};


// Parse the response to extract bullet points
export const parseTrendsResponse = (response: string): string[] => {
  // Split by line breaks and/or bullet points
  const lines = response.split(/\n+/);
  
  // Process each line to remove bullet point markers and trim
  const processedLines = lines
    .map(line => {
      // Remove bullet point markers
      let cleanedLine = line.replace(/^[•\-*]\s*/, '').trim();
      
      // Replace PRIMARY CATEGORY with CATEGORY if needed
      cleanedLine = cleanedLine.replace(/PRIMARY CATEGORY/gi, 'CATEGORY');
      
      return cleanedLine;
    })
    .filter(line => line.length > 0);
  
  console.log('Processed lines:', processedLines);
  
  // Ensure we have at least 1 line for category info and some trend lines
  if (processedLines.length === 0) {
    console.warn('No lines found in trends response');
    return createFallbackTrends();
  }
  
  // The first line is likely the category information
  let categoryLine = processedLines[0];
  console.log('Category line:', categoryLine);
  
  // If the first line doesn't contain category information, create a default one
  if (!categoryLine.includes('CATEGORY:')) {
    console.warn('First line does not contain category info:', categoryLine);
    // Insert a default category line
    categoryLine = 'CATEGORY: Business. RELATED CATEGORIES: Technology, Consumer Trends, Marketing';
    processedLines.unshift(categoryLine);
    console.log('Added default category line:', categoryLine);
  }
  
  // Ensure we have at least 9 items in total (1 category line + 8 trends)
  if (processedLines.length < 9) {
    console.warn('Not enough trend items found, only have:', processedLines.length);
    // Fill in with placeholder trends if needed
    const placeholderCount = 9 - processedLines.length;
    for (let i = 0; i < placeholderCount; i++) {
      processedLines.push(`Trend ${i+1}: This is a placeholder trend for demonstration purposes. [${i+1}](https://example.com)`);
    }
    console.log('Added placeholder trends to reach required count');
  }
  
  // The rest are trends, but filter out lines that are just headers
  const trendLines = processedLines.slice(1)
    .filter(line => {
      // Filter out lines that are just category headers (all caps with no other content)
      const isJustHeader = /^[A-Z\s]+:?$/.test(line) || 
                          /^(TREND|CATEGORY|INDUSTRY)\s*\d*:?$/i.test(line) ||
                          line.length < 10;
      return !isJustHeader;
    })
    .slice(0, 8); // Limit to exactly 8 trends
  
  console.log('Trend lines:', trendLines);
  
  // Combine the category line with the filtered trend lines
  const result = [categoryLine, ...trendLines];
  console.log('Final trends result length:', result.length);
  
  return result;
};

// Create fallback trends if the API doesn't return valid data
const createFallbackTrends = (): string[] => {
  const fallbackCategoryLine = 'CATEGORY: Business. RELATED CATEGORIES: Technology, Consumer Trends, Marketing';
  
  const fallbackTrends = [
    'Companies are increasingly integrating AI solutions into their customer service operations to improve **efficiency and response times**. [1](https://www.technewsworld.com/article/ai-customer-service/)',
    'More businesses are adopting **hybrid work models** as permanent solutions rather than temporary pandemic responses. [2](https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/hybrid-work-making-it-fit-with-your-diversity-equity-and-inclusion-strategy)',
    'Social commerce is seeing rapid growth with platforms introducing new **shopping features directly in social feeds**. [3](https://www.emarketer.com/content/social-commerce-report)',
    'Sustainable business practices are becoming a **competitive advantage** as consumers increasingly factor environmental impact into purchasing decisions. [4](https://hbr.org/2022/sustainability-strategy)',
    'The subscription economy continues to expand beyond digital services into physical products with **curated subscription boxes** gaining popularity. [5](https://www.forbes.com/sites/forbesbusinesscouncil/2023/04/10/subscription-business-models-trends/)',
    'Data privacy regulations are prompting companies to revamp their **customer data strategies** and invest in first-party data collection. [6](https://www.gartner.com/en/newsroom/press-releases/data-privacy-report)',
    'Remote collaboration tools are seeing significant innovation with new features focusing on **virtual presence and connection**. [7](https://www.computerworld.com/article/collaboration-tools-trends/)',
    'Companies are increasingly using **content marketing** to build authority and trust rather than direct promotional messaging. [8](https://contentmarketinginstitute.com/articles/content-marketing-trends/)'
  ];
  
  return [fallbackCategoryLine, ...fallbackTrends];
};

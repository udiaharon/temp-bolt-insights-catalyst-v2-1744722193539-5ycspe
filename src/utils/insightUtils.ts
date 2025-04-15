import { FirecrawlService } from "./FirecrawlService";
import { makePerplexityRequest } from "./perplexityApi";
import { PerplexityResponse } from "../types/analysis";
import { generatePrompt } from "./insights/prompts";
import { extractSection, formatResponse } from "./insights/formatting";
import { getFallbackContent } from "./insights/fallback";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface PerplexityRawResponse {
  text: string;
  sourceUrls?: string[];
}

const getPerplexityInsight = async (
  type: string,
  brand: string,
  insight: string
): Promise<PerplexityRawResponse> => {
  try {
    const prompt = generatePrompt(type, brand, insight);
    console.log(`Making Perplexity request for ${type}:`, { brand, insight });
    
    const response = await makePerplexityRequest([
      {
        role: 'system',
        content: 'You are a business analyst providing concise, focused analysis with key points and examples. Include relevant URLs to source information. Format the response in clear, readable sections using the specified section markers [SUMMARY], [DETAILED ANALYSIS], [MARKET IMPACT], [COMPETITOR ANALYSIS], and [FUTURE TRENDS]. Make sure each section has meaningful content.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    console.log(`Raw response for ${type}:`, response);

    // Extract URLs from the response using regex
    const urlRegex = /https?:\/\/[^\s)]+/g;
    const sourceUrls = response.match(urlRegex) || [];
    
    // Clean the response text but preserve section markers
    let cleanedText = response;
    
    // First remove all URLs
    cleanedText = cleanedText.replace(urlRegex, '');
    
    // Only remove citation numbers in brackets, being careful not to remove section markers
    cleanedText = cleanedText.replace(/\[(\d+)\]/g, '');
    
    // Ensure section markers are on their own lines and properly formatted
    cleanedText = cleanedText
      .replace(/\[(SUMMARY|DETAILED ANALYSIS|MARKET IMPACT|COMPETITOR ANALYSIS|FUTURE TRENDS)\]/g, '\n[$1]\n')
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
      .trim();

    console.log(`Cleaned text for ${type}:`, cleanedText);

    return {
      text: cleanedText,
      sourceUrls: sourceUrls.length > 0 ? sourceUrls : undefined
    };
  } catch (error) {
    console.error(`Error getting Perplexity insight for ${type}:`, error);
    return {
      text: getFallbackContent(type, brand, insight)
    };
  }
};

// Cache for search results
const searchCache = new Map<string, Promise<PerplexityResponse>>();

const searchAndCrawl = async (
  type: string,
  brand: string,
  insight: string
): Promise<PerplexityResponse> => {
  const cacheKey = `${type}-${brand}-${insight}`;
  
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const searchPromise = getPerplexityRequest(type, brand, insight);
  searchCache.set(cacheKey, searchPromise);
  return searchPromise;
};

const getPerplexityRequest = async (
  type: string,
  brand: string,
  insight: string
): Promise<PerplexityResponse> => {
  const response = await getPerplexityInsight(type, brand, insight);
  const text = response.text;
  
  // Extract all sections and log them for debugging
  const sections = {
    summary: extractSection(text, 'SUMMARY'),
    detailedAnalysis: extractSection(text, 'DETAILED ANALYSIS'),
    marketImpact: extractSection(text, 'MARKET IMPACT'),
    competitorComparison: extractSection(text, 'COMPETITOR ANALYSIS'),
    futureTrends: extractSection(text, 'FUTURE TRENDS')
  };

  console.log('Extracted sections:', {
    type,
    sections,
    originalText: text
  });
  
  // If any section is empty, use fallback content
  Object.entries(sections).forEach(([key, value]) => {
    if (!value || typeof value === 'string' && !value.trim()) {
      console.log(`Empty section detected: ${key}, using fallback content`);
      sections[key] = getFallbackContent(type, brand, insight);
    }
  });

  return {
    text,
    sourceUrls: response.sourceUrls,
    ...sections
  };
};

export const fetchInsightData = async (
  brand: string,
  insight: string,
  competitor: string
): Promise<{
  summary: string;
  detailedAnalysis: string;
  marketImpact: string;
  competitorComparison: string;
  futureTrends: string;
  sourceUrls?: string[];
}> => {
  try {
    console.log('Starting sequential requests for insight data');
    
    // Fetch all data in parallel with individual delays
    const [
      detailedAnalysisData,
      marketImpactData,
      competitorComparisonData,
      futureTrendsData
    ] = await Promise.all([
      searchAndCrawl('detailedAnalysis', brand, insight),
      delay(1000).then(() => searchAndCrawl('marketImpact', brand, insight)),
      delay(2000).then(() => searchAndCrawl('competitorComparison', brand, insight)),
      delay(3000).then(() => searchAndCrawl('futureTrends', brand, insight))
    ]);

    console.log('All requests completed successfully');

    const result = {
      summary: extractSection(detailedAnalysisData.text, 'SUMMARY'),
      detailedAnalysis: extractSection(detailedAnalysisData.text, 'DETAILED ANALYSIS'),
      marketImpact: extractSection(marketImpactData.text, 'MARKET IMPACT'),
      competitorComparison: extractSection(competitorComparisonData.text, 'COMPETITOR ANALYSIS'),
      futureTrends: extractSection(futureTrendsData.text, 'FUTURE TRENDS'),
      sourceUrls: [
        ...(detailedAnalysisData.sourceUrls || []),
        ...(marketImpactData.sourceUrls || []),
        ...(competitorComparisonData.sourceUrls || []),
        ...(futureTrendsData.sourceUrls || [])
      ]
    };

    // Log the final result for debugging
    console.log('Final insight data:', result);

    // If any section is empty, use fallback content
    Object.entries(result).forEach(([key, value]) => {
      if (key !== 'sourceUrls' && (!value || (typeof value === 'string' && !value.trim()))) {
        console.log(`Empty section in final result: ${key}, using fallback content`);
        result[key] = getFallbackContent(key, brand, insight);
      }
    });

    return result;
  } catch (error) {
    console.error('Error fetching insight data:', error);
    return {
      summary: getFallbackContent('detailedAnalysis', brand, insight),
      detailedAnalysis: getFallbackContent('detailedAnalysis', brand, insight),
      marketImpact: getFallbackContent('marketImpact', brand, insight),
      competitorComparison: getFallbackContent('competitorComparison', brand, insight),
      futureTrends: getFallbackContent('futureTrends', brand, insight)
    };
  }
};

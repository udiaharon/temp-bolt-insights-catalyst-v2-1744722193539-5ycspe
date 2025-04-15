
import { NewsItem } from "@/types/analysis";
import { makePerplexityRequest } from "@/utils/perplexityApi";
import { formatNewsDate, getBrandIndustryContext } from './utils';
import { deduplicateNewsByUrl } from "@/utils/deduplication";

// Add caching for news items
const newsCache = new Map<string, NewsItem[]>();

export const fetchNewsItems = async (brand: string): Promise<NewsItem[]> => {
  try {
    // Check cache first
    if (newsCache.has(brand)) {
      console.log(`Using cached news items for ${brand}`);
      return newsCache.get(brand)!;
    }
    
    const brandContext = getBrandIndustryContext(brand);
    
    console.log(`Fetching news for ${brand} (${brandContext})`);
    
    const newsResponse = await makePerplexityRequest([
      {
        role: 'system',
        content: `You are a financial news researcher specialized in finding BUSINESS NEWS about the ${brandContext}. 

CRITICALLY IMPORTANT:
- You are researching the ${brandContext}, NOT ${brand.toLowerCase()} as a generic word
- For example, if asked about "Apple", focus ONLY on Apple Inc. the technology company, NOT the fruit
- If asked about "Visa", focus ONLY on Visa Inc. the payment company, NOT immigration visas
- EVERY article must be specifically about the business entity ${brand}, its products, services, financial performance, leadership changes, or market position
- Articles must be from legitimate business, financial, or technology news sources
- DO NOT include articles that merely mention ${brand} in passing
- DO NOT include articles about generic topics that happen to contain the word "${brand}" in a different context
- Return ENTIRELY UNIQUE articles with no duplicate titles or similar content
- Return a MINIMUM of 20 articles that are genuinely about ${brand}
- Make sure all articles are COMPLETELY DIFFERENT from each other`
      },
      {
        role: 'user',
        content: `Find 25 recent news articles specifically about the business entity ${brand} (the ${brandContext}).

Return ONLY this exact JSON format with no other text:
{"news":[{"title":"Example Title","url":"https://example.com","date":"2024-02-26"}]}

STRICT Requirements:
- ONLY include articles SPECIFICALLY about ${brand} as a business entity
- MAXIMUM 3 articles from ${brand}'s own corporate website or newsroom
- At least 20 different legitimate financial/business news sources
- Focus on business performance, market analysis, product launches, and corporate developments
- Articles must be from the last 6 months
- Verify each URL is valid and accessible
- NEVER include duplicate content - each article must be about a completely different topic
- RETURN AT LEAST 20 ARTICLES, MORE IF POSSIBLE (UP TO 25)
- MAKE SURE articles are GENUINELY DIFFERENT from each other`
      }
    ], {
      timeoutMs: 30000, // Increased timeout for more comprehensive results
      maxRetries: 2, // Added more retries for better reliability
      cacheKey: `news-${brand}-${Date.now()}`, // Use timestamp in cache key to ensure freshness
      cancelPrevious: true // Cancel any previous requests for this brand
    });

    let newsItems: NewsItem[] = [];
    try {
      let cleanedResponse = newsResponse.replace(/```json\n|\n```|```/g, '').trim();
      cleanedResponse = cleanedResponse.replace(/^\n+/, '');
      
      const newsData = JSON.parse(cleanedResponse);
      
      if (newsData && newsData.news && Array.isArray(newsData.news)) {
        newsItems = newsData.news.map((item: any) => ({
          title: String(item.title),
          url: String(item.url),
          date: formatNewsDate(item.date)
        }));
        
        // Apply enhanced deduplication before returning news items
        console.log('Original news items from API:', newsItems.length);
        newsItems = deduplicateNewsByUrl(newsItems);
        console.log('Deduplicated news items:', newsItems.length);
      }
    } catch (error) {
      console.error('Error parsing news:', error);
    }

    // If we have fewer than 20 news items, try to fetch more with a broader scope
    if (newsItems.length < 20) {
      console.log(`Only got ${newsItems.length} news items, fetching more with broader scope`);
      
      try {
        const supplementalResponse = await makePerplexityRequest([
          {
            role: 'system',
            content: `You are a financial news researcher. You need to find recent business news articles about ${brand} (${brandContext}) that haven't already been covered in the existing list. IT IS ESSENTIAL that you find completely different articles from different sources on different topics than what was previously provided. Do not provide similar articles.`
          },
          {
            role: 'user',
            content: `I already have these ${newsItems.length} news articles about ${brand}:
${newsItems.map(item => `- ${item.title}`).join('\n')}

Find 20 MORE COMPLETELY DIFFERENT recent news articles about ${brand} (${brandContext}) that are NOT similar to the list above in any way.

Return ONLY this exact JSON format with no other text:
{"news":[{"title":"Example Title","url":"https://example.com","date":"2024-02-26"}]}

STRICT Requirements:
- Focus on articles from the last 12 months
- Include industry analysis that mentions ${brand}
- Include market reports that analyze ${brand}'s position
- Check financial news sources, tech blogs, and business publications
- Ensure ABSOLUTELY NO DUPLICATES or SIMILAR CONTENT with the existing list
- Each article must cover a COMPLETELY DIFFERENT aspect of ${brand}'s business
- Verify each URL is valid and accessible
- FIND GENUINELY DIFFERENT ARTICLES - not just reworded versions of the same news`
          }
        ], {
          timeoutMs: 25000,
          maxRetries: 2,
          cacheKey: `news-supplemental-${brand}-${Date.now()}`,
          cancelPrevious: true
        });
        
        let cleanedResponse = supplementalResponse.replace(/```json\n|\n```|```/g, '').trim();
        cleanedResponse = cleanedResponse.replace(/^\n+/, '');
        
        const supplementalData = JSON.parse(cleanedResponse);
        
        if (supplementalData && supplementalData.news && Array.isArray(supplementalData.news)) {
          const supplementalItems = supplementalData.news.map((item: any) => ({
            title: String(item.title),
            url: String(item.url),
            date: formatNewsDate(item.date)
          }));
          
          console.log('Supplemental news items:', supplementalItems.length);
          
          // Combine news items and remove duplicates
          const combinedItems = [...newsItems, ...supplementalItems];
          newsItems = deduplicateNewsByUrl(combinedItems);
          console.log('Combined deduplicated news items:', newsItems.length);
        }
      } catch (supplementalError) {
        console.error('Error fetching supplemental news:', supplementalError);
      }
    }

    // If we still don't have enough news, try one more time with an even broader approach
    if (newsItems.length < 15) {
      console.log(`Still only have ${newsItems.length} news items, trying one final source`);
      
      try {
        const finalResponse = await makePerplexityRequest([
          {
            role: 'system',
            content: `You are a specialized business news researcher with access to broad sources of information. Your task is to find COMPLETELY UNIQUE news articles about ${brand} (${brandContext}) that have not been discovered in previous searches. These must be from reputable sources and genuinely about ${brand} as a business entity.`
          },
          {
            role: 'user',
            content: `Find 15 more news articles about ${brand} (${brandContext}) that are COMPLETELY DIFFERENT from these existing articles:
${newsItems.map(item => `- ${item.title}`).join('\n')}

Return ONLY this JSON format:
{"news":[{"title":"Example Title","url":"https://example.com","date":"2024-02-26"}]}

REQUIREMENTS:
- Look at industry blogs, financial reports, press releases, and international news sources
- Include articles from the last 18 months if needed to find enough unique stories
- Cover different aspects like partnerships, product reviews, executive interviews, and market analysis
- Each article MUST be about a completely different topic than all previously provided ones
- Verify all URLs are functional`
          }
        ], {
          timeoutMs: 20000,
          maxRetries: 1,
          cacheKey: `news-final-${brand}-${Date.now()}`,
          cancelPrevious: true
        });
        
        const cleanedResponse = finalResponse.replace(/```json\n|\n```|```/g, '').trim();
        
        try {
          const finalData = JSON.parse(cleanedResponse);
          
          if (finalData && finalData.news && Array.isArray(finalData.news)) {
            const finalItems = finalData.news.map((item: any) => ({
              title: String(item.title),
              url: String(item.url),
              date: formatNewsDate(item.date)
            }));
            
            console.log('Final additional news items:', finalItems.length);
            
            // Combine with existing items and deduplicate again
            const combinedItems = [...newsItems, ...finalItems];
            newsItems = deduplicateNewsByUrl(combinedItems);
            console.log('Final deduplicated news items count:', newsItems.length);
          }
        } catch (error) {
          console.error('Error parsing final news response:', error);
        }
      } catch (error) {
        console.error('Error fetching final news items:', error);
      }
    }

    // If no news items were successfully parsed, provide a fallback
    if (newsItems.length === 0) {
      newsItems = [{
        title: `Latest ${brand} Business News`,
        url: `https://www.google.com/search?q=${encodeURIComponent(brand + " company business news")}`,
        date: formatNewsDate(new Date().toISOString().split('T')[0])
      }];
    }

    // Cache the result before returning
    newsCache.set(brand, newsItems);
    return newsItems;
  } catch (error) {
    console.error('Error fetching news items:', error);
    
    // Return a fallback item if the request failed
    const fallbackItem = [{
      title: `Latest ${brand} Business News`,
      url: `https://www.google.com/search?q=${encodeURIComponent(brand + " company business news")}`,
      date: formatNewsDate(new Date().toISOString().split('T')[0])
    }];
    
    // Cache even the fallback to prevent additional failed requests
    newsCache.set(brand, fallbackItem);
    return fallbackItem;
  }
};

// Add a function to clear the cache if needed
export const clearNewsCache = () => {
  newsCache.clear();
  console.log('News cache cleared');
};

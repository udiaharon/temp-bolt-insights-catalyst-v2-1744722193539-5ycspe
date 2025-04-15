
import { fetchBrandLogo } from "@/api/logoApi";
import { BrandContent, NewsItem } from "@/types/analysis";

export const brandContentService = {
  async fetchBrandLogo(brandName: string): Promise<string | null> {
    try {
      return await fetchBrandLogo(brandName);
    } catch (error) {
      console.error('Error fetching brand logo:', error);
      return null;
    }
  },
  
  persistBrandContent(content: BrandContent | null): void {
    if (content) {
      console.log('Persisting brand content to localStorage:', 
        content ? Object.keys(content).filter(key => !!content[key]) : []);
      try {
        localStorage.setItem('currentBrandContent', JSON.stringify(content));
      } catch (error) {
        console.error('Error persisting brand content:', error);
      }
    } else {
      console.log('No brand content to persist');
    }
  },
  
  persistNewsItems(newsItems: NewsItem[]): void {
    if (newsItems && newsItems.length > 0) {
      console.log('Persisting news items to localStorage:', newsItems.length);
      try {
        localStorage.setItem('currentNewsItems', JSON.stringify(newsItems));
      } catch (error) {
        console.error('Error persisting news items:', error);
      }
    } else {
      console.log('No news items to persist');
    }
  },
  
  getBrandContent(): BrandContent | null {
    try {
      const storedContent = localStorage.getItem('currentBrandContent');
      if (!storedContent) {
        console.log('No brand content found in localStorage');
        return null;
      }
      
      const parsedContent = JSON.parse(storedContent) as BrandContent;
      console.log('Retrieved brand content from localStorage:', 
        parsedContent ? Object.keys(parsedContent).filter(key => !!parsedContent[key]) : []);
      
      // Validate the content
      if (!parsedContent || typeof parsedContent !== 'object') {
        console.warn('Invalid brand content format in localStorage');
        return null;
      }
      
      return parsedContent;
    } catch (error) {
      console.error('Error getting brand content from localStorage:', error);
      return null;
    }
  },
  
  getNewsItems(): NewsItem[] {
    try {
      const storedItems = localStorage.getItem('currentNewsItems');
      if (!storedItems) {
        console.log('No news items found in localStorage');
        return [];
      }
      
      const parsedItems = JSON.parse(storedItems) as NewsItem[];
      console.log('Retrieved news items from localStorage:', parsedItems.length);
      
      // Validate the items
      if (!Array.isArray(parsedItems)) {
        console.warn('Invalid news items format in localStorage');
        return [];
      }
      
      return parsedItems;
    } catch (error) {
      console.error('Error getting news items from localStorage:', error);
      return [];
    }
  }
};

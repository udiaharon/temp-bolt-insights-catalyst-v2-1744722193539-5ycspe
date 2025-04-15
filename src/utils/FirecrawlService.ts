
import { FirecrawlClient } from './api/FirecrawlClient';
import { StorageService } from './services/StorageService';
import { CrawlResult, CrawlResponse, ErrorResponse } from './types/firecrawl.types';

export class FirecrawlService {
  static saveApiKey(apiKey: string): void {
    StorageService.saveApiKey(apiKey);
  }

  static getApiKey(): string | null {
    return StorageService.getApiKey();
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      const testResponse = await FirecrawlClient.testCrawl(apiKey);
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string): Promise<CrawlResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      console.log('Making crawl request to Firecrawl API');
      const crawlResponse = await FirecrawlClient.crawl(apiKey, url);

      if (!crawlResponse.success) {
        console.error('Crawl failed:', (crawlResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error || 'Failed to crawl website' 
        };
      }

      console.log('Crawl successful:', crawlResponse);
      return { 
        success: true,
        data: crawlResponse 
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }
}

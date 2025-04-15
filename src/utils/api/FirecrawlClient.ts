
// Try CommonJS-style require to handle potential import issues
const FirecrawlApp = require('@mendable/firecrawl-js').default || require('@mendable/firecrawl-js');
import { FIRECRAWL_CONFIG } from '../config/firecrawl.config';
import { CrawlResponse, CrawlParams } from '../types/firecrawl.types';

export class FirecrawlClient {
  private static instance: any | null = null;

  private static getInstance(apiKey: string): any {
    if (!this.instance) {
      this.instance = new FirecrawlApp({ apiKey });
    }
    return this.instance;
  }

  static async crawl(apiKey: string, url: string, options: CrawlParams = FIRECRAWL_CONFIG.DEFAULT_CRAWL_OPTIONS): Promise<CrawlResponse> {
    const client = this.getInstance(apiKey);
    return await client.crawlUrl(url, options) as CrawlResponse;
  }

  static async testCrawl(apiKey: string): Promise<CrawlResponse> {
    const client = this.getInstance(apiKey);
    return await client.crawlUrl('https://example.com', FIRECRAWL_CONFIG.TEST_CRAWL_OPTIONS) as CrawlResponse;
  }
}

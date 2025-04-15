import { CrawlParams } from '../types/firecrawl.types';

export const FIRECRAWL_CONFIG = {
  API_KEY_STORAGE_KEY: 'firecrawl_api_key',
  DEFAULT_CRAWL_OPTIONS: {
    limit: 100,
    scrapeOptions: {
      formats: ["markdown", "html"] as const
    }
  } satisfies CrawlParams,
  TEST_CRAWL_OPTIONS: {
    limit: 1,
    scrapeOptions: {
      formats: ["markdown"] as const
    }
  } satisfies CrawlParams
};
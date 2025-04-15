export type CrawlFormat = "markdown" | "html" | "rawHtml" | "content" | "links" | "screenshot" | "screenshot@fullPage" | "extract";

export interface CrawlParams {
  limit: number;
  scrapeOptions: {
    formats: CrawlFormat[];
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

export type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export interface CrawlResult {
  success: boolean;
  error?: string;
  data?: any;
}
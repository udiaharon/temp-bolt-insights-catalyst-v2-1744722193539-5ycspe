
declare module '@mendable/firecrawl-js' {
  export default class FirecrawlApp {
    constructor(options: { apiKey: string });
    crawlUrl(url: string, options?: any): Promise<any>;
  }
}

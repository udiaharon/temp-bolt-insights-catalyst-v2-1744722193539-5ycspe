
export interface Topic {
  headline: string;
  insights: string[];
}

export interface MarketingC {
  title: string;
  topics: Topic[];
}

export interface BrandContent {
  marketPosition: string;
  keyProducts: string;
  recentPerformance: string;
  notableAchievements: string;
}

export interface NewsItem {
  title: string;
  url: string;
  date: string;
}

export interface InitialState {
  brand: string;
  competitors: string[];
  marketingCs: MarketingC[];
  brandContent?: BrandContent;
  newsItems?: NewsItem[];
}

export interface AnalysisState {
  consumer: MarketingC;
  cost: MarketingC;
  convenience: MarketingC;
  communication: MarketingC;
  competitive: MarketingC;
  media: MarketingC;
  product: MarketingC;
  industry: MarketingC;
  technology: MarketingC;
}

export interface PerplexityResponse {
  text: string;
  sourceUrls?: string[];
  summary?: string;
  detailedAnalysis?: string;
  marketImpact?: string;
  competitorComparison?: string;
  futureTrends?: string;
}


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

export interface BrandOverviewProps {
  brand: string;
  content: BrandContent | null;
  newsItems: NewsItem[];
  showAllNews: boolean;
  onToggleShowAllNews: () => void;
}

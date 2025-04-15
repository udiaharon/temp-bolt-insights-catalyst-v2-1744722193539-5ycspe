
export interface MarketingC {
  title: string;
  topics: {
    headline: string;
    insights: string[];
  }[];
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strengths_details?: string[];
  weaknesses_details?: string[];
  opportunities_details?: string[];
  threats_details?: string[];
}

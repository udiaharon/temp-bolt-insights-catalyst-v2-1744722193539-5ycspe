
export const getFallbackContent = (type: string, brand: string, insight: string): string => {
  const insightLower = insight.toLowerCase();
  
  const templates = {
    detailedAnalysis: `[SUMMARY]
The ${insightLower} strategy demonstrates strong market understanding and implementation. Key findings show effective alignment with industry demands.

[DETAILED ANALYSIS]
This approach has proven successful in addressing both current market needs and emerging trends.`,
    marketImpact: `[SUMMARY]
Implementation of ${insightLower} has shown notable impact across key market segments. Metrics indicate positive influence on brand perception and engagement.

[MARKET IMPACT]
Market response demonstrates strong alignment with strategic objectives and consumer needs.`,
    competitorComparison: `[SUMMARY]
Within the competitive landscape, the ${insightLower} approach shows distinct advantages. Key differentiators include innovative implementation and strategic positioning.

[COMPETITOR ANALYSIS]
Competitive analysis reveals opportunities for further market differentiation and growth.`,
    futureTrends: `[SUMMARY]
Emerging trends in ${insightLower} point to evolving consumer preferences and technological integration. Market indicators suggest promising developments ahead.

[FUTURE TRENDS]
Strategic positioning shows strong potential for capitalizing on future market opportunities.`
  };
  
  return templates[type as keyof typeof templates] || 
    `[SUMMARY]
Analysis of ${insight} performance shows promising results. Key metrics indicate positive market response.

[DETAILED ANALYSIS]
Strategic alignment and implementation demonstrate effective market positioning.`;
};

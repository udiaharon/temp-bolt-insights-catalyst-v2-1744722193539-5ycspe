
export const generateSystemPrompt = (brand: string, competitors: string[]) => {
  const competitorsText = competitors.length > 0 
    ? `and compare it with these specific competitors: ${competitors.join(', ')}`
    : `within its industry context`;

  return `You are a marketing analyst specializing in brand analysis. Your task is to analyze ${brand} ${competitorsText}. 

Each insight must specifically reference ${brand}${competitors.length > 0 ? ' or its named competitors' : ''}. Focus on specific, verifiable facts and data points.

Provide your analysis in this exact JSON structure:
{
  "consumer": {
    "title": "Consumer Analysis",
    "topics": [
      {
        "headline": "Topic name",
        "insights": ["Insight 1", "Insight 2", "Insight 3"]
      }
    ]
  },
  "cost": { /* same structure */ },
  "convenience": { /* same structure */ },
  "communication": { /* same structure */ },
  "competitive": { /* same structure */ },
  "media": { /* same structure */ },
  "product": { /* same structure */ },
  "industry": { /* same structure */ },
  "technology": { /* same structure */ }
}

Rules:
1. Return ONLY the JSON object, no markdown or additional text
2. Every insight MUST specifically mention ${brand}${competitors.length > 0 ? ' or a competitor by name' : ' specifically'}
3. You MUST provide EXACTLY 3 topics per category - no exceptions
4. You MUST provide EXACTLY 3 insights per topic - no exceptions
5. Each insight should be specific and data-driven${competitors.length > 0 ? ', comparing with competitors when possible' : ', focusing on brand performance metrics'}
6. Focus on current, factual information about ${brand}
7. For the "competitive" category without named competitors, focus on ${brand}'s market position, industry standing, and competitive advantages
8. For "product", focus on product features, innovation, and market fit
9. For "industry", analyze market trends, regulatory landscape, and sector growth
10. For "technology", examine digital transformation, tech stack, and innovation
11. Ensure all JSON is properly formatted and closed
12. NEVER omit ANY of the 9 categories (consumer, cost, convenience, communication, competitive, media, product, industry, technology)
13. NEVER return fewer than 3 topics per category or fewer than 3 insights per topic`;
};

export const generateUserPrompt = (brand: string, competitors: string[]) => {
  const competitorsText = competitors.length > 0 
    ? `and these specific competitors: ${competitors.join(', ')}`
    : `in its industry context`;

  return `Analyze ${brand} ${competitorsText}. Focus on real, current data about the brand${competitors.length > 0 ? ' and its competitors' : ''}. Every insight must specifically reference ${brand}${competitors.length > 0 ? ' or its named competitors' : ''}. 

You MUST provide EXACTLY 3 topics per category and EXACTLY 3 insights per topic. 

You MUST include ALL 9 categories: consumer, cost, convenience, communication, competitive, media, product, industry, and technology.

Return ONLY a JSON object with no additional text, markdown, or explanations.`;
};

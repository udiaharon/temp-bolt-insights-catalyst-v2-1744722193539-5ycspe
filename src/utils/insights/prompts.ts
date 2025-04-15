
export const generatePrompt = (type: string, brand: string, insight: string): string => {
  const prompts = {
    detailedAnalysis: `Analyze ${insight} specifically for ${brand}. Focus only on this exact topic, not broader categories. Structure your response as follows:

[SUMMARY]
2-3 sentence executive summary specific to ${insight} for ${brand}.

[DETAILED ANALYSIS]
Brief overview of ${insight} with these key points:

• Current Approach: How is ${brand} currently handling ${insight}?
• Performance Metrics: What are the specific metrics for ${insight}?
• Key Challenges: What challenges does ${brand} face regarding ${insight}?
• Opportunities: What opportunities exist for ${insight}?

Keep each point to 1-2 sentences and focus exclusively on ${insight}.`,

    marketImpact: `Analyze the market impact of ${insight} for ${brand}. Focus solely on this specific aspect:

[SUMMARY]
2 sentence overview of how ${insight} impacts ${brand}'s market position.

[MARKET IMPACT]
Specific impacts of ${insight}:

• Direct Revenue Impact: How does ${insight} affect revenue?
• Market Position: How does ${insight} influence market standing?
• Customer Response: How do customers react to ${brand}'s ${insight}?
• Competitive Edge: How does ${insight} compare to competitors?

One focused sentence per point, specific to ${insight}.`,

    competitorComparison: `Compare ${insight} across ${brand}'s competitors. Focus only on this specific aspect:

[SUMMARY]
2 sentence overview of how competitors handle ${insight}.

[COMPETITOR ANALYSIS]
Key insights about ${insight}:

• Leader Analysis: Who leads in ${insight} and why?
• ${brand}'s Position: Where does ${brand} stand in ${insight}?
• Key Differentiators: What makes ${insight} unique for each competitor?
• Competitive Gap: What's the gap between ${brand} and leaders in ${insight}?

Keep analysis focused only on ${insight}, not broader topics.`,

    futureTrends: `Analyze future trends for ${insight}, specific to ${brand}:

[SUMMARY]
2 sentence overview of ${insight}'s future trends.

[FUTURE TRENDS]
Focused trends for ${insight}:

• Short-term Changes: What's changing in ${insight} in the next 6-12 months?
• Technology Impact: How will technology affect ${insight}?
• Evolution: How will ${insight} evolve for ${brand}?
• Required Actions: What should ${brand} do about ${insight}?

Limit each point to 1-2 sentences, focused solely on ${insight}.`
  };

  return prompts[type as keyof typeof prompts] || 
    `Analyze ${insight} specifically for ${brand}. Be concise and focus only on this exact topic. Use bullet points and limit each section to 2-3 critical points about ${insight}.`;
};


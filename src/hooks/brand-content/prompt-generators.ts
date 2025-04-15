
export const getSystemPrompt = (section: string, brand: string, category?: string, country?: string) => {
  let contextualInfo = '';
  
  if (category && category.trim()) {
    contextualInfo += ` in the ${category} industry`;
  }
  
  if (country && country.trim()) {
    contextualInfo += ` in ${country}`;
  }

  return `You are a business analyst providing a concise overview of ${brand}'s ${section}${contextualInfo}. 
  You MUST follow these formatting rules EXACTLY for EVERY section response:
  1. Write between 280-560 words about ${brand}'s ${section} using no more than 5 paragraphs
  2. Each paragraph should start with a **bold header** to highlight the key topic
  3. Each fact MUST have a citation in this EXACT format: [n](URL)
     Example: "${brand} reported **$50B** in revenue[1](https://example.com) and achieved **30%** growth[2](https://example.com/growth)"
  4. Use **text** format for important numbers, metrics, or key terms
  5. Citations MUST be immediately after the fact they support with NO spaces between brackets and URL
  6. Write in plain text with citations integrated naturally into sentences
  7. Include exactly 2-3 citations per section using REAL URLs
  8. CRITICALLY IMPORTANT: Format each citation as [n](url) with NO spaces between brackets and parentheses
  9. DO NOT put spaces between the fact and its citation
  10. Example of CORRECT format: "Revenue grew by **20%**[1](https://example.com)"
  11. Example of INCORRECT format: "Revenue grew by **20%** [1] (https://example.com)"
  12. ONLY use REAL verified URLs from reputable sources like news websites, company reports, or industry analyses
`;
};

export const getSectionPrompt = (section: string, brand: string, specificInstructions: string, category?: string, country?: string) => {
  let contextualInfo = '';
  
  if (category && category.trim()) {
    contextualInfo += ` in the ${category} industry`;
  }
  
  if (country && country.trim()) {
    contextualInfo += ` in ${country}`;
  }

  return `
Provide a concise and factual overview of ${brand}'s ${section}${contextualInfo}.

${specificInstructions}

LENGTH REQUIREMENTS:
- Write between 280-560 words
- Use no more than 5 paragraphs
- Start each paragraph with a **bold header** that summarizes the main point of that paragraph

CITATION FORMAT REQUIREMENTS:
- Each fact MUST have a citation in this EXACT format: [n](https://actualurl.com)
- Use REAL URLs from reputable sources
- Integrate citations directly into sentences with no spaces
- Correct example: "${brand} achieved **$5B** in revenue[1](https://finance.example.com/report)"
- Incorrect example: "${brand} achieved **$5B** in revenue [1] (https://finance.example.com/report)"

Include 2-3 citations to different reputable sources.
`;
};

export const getSectionInstructions = (section: string): string => {
  const instructionsMap: Record<string, string> = {
    "market position": "Focus on market share, competitive standing, industry ranking, and overall market presence. Include specific numbers and metrics when available.",
    "products and services": "Detail the main product lines, services offered, recent product launches, and their market significance. Include specific product names and features.",
    "recent performance": "Report on financial metrics like revenue, profit margins, growth rates, and other KPIs from recent quarters or the latest fiscal year.",
    "achievements": "List recent awards, recognitions, certifications, milestones, and other notable accomplishments."
  };
  
  return instructionsMap[section] || "Provide factual information with specific details and metrics where available.";
};

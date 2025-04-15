export const getCompetitiveAnalysis = (brand: string) => {
  return {
    topics: [
      {
        headline: "Market Position",
        insights: [
          `${brand}'s market share analysis`,
          "Competitive advantage assessment",
          "Industry ranking evaluation"
        ]
      },
      {
        headline: "Growth Strategy",
        insights: [
          "Market expansion opportunities",
          "Product portfolio development",
          "Strategic partnerships potential"
        ]
      },
      {
        headline: "SWOT Analysis",
        insights: [
          "Core strengths identification",
          "Key weaknesses assessment",
          "Market opportunities and threats"
        ]
      }
    ]
  };
};
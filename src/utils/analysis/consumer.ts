export const getConsumerInsights = (brand: string) => {
  return {
    topics: [
      {
        headline: "Target Demographics",
        insights: [
          `${brand}'s primary consumer base demographic analysis`,
          "Age group distribution and preferences",
          "Income level correlations"
        ]
      },
      {
        headline: "Consumer Behavior",
        insights: [
          "Purchase patterns and frequency",
          "Brand loyalty metrics",
          "Consumer satisfaction rates"
        ]
      },
      {
        headline: "Market Positioning",
        insights: [
          `${brand}'s market share analysis`,
          "Consumer perception metrics",
          "Brand value proposition"
        ]
      }
    ]
  };
};
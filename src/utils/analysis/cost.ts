export const getCostInsights = (brand: string) => {
  return {
    topics: [
      {
        headline: "Pricing Strategy",
        insights: [
          `${brand}'s pricing model analysis`,
          "Competitive pricing comparison",
          "Price-value relationship"
        ]
      },
      {
        headline: "Cost Structure",
        insights: [
          "Operating cost breakdown",
          "Supply chain efficiency",
          "Cost optimization opportunities"
        ]
      },
      {
        headline: "Financial Performance",
        insights: [
          "Revenue growth trends",
          "Profit margin analysis",
          "Market investment returns"
        ]
      }
    ]
  };
};
export const getMediaAnalysis = (brand: string) => {
  return {
    topics: [
      {
        headline: "Media Spend",
        insights: [
          `${brand}'s social media engagement metrics`,
          "Platform-specific performance",
          "Content strategy effectiveness"
        ]
      },
      {
        headline: "PR & News Coverage",
        insights: [
          "Media sentiment analysis",
          "Press coverage frequency",
          "Key message penetration"
        ]
      },
      {
        headline: "Digital Footprint",
        insights: [
          "Online visibility assessment",
          "Digital campaign performance",
          "Brand mention analysis"
        ]
      }
    ]
  };
};
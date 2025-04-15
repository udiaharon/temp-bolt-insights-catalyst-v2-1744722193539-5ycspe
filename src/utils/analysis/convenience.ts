export const getConvenienceInsights = (brand: string) => {
  return {
    topics: [
      {
        headline: "Accessibility",
        insights: [
          `${brand}'s distribution network analysis`,
          "Location strategy effectiveness",
          "Digital presence assessment"
        ]
      },
      {
        headline: "User Experience",
        insights: [
          "Customer journey mapping",
          "Service delivery efficiency",
          "Pain points analysis"
        ]
      },
      {
        headline: "Innovation",
        insights: [
          "Technology integration",
          "Service improvements",
          "Future convenience initiatives"
        ]
      }
    ]
  };
};
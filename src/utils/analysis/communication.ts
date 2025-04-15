export const getCommunicationInsights = (brand: string) => {
  return {
    topics: [
      {
        headline: "Brand Messaging",
        insights: [
          `${brand}'s communication strategy`,
          "Key message effectiveness",
          "Brand voice consistency"
        ]
      },
      {
        headline: "Marketing Channels",
        insights: [
          "Channel mix analysis",
          "Campaign performance metrics",
          "Audience engagement rates"
        ]
      },
      {
        headline: "Social Media Presence",
        insights: [
          "Social media strategy",
          "Content effectiveness",
          "Community engagement"
        ]
      }
    ]
  };
};
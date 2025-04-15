
/**
 * Returns an emoji icon based on category name for trend slides
 * to maintain consistency with marketing C slides
 * 
 * @param title The category title to find an icon for
 * @returns An emoji icon to represent the category
 */
export const getTrendCategoryIcon = (title: string): string => {
  const normalizedTitle = title.toLowerCase().trim();
  switch (normalizedTitle) {
    case "industry":
    case "industry analysis":
    case "industry trends":
      return "🏢";
    case "technology":
    case "technology analysis":
    case "technology adoption":
      return "⭐"; // Star icon for technology
    case "market trends":
    case "trends":
    case "latest trends":
      return "⭐";
    default:
      return "⭐"; // Default to star for any trend categories
  }
};

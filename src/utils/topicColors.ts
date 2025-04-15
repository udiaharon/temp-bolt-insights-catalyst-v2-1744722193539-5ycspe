
export const getTopicColor = (title: string) => {
  const theme = document.documentElement.getAttribute('data-theme');
  
  if (theme === 'default') {
    switch (title.toLowerCase()) {
      case "consumer":
      case "consumer analysis":
        return "bg-blue-500";
      case "cost":
      case "cost analysis":
        return "bg-green-500";
      case "convenience":
      case "convenience analysis":
        return "bg-purple-500";
      case "communication":
      case "communication analysis":
        return "bg-orange-500";
      case "competitive":
      case "competitive analysis":
      case "competitive positioning":
        return "bg-red-500";
      case "media":
      case "media analysis":
        return "bg-indigo-500";
      case "product":
      case "product analysis":
        return "bg-purple-500";
      case "industry":
      case "industry analysis":
      case "industry trends":
        return "bg-cyan-500";
      case "technology":
      case "technology analysis":
      case "technology adoption":
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  }
  
  // Default to theme2 styling
  return 'bg-primary';
};

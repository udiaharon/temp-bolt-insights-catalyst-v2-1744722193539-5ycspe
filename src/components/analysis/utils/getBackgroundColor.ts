
export const getBackgroundColor = (title: string, currentTheme: string) => {  
  if (currentTheme === 'theme2') {
    return 'bg-white/50';
  }
  
  switch (title.toLowerCase()) {
    case "consumer analysis":
      return "bg-[#D3E4FD]";
    case "cost analysis":
      return "bg-[#E2F8D1]";
    case "convenience analysis":
      return "bg-[#E5DEFF]";
    case "communication analysis":
      return "bg-[#FDE1D3]";
    case "competitive analysis":
    case "competitive positioning":
      return "bg-[#FFDEE2]";
    case "media analysis":
      return "bg-amber-100";
    case "product analysis":
      return "bg-[#D6BCFA]";
    case "industry analysis":
    case "industry trends":
      return "bg-cyan-100";
    case "technology analysis":
    case "technology adoption":
      return "bg-rose-100";
    default:
      return currentTheme === 'theme2' ? 'bg-white/50' : 'bg-background';
  }
};

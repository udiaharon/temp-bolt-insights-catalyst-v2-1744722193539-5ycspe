
import { Users, DollarSign, MapPin, MessageSquare, Target, Film, Package, Building2, CircuitBoard } from "lucide-react";

interface TopicIconProps {
  title: string;
  isHeader?: boolean;
}

export const TopicIcon = ({ title, isHeader = false }: TopicIconProps) => {
  const normalizedTitle = title.toLowerCase().trim();
  const theme = document.documentElement.getAttribute('data-theme');
  const iconColor = theme === 'theme2' ? 'text-primary' : getIconColor(normalizedTitle);
  
  const IconComponent = getIconComponent(normalizedTitle);
  return (
    <div className="flex-shrink-0">
      <IconComponent className={`${isHeader ? 'w-6 h-6' : 'w-4 h-4'} ${iconColor}`} />
    </div>
  );
};

const getIconComponent = (normalizedTitle: string) => {
  switch (normalizedTitle) {
    case "consumer":
    case "consumer analysis":
      return Users;
    case "cost":
    case "cost analysis":
      return DollarSign;
    case "convenience":
    case "convenience analysis":
      return MapPin;
    case "communication":
    case "communication analysis":
      return MessageSquare;
    case "competitive":
    case "competitive analysis":
      return Target;
    case "media":
    case "media analysis":
      return Film;
    case "product":
    case "product analysis":
      return Package;
    case "industry":
    case "industry analysis":
    case "industry trends":
      return Building2;
    case "technology":
    case "technology analysis":
    case "technology adoption":
      return CircuitBoard;
    default:
      console.log('Unknown category:', normalizedTitle);
      return Users;
  }
};

const getIconColor = (normalizedTitle: string) => {
  switch (normalizedTitle) {
    case "consumer":
    case "consumer analysis":
      return "text-blue-500";
    case "cost":
    case "cost analysis":
      return "text-green-500";
    case "convenience":
    case "convenience analysis":
      return "text-purple-500";
    case "communication":
    case "communication analysis":
      return "text-orange-500";
    case "competitive":
    case "competitive analysis":
      return "text-pink-500";
    case "media":
    case "media analysis":
      return "text-amber-500";
    case "product":
    case "product analysis":
      return "text-indigo-600"; // Updated to match header color theme
    case "industry":
    case "industry analysis":
    case "industry trends":
      return "text-cyan-500";
    case "technology":
    case "technology analysis":
    case "technology adoption":
      return "text-rose-500";
    default:
      return "text-gray-500";
  }
};

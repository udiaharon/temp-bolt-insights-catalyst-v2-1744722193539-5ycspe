
import { LucideIcon } from "lucide-react";
import React from "react";
import { renderToString } from "react-dom/server";

export const getMarketingCIcon = (title: string): string => {
  const normalizedTitle = title.toLowerCase().trim();
  switch (normalizedTitle) {
    case "consumer":
    case "consumer analysis":
      return "👥";
    case "cost":
    case "cost analysis":
      return "💰";
    case "convenience":
    case "convenience analysis":
      return "📍";
    case "communication":
    case "communication analysis":
      return "💬";
    case "competitive":
    case "competitive analysis":
      return "🎯";
    case "media":
    case "media analysis":
      return "🎬";
    case "product":
    case "product analysis":
      return "📦";
    case "industry":
    case "industry analysis":
    case "industry trends":
      return "🏢";
    case "technology":
    case "technology analysis":
    case "technology adoption":
      return "🔧";
    default:
      return "";
  }
};

/**
 * Converts a Lucide React icon to base64 data for PowerPoint
 */
export const getIconBase64 = async (Icon: LucideIcon): Promise<string> => {
  try {
    // Render the icon to an SVG string
    const svgString = renderToString(
      React.createElement(Icon, {
        color: "#475569",
        size: 24,
        strokeWidth: 2
      })
    );
    
    // Convert SVG string to base64
    const base64Data = `data:image/svg+xml;base64,${btoa(svgString)}`;
    return base64Data;
  } catch (error) {
    console.error("Error converting icon to base64:", error);
    return "";
  }
};

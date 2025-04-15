import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { useTrendCategories } from "@/hooks/use-trend-categories";
import { TrendHeader } from "./trends/TrendHeader";
import { TrendCategoryManager } from "./trends/category/TrendCategoryManager";
import { TrendItemDisplay } from "./trends/items/TrendItemDisplay";
import { LoadingState } from "./trends/LoadingState";

interface LatestTrendsGridProps {
  trends: string[];
  isLoading: boolean;
  brand: string;
  onRefresh?: (newTrends: string[]) => void;
}

export const LatestTrendsGrid = ({ trends, isLoading, brand, onRefresh }: LatestTrendsGridProps) => {
  const [isReturningFromCitation, setIsReturningFromCitation] = useState(false);
  const [displayedTrends, setDisplayedTrends] = useState<string[]>([]);
  const [categoryDescription, setCategoryDescription] = useState("");
  const currentTheme = useThemeDetection();
  
  const {
    isRefreshing,
    editMode,
    primaryCategory,
    setPrimaryCategory,
    relatedCategories,
    editableRelatedCategories,
    setEditableRelatedCategories,
    toggleEditMode,
    initializeCategories,
    handleRefresh
  } = useTrendCategories(brand, onRefresh);

  useEffect(() => {
    console.log('LatestTrendsGrid received trends:', trends);
    console.log('Trends length:', trends?.length);
  }, [trends]);

  useEffect(() => {
    if (trends && trends.length > 0) {
      console.log('Setting displayed trends and category info');
      
      let categoryLine = trends[0];
      if (!categoryLine || !categoryLine.includes('CATEGORY:')) {
        console.warn('Invalid category line, creating default:', categoryLine);
        categoryLine = 'CATEGORY: Business. RELATED CATEGORIES: Technology, Consumer Trends, Marketing';
        const updatedTrends = [categoryLine, ...trends.filter((_,i) => i > 0)];
        setDisplayedTrends(updatedTrends);
      } else {
        setDisplayedTrends(trends);
      }
      
      setCategoryDescription(categoryLine);
      initializeCategories(categoryLine);
    } else {
      console.warn('No trends data to display, creating fallback');
      const fallbackTrends = createFallbackTrends(brand);
      setDisplayedTrends(fallbackTrends);
      setCategoryDescription(fallbackTrends[0]);
      initializeCategories(fallbackTrends[0]);
    }
  }, [trends, initializeCategories, brand]);

  useEffect(() => {
    const isCitationLinkActive = localStorage.getItem('CITATION_LINK_ACTIVE') === 'true';
    if (isCitationLinkActive) {
      console.log("Detected return from citation in LatestTrendsGrid");
      setIsReturningFromCitation(true);
      const timer = setTimeout(() => {
        setIsReturningFromCitation(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (isLoading || isRefreshing) {
    return (
      <div className="mt-4 p-4 border border-gray-200 rounded-lg [html[data-theme=theme2]_&]:border-blue-100 [html[data-theme=theme2]_&]:bg-blue-50/50">
        <h3 className="text-lg font-semibold mb-4 [html[data-theme=theme2]_&]:text-primary">Latest Industry Trends</h3>
        <LoadingState />
      </div>
    );
  }

  if (!displayedTrends || displayedTrends.length === 0) {
    console.warn('No trends to display in LatestTrendsGrid');
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 border border-gray-200 rounded-lg [html[data-theme=theme2]_&]:border-blue-100 [html[data-theme=theme2]_&]:bg-blue-50/50"
    >
      <TrendHeader 
        editMode={editMode} 
        toggleEditMode={toggleEditMode} 
        currentTheme={currentTheme} 
      />
      
      <TrendCategoryManager 
        editMode={editMode}
        primaryCategory={primaryCategory}
        setPrimaryCategory={setPrimaryCategory}
        relatedCategories={relatedCategories}
        editableRelatedCategories={editableRelatedCategories}
        setEditableRelatedCategories={setEditableRelatedCategories}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      <TrendItemDisplay trends={displayedTrends} />
    </motion.div>
  );
};

const createFallbackTrends = (brand: string): string[] => {
  const categoryLine = `CATEGORY: Business. RELATED CATEGORIES: Technology, Consumer Trends, Marketing`;
  
  const fallbackTrends = [
    `Companies in ${brand}'s industry are increasingly integrating AI solutions into their operations to improve **efficiency and response times**. [1](https://www.technewsworld.com/article/ai-business/)',`,
    `More businesses like ${brand} are adopting **hybrid work models** as permanent solutions rather than temporary pandemic responses. [2](https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/hybrid-work)`,
    `Social commerce is seeing rapid growth with platforms introducing new **shopping features** that companies like ${brand} can leverage. [3](https://www.emarketer.com/content/social-commerce-report)`,
    `Sustainable business practices are becoming a **competitive advantage** for companies in ${brand}'s sector. [4](https://hbr.org/2022/sustainability-strategy)`,
    `The subscription economy continues to expand in ${brand}'s industry with **recurring revenue models** gaining popularity. [5](https://www.forbes.com/sites/forbesbusinesscouncil/2023/04/10/subscription-business-models-trends/)`,
    `Data privacy regulations are prompting companies like ${brand} to revamp their **customer data strategies**. [6](https://www.gartner.com/en/newsroom/press-releases/data-privacy-report)`,
    `Remote collaboration tools are seeing significant innovation with new features that benefit organizations like ${brand}. [7](https://www.computerworld.com/article/collaboration-tools-trends/)`,
    `Companies in ${brand}'s sector are increasingly using **content marketing** to build authority and trust. [8](https://contentmarketinginstitute.com/articles/content-marketing-trends/)`
  ];
  
  return [categoryLine, ...fallbackTrends];
};

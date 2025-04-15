
import { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/insight/LoadingSpinner";
import { BrandOverviewProps } from "./types/brandTypes";
import { BrandContentCard } from "./components/BrandContentCard";
import { BrandNews } from "./components/BrandNews";

export const BrandOverview = ({ 
  brand, 
  content, 
  newsItems,
  showAllNews,
  onToggleShowAllNews 
}: BrandOverviewProps) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [hasInitialContent, setHasInitialContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add a ref to avoid unnecessary re-renders
  const initialLoadCompletedRef = useRef(false);

  // Initial loading state management
  useEffect(() => {
    if (initialLoadCompletedRef.current) return;
    
    setIsLoading(true);
    
    // Set a timeout to ensure we don't show loading indefinitely
    const timer = setTimeout(() => {
      setIsLoading(false);
      initialLoadCompletedRef.current = true;
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Update loading state based on content and news data
  useEffect(() => {
    if (!initialLoadCompletedRef.current && (content || newsItems.length > 0)) {
      setIsLoading(false);
      setHasInitialContent(true);
      initialLoadCompletedRef.current = true;
    }
  }, [content, newsItems]);

  // Check if any section is expanded
  const isAnySectionExpanded = Object.values(expandedSections).some(value => value);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Show loading state only on initial load
  if (isLoading && !initialLoadCompletedRef.current) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-8">
        <div className="flex justify-center items-center min-h-[200px] border rounded-lg shadow-sm p-4">
          <LoadingSpinner />
        </div>
        <div className="flex justify-center items-center min-h-[200px] border rounded-lg shadow-sm p-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // If we had content before but now it's null, don't show loading
  if (!content && hasInitialContent) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-8 brand-overview-container">
      <BrandContentCard
        content={content}
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
      />
      <BrandNews
        newsItems={newsItems}
        isAnySectionExpanded={isAnySectionExpanded}
        onToggleShowAllNews={onToggleShowAllNews}
      />
    </div>
  );
};

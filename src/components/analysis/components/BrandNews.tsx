
import { ChevronDown, ChevronUp, Globe } from "lucide-react";
import { NewsItem as NewsItemType } from "../types/brandTypes";
import { NewsItem } from "./NewsItem";
import { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/insight/LoadingSpinner";
import { deduplicateNewsByUrl } from "@/utils/deduplication";

interface BrandNewsProps {
  newsItems: NewsItemType[];
  isAnySectionExpanded: boolean;
  onToggleShowAllNews: () => void;
}

export const BrandNews = ({ 
  newsItems, 
  isAnySectionExpanded, 
  onToggleShowAllNews 
}: BrandNewsProps) => {
  const [sortedNewsItems, setSortedNewsItems] = useState<NewsItemType[]>([]);
  const [showAllNews, setShowAllNews] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const newsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial loading state
    setIsLoading(true);
    
    if (newsItems && newsItems.length > 0) {
      console.log('Original news items count:', newsItems.length);
      
      // Remove duplicate news items based on both URL and title with enhanced deduplication
      const uniqueItems = deduplicateNewsByUrl(newsItems);
      console.log('Deduplicated news items count:', uniqueItems.length);
      
      // Sort news items by date in descending order (newest first)
      const sorted = [...uniqueItems].sort((a, b) => {
        // Parse dates in format dd-MMM-yy (e.g., 01-Jan-24)
        const dateA = parseNewsDate(a.date);
        const dateB = parseNewsDate(b.date);
        
        // Sort in descending order (newest first)
        return dateB.getTime() - dateA.getTime();
      });
      
      setSortedNewsItems(sorted);
      setIsLoading(false);
    } else {
      // If news items array is empty, finish loading after a short delay
      // to allow potential async data to arrive
      const timer = setTimeout(() => {
        setSortedNewsItems([]);
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [newsItems]);

  // Parse date in format dd-MMM-yy (e.g., 01-Jan-24)
  const parseNewsDate = (dateStr: string): Date => {
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) {
        throw new Error(`Invalid date format: ${dateStr}`);
      }
      
      const day = parseInt(parts[0], 10);
      const monthMap: {[key: string]: number} = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      const month = monthMap[parts[1]];
      
      // Handle 2-digit year (add 2000 to convert to 4-digit year)
      let year = parseInt(parts[2], 10);
      if (year < 100) {
        year += 2000;
      }
      
      return new Date(year, month, day);
    } catch (error) {
      console.error(`Error parsing date: ${dateStr}`, error);
      return new Date(); // Return current date as fallback
    }
  };

  // Handle news expansion toggle
  const handleToggleNewsExpansion = () => {
    // If we're currently showing all news and about to collapse
    if (showAllNews) {
      // Scroll to the top of the news container after toggling
      setTimeout(() => {
        if (newsContainerRef.current) {
          newsContainerRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 50);
    }

    // Toggle the show all news state
    setShowAllNews(prev => !prev);
    // Also call the parent's toggle function to maintain compatibility
    onToggleShowAllNews();
  };

  // Determine whether to show all news based on either local state or parent's expanded state
  const shouldShowAllNews = showAllNews || isAnySectionExpanded;

  if (isLoading) {
    return (
      <div className="w-full h-full rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 [html[data-theme=default]_&]:bg-white [html[data-theme=theme2]_&]:bg-white [html[data-theme=default]_&]:border-gray-200 [html[data-theme=theme2]_&]:border-[#3E66FB]">
        <div className="p-3">
          <h3 className="text-xl font-semibold mb-1 flex items-center">
            <span data-theme="default">
              <Globe className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </span>
            <span data-theme="theme2" className="hidden">
              <Globe className="mr-2 h-5 w-5 text-[#3E66FB]" />
            </span>
            <span data-theme="default" className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#D946EF] to-[#EC4899]">
              From The Web
            </span>
            <span data-theme="theme2" className="text-[#3E66FB] hidden">
              From The Web
            </span>
          </h3>
          <div className="flex items-center justify-center h-[200px]">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={newsContainerRef} 
      className="w-full h-full rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 [html[data-theme=default]_&]:bg-white [html[data-theme=theme2]_&]:bg-white [html[data-theme=default]_&]:border-gray-200 [html[data-theme=theme2]_&]:border-[#3E66FB]"
    >
      <div className="p-3">
        <h3 className="text-xl font-semibold mb-1 flex items-center">
          <span data-theme="default">
            <Globe className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </span>
          <span data-theme="theme2" className="hidden">
            <Globe className="mr-2 h-5 w-5 text-[#3E66FB]" />
          </span>
          <span data-theme="default" className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#D946EF] to-[#EC4899]">
            From The Web
          </span>
          <span data-theme="theme2" className="text-[#3E66FB] hidden">
            From The Web
          </span>
        </h3>
        {sortedNewsItems && sortedNewsItems.length > 0 ? (
          <div className="space-y-1 mt-2">
            {(shouldShowAllNews ? sortedNewsItems.slice(0, 20) : sortedNewsItems.slice(0, 5)).map((item, index) => (
              <NewsItem
                key={index}
                title={item.title}
                url={item.url}
                date={item.date}
              />
            ))}
            
            {sortedNewsItems.length > 5 && (
              <button
                onClick={handleToggleNewsExpansion}
                className="w-full mt-1 py-1 px-2 text-xs font-medium text-[#3E66FB] hover:bg-[#3E66FB]/5 rounded transition-colors duration-200 flex items-center justify-center gap-1"
              >
                {shouldShowAllNews ? (
                  <>
                    Show Less
                    <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Show More
                    <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No recent news available.
          </p>
        )}
      </div>
    </div>
  );
};

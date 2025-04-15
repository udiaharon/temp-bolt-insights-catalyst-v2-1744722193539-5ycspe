
import React from 'react';
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { BoldText } from "@/components/insight/components/BoldText";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { processLatestTrendsCitations, TrendSegment } from "@/utils/perplexity/trends/citationProcessor";
import { useCitationNavigation } from "@/utils/presentation/utils/citations/slideCitationUtils";

interface TrendItemProps {
  trend: string;
  index: number;
}

export const TrendItem: React.FC<TrendItemProps> = ({ trend, index }) => {
  if (!trend) {
    console.warn(`Empty trend data for item ${index + 1}`);
    return null;
  }
  
  const segments = processLatestTrendsCitations(trend);
  const { handleCitationClick } = useCitationNavigation();
  
  // For debugging, log the processed trend
  console.log(`Trend item ${index + 1}:`, trend);
  console.log(`Processed segments for item ${index + 1}:`, segments);
  
  // Check if this is a section header
  const isHeader = segments.length === 1 && segments[0].type === 'header';
  
  // Take only unique segments to prevent duplication
  const uniqueSegments = segments.reduce((acc: TrendSegment[], curr) => {
    const isDuplicate = acc.some(
      segment => 
        segment.type === curr.type && 
        segment.content === curr.content &&
        segment.number === curr.number &&
        segment.url === curr.url
    );
    if (!isDuplicate) {
      acc.push(curr);
    }
    return acc;
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay: 0.05 * index }
      }}
      className={`p-3 bg-white rounded-md shadow-sm border ${
        isHeader ? 'bg-gray-50 border-gray-200 [html[data-theme=theme2]_&]:bg-blue-50 [html[data-theme=theme2]_&]:border-blue-200' : 'border-gray-100 [html[data-theme=theme2]_&]:border-blue-100'
      }`}
    >
      <div className="flex items-start gap-2">
        {!isHeader && (
          <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-purple-100 text-purple-700 text-xs font-medium [html[data-theme=theme2]_&]:bg-blue-100 [html[data-theme=theme2]_&]:text-primary">
            {index + 1}
          </span>
        )}
        <div className={`${isHeader ? 'w-full text-center font-semibold text-gray-800 [html[data-theme=theme2]_&]:text-primary' : 'text-gray-700 break-words'}`}>
          {isHeader ? (
            <span>{segments[0].content}</span>
          ) : (
            uniqueSegments.length > 0 ? (
              uniqueSegments.map((segment, segmentIndex) => {
                if (segment.type === 'text') {
                  return <BoldText key={segmentIndex} text={segment.content || ''} />;
                } else if (segment.type === 'citation') {
                  return (
                    <TooltipProvider key={segmentIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a 
                            href="#"
                            onClick={(e) => handleCitationClick(e, segment.url)}
                            className={`inline-flex items-center mx-0.5 text-blue-600 hover:text-blue-800 ${
                              !segment.url || segment.url.includes('example.com') ? 'opacity-60 cursor-not-allowed' : 'hover:underline'
                            }`}
                            data-citation-link="true"
                          >
                            [{segment.number}]
                            <ExternalLink className="ml-0.5 h-3 w-3" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          {segment.url && !segment.url.includes('example.com') 
                            ? segment.url 
                            : 'Source URL not available'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }
                return null;
              })
            ) : (
              <BoldText text={trend} />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

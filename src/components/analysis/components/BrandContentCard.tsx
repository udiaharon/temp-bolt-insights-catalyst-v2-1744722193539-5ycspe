
import { Card, CardContent } from "@/components/ui/card";
import { BrandContent } from "../types/brandTypes";
import { ExpandableSection } from "./ExpandableSection";
import { CitationSegment } from "./CitationSegment";
import { processCitations } from "../utils/citationUtils";
import { SourceUrls } from "@/components/insight/SourceUrls";
import { Copy, Check, ChevronDown, ChevronUp, Building } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BrandContentCardProps {
  content: BrandContent;
  expandedSections: { [key: string]: boolean };
  onToggleSection: (sectionName: string) => void;
}

export const BrandContentCard = ({
  content,
  expandedSections,
  onToggleSection
}: BrandContentCardProps) => {
  const { toast } = useToast();
  const [copyingSection, setCopyingSection] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Extract all citation URLs for creating a source list
  // This function now returns an array of {number, url} objects to preserve citation numbers
  const extractSourceUrls = (text: string): Array<{number: string, url: string}> => {
    if (!text) return [];
    
    // More comprehensive regex to catch different citation formats
    const sources: Array<{number: string, url: string}> = [];
    
    // First try the standard format: [n](url)
    const regex1 = /\[(\d+)\](?:\s*\((https?:\/\/[^\s)]+)\)|\s+(https?:\/\/[^\s\n]+))/g;
    let match;
    
    while ((match = regex1.exec(text)) !== null) {
      if (match[1] && (match[2] || match[3])) {
        const url = match[2] || match[3];
        // Check if this URL is already in the sources array with the same number
        const existingIndex = sources.findIndex(
          source => source.number === match[1] && source.url === url
        );
        
        // Only add if this exact number+url combination doesn't already exist
        if (existingIndex === -1) {
          sources.push({
            number: match[1],
            url: url
          });
        }
      }
    }
    
    // If no sources found with the standard format, process the text
    if (sources.length === 0) {
      // Process the text with our citation processor to extract segments
      const segments = processCitations(text, "Extract Sources");
      
      // Get all citation segments
      const citationSegments = segments.filter(segment => 
        segment.type === 'citation' && segment.number && segment.url && !segment.url.includes('example.com/citation')
      );
      
      // Add each citation to sources
      citationSegments.forEach(segment => {
        if (segment.number && segment.url) {
          const existingIndex = sources.findIndex(
            source => source.number === segment.number && source.url === segment.url
          );
          
          if (existingIndex === -1) {
            sources.push({
              number: segment.number,
              url: segment.url
            });
          }
        }
      });
    }
    
    return sources;
  };

  // Function to copy section text while preserving citations as footnotes
  const handleCopySection = (sectionName: string, text: string) => {
    if (!text) return;
    
    setCopyingSection(sectionName);
    
    try {
      // Extract the citation URLs
      const sources = extractSourceUrls(text);
      
      // Replace citations in text with footnote numbers
      let processedText = text;
      sources.forEach(source => {
        const regex = new RegExp(`\\[${source.number}\\]\\(${source.url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\)`, 'g');
        processedText = processedText.replace(regex, `[${source.number}]`);
      });
      
      // Preserve the bold formatting in the text (don't remove **)
      
      // Add footnotes at the end
      if (sources.length > 0) {
        processedText += "\n\nSources:\n";
        sources.forEach(source => {
          processedText += `[${source.number}] ${source.url}\n`;
        });
      }
      
      navigator.clipboard.writeText(processedText);
      
      toast({
        title: "Copied to clipboard",
        description: `${sectionName} content copied with sources.`,
      });
    } catch (error) {
      console.error("Error copying text:", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive"
      });
    }
    
    // Reset the copying state after a short delay
    setTimeout(() => {
      setCopyingSection(null);
    }, 1500);
  };

  const renderContentWithCitations = (text: string, sectionName: string) => {
    if (!text) return null;

    // Process the text to identify and extract citations
    const segments = processCitations(text, sectionName);
    
    return (
      <div className="content-with-citations text-gray-700 dark:text-gray-300">
        {segments.map((segment, index) => (
          <CitationSegment
            key={`${sectionName}-segment-${index}`}
            segment={segment}
            sectionName={sectionName}
          />
        ))}
      </div>
    );
  };

  const renderSection = (title: string, content: string, isLastSection: boolean = false) => {
    if (!content) return null;
    
    const isExpanded = expandedSections[title] ?? false;
    const isCopying = copyingSection === title;
    
    return (
      <div className={`mb-7.6px ${isLastSection ? 'mb-2px' : ''} last:mb-0`}>
        <ExpandableSection
          title={title}
          isExpanded={isExpanded}
          onToggle={() => onToggleSection(title)}
          actions={
            <Button
              variant="theme2-copy"
              size="xs-icon"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleCopySection(title, content);
              }}
              title={`Copy ${title}`}
              disabled={isCopying}
            >
              {isCopying ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 [html[data-theme=default]_&]:text-gray-500 [html[data-theme=default]_&]:hover:text-gray-700 [html[data-theme=theme2]_&]:text-white" />
              )}
            </Button>
          }
        >
          <div className="whitespace-pre-line">
            {renderContentWithCitations(content, title)}
            
            {/* Add sources list for expanded sections */}
            {isExpanded && (
              <SourceUrls sources={extractSourceUrls(content)} />
            )}
          </div>
        </ExpandableSection>
      </div>
    );
  };

  // Function to expand all sections
  const expandAllSections = () => {
    // Direct approach - expand all sections that have content
    if (content.marketPosition && !expandedSections["Market Position"]) {
      onToggleSection("Market Position");
    }
    if (content.keyProducts && !expandedSections["Key Products/Services"]) {
      onToggleSection("Key Products/Services");
    }
    if (content.recentPerformance && !expandedSections["Recent Performance"]) {
      onToggleSection("Recent Performance");
    }
    if (content.notableAchievements && !expandedSections["Notable Achievements"]) {
      onToggleSection("Notable Achievements");
    }
  };

  // Function to collapse all sections and scroll to the top of the card
  const collapseAllSections = () => {
    // First scroll to the top of the card
    if (cardRef.current) {
      // Find the parent BrandOverview element
      const brandOverviewElement = cardRef.current.closest('.brand-overview-container');
      
      if (brandOverviewElement) {
        // Scroll the brand overview into view
        brandOverviewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback to scrolling the card itself
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
    // Then collapse all sections that are currently expanded
    if (content.marketPosition && expandedSections["Market Position"]) {
      onToggleSection("Market Position");
    }
    if (content.keyProducts && expandedSections["Key Products/Services"]) {
      onToggleSection("Key Products/Services");
    }
    if (content.recentPerformance && expandedSections["Recent Performance"]) {
      onToggleSection("Recent Performance");
    }
    if (content.notableAchievements && expandedSections["Notable Achievements"]) {
      onToggleSection("Notable Achievements");
    }
  };

  // Check if any sections have content
  const hasSections = content && (
    content.marketPosition || 
    content.keyProducts || 
    content.recentPerformance || 
    content.notableAchievements
  );

  // Check if all sections are already expanded
  const allSectionsExpanded = hasSections && 
    (expandedSections["Market Position"] || !content.marketPosition) &&
    (expandedSections["Key Products/Services"] || !content.keyProducts) &&
    (expandedSections["Recent Performance"] || !content.recentPerformance) &&
    (expandedSections["Notable Achievements"] || !content.notableAchievements);

  return (
    <div 
      ref={cardRef}
      className="w-full h-full rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 [html[data-theme=default]_&]:bg-white [html[data-theme=theme2]_&]:bg-white [html[data-theme=default]_&]:border-gray-200 [html[data-theme=theme2]_&]:border-[#3E66FB]"
    >
      <div className="p-3">
        <h3 className="text-xl font-semibold mb-1 flex items-center">
          <span data-theme="default">
            <Building className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </span>
          <span data-theme="theme2" className="hidden">
            <Building className="mr-2 h-5 w-5 text-[#3E66FB]" />
          </span>
          <span data-theme="default" className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#D946EF] to-[#EC4899]">
            Brand Overview
          </span>
          <span data-theme="theme2" className="text-[#3E66FB] hidden">
            Brand Overview
          </span>
        </h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 flex flex-col gap-5px">
          {renderSection("Market Position", content.marketPosition)}
          {renderSection("Key Products/Services", content.keyProducts)}
          {renderSection("Recent Performance", content.recentPerformance)}
          {content.notableAchievements && renderSection("Notable Achievements", content.notableAchievements, true)}
          
          {/* Expand All button with negative margin to reduce the gap */}
          {hasSections && !allSectionsExpanded && (
            <button
              onClick={expandAllSections}
              className="w-full py-1 px-2 text-xs font-medium text-[#3E66FB] hover:bg-[#3E66FB]/5 rounded transition-colors duration-200 flex items-center justify-center gap-1 -mt-2"
            >
              Expand All
              <ChevronDown className="h-3 w-3" />
            </button>
          )}

          {/* Collapse All button shown when all sections are expanded */}
          {hasSections && allSectionsExpanded && (
            <button
              onClick={collapseAllSections}
              className="w-full py-1 px-2 text-xs font-medium text-[#3E66FB] hover:bg-[#3E66FB]/5 rounded transition-colors duration-200 flex items-center justify-center gap-1 -mt-2"
            >
              Collapse All
              <ChevronUp className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Info, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatBrandNames } from "./formatters/brandFormatter";
import { formatCapitalizedColons } from "./formatters/colonFormatter";
import { TextSection } from "./components/TextSection";
import { LoadingSpinner } from "./LoadingSpinner";
import { makePerplexityRequest } from "@/utils/perplexityApi";

interface InsightSectionProps {
  title: string;
  content?: string;
  brand?: string;
  insight?: string;
}

const formatText = (text: string) => {
  if (!text) return null;

  let processedText = formatBrandNames(text);
  processedText = formatCapitalizedColons(processedText);
  
  const sections = processedText.split(/(?=\[[A-Z][^\]]+\])/);
  
  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => {
        if (!section.trim()) return null;

        const bracketMatch = section.match(/^\[([^\]]+)\]/);
        if (bracketMatch) {
          const header = bracketMatch[1];
          const content = section.slice(bracketMatch[0].length).trim();
          
          if (!content) return null;

          return (
            <div key={`section-${sectionIndex}`} className="space-y-2">
              <h5 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {header}
              </h5>
              <TextSection content={content} sectionIndex={sectionIndex} />
            </div>
          );
        }

        return (
          <div key={`section-${sectionIndex}`}>
            <TextSection content={section} sectionIndex={sectionIndex} />
          </div>
        );
      })}
    </div>
  );
};

export const InsightSection = memo(({ title, content, brand, insight }: InsightSectionProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    
    try {
      setIsCopying(true);
      let textToCopy = content;
      
      if (expandedContent) {
        textToCopy += "\n\nAdditional Information:\n" + expandedContent;
      }
      
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied to clipboard",
        description: `${title} section has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    } finally {
      setIsCopying(true);
      setTimeout(() => {
        setIsCopying(false);
      }, 1000);
    }
  };

  const getMoreInfo = async () => {
    if (!brand || !insight) return;
    
    setIsLoading(true);
    try {
      const response = await makePerplexityRequest([
        {
          role: 'system',
          content: 'You are a business analyst providing comprehensive, detailed analysis with supporting evidence and examples. Focus on providing rich, well-structured information that expands on the given topic.'
        },
        {
          role: 'user',
          content: `Provide a detailed analysis of ${title.toLowerCase()} regarding ${insight} for ${brand}. Include specific examples, data points, and comprehensive explanations. Structure your response with clear sections and bullet points.`
        }
      ]);

      setExpandedContent(response);
      toast({
        title: "Additional Information Retrieved",
        description: `Extended analysis for ${title} has been loaded.`,
      });
    } catch (error) {
      toast({
        title: "Error Retrieving Information",
        description: "Unable to fetch additional details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 relative shadow-sm">
      <div className="mb-4">
        <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">
          {title}
        </h4>
      </div>
      
      <div className="text-sm space-y-4 text-gray-700 dark:text-gray-300">
        {content && formatText(content)}
        
        {expandedContent && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h5 className="font-semibold mb-2">Additional Information</h5>
            {formatText(expandedContent)}
          </div>
        )}
        
        {isLoading && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <LoadingSpinner />
          </div>
        )}
      </div>

      <div className="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="secondary"
          size="sm"
          onClick={getMoreInfo}
          disabled={isLoading || !brand || !insight}
          className="flex items-center gap-1 [html[data-theme=theme2]_&]:bg-[#3E66FB] [html[data-theme=theme2]_&]:text-white [html[data-theme=theme2]_&]:hover:bg-[#3E66FB]/90"
          title={!brand || !insight ? "Additional information not available" : `Get more info about ${title}`}
        >
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">More Info</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          disabled={isCopying}
          className="flex items-center gap-1 min-w-[70px] sm:min-w-[90px] [html[data-theme=theme2]_&]:bg-[#3E66FB] [html[data-theme=theme2]_&]:text-white [html[data-theme=theme2]_&]:hover:bg-[#3E66FB]/90"
          title={`Copy ${title}`}
        >
          {isCopying ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
});

InsightSection.displayName = 'InsightSection';

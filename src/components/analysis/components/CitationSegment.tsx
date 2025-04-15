import { BoldText } from "@/components/insight/components/BoldText";
import { ExternalLink } from "lucide-react";
import { useCitationNavigation } from "@/utils/presentation/utils/citations/slideCitationUtils";

interface Segment {
  type: 'text' | 'citation';
  content?: string;
  number?: string;
  url?: string;
}

interface CitationSegmentProps {
  segment: Segment;
  sectionName: string;
}

export const CitationSegment = ({ segment, sectionName }: CitationSegmentProps) => {
  // Use our standardized citation navigation hook
  const { handleCitationClick } = useCitationNavigation();
  
  if (segment.type === 'citation' && segment.number) {
    // Skip displaying example.com placeholder URLs but keep citation number
    const isPlaceholder = !segment.url || segment.url.includes('example.com/citation');
    const isValidUrl = segment.url && (segment.url.startsWith('http://') || segment.url.startsWith('https://'));
    
    return (
      <span
        className={`text-blue-600 mx-1 inline-flex items-center relative group ${
          isPlaceholder || !isValidUrl ? 'opacity-50 cursor-default' : 'hover:underline cursor-pointer'
        }`}
        title={isPlaceholder ? "No source URL available" : segment.url}
        onClick={(e) => {
          if (isPlaceholder || !isValidUrl) {
            e.preventDefault();
            return;
          }
          
          // Use our standardized citation handler
          handleCitationClick(e, segment.url!);
        }}
        data-citation-link="true"
      >
        <span>{`[${segment.number}]`}</span>
        {!isPlaceholder && isValidUrl && (
          <>
            <ExternalLink className="ml-0.5 h-3 w-3" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
              {segment.url}
            </span>
          </>
        )}
      </span>
    );
  }
  
  // If it's text content, use the BoldText component to render it
  if (segment.type === 'text' && segment.content) {
    return <BoldText text={segment.content} />;
  }
  
  // Fallback in case of empty segment
  return null;
};

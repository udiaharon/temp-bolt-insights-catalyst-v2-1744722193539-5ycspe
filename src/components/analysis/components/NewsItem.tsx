
import { ExternalLink } from "lucide-react";
import { useCitationNavigation } from "@/utils/presentation/utils/citations/slideCitationUtils";

interface NewsItemProps {
  title: string;
  url: string;
  date: string;
}

export const NewsItem = ({ title, url, date }: NewsItemProps) => {
  // Use our standardized citation navigation hook
  const { handleCitationClick } = useCitationNavigation();

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleCitationClick(e, url);
      }}
      className="block h-[38px] py-1 px-2 rounded border relative group
        [html[data-theme=default]_&]:border-gray-200 
        [html[data-theme=default]_&]:hover:bg-gray-50 
        [html[data-theme=theme2]_&]:border-[#3E66FB] 
        [html[data-theme=theme2]_&]:border-opacity-10 
        [html[data-theme=theme2]_&]:hover:bg-[#3E66FB]/10 
        transition-colors duration-200"
      title={url}
      data-citation-link="true"
    >
      <div className="flex items-center gap-1.5 h-full">
        <div className="p-0.5 rounded [html[data-theme=default]_&]:bg-blue-100 [html[data-theme=theme2]_&]:bg-[#3E66FB]/10 shrink-0">
          <ExternalLink className="h-3.5 w-3.5 [html[data-theme=default]_&]:text-blue-600 [html[data-theme=theme2]_&]:text-[#3E66FB]" />
        </div>
        <div className="flex-1 min-w-0 flex items-center">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-200 line-clamp-2 leading-4">
                {title}
              </p>
            </div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
              ({date})
            </span>
          </div>
        </div>
      </div>
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
        {url}
      </span>
    </a>
  );
};

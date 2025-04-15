
import { memo } from "react";
import { Link } from "lucide-react";

interface SourceUrlsProps {
  urls?: string[];
  sources?: Array<{number: string, url: string}>;
}

export const SourceUrls = memo(({ urls, sources }: SourceUrlsProps) => {
  // Use sources array if provided, otherwise create from urls with sequential numbering
  const sourcesToDisplay = sources || (urls ? urls.map((url, index) => ({ 
    number: (index + 1).toString(), 
    url 
  })) : []);
  
  if (sourcesToDisplay.length === 0) return null;

  // Function to format URLs for display
  const formatUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      // Return domain name and path
      const domain = urlObj.hostname.replace(/^www\./, '');
      const path = urlObj.pathname.length > 60 
        ? urlObj.pathname.substring(0, 57) + '...' 
        : urlObj.pathname;
      
      return `${domain}${path}`;
    } catch (e) {
      // If URL parsing fails, just return the URL with length limit
      return url.length > 80 ? url.substring(0, 77) + '...' : url;
    }
  };

  // Filter out example.com URLs if we have real URLs available
  const validSources = sourcesToDisplay.filter(src => 
    src.url && 
    src.url.startsWith('http') && 
    !src.url.includes('example.com/citation')
  );

  if (validSources.length === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mt-4">
      <h4 className="font-semibold mb-1 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Link className="w-4 h-4" />
        Sources
      </h4>
      <ul className="space-y-1">
        {validSources.map((source, index) => (
          <li key={`${source.number}-${index}`} className="text-sm break-all">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-start gap-1"
              onClick={(e) => {
                e.preventDefault();
                window.open(source.url, '_blank', 'noopener,noreferrer');
              }}
            >
              <span className="text-gray-500 min-w-[20px] mt-0.5">[{source.number}]</span>
              <span className="flex-1 pr-1">{formatUrl(source.url)}</span>
              <Link className="w-3 h-3 mt-1 flex-shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

SourceUrls.displayName = 'SourceUrls';

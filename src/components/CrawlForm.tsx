import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FirecrawlService } from "@/utils/FirecrawlService";
import { CrawlResults } from "./CrawlResults";
import { CrawlHistory } from "./CrawlHistory";
import { CrawlFormInput } from "./CrawlFormInput";

interface CrawlHistoryItem {
  url: string;
  timestamp: string;
  results: any[];
}

export const CrawlForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResults, setCurrentResults] = useState<any[] | null>(null);
  const [history, setHistory] = useState<CrawlHistoryItem[]>(() => {
    const saved = localStorage.getItem("crawl_history");
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  const saveToHistory = (url: string, results: any[]) => {
    const newHistory = [
      {
        url,
        timestamp: new Date().toISOString(),
        results,
      },
      ...history,
    ].slice(0, 10);
    
    setHistory(newHistory);
    localStorage.setItem("crawl_history", JSON.stringify(newHistory));
  };

  const handleSubmit = async (searchQuery: string) => {
    setIsLoading(true);

    try {
      const result = await FirecrawlService.crawlWebsite(searchQuery);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Website crawled successfully",
          duration: 3000,
        });
        setCurrentResults(result.data);
        saveToHistory(searchQuery, result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to crawl website",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CrawlFormInput onSubmit={handleSubmit} isLoading={isLoading} />

      {currentResults && (
        <CrawlResults data={currentResults} />
      )}

      {history.length > 0 && (
        <CrawlHistory
          history={history}
          onViewResults={setCurrentResults}
        />
      )}
    </div>
  );
};
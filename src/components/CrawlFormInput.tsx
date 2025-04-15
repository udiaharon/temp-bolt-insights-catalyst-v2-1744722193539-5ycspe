import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CrawlFormInputProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

export const CrawlFormInput = ({ onSubmit, isLoading }: CrawlFormInputProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="searchQuery"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Website URL
        </label>
        <Input
          id="searchQuery"
          type="url"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter website URL to crawl"
          className="w-full"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Crawling..." : "Start Crawl"}
      </Button>
    </form>
  );
};
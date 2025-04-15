
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchInsightData } from "@/utils/insightUtils";

interface InsightState {
  title: string;
  insight: string;
  detailedAnalysis?: string;
  marketImpact?: string;
  competitorComparison?: string;
  futureTrends?: string;
  isLoading: boolean;
}

export const useInsight = (brand: string, competitors: string[]) => {
  const { toast } = useToast();
  const [selectedInsight, setSelectedInsight] = useState<InsightState | null>(null);

  const handleInsightClick = useCallback(async (title: string, insight: string) => {
    setSelectedInsight({
      title,
      insight,
      isLoading: true,
    });

    try {
      const insightData = await fetchInsightData(
        brand,
        insight,
        competitors[0] || "competitors"
      );

      setSelectedInsight({
        title,
        insight,
        ...insightData,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching detailed insight:", error);
      toast({
        title: "Error",
        description: "Failed to fetch detailed analysis. Please try again.",
        variant: "destructive",
      });
      setSelectedInsight(null);
    }
  }, [brand, competitors, toast]);

  return {
    selectedInsight,
    setSelectedInsight,
    handleInsightClick,
  };
};

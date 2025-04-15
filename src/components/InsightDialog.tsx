
import { memo } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InsightSection } from "./insight/InsightSection";
import { SourceUrls } from "./insight/SourceUrls";
import { LoadingSpinner } from "./insight/LoadingSpinner";
import { DialogChatBox } from "./chat/DialogChatBox";

interface InsightDialogProps {
  selectedInsight: {
    title: string;
    insight: string;
    summary?: string;
    detailedAnalysis?: string;
    marketImpact?: string;
    competitorComparison?: string;
    futureTrends?: string;
    sourceUrls?: string[];
    isLoading: boolean;
  } | null;
}

const createComprehensiveSummary = (insight: InsightDialogProps['selectedInsight']) => {
  if (!insight) return '';

  const sections = [
    { title: 'Overview', content: insight.summary },
    { title: 'Analysis', content: insight.detailedAnalysis },
    { title: 'Market Impact', content: insight.marketImpact },
    { title: 'Competition', content: insight.competitorComparison },
    { title: 'Future', content: insight.futureTrends }
  ];

  return sections
    .filter(section => section.content)
    .map(section => {
      const firstSentence = section.content?.split(/[.!?](?:\s|$)/)[0]?.trim();
      return firstSentence ? `${firstSentence}.` : '';
    })
    .filter(Boolean)
    .join('\n\n');
};

export const InsightDialog = memo(({ selectedInsight }: InsightDialogProps) => {
  if (!selectedInsight) return null;

  const insights = [
    {
      title: selectedInsight.title,
      topics: [
        {
          headline: "Summary",
          insights: selectedInsight.summary ? [selectedInsight.summary] : []
        },
        {
          headline: "Detailed Analysis",
          insights: selectedInsight.detailedAnalysis ? [selectedInsight.detailedAnalysis] : []
        },
        {
          headline: "Market Impact",
          insights: selectedInsight.marketImpact ? [selectedInsight.marketImpact] : []
        },
        {
          headline: "Competitor Analysis",
          insights: selectedInsight.competitorComparison ? [selectedInsight.competitorComparison] : []
        },
        {
          headline: "Future Trends",
          insights: selectedInsight.futureTrends ? [selectedInsight.futureTrends] : []
        }
      ].filter(topic => topic.insights.length > 0)
    }
  ];

  const comprehensiveSummary = createComprehensiveSummary(selectedInsight);

  return (
    <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-[#3E66FB]/10 [&[data-theme=theme2]_button]:bg-[#3E66FB] [&[data-theme=theme2]_button]:text-white [&[data-theme=theme2]_button]:hover:bg-[#3E66FB]/90 [&[data-theme=theme2]_button.secondary]:bg-[#3E66FB] [&[data-theme=theme2]_button.secondary]:text-white [&[data-theme=theme2]_button.secondary]:hover:bg-[#3E66FB]/90">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">
          {selectedInsight.title} - Detailed Analysis
        </DialogTitle>
      </DialogHeader>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0 bg-white/95 rounded-lg p-4 border border-[#3E66FB]/50 mb-2 transition-all duration-300 ease-in-out">
          <ScrollArea className="h-full">
            <div className="space-y-6 pr-4">
              {selectedInsight.isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-6">
                  <InsightSection 
                    title="Executive Summary" 
                    content={comprehensiveSummary} 
                    brand={selectedInsight.title}
                    insight={selectedInsight.insight}
                  />
                  <InsightSection 
                    title="Detailed Analysis" 
                    content={selectedInsight.detailedAnalysis} 
                    brand={selectedInsight.title}
                    insight={selectedInsight.insight}
                  />
                  <InsightSection 
                    title="Market Impact" 
                    content={selectedInsight.marketImpact} 
                    brand={selectedInsight.title}
                    insight={selectedInsight.insight}
                  />
                  <InsightSection 
                    title="Competitor Analysis" 
                    content={selectedInsight.competitorComparison} 
                    brand={selectedInsight.title}
                    insight={selectedInsight.insight}
                  />
                  <InsightSection 
                    title="Future Trends" 
                    content={selectedInsight.futureTrends} 
                    brand={selectedInsight.title}
                    insight={selectedInsight.insight}
                  />
                  <SourceUrls urls={selectedInsight.sourceUrls} />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="pt-2 border-t mt-2 transition-all duration-300 ease-in-out" style={{ height: 'min-content', maxHeight: '40vh' }}>
          <DialogChatBox 
            brand={selectedInsight.title} 
            insights={insights}
          />
        </div>
      </div>
    </DialogContent>
  );
});

InsightDialog.displayName = 'InsightDialog';

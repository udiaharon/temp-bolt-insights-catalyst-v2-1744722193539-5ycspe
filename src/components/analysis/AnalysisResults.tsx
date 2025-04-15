
import { motion } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";
import { InsightDialog } from "@/components/InsightDialog";
import { AnalysisHeader } from "./AnalysisHeader";
import { InsightContent } from "./InsightContent";
import { ChatBox } from "@/components/ChatBox";
import { ExportActions } from "./ExportActions";
import { useInsight } from "@/hooks/use-insight";
import { useAnalysisPersistence } from "@/hooks/use-analysis-persistence";

interface Topic {
  headline: string;
  insights: string[];
}

interface MarketingC {
  title: string;
  topics: Topic[];
}

interface AnalysisResultsProps {
  brand: string;
  competitors: string[];
  marketingCs: MarketingC[];
  onReset: () => void;
}

export const AnalysisResults = ({
  brand,
  competitors,
  marketingCs,
  onReset,
}: AnalysisResultsProps) => {
  const { selectedInsight, setSelectedInsight, handleInsightClick } = useInsight(brand, competitors);
  
  // Persist brand and competitors data
  useAnalysisPersistence(brand, competitors);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        transition: {
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1]
        }
      }}
      className="w-full"
    >
      <div className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <AnalysisHeader brand={brand} competitors={competitors} onReset={onReset} />
        </div>

        <div className="space-y-6">
          <InsightContent 
            marketingCs={[
              ...marketingCs.slice(0, 6),
              marketingCs[6] || { title: "Product Analysis", topics: [] },
              marketingCs[7] || { title: "Industry Trends", topics: [] },
              marketingCs[8] || { title: "Technology Adoption", topics: [] }
            ]} 
            onInsightClick={handleInsightClick} 
          />
        </div>

        <Dialog open={!!selectedInsight} onOpenChange={() => setSelectedInsight(null)}>
          <InsightDialog selectedInsight={selectedInsight} />
        </Dialog>

        <div className="mt-8">
          <ChatBox brand={brand} insights={marketingCs} />
        </div>

        <ExportActions 
          brand={brand}
          competitors={competitors}
          marketingCs={marketingCs}
        />
      </div>
    </motion.div>
  );
};

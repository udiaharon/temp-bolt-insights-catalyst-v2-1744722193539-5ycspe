
import { motion } from "framer-motion";
import { InsightList } from "../../InsightList";
import { getBackgroundColor } from "../utils/getBackgroundColor";

interface Topic {
  headline: string;
  insights: string[];
}

interface MarketingC {
  title: string;
  topics: Topic[];
}

interface MarketingGridProps {
  marketingCs: MarketingC[];
  onInsightClick: (title: string, insight: string) => void;
  expandAll: boolean;
  currentTheme: string;
}

export const MarketingGrid = ({ marketingCs, onInsightClick, expandAll, currentTheme }: MarketingGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {marketingCs.map((c, index) => {
      const bgColor = getBackgroundColor(c.title, currentTheme);
      return (
        <motion.div 
          key={c.title}
          className={`w-full h-full rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 ${bgColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <InsightList
            title={c.title}
            topics={c.topics}
            onInsightClick={onInsightClick}
            index={index}
            expandAll={expandAll}
            rowIndex={Math.floor(index / 3)}
          />
        </motion.div>
      );
    })}
  </div>
);

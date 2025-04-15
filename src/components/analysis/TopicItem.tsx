
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { InsightItem } from "./InsightItem";
import { TopicIcon } from "./TopicIcon";

interface TopicProps {
  title: string;
  topic: {
    headline: string;
    insights: string[];
  };
  isExpanded: boolean;
  onToggle: () => void;
  onInsightClick: (title: string, insight: string) => void;
}

export const TopicItem = ({
  title,
  topic,
  isExpanded,
  onToggle,
  onInsightClick,
}: TopicProps) => {
  return (
    <div className="rounded-md">
      <button
        onClick={onToggle}
        className="w-full px-2 py-1.5 flex items-center justify-between rounded-md text-gray-700 hover:bg-white/80 dark:text-gray-200 dark:hover:bg-gray-800/80 data-[theme=theme2]:text-primary transition-colors duration-200 [html[data-theme=theme2]_&]:hover:bg-[#3E66FB]/15"
      >
        <div className="flex items-center gap-2">
          <TopicIcon title={title} />
          <span className="text-sm font-medium text-left">{topic.headline}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="pt-1 pl-8">
              {topic.insights.map((insight, index) => (
                <InsightItem
                  key={index}
                  title={title}
                  insight={insight}
                  onClick={() => onInsightClick(title, insight)}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


import { AnimatePresence, motion } from "framer-motion";
import { TopicItem } from "./analysis/TopicItem";
import { useState, useEffect } from "react";
import { TopicIcon } from "./analysis/TopicIcon";

interface Topic {
  headline: string;
  insights: string[];
}

interface InsightListProps {
  title: string;
  topics: Topic[];
  onInsightClick: (title: string, insight: string) => void;
  index: number;
  expandAll: boolean;
  rowIndex: number;
}

export const InsightList = ({ title, topics, onInsightClick, expandAll }: InsightListProps) => {
  const [expandedTopics, setExpandedTopics] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const newExpandedState: { [key: string]: boolean } = {};
    topics.forEach(topic => {
      newExpandedState[topic.headline] = expandAll;
    });
    setExpandedTopics(newExpandedState);
  }, [expandAll, topics]);

  const handleTopicToggle = (headline: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [headline]: !prev[headline]
    }));
  };

  return (
    <div className="p-4 relative bg-transparent">
      <div className="flex items-center gap-2 mb-2 p-2">
        <div className="w-6 h-6">
          <TopicIcon title={title} isHeader={true} />
        </div>
        <h3 className={`font-semibold text-left text-lg ${getHeaderColor(title)} data-[theme=theme2]:text-primary`}>
          {title}
        </h3>
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <div className="space-y-2">
            {topics.map((topic) => (
              <TopicItem
                key={topic.headline}
                title={title}
                topic={topic}
                isExpanded={expandedTopics[topic.headline]}
                onToggle={() => handleTopicToggle(topic.headline)}
                onInsightClick={onInsightClick}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const getHeaderColor = (title: string) => {
  const theme = document.documentElement.getAttribute('data-theme');
  
  if (theme === 'theme2') {
    return 'text-primary';
  }

  switch (title.toLowerCase()) {
    case "consumer analysis":
      return "text-blue-600 dark:text-blue-400";
    case "cost analysis":
      return "text-green-600 dark:text-green-400";
    case "convenience analysis":
      return "text-purple-600 dark:text-purple-400";
    case "communication analysis":
      return "text-orange-600 dark:text-orange-400";
    case "competitive analysis":
      return "text-pink-600 dark:text-pink-400";
    case "media analysis":
      return "text-amber-600 dark:text-amber-400";
    case "product analysis":
      return "text-indigo-600 dark:text-indigo-400";
    case "industry analysis":
    case "industry trends":
      return "text-cyan-600 dark:text-cyan-400";
    case "technology analysis":
    case "technology adoption":
      return "text-rose-600 dark:text-rose-400";
    default:
      return "text-gray-900 dark:text-gray-100";
  }
};

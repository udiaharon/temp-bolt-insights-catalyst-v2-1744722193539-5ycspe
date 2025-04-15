
import { motion } from "framer-motion";
import { getTopicColor } from "@/utils/topicColors";
import { formatBrandNames } from "../insight/formatters/brandFormatter";
import { BoldText } from "../insight/components/BoldText";

interface InsightItemProps {
  title: string;
  insight: string;
  onClick: () => void;
}

export const InsightItem = ({ title, insight, onClick }: InsightItemProps) => {
  const colorClass = getTopicColor(title);
  
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="group text-gray-700 dark:text-gray-300 data-[theme=theme2]:text-primary cursor-pointer hover:bg-white/80 dark:hover:bg-gray-800/80 p-1.5 rounded-md transition-colors duration-200 flex items-center gap-2 text-sm [html[data-theme=theme2]_&]:hover:bg-[#3E66FB]/15"
    >
      <div className={`min-w-[8px] min-h-[8px] w-2 h-2 rounded-full ${colorClass} data-[theme=theme2]:bg-primary`} />
      <span>
        <BoldText text={formatBrandNames(insight)} />
      </span>
    </motion.li>
  );
};

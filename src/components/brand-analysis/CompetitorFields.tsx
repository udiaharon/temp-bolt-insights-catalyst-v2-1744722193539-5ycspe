
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CompetitorFieldsProps {
  competitors: string[];
  updateCompetitor: (index: number, value: string) => void;
  onAddCompetitor: () => void;
}

export const CompetitorFields = ({ competitors, updateCompetitor, onAddCompetitor }: CompetitorFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimatePresence>
          {competitors.map((competitor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <Input
                value={competitor}
                onChange={(e) => updateCompetitor(index, e.target.value)}
                placeholder={`Competitor ${index + 1}`}
                className={`transition-all duration-200 text-black dark:text-white ${
                  competitor.trim() ? '[background-color:#D3E4FD] dark:bg-blue-900/20' : ''
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <Button
        type="button"
        variant="outline"
        onClick={onAddCompetitor}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Competitor
      </Button>
    </div>
  );
};

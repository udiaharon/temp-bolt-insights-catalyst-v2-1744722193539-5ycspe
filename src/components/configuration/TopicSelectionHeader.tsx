
import { Settings } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TopicSelectionHeaderProps {
  areAllSelected: boolean;
  onSelectAll: () => void;
}

export const TopicSelectionHeader = ({
  areAllSelected,
  onSelectAll,
}: TopicSelectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Settings className="h-5 w-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-700">Select Analysis Topics For Automated Report</h2>
        <div className="flex items-center space-x-2 ml-4">
          <Checkbox
            id="select-all-topics"
            checked={areAllSelected}
            onCheckedChange={onSelectAll}
            className="h-3 w-3"
          />
          <label
            htmlFor="select-all-topics"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Select All Topics
          </label>
        </div>
      </div>
    </div>
  );
};


import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

interface ExpandableSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const ExpandableSection = ({
  title,
  isExpanded,
  onToggle,
  children,
  actions
}: ExpandableSectionProps) => {
  return (
    <div className="border border-[#3E66FB]/10 rounded-md overflow-hidden">
      <button
        className="w-full px-3 py-2 flex items-center justify-between text-left"
        data-theme="default"
        onClick={onToggle}
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#3E66FB] mr-2" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#3E66FB] mr-2" />
          )}
          <span className="font-medium text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            {title}
          </span>
        </div>
        <div className="flex items-center">
          {actions}
        </div>
      </button>
      <button
        className="w-full px-3 py-2 flex items-center justify-between text-left bg-[#3E66FB] hidden"
        data-theme="theme2"
        onClick={onToggle}
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-white mr-2" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white mr-2" />
          )}
          <span className="font-medium text-sm text-white">
            {title}
          </span>
        </div>
        <div className="flex items-center">
          {actions}
        </div>
      </button>
      {isExpanded && (
        <div className="p-3 bg-white dark:bg-gray-800/80 text-sm text-gray-700 dark:text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

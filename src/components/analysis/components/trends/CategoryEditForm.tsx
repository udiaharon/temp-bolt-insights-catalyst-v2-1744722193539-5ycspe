
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface CategoryEditFormProps {
  primaryCategory: string;
  setPrimaryCategory: (value: string) => void;
  editableRelatedCategories: string;
  setEditableRelatedCategories: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const CategoryEditForm: React.FC<CategoryEditFormProps> = ({
  primaryCategory,
  setPrimaryCategory,
  editableRelatedCategories,
  setEditableRelatedCategories,
  onRefresh,
  isRefreshing
}) => {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="primary-category" className="block text-sm font-medium text-gray-700 mb-1 px-2 py-1 rounded-md 
          [html[data-theme=default]_&]:bg-purple-100 
          [html[data-theme=theme2]_&]:bg-blue-100 
          inline-block">
          Category:
        </label>
        <div className="flex gap-2">
          <Input
            id="primary-category"
            value={primaryCategory}
            onChange={(e) => setPrimaryCategory(e.target.value)}
            className="flex-1"
            placeholder="e.g., Technology, Fashion, Food"
          />
        </div>
      </div>
      <div>
        <label htmlFor="related-categories" className="block text-sm font-medium text-gray-700 mb-1 px-2 py-1 rounded-md 
          [html[data-theme=default]_&]:bg-purple-100 
          [html[data-theme=theme2]_&]:bg-blue-100 
          inline-block">
          Related Categories (comma-separated):
        </label>
        <div className="flex gap-2">
          <Input
            id="related-categories"
            value={editableRelatedCategories}
            onChange={(e) => setEditableRelatedCategories(e.target.value)}
            className="flex-1"
            placeholder="e.g., Mobile Devices, Cloud Computing, AI"
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Trends
        </Button>
      </div>
    </div>
  );
};

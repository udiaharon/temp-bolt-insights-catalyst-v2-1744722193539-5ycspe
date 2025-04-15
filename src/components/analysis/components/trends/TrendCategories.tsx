
import React from 'react';
import { motion } from "framer-motion";
import { CategoryDisplay } from "./CategoryDisplay";
import { CategoryEditForm } from "./CategoryEditForm";

interface TrendCategoriesProps {
  editMode: boolean;
  primaryCategory: string;
  setPrimaryCategory: (value: string) => void;
  relatedCategories: string[];
  editableRelatedCategories: string;
  setEditableRelatedCategories: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TrendCategories: React.FC<TrendCategoriesProps> = ({
  editMode,
  primaryCategory,
  setPrimaryCategory,
  relatedCategories,
  editableRelatedCategories,
  setEditableRelatedCategories,
  onRefresh,
  isRefreshing
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-4 p-3 bg-white rounded-md shadow-sm border border-gray-100 [html[data-theme=theme2]_&]:border-blue-100"
    >
      {editMode ? (
        <CategoryEditForm 
          primaryCategory={primaryCategory}
          setPrimaryCategory={setPrimaryCategory}
          editableRelatedCategories={editableRelatedCategories}
          setEditableRelatedCategories={setEditableRelatedCategories}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      ) : (
        <div className="text-gray-700">
          <CategoryDisplay 
            primaryCategory={primaryCategory} 
            relatedCategories={relatedCategories} 
          />
        </div>
      )}
    </motion.div>
  );
};

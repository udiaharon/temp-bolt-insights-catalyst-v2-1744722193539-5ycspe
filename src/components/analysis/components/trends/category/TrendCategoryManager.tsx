
import React from 'react';
import { CategoryDisplay } from "../CategoryDisplay";
import { CategoryEditForm } from "../CategoryEditForm";

interface TrendCategoryManagerProps {
  editMode: boolean;
  primaryCategory: string;
  setPrimaryCategory: (value: string) => void;
  relatedCategories: string[];
  editableRelatedCategories: string;
  setEditableRelatedCategories: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TrendCategoryManager: React.FC<TrendCategoryManagerProps> = ({
  editMode,
  primaryCategory,
  setPrimaryCategory,
  relatedCategories,
  editableRelatedCategories,
  setEditableRelatedCategories,
  onRefresh,
  isRefreshing
}) => {
  return editMode ? (
    <CategoryEditForm 
      primaryCategory={primaryCategory}
      setPrimaryCategory={setPrimaryCategory}
      editableRelatedCategories={editableRelatedCategories}
      setEditableRelatedCategories={setEditableRelatedCategories}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
    />
  ) : (
    <CategoryDisplay 
      primaryCategory={primaryCategory} 
      relatedCategories={relatedCategories} 
    />
  );
};

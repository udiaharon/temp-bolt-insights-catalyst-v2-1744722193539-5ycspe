
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface TrendHeaderProps {
  editMode: boolean;
  toggleEditMode: () => void;
  currentTheme: string;
}

export const TrendHeader: React.FC<TrendHeaderProps> = ({ 
  editMode, 
  toggleEditMode,
  currentTheme 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold [html[data-theme=theme2]_&]:text-primary">Latest Industry Trends</h3>
      {currentTheme === 'default' ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleEditMode}
          className="flex items-center gap-1 bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
        >
          {editMode ? "Cancel" : (
            <>
              <Edit className="h-4 w-4" />
              <span>Edit Categories</span>
            </>
          )}
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleEditMode}
          className="flex items-center gap-1"
        >
          {editMode ? "Cancel" : (
            <>
              <Edit className="h-4 w-4" />
              <span>Edit Categories</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

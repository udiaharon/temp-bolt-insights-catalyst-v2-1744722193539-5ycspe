
import React from 'react';

interface CategoryDisplayProps {
  primaryCategory: string;
  relatedCategories: string[];
}

export const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ 
  primaryCategory, 
  relatedCategories 
}) => {
  return (
    <div className="mb-3">
      <span className="text-sm font-medium px-2 py-1 rounded-md mr-2 inline-block
        [html[data-theme=default]_&]:bg-purple-100 
        [html[data-theme=theme2]_&]:bg-blue-100">
        Category: <span className="font-semibold">{primaryCategory}</span>
      </span>
      
      {relatedCategories.length > 0 && (
        <span className="text-sm font-medium px-2 py-1 rounded-md inline-block
          [html[data-theme=default]_&]:bg-purple-100 
          [html[data-theme=theme2]_&]:bg-blue-100">
          Related Categories: <span className="font-semibold">{relatedCategories.join(", ")}</span>
        </span>
      )}
    </div>
  );
};

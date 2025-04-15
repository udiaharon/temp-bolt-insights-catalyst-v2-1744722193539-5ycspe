
import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-24 w-24 border-8 
        [html[data-theme=default]_&]:border-gray-200
        [html[data-theme=default]_&]:border-t-[rgb(134,239,172)]
        [html[data-theme=default]_&]:border-r-[rgb(253,186,116)]
        [html[data-theme=default]_&]:border-b-[rgb(147,197,253)]
        [html[data-theme=default]_&]:border-l-[rgb(252,165,165)]
        [html[data-theme=theme2]_&]:border-blue-100
        [html[data-theme=theme2]_&]:border-t-[#3E66FB]">
      </div>
    </div>
  );
};


import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  variant?: 'swot' | 'dialog';
}

export const LoadingSpinner = ({ variant = 'dialog' }: LoadingSpinnerProps) => {
  if (variant === 'swot') {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-8 
          [html[data-theme=default]_&]:border-gray-200
          [html[data-theme=default]_&]:border-t-[rgb(134,239,172)]
          [html[data-theme=default]_&]:border-r-[rgb(253,186,116)]
          [html[data-theme=default]_&]:border-b-[rgb(147,197,253)]
          [html[data-theme=default]_&]:border-l-[rgb(252,165,165)]
          [html[data-theme=theme2]_&]:border-blue-100
          [html[data-theme=theme2]_&]:border-t-[#3E66FB]"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-64 flex items-center justify-center flex-col gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 [html[data-theme=default]_&]:border-gray-300 [html[data-theme=default]_&]:border-t-blue-900 [html[data-theme=theme2]_&]:border-[#3E66FB]/30 [html[data-theme=theme2]_&]:border-t-[#3E66FB] rounded-full shadow-lg"
      />
      <p className="text-sm font-medium [html[data-theme=default]_&]:text-gray-600 [html[data-theme=theme2]_&]:text-[#3E66FB]">
        Gathering Insights
      </p>
    </div>
  );
};


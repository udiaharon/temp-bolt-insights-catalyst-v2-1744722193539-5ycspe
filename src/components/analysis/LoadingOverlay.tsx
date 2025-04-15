import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface LoadingOverlayProps {
  children?: ReactNode;
  onForceReset?: () => void;
}

export const LoadingOverlay = ({ children, onForceReset }: LoadingOverlayProps) => {
  const [countdown, setCountdown] = useState(59);
  const [showCountdown, setShowCountdown] = useState(false);
  
  useEffect(() => {
    // Wait 1 second before showing the countdown
    const showTimer = setTimeout(() => {
      setShowCountdown(true);
    }, 1000);
    
    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(showTimer);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center space-y-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <motion.div
            className="w-24 h-24 border-8 [html[data-theme=default]_&]:border-gray-300 [html[data-theme=default]_&]:border-t-black [html[data-theme=theme2]_&]:border-blue-100 [html[data-theme=theme2]_&]:border-t-[#3E66FB] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {showCountdown && (
              <span className="text-lg font-semibold [html[data-theme=default]_&]:text-gray-800 [html[data-theme=theme2]_&]:text-[#3E66FB]">
                {countdown}
              </span>
            )}
          </div>
        </div>
        <p className="text-lg font-medium [html[data-theme=default]_&]:text-gray-700 [html[data-theme=theme2]_&]:text-[#3E66FB]">Analyzing brand data...</p>
        <p className="text-sm [html[data-theme=default]_&]:text-gray-500 [html[data-theme=theme2]_&]:text-blue-400">This will take less than a minute!</p>
        
        {children}
      </motion.div>
    </div>
  );
};

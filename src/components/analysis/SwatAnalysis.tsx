import { motion } from "framer-motion";
import { Star, AlertTriangle, Lightbulb, ShieldAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef } from "react";

interface SwatAnalysisProps {
  analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    strengths_details?: string[];
    weaknesses_details?: string[];
    opportunities_details?: string[];
    threats_details?: string[];
  } | null;
  isLoading: boolean;
}

export const SwatAnalysis = ({ analysis, isLoading }: SwatAnalysisProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analysis && !isLoading && gridRef.current) {
      window.scrollTo({
        top: gridRef.current.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  }, [analysis, isLoading]);

  useEffect(() => {
    if (analysis) {
      console.log("Saving SWOT analysis to localStorage:", analysis);
      localStorage.setItem('swotAnalysis', JSON.stringify(analysis));
    }
  }, [analysis]);

  if (isLoading) {
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
  }

  if (!analysis) return null;

  const quadrants = [
    { 
      title: "Strengths", 
      items: analysis.strengths,
      details: analysis.strengths_details || [],
      bgColor: "bg-green-200 data-[theme=theme2]:bg-blue-50",
      textColor: "text-green-800 data-[theme=theme2]:text-primary",
      icon: Star,
      iconClass: "text-green-600 data-[theme=theme2]:text-primary"
    },
    { 
      title: "Weaknesses", 
      items: analysis.weaknesses,
      details: analysis.weaknesses_details || [],
      bgColor: "bg-orange-200 data-[theme=theme2]:bg-blue-50/80",
      textColor: "text-orange-800 data-[theme=theme2]:text-primary",
      icon: AlertTriangle,
      iconClass: "text-orange-600 data-[theme=theme2]:text-primary"
    },
    { 
      title: "Opportunities", 
      items: analysis.opportunities,
      details: analysis.opportunities_details || [],
      bgColor: "bg-blue-200 data-[theme=theme2]:bg-blue-50/60",
      textColor: "text-blue-800 data-[theme=theme2]:text-primary",
      icon: Lightbulb,
      iconClass: "text-blue-600 data-[theme=theme2]:text-primary"
    },
    { 
      title: "Threats", 
      items: analysis.threats,
      details: analysis.threats_details || [],
      bgColor: "bg-red-200 data-[theme=theme2]:bg-blue-50/40",
      textColor: "text-red-800 data-[theme=theme2]:text-primary",
      icon: ShieldAlert,
      iconClass: "text-red-600 data-[theme=theme2]:text-primary"
    }
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        ref={gridRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4 mt-4"
      >
        {quadrants.map((quadrant, index) => {
          const Icon = quadrant.icon;
          return (
            <div
              key={quadrant.title}
              className={`p-6 rounded-lg ${quadrant.bgColor} shadow-md data-[theme=theme2]:shadow-primary/10`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${quadrant.textColor} flex items-center gap-2`}>
                <Icon className={`h-5 w-5 ${quadrant.iconClass}`} />
                {quadrant.title}
              </h3>
              <ul className="space-y-1">
                {quadrant.items.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                    className={`${quadrant.textColor} text-base hover:bg-white/50 rounded p-0.5 transition-colors duration-200`}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help inline-block">• {item}</div>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="right"
                        align="start"
                        sideOffset={5}
                        className="max-w-sm p-4"
                      >
                        {quadrant.details[idx] || "No detailed information available."}
                      </TooltipContent>
                    </Tooltip>
                  </motion.li>
                ))}
              </ul>
            </div>
          );
        })}
      </motion.div>
    </TooltipProvider>
  );
};

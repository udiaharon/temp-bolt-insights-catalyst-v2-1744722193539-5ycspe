
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandAwarenessTrendChart } from "./BrandAwarenessTrendChart";
import { ChartLine } from "lucide-react";

interface BrandAwarenessButtonProps {
  brand: string;
  competitors: string[];
}

export const BrandAwarenessButton = ({ brand, competitors }: BrandAwarenessButtonProps) => {
  const [showChart, setShowChart] = useState(false);

  const handleClick = () => {
    console.log('Brand Awareness button clicked');
    console.log('Current brand:', brand);
    console.log('Current competitors:', competitors);
    setShowChart(!showChart);
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={handleClick}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-800 [html[data-theme=theme2]_&]:bg-[#3E66FB] [html[data-theme=theme2]_&]:hover:bg-[#3E66FB]/90 [html[data-theme=theme2]_&]:text-white [html[data-theme=theme2]_&]:hover:text-white [html[data-theme=theme2]_&]:shadow-primary/10 py-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl text-lg font-semibold tracking-wide flex items-center justify-center [&_svg]:!w-8 [&_svg]:!h-8"
      >
        <ChartLine 
          strokeWidth={2} 
          className="[&_path]:stroke-[url(#gradient)] [html[data-theme=theme2]_&_path]:stroke-white mr-[-33px]"
        />
        <svg width="0" height="0">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="50%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#FDA4AF" />
            </linearGradient>
          </defs>
        </svg>
        Brand Awareness Analysis
      </Button>
      {showChart && (
        <div className="mt-4">
          <BrandAwarenessTrendChart 
            brand={brand} 
            competitors={competitors}
          />
        </div>
      )}
    </div>
  );
};

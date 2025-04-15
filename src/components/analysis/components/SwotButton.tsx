
import { Button } from "@/components/ui/button";
import { QuadrantIcon } from "./QuadrantIcon";

interface SwotButtonProps {
  onClick: () => void;
  isAnalyzing: boolean;
}

export const SwotButton = ({ onClick, isAnalyzing }: SwotButtonProps) => {
  const theme = document.documentElement.getAttribute('data-theme') || 'default';
  
  return (
    <div className="mt-8">
      {theme === 'default' ? (
        <Button 
          onClick={onClick}
          disabled={isAnalyzing}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl text-lg font-semibold tracking-wide flex items-center justify-center"
        >
          <QuadrantIcon theme="default" />
          {isAnalyzing ? "Analyzing..." : "Perform S.W.O.T Analysis"}
        </Button>
      ) : (
        <Button 
          onClick={onClick}
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary hover:from-primary/30 hover:via-primary/50 hover:to-primary text-white py-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl text-lg font-semibold tracking-wide flex items-center justify-center"
        >
          <QuadrantIcon theme="theme2" />
          {isAnalyzing ? "Analyzing..." : "Perform S.W.O.T Analysis"}
        </Button>
      )}
    </div>
  );
};

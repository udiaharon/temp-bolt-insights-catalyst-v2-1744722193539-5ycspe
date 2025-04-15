
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const ConfigurationHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    // Check if we have the analysis data in state
    const state = location.state;
    if (state?.fromAnalysis && state?.brand && state?.competitors && state?.marketingCs) {
      // Navigate to home with the analysis data to recreate the analysis results view
      navigate("/", { 
        state: {
          showResults: true,
          brand: state.brand,
          competitors: state.competitors,
          marketingCs: state.marketingCs
        }
      });
    } else {
      navigate("/");
    }
  };
  
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="lg"
        onClick={handleBack}
        className="rounded-full bg-blue-200 hover:bg-blue-300 dark:bg-blue-800/40 dark:hover:bg-blue-800/60 p-3"
      >
        <ArrowLeft className="h-6 w-6 text-blue-900 dark:text-blue-200" />
      </Button>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-300">
        Configuration
      </h1>
    </div>
  );
};

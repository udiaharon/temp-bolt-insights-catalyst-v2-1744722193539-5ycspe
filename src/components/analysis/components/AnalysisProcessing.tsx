
import { LoadingOverlay } from "@/components/analysis/LoadingOverlay";

interface AnalysisProcessingProps {
  isLoadingContent: boolean;
  isAnalyzing: boolean;
  isProcessing: boolean;
}

export const AnalysisProcessing = ({ 
  isLoadingContent, 
  isAnalyzing, 
  isProcessing 
}: AnalysisProcessingProps) => {
  const showLoading = isProcessing || isLoadingContent || isAnalyzing;
  
  if (!showLoading) return null;
  
  return (
    <LoadingOverlay>
      <div className="text-center text-sm text-gray-500 mt-2">
        Analyzing competitor data, generating insights, and gathering latest news...
      </div>
    </LoadingOverlay>
  );
};


import { Button } from "@/components/ui/button";
import { FileDown, LoaderCircle } from "lucide-react";

interface PdfDownloadButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const PdfDownloadButton = ({ isLoading, onClick }: PdfDownloadButtonProps) => {
  return (
    <Button 
      type="button"
      variant="outline" 
      size="lg" 
      className="gap-2 bg-[#F1F1F1] hover:bg-[#E5E5E5] text-gray-700 border-gray-200"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Loading Report...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          View Full Report
        </>
      )}
    </Button>
  );
};

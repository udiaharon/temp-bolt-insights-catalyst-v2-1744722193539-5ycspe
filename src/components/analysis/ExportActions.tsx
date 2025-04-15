
import { ExportButton } from "./export/ExportButton";
import { useExportHandler, ExportData } from "@/utils/export/exportHandlerUtils";

interface ExportActionsProps {
  brand: string;
  competitors: string[];
  marketingCs: {
    title: string;
    topics: {
      headline: string;
      insights: string[];
    }[];
  }[];
}

export const ExportActions = ({ brand, competitors, marketingCs }: ExportActionsProps) => {
  const exportData: ExportData = {
    brand,
    competitors,
    marketingCs
  };
  
  const { isExporting, handleExportClick } = useExportHandler(exportData);

  return (
    <div className="flex justify-center gap-4 mt-12">
      <ExportButton 
        isExporting={isExporting} 
        onClick={handleExportClick} 
      />
    </div>
  );
};

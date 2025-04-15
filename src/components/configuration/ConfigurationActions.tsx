
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PdfDownloadButton } from "@/components/configuration/PdfDownloadButton";
import { useState } from "react";

interface ConfigurationActionsProps {
  onSubmit: () => void;
}

export const ConfigurationActions = ({ onSubmit }: ConfigurationActionsProps) => {
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const { toast } = useToast();
  
  const handleViewFullReport = async () => {
    setIsLoadingPdf(true);
    try {
      const pdfUrl = "https://ebkcggonudpymnslfoxv.supabase.co/storage/v1/object/sign/brand%20insights/nike%20brand%20insights%20v1.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJicmFuZCBpbnNpZ2h0cy9uaWtlIGJyYW5kIGluc2lnaHRzIHYxLnBkZiIsImlhdCI6MTczNzg5ODU3MiwiZXhwIjoxNzY5NDM0NTcyfQ.wvUXyQdMAS1NGo5PD_bCFXap-xXV0VvA2zBCIzXrz_M&t=2025-01-26T13%3A36%3A12.191Z";
      const delay = () => new Promise(resolve => setTimeout(resolve, 7000));
      await delay();
      
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      } else {
        toast({
          title: "Error",
          description: "PDF URL is not available",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingPdf(false);
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-4">
      <PdfDownloadButton 
        isLoading={isLoadingPdf}
        onClick={handleViewFullReport}
      />
      <Button 
        type="submit" 
        size="lg" 
        onClick={onSubmit}
        className="w-full sm:w-auto rounded-full bg-blue-200 hover:bg-blue-300 dark:bg-blue-800/40 dark:hover:bg-blue-800/60 text-blue-900 dark:text-blue-200"
      >
        Save Configuration
      </Button>
    </div>
  );
};

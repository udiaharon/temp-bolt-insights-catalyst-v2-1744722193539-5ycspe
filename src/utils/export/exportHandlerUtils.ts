
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { fetchBrandLogo } from "@/utils/presentation/utils/logoUtils";
import { generatePowerPoint } from "@/utils/presentation/powerPointUtils";
import { BrandContent, NewsItem } from "@/types/analysis";
import { swotService } from "@/services/swotService";
import { brandContentService } from "@/services/brandContentService";
import { trendsService } from "@/services/trendsService";

export interface ExportData {
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

export const useExportHandler = (exportData: ExportData) => {
  const { brand, competitors, marketingCs } = exportData;
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  // Persist analysis data to localStorage
  useEffect(() => {
    const analysisData = {
      brand,
      competitors,
      marketingCs
    };
    localStorage.setItem('analysisData', JSON.stringify(analysisData));
  }, [brand, competitors, marketingCs]);

  const handleExportClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log("Export process started");
    if (isExporting) {
      console.log("Export already in progress, returning");
      return;
    }
    setIsExporting(true);
    console.log("isExporting set to true");

    try {
      toast({
        title: "Generating PowerPoint",
        description: "Please wait while we prepare your presentation...",
      });

      console.log("Starting logo fetch process for brand:", brand);
      let brandLogoUrl;
      try {
        if (!brand) {
          console.error("No brand name provided for logo fetch");
          throw new Error("Brand name is required for logo fetch");
        }
        brandLogoUrl = await fetchBrandLogo(brand);
        console.log("Logo fetch completed:", brandLogoUrl ? "Successfully" : "No logo returned");
      } catch (error) {
        console.error("Logo fetch failed with error:", error);
        toast({
          title: "Warning",
          description: "Could not fetch company logo. Continuing without logo.",
          variant: "destructive",
        });
        brandLogoUrl = null;
      }

      // Get SWOT Analysis
      let swotAnalysis = null;
      try {
        swotAnalysis = swotService.getStoredSwotAnalysis();
        console.log("Retrieved SWOT analysis:", swotAnalysis ? "Successfully" : "Not found");
        
        if (swotAnalysis) {
          const requiredKeys = ['strengths', 'weaknesses', 'opportunities', 'threats'];
          requiredKeys.forEach(key => {
            if (!swotAnalysis[key] || !Array.isArray(swotAnalysis[key])) {
              swotAnalysis[key] = [];
            }
          });
        }
      } catch (error) {
        console.error("Error retrieving SWOT analysis:", error);
        swotAnalysis = {
          strengths: [],
          weaknesses: [],
          opportunities: [],
          threats: []
        };
      }

      // Get Brand Content and News Items
      const brandContent: BrandContent | null = brandContentService.getBrandContent();
      const newsItems: NewsItem[] = brandContentService.getNewsItems() || [];
      
      console.log("Retrieved brand content:", brandContent ? "Successfully" : "Not found", 
        brandContent ? Object.keys(brandContent).filter(key => !!brandContent[key]) : []);
      console.log("Retrieved news items:", newsItems ? `${newsItems.length} items` : "Not found");

      // Get Trends
      let latestTrends: string[] | undefined;
      try {
        latestTrends = trendsService.getStoredTrends();
        if (latestTrends && latestTrends.length > 0) {
          console.log("Retrieved trends for PowerPoint:", latestTrends.length);
        }
      } catch (error) {
        console.error("Error retrieving trends:", error);
      }

      // Validate marketing Cs
      if (!Array.isArray(marketingCs) || marketingCs.length === 0) {
        throw new Error("Invalid marketing analysis data");
      }

      console.log("Starting PowerPoint generation with:", {
        brand,
        hasLogo: !!brandLogoUrl,
        marketingCsCount: marketingCs.length,
        hasSwot: !!swotAnalysis,
        hasBrandContent: !!brandContent,
        newsItemsCount: newsItems.length,
        hasTrends: !!latestTrends
      });
      
      await generatePowerPoint(
        brand, 
        marketingCs, 
        swotAnalysis, 
        brandLogoUrl, 
        brandContent, 
        newsItems
      );

      toast({
        title: "Success",
        description: "Your PowerPoint presentation has been generated and downloaded.",
      });
    } catch (error) {
      console.error("Export process failed with error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PowerPoint presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log("Export process completed, resetting isExporting");
      setIsExporting(false);
      
      setTimeout(() => {
        sessionStorage.removeItem('pptDownloadInProgress');
      }, 3000);
    }
  };

  return {
    isExporting,
    handleExportClick
  };
};

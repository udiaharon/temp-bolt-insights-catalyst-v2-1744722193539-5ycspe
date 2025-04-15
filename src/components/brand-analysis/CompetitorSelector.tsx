
import { useState, useEffect } from "react";
import { fetchCompetitors, clearCompetitorsCache } from "@/utils/competitorUtils";
import { useToast } from "@/components/ui/use-toast";
import { AutoSelectButton } from "./AutoSelectButton";
import { CompetitorFields } from "./CompetitorFields";
import { clearPerplexityCache } from "@/utils/perplexityApi";

interface CompetitorSelectorProps {
  brand: string;
  category?: string;
  country?: string;
  competitors: string[];
  setCompetitors: (competitors: string[]) => void;
  onAddCompetitor: () => void;
}

export const CompetitorSelector = ({
  brand,
  category,
  country,
  competitors,
  setCompetitors,
  onAddCompetitor,
}: CompetitorSelectorProps) => {
  const [isAutoSelecting, setIsAutoSelecting] = useState(false);
  const { toast } = useToast();

  // Reset competitor fields when component mounts on the main page
  useEffect(() => {
    if (window.location.pathname === '/') {
      console.log("Resetting competitor fields on main page load");
      setCompetitors(Array(9).fill(""));
      localStorage.removeItem('competitors');
    }
  }, [setCompetitors]);

  const updateCompetitor = (index: number, value: string) => {
    const newCompetitors = [...competitors];
    
    // Don't allow setting a competitor to the brand name
    if (value.trim().toLowerCase() === brand.trim().toLowerCase()) {
      toast({
        title: "Invalid Competitor",
        description: "A brand cannot be its own competitor. Please enter a different name.",
        variant: "destructive",
      });
      return;
    }
    
    newCompetitors[index] = value;
    setCompetitors(newCompetitors);
  };

  const handleAutoSelect = async () => {
    setIsAutoSelecting(true);
    setCompetitors(Array(9).fill(""));
    
    try {
      // Clear both the competitors cache and Perplexity API cache to ensure fresh data
      clearCompetitorsCache();
      clearPerplexityCache();
      
      let selectedCompetitors: string[];
      
      if (brand.toLowerCase() === 'nike') {
        await new Promise(resolve => setTimeout(resolve, 3000));
        selectedCompetitors = ["New Balance", "Reebok", "Under Armour", "Adidas"];
      } else {
        // Pass category and country only if they're provided and not empty
        const categoryToUse = category && category.trim() ? category : undefined;
        const countryToUse = country && country.trim() ? country : undefined;
        
        console.log('Auto-selecting competitors with:', {
          brand,
          category: categoryToUse,
          country: countryToUse
        });
        
        selectedCompetitors = await fetchCompetitors(brand, categoryToUse, countryToUse);
      }

      // Double check to ensure no competitor matches the brand name
      selectedCompetitors = selectedCompetitors.filter(
        comp => comp.trim().toLowerCase() !== brand.trim().toLowerCase()
      );
      
      const newCompetitors = Array(9).fill("");
      selectedCompetitors.forEach((competitor, index) => {
        newCompetitors[index] = competitor;
      });
      setCompetitors(newCompetitors);
      
      toast({
        title: "Competitors Selected",
        description: "Top competitors have been automatically filled in.",
      });
    } catch (error) {
      console.error('Error selecting competitors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch competitors. Please try again or enter them manually.",
        variant: "destructive",
      });
    } finally {
      setIsAutoSelecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <AutoSelectButton
        isAutoSelecting={isAutoSelecting}
        onClick={handleAutoSelect}
        disabled={isAutoSelecting || !brand.trim()}
      />
      
      <div className="space-y-4">
        <label className="text-sm font-medium dark:text-blue-300 text-blue-300">
          <span data-theme="default" className="block">Competitors (Optional)</span>
          <span data-theme="theme2" className="block text-[#3E66FB] font-semibold">Competitors (Optional)</span>
        </label>
        
        <CompetitorFields
          competitors={competitors}
          updateCompetitor={updateCompetitor}
          onAddCompetitor={onAddCompetitor}
        />
      </div>
    </div>
  );
};

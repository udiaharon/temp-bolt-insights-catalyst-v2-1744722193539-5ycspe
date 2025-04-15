
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BrandInput } from "./brand-analysis/BrandInput";
import { CategoryInput } from "./brand-analysis/CategoryInput";
import { CountryInput } from "./brand-analysis/CountryInput";
import { CompetitorSelector } from "./brand-analysis/CompetitorSelector";
import { StorageService } from "@/utils/services/StorageService";
import { clearPerplexityCache } from "@/utils/perplexityApi";
import { clearBrandContentCache, clearNewsCache } from "@/hooks/use-brand-content";
import { clearSearchVolumeCache } from "@/components/analysis/utils/searchVolume";
import { getSelectedLanguage } from "@/utils/stores/languageStore";

interface BrandAnalysisFormProps {
  onSubmit: (data: { brand: string; category: string; country: string; competitors: string[] }) => void;
  isLoading: boolean;
}

export const BrandAnalysisForm = ({ onSubmit, isLoading }: BrandAnalysisFormProps) => {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [competitors, setCompetitors] = useState<string[]>(Array(9).fill(""));
  const { toast } = useToast();

  // Check if we have previously stored values or reset if on main page
  useEffect(() => {
    // If on the main index page, clear form data
    if (window.location.pathname === '/') {
      console.log('On main page, resetting form fields');
      setBrand("");
      setCategory("");
      setCountry("");
      setCompetitors(Array(9).fill(""));
      localStorage.removeItem('category');
      localStorage.removeItem('country');
      return; // Exit early to avoid setting stored values
    }

    // Only load stored values if not on the main page
    const storedCompetitors = localStorage.getItem('competitors');
    if (storedCompetitors) {
      try {
        const parsedCompetitors = JSON.parse(storedCompetitors);
        if (Array.isArray(parsedCompetitors) && parsedCompetitors.length > 0) {
          // Create a new array with 9 empty strings and fill in the stored competitors
          const newCompetitors = Array(9).fill("");
          parsedCompetitors.forEach((comp, index) => {
            if (index < 9) {
              newCompetitors[index] = comp;
            }
          });
          setCompetitors(newCompetitors);
        }
      } catch (error) {
        console.error('Error parsing stored competitors:', error);
      }
    }

    // Load previously stored category and country
    const storedCategory = localStorage.getItem('category');
    if (storedCategory) {
      setCategory(storedCategory);
    }

    const storedCountry = localStorage.getItem('country');
    if (storedCountry) {
      setCountry(storedCountry);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredCompetitors = competitors.filter((c) => c.trim() !== "");
    
    // Clear ALL caches before starting a new analysis
    StorageService.clearAnalysisCache();
    clearPerplexityCache();
    clearBrandContentCache();
    clearNewsCache();
    clearSearchVolumeCache();
    console.log('All caches cleared for fresh analysis');
    
    // Store competitors, category, country and language in localStorage
    localStorage.setItem('competitors', JSON.stringify(filteredCompetitors));
    localStorage.setItem('category', category);
    localStorage.setItem('country', country);
    
    // Store the current language being used for the analysis
    const currentLanguage = getSelectedLanguage();
    localStorage.setItem('analysisLanguage', currentLanguage);
    
    onSubmit({ brand, category, country, competitors: filteredCompetitors });
  };

  const handleAddCompetitor = () => {
    setCompetitors(prev => [...prev, ""]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 sm:p-6 backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <BrandInput brand={brand} setBrand={setBrand} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoryInput category={category} setCategory={setCategory} />
            <CountryInput country={country} setCountry={setCountry} />
          </div>
        </div>

        <CompetitorSelector
          brand={brand}
          category={category}
          country={country}
          competitors={competitors}
          setCompetitors={setCompetitors}
          onAddCompetitor={handleAddCompetitor}
        />

        <Button
          type="submit"
          disabled={isLoading || !brand.trim()}
          className="w-full transition-all duration-200 disabled:opacity-95 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 [html[data-theme=theme2]_&]:bg-primary [html[data-theme=theme2]_&]:bg-none"
        >
          {isLoading ? "Analyzing..." : "Analyze Brand"}
        </Button>
      </form>
    </Card>
  );
};

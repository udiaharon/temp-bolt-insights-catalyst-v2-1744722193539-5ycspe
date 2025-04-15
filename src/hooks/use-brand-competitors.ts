
import { useState, useEffect } from "react";

export const useBrandCompetitors = (
  initialBrand?: string,
  initialCompetitors?: string[]
) => {
  const [brand, setBrand] = useState(initialBrand || '');
  const [competitors, setCompetitors] = useState<string[]>(initialCompetitors || []);

  // Load brand and competitors from props or localStorage
  useEffect(() => {
    if (initialBrand) {
      setBrand(initialBrand);
    } else {
      const currentBrand = localStorage.getItem('currentBrand');
      if (currentBrand) {
        setBrand(currentBrand);
      }
    }
    
    if (initialCompetitors && initialCompetitors.length > 0) {
      setCompetitors(initialCompetitors);
    } else {
      const currentCompetitorsStr = localStorage.getItem('currentCompetitors');
      if (currentCompetitorsStr) {
        try {
          const parsedCompetitors = JSON.parse(currentCompetitorsStr);
          if (Array.isArray(parsedCompetitors)) {
            setCompetitors(parsedCompetitors);
          }
        } catch (error) {
          console.error('Error parsing competitors:', error);
        }
      }
    }
  }, [initialBrand, initialCompetitors]);

  // Update state when props change
  useEffect(() => {
    if (initialBrand) {
      setBrand(initialBrand);
    }
    
    if (initialCompetitors && initialCompetitors.length > 0) {
      setCompetitors(initialCompetitors);
    }
  }, [initialBrand, initialCompetitors]);

  return {
    brand,
    competitors
  };
};

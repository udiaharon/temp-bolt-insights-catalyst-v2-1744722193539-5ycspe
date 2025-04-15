
import { useEffect } from "react";

export const useAnalysisPersistence = (brand: string, competitors: string[]) => {
  useEffect(() => {
    localStorage.setItem('currentBrand', brand);
    localStorage.setItem('currentCompetitors', JSON.stringify(competitors));

    return () => {
      localStorage.removeItem('currentBrand');
      localStorage.removeItem('currentCompetitors');
    };
  }, [brand, competitors]);
};

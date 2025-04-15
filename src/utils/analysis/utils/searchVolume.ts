
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths } from "date-fns";
import { SearchData } from "@/components/analysis/types/chartTypes";

// Cache for search volume data
const searchVolumeCache = new Map<string, number>();

export const generateTrendDates = (months: number): SearchData[] => {
  const today = new Date();
  return Array.from({ length: months }, (_, i) => {
    const date = subMonths(today, months - 1 - i);
    return {
      date: format(date, 'MMM yyyy')
    };
  });
};

export const fetchSearchData = async (query: string): Promise<number> => {
  try {
    // Check cache first
    if (searchVolumeCache.has(query)) {
      console.log('Using cached search volume for:', query);
      return searchVolumeCache.get(query)!;
    }

    console.log('Fetching search volume for:', query);
    
    const { data, error } = await supabase.functions.invoke('fetch-search-volume', {
      body: { query }
    });

    if (error) {
      console.error('Error fetching search volume:', error);
      return 0;
    }

    const volume = data?.searchVolume ?? 0;
    console.log('Received search volume for', query, ':', volume);
    
    // Cache the result
    searchVolumeCache.set(query, volume);
    
    return volume;
  } catch (error) {
    console.error('Failed to fetch search volume:', error);
    return 0;
  }
};

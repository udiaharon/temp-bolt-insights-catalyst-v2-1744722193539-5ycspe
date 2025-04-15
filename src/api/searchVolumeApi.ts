
import { supabaseClient } from "./supabase/supabaseClient";

// Declare the cache on the window object for global access
declare global {
  interface Window {
    searchVolumeCache: { [key: string]: number[] };
  }
}

// Initialize the cache
if (typeof window !== 'undefined') {
  window.searchVolumeCache = window.searchVolumeCache || {};
}

export const clearSearchVolumeCache = () => {
  if (typeof window !== 'undefined') {
    window.searchVolumeCache = {};
    console.log('Search volume cache cleared');
  }
};

export const fetchSearchData = async (query: string) => {
  if (!query) {
    console.error('No query provided to fetchSearchData');
    return Array(24).fill(0);
  }

  // Check cache first
  if (typeof window !== 'undefined' && window.searchVolumeCache && window.searchVolumeCache[query]) {
    console.log('Using cached value for:', query);
    return window.searchVolumeCache[query];
  }

  try {
    console.log('Starting search data fetch for:', query);
    
    const { data, error } = await supabaseClient.functions.invoke<{ searchVolume: number[] }>('fetch-search-volume', { 
      query 
    });
    
    console.log('Supabase function response:', { data, error });

    if (error) {
      console.error('Supabase function error:', error);
      return Array(24).fill(0);
    }

    if (!data) {
      console.error('No data received from function');
      return Array(24).fill(0);
    }

    const volumes = data.searchVolume ?? Array(24).fill(0);
    console.log('Received search volumes:', volumes);
    
    if (typeof window !== 'undefined') {
      window.searchVolumeCache = window.searchVolumeCache || {};
      window.searchVolumeCache[query] = volumes;
    }
    return volumes;

  } catch (error) {
    console.error('Error in fetchSearchData:', error);
    return Array(24).fill(0);
  }
};

export const generateTrendDates = (monthCount: number) => {
  const today = new Date();
  return Array.from({ length: monthCount }, (_, i) => {
    const date = new Date();
    date.setMonth(today.getMonth() - (monthCount - 1) + i);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short',
        year: '2-digit'
      })
    };
  });
};

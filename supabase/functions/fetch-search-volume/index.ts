
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('Edge function loaded and initialized');

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
const CUSTOM_SEARCH_CX = Deno.env.get('CUSTOM_SEARCH_CX');

console.log('Environment check:', {
  hasApiKey: !!GOOGLE_API_KEY,
  hasCx: !!CUSTOM_SEARCH_CX
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Processing query:', query);
    
    if (!query) {
      throw new Error('Query is required');
    }

    if (!GOOGLE_API_KEY || !CUSTOM_SEARCH_CX) {
      console.error('Missing configuration:', { hasApiKey: !!GOOGLE_API_KEY, hasCx: !!CUSTOM_SEARCH_CX });
      throw new Error('Google API configuration is missing');
    }

    // Generate data points for the last 24 months
    const months = Array.from({ length: 24 }, (_, i) => i + 1);
    console.log('Processing months:', months);

    // Array to store volumes
    const volumes: number[] = [];

    // Collect raw volumes with improved search parameters
    for (const monthsAgo of months) {
      try {
        // Build the search URL with more specific parameters
        const url = new URL('https://www.googleapis.com/customsearch/v1');
        url.searchParams.append('key', GOOGLE_API_KEY);
        url.searchParams.append('cx', CUSTOM_SEARCH_CX);
        url.searchParams.append('q', query);
        url.searchParams.append('dateRestrict', `m${monthsAgo}`);
        url.searchParams.append('num', '10'); // Request max results per page
        url.searchParams.append('fields', 'searchInformation(totalResults)'); // Only request the data we need
        
        console.log('Fetching data for months ago:', monthsAgo, 'URL:', url.toString());
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error for month ${monthsAgo}:`, errorText);
          throw new Error(`API Error: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Raw API Response for month', monthsAgo, ':', data);
        
        if (!data.searchInformation?.totalResults) {
          console.error('No total results found in response for month', monthsAgo);
          volumes.push(0);
          continue;
        }
        
        const volume = parseInt(data.searchInformation.totalResults);
        console.log(`Month ${monthsAgo} volume:`, volume);
        volumes.push(volume);

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Error fetching data for month ${monthsAgo}:`, error);
        volumes.push(0);
      }
    }

    // Reverse the array so most recent data comes last
    const orderedVolumes = volumes.reverse();
    console.log('Final volumes array:', orderedVolumes);

    return new Response(
      JSON.stringify({ 
        searchVolume: orderedVolumes,
        isMock: false,
        message: 'Using raw search data',
        query: query
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        searchVolume: Array(24).fill(0),
        isMock: false,
        message: 'Error occurred, using fallback data'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

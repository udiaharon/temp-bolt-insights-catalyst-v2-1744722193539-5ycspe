
import { supabaseClient } from "./supabase/supabaseClient";

/**
 * Fetches a brand logo from Supabase Edge Function
 */
export async function fetchBrandLogo(brandName: string): Promise<string> {
  if (!brandName) {
    console.error("No brand name provided for logo fetch");
    throw new Error("Brand name is required for logo fetch");
  }

  try {
    console.log("Starting logo fetch for brand:", brandName);
    
    // Call our Edge Function to fetch the logo
    const { data, error } = await supabaseClient.functions.invoke<{ url: string; type: string }>('fetch-logo', { 
      brand: brandName.toLowerCase().trim() 
    });

    console.log("Raw Supabase response:", { data, error });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(`Failed to fetch logo: ${error.message}`);
    }

    if (!data?.url) {
      console.error("No URL in response data:", data);
      throw new Error('No logo URL in response');
    }

    // Validate that we received a proper data URL
    if (!data.url.startsWith('data:')) {
      console.error("Invalid data URL format received");
      throw new Error('Invalid logo data format received');
    }

    console.log("Successfully received logo URL:", {
      length: data.url.length,
      isDataUrl: data.url.startsWith('data:'),
      preview: data.url.substring(0, 50) + '...'
    });

    return data.url;
  } catch (error) {
    console.error("Logo fetch error:", error);
    throw error; // Let the caller handle the error
  }
}


import { supabaseClient } from "./supabase/supabaseClient";

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strengths_details: string[];
  weaknesses_details: string[];
  opportunities_details: string[];
  threats_details: string[];
}

export async function performSwotAnalysis(brand: string): Promise<SwotAnalysis> {
  try {
    console.log('Starting SWOT analysis for brand:', brand);

    const { data, error } = await supabaseClient.functions.invoke<SwotAnalysis>('swat-analysis', { 
      brand 
    });

    console.log('SWOT analysis response:', { data, error });

    if (error) {
      console.error('SWOT analysis error:', error);
      throw new Error(`SWOT analysis failed: ${error.message}`);
    }

    if (!data || !data.strengths || !data.weaknesses || !data.opportunities || !data.threats) {
      console.error('Invalid SWOT analysis data structure:', data);
      throw new Error('Invalid SWOT analysis response structure');
    }

    return data;
  } catch (error) {
    console.error('SWOT analysis error:', error);
    throw error;
  }
}

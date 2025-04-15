
import { makePerplexityRequest } from "@/api/perplexityApi";
import { generateSystemPrompt, generateUserPrompt } from "@/utils/perplexity/promptGenerators";
import { validateAnalysisStructure, extractJSONFromResponse } from "@/utils/perplexity/responseValidation";
import { MarketingC } from "@/types/analysis";

export const analysisService = {
  async analyzeBrand(brand: string, competitors: string[]): Promise<{
    consumer: any;
    cost: any;
    convenience: any;
    communication: any;
    competitive: any;
    media: any;
    product: any;
    industry: any;
    technology: any;
  }> {
    try {
      console.log(`Starting brand analysis for ${brand} with competitors:`, competitors);
      const systemPrompt = generateSystemPrompt(brand, competitors);
      const userPrompt = generateUserPrompt(brand, competitors);

      const response = await this.getPerplexityResponse(systemPrompt, userPrompt);
      console.log('Successfully received analysis response');
      
      try {
        const jsonStr = extractJSONFromResponse(response);
        console.log('Extracted JSON string length:', jsonStr.length);
        
        if (!jsonStr) {
          throw new Error('No valid JSON found in response');
        }
        
        const parsedResponse = JSON.parse(jsonStr);
        console.log('Parsed response categories:', Object.keys(parsedResponse));
        
        if (!validateAnalysisStructure(parsedResponse)) {
          console.error('Invalid analysis structure:', parsedResponse);
          throw new Error('Analysis response does not match expected structure');
        }
        
        // Make sure we have all 9Cs
        const requiredCategories = [
          'consumer', 'cost', 'convenience', 'communication', 
          'competitive', 'media', 'product', 'industry', 'technology'
        ];
        
        for (const category of requiredCategories) {
          if (!parsedResponse[category]) {
            console.error(`Missing required category: ${category}`);
            throw new Error(`Analysis response missing required category: ${category}`);
          }
        }
        
        console.log('Successfully parsed and validated JSON response with all 9Cs');
        return parsedResponse;
      } catch (error) {
        console.error('Error parsing Perplexity response:', error);
        console.error('Raw response excerpt:', response.substring(0, 200) + '...');
        throw new Error(`Failed to parse Perplexity API response: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in analyzeBrand:', error);
      throw new Error('Failed to analyze brand data: ' + (error instanceof Error ? error.message : String(error)));
    }
  },

  async getPerplexityResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      console.log('Sending request to Perplexity API with prompts:', { 
        systemPromptLength: systemPrompt.length, 
        userPromptLength: userPrompt.length 
      });
      
      const response = await makePerplexityRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);
      
      if (!response) {
        throw new Error('Empty response from Perplexity API');
      }
      
      console.log('Raw Perplexity response length:', response.length);
      return response;
    } catch (error) {
      console.error('Error getting Perplexity response:', error);
      throw new Error(`Failed to get Perplexity response: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  persistAnalysisData(brand: string, competitors: string[], marketingCs: MarketingC[]): void {
    const analysisData = {
      brand,
      competitors,
      marketingCs
    };
    localStorage.setItem('analysisData', JSON.stringify(analysisData));
  },

  getStoredAnalysisData(): { brand: string; competitors: string[]; marketingCs: MarketingC[] } | null {
    try {
      const storedData = localStorage.getItem('analysisData');
      if (storedData) {
        return JSON.parse(storedData);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving stored analysis data:', error);
      return null;
    }
  }
};

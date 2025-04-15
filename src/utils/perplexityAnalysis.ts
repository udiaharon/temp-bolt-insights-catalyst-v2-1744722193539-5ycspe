import { makePerplexityRequest } from "./perplexityApi";
import { generateSystemPrompt, generateUserPrompt } from "./perplexity/promptGenerators";
import { validateAnalysisStructure, extractJSONFromResponse } from "./perplexity/responseValidation";

async function getPerplexityResponse(systemPrompt: string, userPrompt: string): Promise<string> {
  try {
    console.log('Sending request to Perplexity API with prompts:', { systemPrompt, userPrompt });
    const response = await makePerplexityRequest([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
    
    if (!response) {
      throw new Error('Empty response from Perplexity API');
    }
    
    console.log('Raw Perplexity response:', response);
    return response;
  } catch (error) {
    console.error('Error getting Perplexity response:', error);
    throw new Error(`Failed to get Perplexity response: ${error.message}`);
  }
}

export async function analyzeBrandWithPerplexity(brand: string, competitors: string[]): Promise<{
  consumer: any;
  cost: any;
  convenience: any;
  communication: any;
  competitive: any;
  media: any;
}> {
  try {
    console.log(`Starting brand analysis for ${brand} with competitors:`, competitors);
    const systemPrompt = generateSystemPrompt(brand, competitors);
    const userPrompt = generateUserPrompt(brand, competitors);

    const response = await getPerplexityResponse(systemPrompt, userPrompt);
    console.log('Successfully received analysis response');
    
    try {
      const jsonStr = extractJSONFromResponse(response);
      console.log('Extracted JSON string:', jsonStr);
      
      if (!jsonStr) {
        throw new Error('No valid JSON found in response');
      }
      
      const parsedResponse = JSON.parse(jsonStr);
      console.log('Parsed response:', parsedResponse);
      
      if (!validateAnalysisStructure(parsedResponse)) {
        console.error('Invalid analysis structure:', parsedResponse);
        throw new Error('Analysis response does not match expected structure');
      }
      
      console.log('Successfully parsed and validated JSON response');
      return parsedResponse;
    } catch (error) {
      console.error('Error parsing Perplexity response:', error);
      console.error('Raw response:', response);
      throw new Error(`Failed to parse Perplexity API response: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in analyzeBrandWithPerplexity:', error);
    throw new Error('Failed to analyze brand data');
  }
}

import { supabaseClient } from "./supabase/supabaseClient";

interface PerplexityMessage {
  role: 'system' | 'user';
  content: string;
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Makes a request to the Perplexity API via Supabase Edge Function
 */
export async function makePerplexityRequest(
  messages: PerplexityMessage[],
  options: {
    timeoutMs?: number;
    maxRetries?: number;
    validateResponse?: boolean;
  } = {}
): Promise<string> {
  const {
    timeoutMs = 30000,
    maxRetries = 1,
    validateResponse = true
  } = options;
  
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      console.log(`Perplexity request attempt ${retryCount + 1}/${maxRetries + 1} with messages:`, messages);
      
      // Create a timeout promise that rejects after specified milliseconds
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Perplexity API request timed out after ${timeoutMs}ms`)), timeoutMs);
      });
      
      // Create the actual request promise
      const requestPromise = supabaseClient.functions.invoke<PerplexityResponse>('perplexity', { messages });
      
      // Race the request against the timeout
      const { data, error } = await Promise.race([
        requestPromise,
        timeoutPromise
      ]);

      if (error) {
        console.error('Perplexity API error:', error);
        throw new Error(`Perplexity API request failed: ${error.message}`);
      }

      // Validate the response structure
      if (validateResponse) {
        validatePerplexityResponse(data);
      }

      console.log('Successfully received response from Perplexity API');
      return data.choices[0].message.content;
    } catch (error) {
      console.error(`Error in makePerplexityRequest (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
      
      // If we've exhausted retries, throw the error
      if (retryCount >= maxRetries) {
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error('Unknown error during Perplexity API request');
        }
      }
      
      // Wait before retrying (exponential backoff)
      const backoffMs = Math.min(1000 * Math.pow(2, retryCount), 8000);
      console.log(`Retrying in ${backoffMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      
      retryCount++;
    }
  }
  
  // This should never be reached due to the throw in the catch block
  throw new Error('Unexpected error in Perplexity API request');
}

/**
 * Validates the structure of a Perplexity API response
 */
function validatePerplexityResponse(data: any): asserts data is PerplexityResponse {
  if (!data) {
    console.error('Empty response received from Perplexity API');
    throw new Error('Empty response from Perplexity API');
  }
  
  if (!data.choices || !Array.isArray(data.choices)) {
    console.error('Invalid response format: missing choices array', data);
    throw new Error('Invalid response format: missing choices array');
  }
  
  if (data.choices.length === 0) {
    console.error('Invalid response format: empty choices array', data);
    throw new Error('Invalid response format: empty choices array');
  }
  
  if (!data.choices[0].message) {
    console.error('Invalid response format: missing message in first choice', data);
    throw new Error('Invalid response format: missing message in first choice');
  }
  
  if (typeof data.choices[0].message.content !== 'string') {
    console.error('Invalid response format: message content is not a string', data);
    throw new Error('Invalid response format: message content is not a string');
  }
}

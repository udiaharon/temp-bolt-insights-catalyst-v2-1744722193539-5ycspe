
import { supabase } from "@/integrations/supabase/client";

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

// Improved cache with timestamping
const perplexityCache = new Map<string, {content: string, timestamp: number}>();

// Track ongoing requests to enable cancellation
const activeRequests = new Map<string, AbortController>();

/**
 * Makes a request to the Perplexity API via Supabase Edge Function
 * @param messages Array of system and user messages to send to Perplexity
 * @param options Additional options like timeout and retries
 * @returns Promise resolving to the text content from Perplexity
 */
export async function makePerplexityRequest(
  messages: PerplexityMessage[],
  options: {
    timeoutMs?: number;
    maxRetries?: number;
    validateResponse?: boolean;
    useCache?: boolean;
    cacheKey?: string; // Custom cache key to allow forced refreshes
    cancelPrevious?: boolean;
  } = {}
): Promise<string> {
  const {
    timeoutMs = 25000, // Reduced from 30s to 25s
    maxRetries = 0, // Reduced from 1 to 0 for faster failure
    validateResponse = true,
    useCache = true,
    cacheKey,
    cancelPrevious = true
  } = options;
  
  // Create a cache key from the messages or use provided key
  const requestKey = cacheKey || JSON.stringify(messages);
  
  // Cancel any previous requests with the same key if option is enabled
  if (cancelPrevious && activeRequests.has(requestKey)) {
    console.log(`Cancelling previous request with key: ${requestKey.substring(0, 50)}...`);
    activeRequests.get(requestKey)?.abort();
    activeRequests.delete(requestKey);
  }
  
  // Check if we have a valid cached response (less than 10 minutes old)
  if (useCache && perplexityCache.has(requestKey)) {
    const cached = perplexityCache.get(requestKey)!;
    const cacheAge = Date.now() - cached.timestamp;
    
    // Use cache if it's less than 10 minutes old
    if (cacheAge < 10 * 60 * 1000) {
      console.log('Using cached Perplexity response');
      return cached.content;
    } else {
      console.log('Cache expired, fetching fresh data');
      perplexityCache.delete(requestKey);
    }
  }
  
  // Create abort controller for this request
  const controller = new AbortController();
  activeRequests.set(requestKey, controller);
  
  let retryCount = 0;
  
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Perplexity request with key: ${requestKey.substring(0, 50)}...`);
    } else {
      console.log(`Perplexity request initiated`);
    }
    
    // Create a timeout promise that rejects after specified milliseconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Perplexity API request timed out after ${timeoutMs}ms`)), timeoutMs);
    });
    
    // Create the actual request promise
    const requestPromise = supabase.functions.invoke('perplexity', {
      body: { messages }
    });
    
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
    const responseContent = data.choices[0].message.content;
    
    // Cache the response if caching is enabled
    if (useCache) {
      perplexityCache.set(requestKey, {
        content: responseContent,
        timestamp: Date.now()
      });
    }
    
    // Clean up - remove this request from active requests
    activeRequests.delete(requestKey);
    
    return responseContent;
  } catch (error) {
    console.error(`Error in makePerplexityRequest:`, error);
    
    // Clean up - remove this request from active requests
    activeRequests.delete(requestKey);
    
    // If the error is a DOMException with name AbortError, it was intentionally cancelled
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }
    
    throw error;
  }
}

/**
 * Validates the structure of a Perplexity API response
 * @param data Response data to validate
 * @throws Error if validation fails
 */
function validatePerplexityResponse(data: any): asserts data is PerplexityResponse {
  // Quick validation with minimal checks for speed
  if (!data?.choices?.[0]?.message?.content) {
    throw new Error('Invalid response format from Perplexity API');
  }
}

/**
 * Cancels all active Perplexity API requests
 */
export function cancelAllPerplexityRequests(): void {
  const count = activeRequests.size;
  if (count > 0) {
    console.log(`Cancelling ${count} active Perplexity requests`);
    activeRequests.forEach(controller => controller.abort());
    activeRequests.clear();
  }
}

/**
 * Clears the Perplexity API cache
 */
export function clearPerplexityCache(): void {
  perplexityCache.clear();
  console.log('Perplexity API cache cleared');
}


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

const TIMEOUT_MS = 30000; // 30 second timeout

serve(async (req) => {
  console.log("=========== NEW REQUEST ===========");
  console.log("Request method:", req.method);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error(`HTTP method ${req.method} is not allowed`);
    }

    // Get the API key first
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    if (!PERPLEXITY_API_KEY) {
      console.error('Missing Perplexity API key in environment variables');
      throw new Error('Server configuration error: Missing API key');
    }

    // Safely parse the request body
    let messages;
    try {
      const body = await req.text();
      console.log('Raw request body:', body);
      
      if (!body) {
        throw new Error('Empty request body');
      }
      
      const parsedBody = JSON.parse(body);
      messages = parsedBody.messages;
      
      if (!messages || !Array.isArray(messages)) {
        throw new Error('Invalid messages format: messages must be an array');
      }

      console.log('Parsed messages:', messages);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(JSON.stringify({
        error: 'Invalid request format',
        details: parseError.message
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Making request to Perplexity API with messages:', messages);

    // Create an AbortController for the timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: messages,
          temperature: 0.2,
          max_tokens: 4000,
          top_p: 0.9,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!perplexityResponse.ok) {
        const errorText = await perplexityResponse.text();
        console.error('Perplexity API error response:', errorText);
        throw new Error(`Perplexity API error: ${perplexityResponse.status} ${perplexityResponse.statusText}\n${errorText}`);
      }

      const data = await perplexityResponse.json();
      console.log('Successfully received response from Perplexity API');
      
      // Validate the response structure
      if (!data || !data.choices || !data.choices[0]?.message?.content) {
        console.error('Invalid response format from Perplexity:', data);
        throw new Error('Invalid response format from Perplexity API');
      }

      return new Response(JSON.stringify({
        choices: [{
          message: {
            content: data.choices[0].message.content
          }
        }]
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 30 seconds');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in Perplexity function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});

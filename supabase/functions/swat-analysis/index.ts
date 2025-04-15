
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
}

const extractJSONFromText = (text: string): string => {
  // First try to parse the text directly
  try {
    JSON.parse(text);
    return text;
  } catch (e) {
    // Remove markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      return jsonMatch[1].trim();
    }
    
    // Try to find JSON object between curly braces
    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      return braceMatch[0].trim();
    }
    
    throw new Error('No valid JSON found in response');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const { brand } = await req.json()
    
    if (!brand || typeof brand !== 'string') {
      throw new Error('Brand name is required and must be a string')
    }

    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY')
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Missing Perplexity API key')
    }

    console.log('Making request to Perplexity API for brand:', brand)

    const systemPrompt = `You are a business analyst performing a SWOT analysis for ${brand}. 
    Format your response EXACTLY as a valid JSON object with these keys: 
    - strengths
    - weaknesses
    - opportunities
    - threats
    - strengths_details
    - weaknesses_details
    - opportunities_details
    - threats_details
    
    Each of strengths, weaknesses, opportunities, threats must contain an array of exactly 6 concise strings (max 100 characters).
    Each corresponding _details array must contain exactly 6 comprehensive analysis strings (400-600 characters) that explain the corresponding point in depth.
    Make sure to always return exactly 6 items for EACH array.
    
    DO NOT use any markdown formatting or code blocks in your response. Return ONLY the raw JSON object.`

    const userPrompt = `Provide a detailed SWOT analysis for ${brand} as a JSON object with exactly 6 points and comprehensive detailed explanations for each category. Focus on providing specific, data-driven insights with real examples and metrics where possible. Ensure all responses are plain text strings. Remember, EVERY array MUST contain exactly 6 items.`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000)

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1,
          max_tokens: 4000,
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Perplexity API error:', errorText)
        throw new Error('Failed to get analysis from Perplexity')
      }

      const data = await response.json()
      console.log('Perplexity raw response:', data)
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response structure from Perplexity')
      }

      const analysisText = data.choices[0].message.content.trim()
      console.log('Raw analysis text:', analysisText)
      
      // Extract and clean JSON from the response
      const cleanedAnalysisText = extractJSONFromText(analysisText)
      console.log('Cleaned analysis text:', cleanedAnalysisText)
      
      let analysis = JSON.parse(cleanedAnalysisText)

      const requiredKeys = [
        'strengths', 'weaknesses', 'opportunities', 'threats',
        'strengths_details', 'weaknesses_details', 'opportunities_details', 'threats_details'
      ]
      
      // Validate and pad arrays if necessary
      requiredKeys.forEach(key => {
        if (!analysis[key]) {
          analysis[key] = []
        }
        
        if (!Array.isArray(analysis[key])) {
          throw new Error(`${key} must be an array`)
        }

        // Convert any non-string items to strings
        analysis[key] = analysis[key].map((item: any) => String(item).trim())

        // Pad or truncate array to exactly 6 items
        while (analysis[key].length < 6) {
          if (key.includes('_details')) {
            analysis[key].push('Additional analysis will be provided upon further research.')
          } else {
            analysis[key].push('Additional point to be analyzed')
          }
        }
        
        if (analysis[key].length > 6) {
          analysis[key] = analysis[key].slice(0, 6)
        }

        // Validate that all items are strings
        if (!analysis[key].every((item: any) => typeof item === 'string')) {
          throw new Error(`${key} must contain only strings`)
        }
      })

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { error: insertError } = await supabaseClient
        .from('swat_analyses')
        .insert({
          brand_name: brand,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          opportunities: analysis.opportunities,
          threats: analysis.threats,
          strengths_details: analysis.strengths_details,
          weaknesses_details: analysis.weaknesses_details,
          opportunities_details: analysis.opportunities_details,
          threats_details: analysis.threats_details
        })

      if (insertError) {
        console.error('Database insertion error:', insertError)
        throw new Error('Failed to store analysis')
      }

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } finally {
      clearTimeout(timeoutId)
    }

  } catch (error) {
    console.error('Error in SWOT analysis:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

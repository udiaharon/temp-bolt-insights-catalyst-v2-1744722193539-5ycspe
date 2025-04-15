
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Edge function loaded and ready");

serve(async (req) => {
  console.log("=========== NEW REQUEST ===========");
  console.log("Request method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));
  
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestBody = await req.text();
    console.log("Raw request body:", requestBody);

    let brand;
    try {
      const body = JSON.parse(requestBody);
      brand = body.brand;
      console.log("Successfully parsed brand name:", brand);
    } catch (e) {
      console.error("Failed to parse request body:", e);
      throw new Error(`Invalid request body: ${e.message}`);
    }

    if (!brand) {
      console.error("No brand name provided");
      throw new Error('Brand name is required');
    }

    console.log(`Attempting to fetch logo for brand: ${brand}`);
    
    // Clean and format the brand name for domain construction
    // Remove special characters and extra spaces, then join with hyphens
    const cleanBrand = brand
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    
    console.log("Cleaned brand name for domain:", cleanBrand);
    
    // Try different domain variations with common TLDs
    const domains = [
      `${cleanBrand}.com`,
      `${cleanBrand}.global`,
      `${cleanBrand}-global.com`,
      `${cleanBrand}-motors.com`,
      `${cleanBrand}-motor.com`,
      `${cleanBrand}motor.com`,
      `${cleanBrand}motors.com`,
      `${cleanBrand}usa.com`,
      `${cleanBrand}-usa.com`,
      `${cleanBrand}-worldwide.com`,
      `${cleanBrand}.co.jp`, // For Japanese companies
      `www.${cleanBrand}.com`
    ];

    console.log("Will try domains:", domains);

    let logoResponse = null;
    let lastError = null;

    // Try to fetch logo from each domain until we find one that works
    for (const domain of domains) {
      const encodedDomain = encodeURIComponent(domain);
      const url = `https://logo.clearbit.com/${encodedDomain}`;
      console.log(`Attempting fetch from: ${url}`);
      
      try {
        const response = await fetch(url);
        console.log(`Response status for ${url}:`, response.status);
        
        if (response.ok) {
          // Validate content type to ensure it's an image
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.startsWith('image/')) {
            console.log(`Successfully fetched from: ${url}`);
            logoResponse = response;
            break;
          } else {
            console.log(`Invalid content type (${contentType}) from ${url}, skipping`);
            continue;
          }
        }

        // If we haven't found a logo yet, try Google favicon as fallback
        if (!logoResponse) {
          const googleUrl = `https://www.google.com/s2/favicons?domain=${encodedDomain}&sz=128`;
          console.log(`Trying Google favicon fallback: ${googleUrl}`);
          
          const googleResponse = await fetch(googleUrl);
          if (googleResponse.ok) {
            const googleContentType = googleResponse.headers.get('content-type');
            if (googleContentType && googleContentType.startsWith('image/')) {
              console.log(`Successfully fetched Google favicon for: ${domain}`);
              logoResponse = googleResponse;
              break;
            }
          }
        }
      } catch (e) {
        lastError = `Fetch error for ${domain}: ${e.message}`;
        console.error(`Error fetching from ${domain}:`, e);
      }
    }

    if (!logoResponse) {
      console.error("Failed to fetch logo from all URLs. Last error:", lastError);
      throw new Error(lastError || 'Failed to fetch logo from all attempted URLs');
    }

    // Process the successful response
    const contentType = logoResponse.headers.get('content-type') || 'image/png';
    console.log("Logo content type:", contentType);

    const imageBuffer = await logoResponse.arrayBuffer();
    console.log("Received image buffer of size:", imageBuffer.byteLength);

    const base64 = base64Encode(new Uint8Array(imageBuffer));
    console.log("Successfully encoded image to base64");

    const dataUrl = `data:${contentType};base64,${base64}`;
    console.log("Generated data URL of length:", dataUrl.length);

    return new Response(
      JSON.stringify({ 
        url: dataUrl,
        type: contentType
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});

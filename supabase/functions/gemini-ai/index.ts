
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || "AIzaSyCR_6tqAUeI4vs5rAd5irRYPqK_0-pPudI";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to extract JSON from Gemini response
const extractJsonFromText = (text) => {
  // Try to find JSON content within backticks, braces, or plaintext
  let jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch) return jsonMatch[1];
  
  // Try to find JSON between curly braces if no backticks found
  jsonMatch = text.match(/(\{[\s\S]*\})/);
  if (jsonMatch) return jsonMatch[1];
  
  return text; // Return original text if no pattern matched
};

// Function to clean up Gemini responses
const cleanupResponse = (text) => {
  // For recipe requests, try to extract valid JSON
  if (text.includes("title") && text.includes("ingredients")) {
    const jsonText = extractJsonFromText(text);
    try {
      // Try to parse as JSON
      const jsonObj = JSON.parse(jsonText);
      return JSON.stringify(jsonObj);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      // Return cleaned text instead
    }
  }
  
  // Regular text cleanup for non-JSON responses
  let cleaned = text.replace(/\*\*([^*]+)\*\*/g, '$1'); 
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/#{1,6}\s+([^\n]+)/g, '$1');
  cleaned = cleaned.replace(/^\s*[-*•]\s+/gm, '• ');
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  return cleaned.trim();
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type } = await req.json();
    
    let finalPrompt = prompt;
    
    // Add context based on query type
    if (type === 'fitness') {
      finalPrompt = `Generate a personalized fitness recommendation based on this query: ${prompt}. Focus on workout routines, exercise techniques, and training advice. Provide a concise, practical response.`;
    } else if (type === 'nutrition') {
      finalPrompt = `Generate a personalized nutrition recommendation based on this query: ${prompt}. Focus on diet plans, meal suggestions, and nutritional advice. Provide a concise, practical response.`;
    } else if (type === 'mindfulness') {
      finalPrompt = `Generate a personalized mindfulness or yoga recommendation based on this query: ${prompt}. Focus on meditation techniques, yoga poses, breathing exercises, or mental wellness. Provide a concise, practical response.`;
    }
    
    console.log("Sending prompt to Gemini:", finalPrompt);
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: finalPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4, // Lower temperature for more structured responses
          maxOutputTokens: 800, // Increased token limit for recipes
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Failed to get response from Gemini API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Gemini API response:", data);
    
    let recommendationText = 'Unable to generate recommendation.';
    
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] && 
        data.candidates[0].content.parts[0].text) {
      // Clean and format the recommendation text
      recommendationText = cleanupResponse(data.candidates[0].content.parts[0].text);
    }
    
    return new Response(JSON.stringify({ recommendation: recommendationText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in gemini-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

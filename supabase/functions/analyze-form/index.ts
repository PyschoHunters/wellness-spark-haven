
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || "AIzaSyCR_6tqAUeI4vs5rAd5irRYPqK_0-pPudI";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      console.error('Missing image data in request');
      return new Response(
        JSON.stringify({ error: 'Missing image data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Sending request to Gemini API...');
    
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
                text: "You are an expert fitness trainer specialized in analyzing workout form. Provide detailed, constructive feedback on exercise form from images/videos. Focus on form improvements, safety concerns, and practical tips to enhance performance. Your feedback should be organized in clear sections with bullet points where appropriate. BE GENEROUS with your analysis - if the image is low quality or unclear, make reasonable assumptions and provide general advice that would be helpful for most people doing that exercise. NEVER refuse to analyze an image due to quality issues."
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: image.split(',')[1] // Remove the data:image/jpeg;base64, part
                }
              },
              {
                text: "Please analyze this workout form and provide specific feedback on: 1. Overall form quality 2. Key areas for improvement 3. Safety concerns if any 4. Tips for better form. Be thorough but concise. If the image is not perfectly clear, make your best assessment and provide general guidance."
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        }
      }),
    });

    const responseText = await response.text();
    console.log('Raw Gemini API response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse Gemini response as JSON:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid response format from AI service', details: responseText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!response.ok) {
      console.error('Gemini API error:', response.status, data);
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${response.status}`, details: data?.error?.message || 'Unknown error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }
    
    // Extract the feedback from Gemini response
    let feedback = '';
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] && 
        data.candidates[0].content.parts[0].text) {
      feedback = data.candidates[0].content.parts[0].text;
      console.log('Analysis complete, returning feedback');
    } else {
      console.error('Unexpected response format from Gemini:', data);
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI service' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ feedback }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-form function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze form', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

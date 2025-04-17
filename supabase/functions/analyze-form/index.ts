
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = "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";

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

    console.log('Sending request to OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert fitness trainer specialized in analyzing workout form. Provide detailed, constructive feedback on exercise form from images/videos. Focus on form improvements, safety concerns, and practical tips to enhance performance. Your feedback should be organized in clear sections with bullet points where appropriate.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              },
              {
                type: 'text',
                text: 'Please analyze this workout form and provide specific feedback on: 1. Overall form quality 2. Key areas for improvement 3. Safety concerns if any 4. Tips for better form. Be thorough but concise.'
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${response.status}`, details: errorText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }

    const data = await response.json();
    console.log('OpenAI API response received successfully');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Unexpected response format from OpenAI:', data);
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI service' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const feedback = data.choices[0].message.content;

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


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
            content: 'You are an expert fitness trainer specialized in analyzing workout form. Provide detailed, constructive feedback on exercise form from images/videos.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'image',
                image_url: image
              },
              {
                type: 'text',
                text: 'Please analyze this workout form and provide specific feedback on: 1. Overall form quality 2. Key areas for improvement 3. Safety concerns if any 4. Tips for better form'
              }
            ]
          }
        ]
      }),
    });

    const data = await response.json();
    const feedback = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ feedback }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze form' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

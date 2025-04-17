
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, exerciseType } = await req.json();
    
    if (!imageBase64 || !exerciseType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: imageBase64 and exerciseType' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // We'll use OpenAI's vision capabilities to analyze the form
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert fitness trainer specialized in analyzing exercise form. 
            Provide detailed feedback on the user's form for the exercise they are performing.
            Focus on:
            1. Posture and alignment
            2. Potential issues and corrections
            3. Form rating on a scale of 1-10
            4. One tip for improvement
            Keep your total response under 200 words and format it clearly.`
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: `Please analyze my form for this ${exerciseType} exercise and provide feedback:` },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          }
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Error analyzing image', details: errorData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    // Extract the numeric rating from the analysis
    const ratingMatch = analysis.match(/(?:rating|score|rated).*?(\d+(?:\.\d+)?)\s*(?:\/|\s*out\s*of\s*)10/i);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    
    // Generate form improvement tips
    const formTips = getExerciseFormTips(exerciseType);
    
    return new Response(
      JSON.stringify({ 
        analysis, 
        rating,
        exerciseType,
        formTips,
        // Add a timestamp to store with the analysis
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in pose-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Helper function to provide exercise-specific form tips
function getExerciseFormTips(exerciseType: string): string[] {
  const tips: Record<string, string[]> = {
    'squat': [
      'Keep your chest up and back straight',
      'Push your knees outward in line with your toes',
      'Maintain weight in your heels',
      'Go as low as mobility allows while keeping good form',
      'Engage your core throughout the movement'
    ],
    'pushup': [
      'Keep your body in a straight line from head to heels',
      'Position hands slightly wider than shoulder-width',
      'Lower your chest to the ground, not just your head',
      'Keep elbows at about a 45-degree angle to your body',
      'Engage your core to prevent sagging hips'
    ],
    'deadlift': [
      'Start with the bar over mid-foot',
      'Maintain a neutral spine throughout the movement',
      'Push through your heels as you lift',
      'Keep the bar close to your body',
      'Engage your lats to protect your lower back'
    ],
    'plank': [
      'Keep your body in a straight line from head to heels',
      'Engage your core and glutes',
      'Keep your head in a neutral position (don\'t look up)',
      'Don\'t let your hips sag or pike up',
      'Breathe normally throughout the hold'
    ],
    'lunge': [
      'Step forward far enough that your knee stays above your ankle',
      'Keep your torso upright',
      'Lower your back knee toward the ground',
      'Push through the heel of your front foot to return to standing',
      'Keep your front knee tracking over your second toe'
    ]
  };
  
  // Return tips for the specific exercise, or generic tips if not found
  return tips[exerciseType.toLowerCase()] || [
    'Maintain proper breathing throughout the exercise',
    'Focus on controlled movements rather than speed',
    'Ensure proper joint alignment for your specific exercise',
    'Start with lighter weights to perfect form before increasing load',
    'Consider working with a personal trainer to refine your technique'
  ];
}

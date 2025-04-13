
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID') || "TEST_KEY_ID";
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') || "TEST_KEY_SECRET";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || "";
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || "";

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { amount, userId, currency = "INR", description = "Fitness membership" } = await req.json();
    
    // Create order with Razorpay
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`
      },
      body: JSON.stringify({
        amount: amount * 100, // Amount in paise
        currency: currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          description: description,
          user_id: userId
        }
      })
    });
    
    if (!orderResponse.ok) {
      throw new Error(`Failed to create Razorpay order: ${orderResponse.status}`);
    }
    
    const orderData = await orderResponse.json();
    console.log("Razorpay order created:", orderData);
    
    // Record the payment in database with pending status
    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        amount: amount,
        currency: currency,
        status: 'pending',
        order_id: orderData.id
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error recording payment:", error);
      throw new Error(`Failed to record payment: ${error.message}`);
    }
    
    return new Response(JSON.stringify({
      key_id: RAZORPAY_KEY_ID,
      order_id: orderData.id,
      amount: amount * 100,
      currency: currency,
      payment_record_id: data.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in razorpay function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

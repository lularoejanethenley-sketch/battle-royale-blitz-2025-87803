import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  last4Digits: string;
  action: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { last4Digits, action }: RequestBody = await req.json();

    console.log('Received request:', { last4Digits, action });

    // Validate input
    if (!last4Digits || last4Digits.length !== 4) {
      return new Response(
        JSON.stringify({ error: 'Invalid last 4 digits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Action is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find card by last 4 digits
    const { data: cards, error: cardError } = await supabase
      .from('battle_cards')
      .select('id, card_number, mid, status')
      .ilike('card_number', `%${last4Digits}`)
      .limit(1);

    if (cardError) {
      console.error('Database error:', cardError);
      throw cardError;
    }

    if (!cards || cards.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Card not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const card = cards[0];
    const mid = card.mid || 'N/A';

    console.log('Found card:', { mid, status: card.status });

    // Save service request to database
    const { data: serviceRequest, error: insertError } = await supabase
      .from('card_service_requests')
      .insert({
        card_id: card.id,
        mid: mid,
        last_4_digits: last4Digits,
        action: action,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save service request');
    }

    console.log('Service request saved successfully:', serviceRequest);

    return new Response(
      JSON.stringify({ 
        success: true, 
        mid,
        requestId: serviceRequest.id,
        message: 'Service request saved successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in send-discord-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

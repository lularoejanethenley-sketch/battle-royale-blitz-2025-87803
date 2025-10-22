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

    // Send to Discord webhook
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1351700188577923195/YGQkERD6R-bvLNqFoRqcCkQK50VdwcIK2ogCte5QGRYNqgxrMMFlV9RucsYo-5B_VLCe';
    
    const discordPayload = {
      embeds: [{
        title: '📋 Card Service Request',
        color: 0x5865F2,
        fields: [
          {
            name: 'M.I.D',
            value: mid,
            inline: true
          },
          {
            name: 'Last 4 Digits',
            value: last4Digits,
            inline: true
          },
          {
            name: 'Action',
            value: action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            inline: false
          },
          {
            name: 'Card Status',
            value: card.status,
            inline: true
          },
          {
            name: 'Timestamp',
            value: new Date().toISOString(),
            inline: true
          }
        ]
      }]
    };

    const discordResponse = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      const discordError = await discordResponse.text();
      console.error('Discord webhook error:', discordError);
      throw new Error('Failed to send Discord notification');
    }

    console.log('Discord notification sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        mid,
        message: 'Request submitted successfully' 
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

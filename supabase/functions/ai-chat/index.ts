import { createClient } from 'jsr:@supabase/supabase-js@2';
import { OpenAI } from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
});

const systemPrompt = `You are V.I.R.T.U.E. (Virtual Intelligence for Resource and Technical Understanding Enhancement), 
a cyberpunk AI assistant for the Innovare Technical Club's web platform. Your responses should:
1. Be concise and direct, using cyberpunk terminology
2. Help users navigate the platform and understand its features
3. Maintain a futuristic, tech-savvy personality
4. Use terms like "neural link", "datastream", "netrunner", etc.
5. Keep responses under 100 words for optimal interface display`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Failed to get user information');
    }

    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    const { error: dbError } = await supabaseClient
      .from('ai_chat_history')
      .insert({
        user_id: user.id,
        message,
        response: aiResponse
      });

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ message, response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

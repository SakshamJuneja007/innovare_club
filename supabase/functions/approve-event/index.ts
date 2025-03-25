import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify moderator/admin status
    const authHeader = req.headers.get('authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) throw new Error('Failed to get user information');

    // Check moderator status
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || (!userProfile?.is_admin && userProfile?.role !== 'moderator')) {
      throw new Error('Unauthorized - Moderator access required');
    }

    // Get request body
    const { eventId, approved, notes } = await req.json();
    if (!eventId) throw new Error('Missing event ID');

    // Update event status
    const { error: moderationError } = await supabaseClient
      .from('content_moderation')
      .update({
        status: approved ? 'approved' : 'rejected',
        moderator_id: user.id,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('content_id', eventId)
      .eq('content_type', 'event');

    if (moderationError) throw moderationError;

    // Log moderation action
    await supabaseClient.from('admin_logs').insert({
      admin_id: user.id,
      action: approved ? 'approve_event' : 'reject_event',
      target_type: 'event',
      target_id: eventId,
      details: { notes }
    });

    return new Response(
      JSON.stringify({ 
        status: 'success',
        message: `Event ${approved ? 'approved' : 'rejected'} successfully`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message.includes('Unauthorized') ? 403 : 500
      }
    );
  }
});

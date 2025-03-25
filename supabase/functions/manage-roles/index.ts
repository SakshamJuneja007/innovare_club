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

    // Verify admin status
    const authHeader = req.headers.get('authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) throw new Error('Failed to get user information');

    // Verify admin status
    const { data: adminCheck, error: adminError } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (adminError || !adminCheck?.is_admin) {
      throw new Error('Unauthorized - Admin access required');
    }

    // Get request body
    const { userId, role, permissions } = await req.json();
    if (!userId || !role) throw new Error('Missing required fields');

    // Update user role
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        role,
        permissions: permissions || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Log admin action
    await supabaseClient.from('admin_logs').insert({
      admin_id: user.id,
      action: 'update_role',
      target_type: 'user',
      target_id: userId,
      details: { role, permissions }
    });

    return new Response(
      JSON.stringify({ 
        status: 'success',
        message: 'Role updated successfully'
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

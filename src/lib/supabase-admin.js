import { createClient } from '@supabase/supabase-js';

// Server-only admin client. Uses the service-role key — NEVER import this
// into a client component. Only use inside route handlers under src/app/api.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = (url && serviceKey)
  ? createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

// Resolve the caller's profile from a Bearer access token (sent by the client).
export async function getCallerProfile(accessToken) {
  if (!supabaseAdmin || !accessToken) return null;
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user) return null;
  const { data: profile } = await supabaseAdmin
    .from('user_profiles').select('*').eq('id', user.id).single();
  return profile;
}

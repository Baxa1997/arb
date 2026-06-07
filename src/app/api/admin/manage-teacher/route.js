import { NextResponse } from 'next/server';
import { supabaseAdmin, getCallerProfile } from '@/lib/supabase-admin';

const BAN_FOREVER = '876000h'; // ~100 years

// POST /api/admin/manage-teacher  { id, action: 'deactivate'|'activate'|'delete' }
// Only a super_admin may manage teacher accounts.
export async function POST(req) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const caller = await getCallerProfile(token);
  if (!caller || caller.role !== 'super_admin') {
    return NextResponse.json({ error: 'Faqat super-admin amal bajara oladi' }, { status: 403 });
  }

  const { id, action } = await req.json();
  if (!id || !action) {
    return NextResponse.json({ error: 'id va action majburiy' }, { status: 400 });
  }

  // Guard: only act on actual teacher accounts.
  const { data: target } = await supabaseAdmin
    .from('user_profiles').select('id, role').eq('id', id).single();
  if (!target || target.role !== 'teacher') {
    return NextResponse.json({ error: "O'qituvchi topilmadi" }, { status: 404 });
  }

  if (action === 'delete') {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (action === 'deactivate' || action === 'activate') {
    const active = action === 'activate';
    const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(id, {
      ban_duration: active ? 'none' : BAN_FOREVER,
    });
    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 });
    const { error: profErr } = await supabaseAdmin
      .from('user_profiles').update({ is_active: active }).eq('id', id);
    if (profErr) return NextResponse.json({ error: profErr.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Notog\'ri action' }, { status: 400 });
}

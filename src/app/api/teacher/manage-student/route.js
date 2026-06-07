import { NextResponse } from 'next/server';
import { supabaseAdmin, getCallerProfile } from '@/lib/supabase-admin';

const BAN_FOREVER = '876000h'; // ~100 years

// POST /api/teacher/manage-student  { id, action: 'deactivate'|'activate'|'delete' }
// A teacher may only manage students bound to them (teacher_id = caller.id).
export async function POST(req) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const caller = await getCallerProfile(token);
  if (!caller || caller.role !== 'teacher') {
    return NextResponse.json({ error: 'Faqat o\'qituvchi amal bajara oladi' }, { status: 403 });
  }

  const { id, action } = await req.json();
  if (!id || !action) {
    return NextResponse.json({ error: 'id va action majburiy' }, { status: 400 });
  }

  // Guard: target must be a student owned by this teacher.
  const { data: target } = await supabaseAdmin
    .from('user_profiles').select('id, role, teacher_id').eq('id', id).single();
  if (!target || target.role !== 'student' || target.teacher_id !== caller.id) {
    return NextResponse.json({ error: 'Bu talaba sizga tegishli emas' }, { status: 403 });
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

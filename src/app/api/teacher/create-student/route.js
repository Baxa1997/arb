import { NextResponse } from 'next/server';
import { supabaseAdmin, getCallerProfile } from '@/lib/supabase-admin';

// POST /api/teacher/create-student
// Only a teacher may create a student; the student is bound to that teacher.
export async function POST(req) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const caller = await getCallerProfile(token);
  if (!caller || caller.role !== 'teacher') {
    return NextResponse.json({ error: 'Faqat o\'qituvchi talaba qo\'sha oladi' }, { status: 403 });
  }

  const { email, password, full_name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email va parol majburiy' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'student',
      full_name,
      teacher_id: caller.id,
      created_by: caller.id,
    },
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: { id: data.user.id, email, full_name, role: 'student' } });
}

import { supabase } from './supabase-client';

// In demo mode (no Supabase env vars) `supabase` is null. Reads return safe
// empty defaults so pages render; writes throw a friendly message.
const DEMO_MSG = "Bu amal faqat Supabase ulanganida ishlaydi (hozir demo rejim).";
const hasDb = () => !!supabase;

/* ─── Auth helper ─────────────────────────── */
async function getAccessToken() {
  if (!hasDb()) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/* ─── Profiles / users ────────────────────── */
export const profileQueries = {
  async listTeachers() {
    if (!hasDb()) return [];
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'teacher')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  async listStudents(teacherId) {
    if (!hasDb()) return [];
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'student')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  async getStudent(id) {
    if (!hasDb()) return null;
    const { data, error } = await supabase
      .from('user_profiles').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async counts() {
    if (!hasDb()) return { teachers: 0, students: 0 };
    const [{ count: teachers }, { count: students }] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    ]);
    return { teachers: teachers ?? 0, students: students ?? 0 };
  },
  // Calls the secure server route (service-role) to create an auth user.
  async createTeacher(payload) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const token = await getAccessToken();
    const res = await fetch('/api/admin/create-teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Xatolik');
    return json.user;
  },
  async createStudent(payload) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const token = await getAccessToken();
    const res = await fetch('/api/teacher/create-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Xatolik');
    return json.user;
  },
  // action: 'deactivate' | 'activate' | 'delete'
  async manageTeacher(id, action) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const token = await getAccessToken();
    const res = await fetch('/api/admin/manage-teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, action }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Xatolik');
    return json;
  },
  async manageStudent(id, action) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const token = await getAccessToken();
    const res = await fetch('/api/teacher/manage-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, action }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Xatolik');
    return json;
  },
};

/* ─── Letter content (admin-editable) ──────── */
// Normalize common YouTube URLs to an embeddable form.
export function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    return url; // assume already an embed/iframe-friendly URL
  } catch {
    return url;
  }
}

export const letterContentQueries = {
  async getAll() {
    if (!hasDb()) return {};
    const { data, error } = await supabase.from('letter_content').select('*');
    if (error) throw error;
    const map = {};
    (data ?? []).forEach(r => { map[r.letter_id] = r; });
    return map;
  },
  async getOne(letterId) {
    if (!hasDb()) return null;
    const { data, error } = await supabase
      .from('letter_content').select('*').eq('letter_id', letterId).maybeSingle();
    if (error) throw error;
    return data;
  },
  async upsert(letterId, fields) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('letter_content')
      .upsert({ letter_id: letterId, ...fields, updated_at: new Date().toISOString(), updated_by: user?.id }, { onConflict: 'letter_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // Super-admin uploads a pronunciation recording for a letter -> public URL.
  async uploadAudio(letterId, file) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const ext = file.name?.split('.').pop()?.toLowerCase() || 'mp3';
    const path = `letter-${letterId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('lesson-audio').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('lesson-audio').getPublicUrl(path);
    return data.publicUrl;
  },
};

/* ─── Student progress (letter unlock) ─────── */
export const progressQueries = {
  async getStudentProgress(studentId) {
    if (!hasDb()) return [];
    const { data, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', studentId)
      .order('letter_id', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
  // Returns a map { [letter_id]: status }
  async getProgressMap(studentId) {
    const rows = await this.getStudentProgress(studentId);
    const map = {};
    rows.forEach(r => { map[r.letter_id] = r.status; });
    return map;
  },
  // Teacher marks the student's current letter done -> unlocks next (RPC).
  async markLetterDone(studentId, letterId) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const { error } = await supabase.rpc('mark_letter_done', {
      p_student: studentId,
      p_letter: letterId,
    });
    if (error) throw error;
  },
};

/* ─── Homework ─────────────────────────────── */
export const homeworkQueries = {
  async getStudentHomework(studentId) {
    if (!hasDb()) return [];
    const { data, error } = await supabase
      .from('homework')
      .select('*, homework_submissions(*)')
      .eq('student_id', studentId)
      .order('due_date', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
  async getTeacherHomework(teacherId) {
    if (!hasDb()) return [];
    const { data, error } = await supabase
      .from('homework')
      .select('*, student:student_id(full_name,email), homework_submissions(*)')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  async getHomework(id) {
    if (!hasDb()) return null;
    const { data, error } = await supabase
      .from('homework')
      .select('*, homework_submissions(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  async createHomework(payload) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const { data, error } = await supabase
      .from('homework')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // Student opens homework -> create/find an in-progress submission (records started_at).
  async startSubmission(homeworkId, studentId) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const { data: existing } = await supabase
      .from('homework_submissions')
      .select('*')
      .eq('homework_id', homeworkId)
      .eq('student_id', studentId)
      .maybeSingle();
    if (existing) return existing;
    const { data, error } = await supabase
      .from('homework_submissions')
      .insert([{ homework_id: homeworkId, student_id: studentId, started_at: new Date().toISOString(), status: 'in_progress' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // Student submits work with the elapsed time.
  async submitHomework(submissionId, { content_text, file_url, audio_url, time_spent_seconds }) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const { data, error } = await supabase
      .from('homework_submissions')
      .update({
        content_text, file_url, audio_url, time_spent_seconds,
        submitted_at: new Date().toISOString(),
        status: 'submitted',
      })
      .eq('id', submissionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async gradeSubmission(submissionId, grade, feedback) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const { data, error } = await supabase
      .from('homework_submissions')
      .update({ teacher_grade: grade, teacher_feedback: feedback, status: 'graded', graded_at: new Date().toISOString() })
      .eq('id', submissionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // Upload a homework file (image/audio) to its bucket; returns public URL.
  async uploadFile(bucket, studentId, file) {
    if (!hasDb()) throw new Error(DEMO_MSG);
    const ext = file.name?.split('.').pop() || (bucket === 'homework-audio' ? 'webm' : 'png');
    const path = `${studentId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },
};

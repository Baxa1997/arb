import { supabase } from './supabase-client';

/* ─── Classes ─────────────────────────────── */
export const classQueries = {
  async getTeacherClasses(teacherId) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  async createClass(payload) {
    const { data, error } = await supabase
      .from('classes')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteClass(id) {
    const { error } = await supabase.from('classes').delete().eq('id', id);
    if (error) throw error;
  },
};

/* ─── Lessons ─────────────────────────────── */
export const lessonQueries = {
  async getClassLessons(classId) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  async createLesson(payload) {
    const { data, error } = await supabase
      .from('lessons')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async updateLesson(id, updates) {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteLesson(id) {
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) throw error;
  },
};

/* ─── Progress ─────────────────────────────── */
export const progressQueries = {
  async startSession(lessonId, studentId, classId) {
    const { data, error } = await supabase
      .from('lesson_sessions')
      .insert([{ lesson_id: lessonId, student_id: studentId, class_id: classId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async completeSession(sessionId, score) {
    const { data, error } = await supabase
      .from('lesson_sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString(), score })
      .eq('id', sessionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

/* ─── Homework ─────────────────────────────── */
export const homeworkQueries = {
  async getClassHomework(classId) {
    const { data, error } = await supabase
      .from('homework')
      .select('*')
      .eq('class_id', classId)
      .order('due_date', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
  async createHomework(payload) {
    const { data, error } = await supabase
      .from('homework')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async gradeSubmission(submissionId, grade, feedback) {
    const { data, error } = await supabase
      .from('homework_submissions')
      .update({ teacher_grade: grade, teacher_feedback: feedback, status: 'graded', graded_at: new Date().toISOString() })
      .eq('id', submissionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

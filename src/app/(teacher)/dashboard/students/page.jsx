'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { profileQueries, progressQueries, homeworkQueries } from '@/lib/queries';
import { letters } from '@/data/letters';
import { useT, useLang } from '@/i18n';
import Icon from '@/components/dash/Icon';

const TOTAL = 28;
function letterName(id) { return letters.find((l) => l.id === id)?.name ?? '—'; }
function letterAr(id) { return letters.find((l) => l.id === id)?.ar ?? '؟'; }

// Homework state for a student's current letter.
function hwStateFor(allHw, studentId, letterId) {
  if (!letterId) return 'none';
  const items = allHw.filter((h) => h.student_id === studentId && h.letter_id === letterId);
  if (items.length === 0) return 'none';
  const anySubmitted = items.some((h) => {
    const st = (h.homework_submissions ?? [])[0]?.status;
    return st === 'submitted' || st === 'graded';
  });
  return anySubmitted ? 'submitted' : 'pending';
}

export default function StudentsPage() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const router = useRouter();
  const { profile } = useAuthStore();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [marking, setMarking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  // Open the create form when arrived via the toolbar "New student" action.
  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('new') === '1') {
      setShowForm(true);
    }
  }, []);

  const load = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    const [students, allHw] = await Promise.all([
      profileQueries.listStudents(profile.id),
      homeworkQueries.getTeacherHomework(profile.id),
    ]);
    const withProgress = await Promise.all(students.map(async (s) => {
      const map = await progressQueries.getProgressMap(s.id);
      const currentId = Number(Object.entries(map).find(([, st]) => st === 'current')?.[0]) || null;
      const doneCount = Object.values(map).filter((st) => st === 'done').length;
      const hwState = hwStateFor(allHw, s.id, currentId);
      return { student: s, currentId, doneCount, hwState };
    }));
    setRows(withProgress);
    setLoading(false);
  }, [profile?.id]);

  useEffect(() => { load(); }, [load]);

  const createStudent = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      await profileQueries.createStudent(form);
      setForm({ full_name: '', email: '', password: '' });
      setShowForm(false);
      await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const markDone = async (studentId, currentId) => {
    if (!currentId) return;
    setMarking(studentId);
    try { await progressQueries.markLetterDone(studentId, currentId); await load(); }
    finally { setMarking(null); }
  };

  const doAction = async (studentId, action, name) => {
    if (action === 'delete' && !window.confirm(`"${name}" ${t('confirm_delete_student')}`)) return;
    setMarking(studentId); setError(null);
    try { await profileQueries.manageStudent(studentId, action); await load(); }
    catch (err) { setError(err.message); }
    finally { setMarking(null); }
  };

  const total = rows.length;
  const activeCount = rows.filter((r) => r.student.is_active !== false).length;
  const pendingCount = rows.filter((r) => r.hwState === 'submitted').length;

  const list = useMemo(() => rows.filter(({ student }) => {
    const active = student.is_active !== false;
    if (filter === 'active' && !active) return false;
    if (filter === 'inactive' && active) return false;
    if (q) {
      const hay = `${student.full_name ?? ''} ${student.email ?? ''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  }), [rows, filter, q]);

  return (
    <div className="view">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('students_title')}</h1>
          <p className="page-sub">{t('students_sub')}</p>
        </div>
        <button className="btn-soft" onClick={() => setShowForm((v) => !v)}>
          <Icon name="plus" size={15} />{showForm ? t('act_cancel') : t('add_student')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createStudent} className="form-card">
          <div className="fc-title">{t('new_student_form')}</div>
          {error && <div className="err-box">{error}</div>}
          <div className="form-grid cols3">
            <div>
              <label className="fld-label">{t('f_fullname')}</label>
              <input className="fld" required value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div>
              <label className="fld-label">{t('f_email')}</label>
              <input className="fld" required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="fld-label">{t('f_password')}</label>
              <input className="fld" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-soft" onClick={() => setShowForm(false)}>{t('act_cancel')}</button>
            <button className="btn btn-primary" disabled={saving}>{saving ? t('act_saving') : t('act_add')}</button>
          </div>
        </form>
      )}

      <div className="summary-chips">
        <div className="schip"><Icon name="students" size={15} /><b>{total}</b> {t('chip_total')}</div>
        <div className="schip"><span className="lg-dot" style={{ background: 'var(--brand)' }} /><b>{activeCount}</b> {t('chip_active')}</div>
        <div className="schip"><Icon name="hourglass" size={15} /><b>{pendingCount}</b> {t('chip_pending')}</div>
      </div>

      <div className="tbl-toolbar">
        <div className="tbl-search">
          <Icon name="search" size={16} />
          <input placeholder={t('search_students_ph')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="seg">
          {[['all', t('filter_all')], ['active', t('filter_active')], ['inactive', t('filter_inactive')]].map(([k, lbl]) => (
            <button key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{lbl}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="dash-spin" />
      ) : list.length === 0 ? (
        <div className="card"><div className="empty"><div className="ei"><Icon name="students" size={26} /></div><h4>{t('no_students')}</h4><p>{t('no_students_hint')}</p></div></div>
      ) : (
        <div className="card table">
          <div className="thead">
            <div className="th">{t('col_student')}</div>
            <div className="th">{t('th_status')}</div>
            <div className="th">{t('col_current_lesson')}</div>
            <div className="th">{t('col_progress')}</div>
            <div className="th">{t('th_hw')}</div>
            <div className="th right">{t('col_actions')}</div>
          </div>
          {list.map(({ student, currentId, doneCount, hwState }) => {
            const active = student.is_active !== false;
            const busy = marking === student.id;
            const canApprove = !!currentId && active && hwState === 'submitted';
            const initial = (student.full_name?.[0] ?? student.email?.[0] ?? 'T').toUpperCase();
            return (
              <div className="trow" key={student.id} onClick={() => router.push(`/dashboard/students/${student.id}`)} style={{ opacity: active ? 1 : 0.6 }}>
                <div className="student">
                  <div className="avatar" style={{ borderRadius: 10 }}>{initial}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="nm">{student.full_name ?? student.email}</div>
                    <div className="em">{student.email}</div>
                  </div>
                </div>
                <div>{active ? <span className="badge ok dot">{t('filter_active')}</span> : <span className="badge neutral dot">{t('st_inactive')}</span>}</div>
                <div className="lesson-cell">
                  {currentId ? (<><span className="gl">{letterAr(currentId)}</span><span>{letterName(currentId)} <span className="lx">#{currentId}</span></span></>) : <span className="lx">{t('finished')}</span>}
                </div>
                <div className="progress">
                  <div className="bar"><i style={{ width: `${Math.round((doneCount / TOTAL) * 100)}%` }} /></div>
                  <span>{doneCount}/{TOTAL}</span>
                </div>
                <div>
                  {hwState === 'submitted' ? <span className="badge ok">{t('hw_graded_badge')}</span>
                    : hwState === 'pending' ? <span className="badge warn">{t('hw_pending_badge')}</span>
                    : <span className="badge neutral">{t('hw_none_badge')}</span>}
                </div>
                <div className="actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-soft sm" disabled={!canApprove || busy} onClick={() => markDone(student.id, currentId)}
                    title={!currentId ? '' : hwState === 'none' ? t('approve_tip_none') : hwState === 'pending' ? t('approve_tip_pending') : ''}>
                    {busy ? '…' : t('approve_lesson')}
                  </button>
                  <button className="btn-soft sm" disabled={busy} onClick={() => doAction(student.id, active ? 'deactivate' : 'activate', student.full_name ?? student.email)}>
                    {active ? t('act_deactivate') : t('act_activate')}
                  </button>
                  <button className="btn-soft sm danger" disabled={busy} onClick={() => doAction(student.id, 'delete', student.full_name ?? student.email)}>{t('act_delete')}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

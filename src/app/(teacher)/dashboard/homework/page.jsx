'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profileQueries, homeworkQueries } from '@/lib/queries';
import { letters } from '@/data/letters';
import { useT, useLang } from '@/i18n';
import Icon from '@/components/dash/Icon';

const TYPES = [
  { id: 'text', key: 'hw_type_text' },
  { id: 'image', key: 'hw_type_image' },
  { id: 'audio', key: 'hw_type_audio' },
];

function fmtTime(sec = 0, lang) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return lang === 'uz' ? `${m}d ${s}s` : `${m}m ${s}s`;
}

const EMPTY = { student_id: '', letter_id: '', title: '', instructions: '', allowed_types: ['text', 'image', 'audio'], due_date: '' };

export default function TeacherHomeworkPage() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const { profile } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [reviewing, setReviewing] = useState(null);
  const [tab, setTab] = useState('pending');
  const [q, setQ] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('new') === '1') {
      setShowForm(true);
    }
  }, []);

  const load = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    const [s, h] = await Promise.all([
      profileQueries.listStudents(profile.id),
      homeworkQueries.getTeacherHomework(profile.id),
    ]);
    setStudents(s); setHomework(h); setLoading(false);
  }, [profile?.id]);

  useEffect(() => { load(); }, [load]);

  const toggleType = (id) => setForm((f) => ({
    ...f,
    allowed_types: f.allowed_types.includes(id) ? f.allowed_types.filter((x) => x !== id) : [...f.allowed_types, id],
  }));

  const assign = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      await homeworkQueries.createHomework({
        teacher_id: profile.id,
        student_id: form.student_id,
        letter_id: form.letter_id ? Number(form.letter_id) : null,
        title: form.title,
        instructions: form.instructions,
        allowed_types: form.allowed_types,
        due_date: form.due_date || null,
      });
      setForm(EMPTY); setShowForm(false); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const statusOf = (h) => (h.homework_submissions ?? [])[0]?.status ?? 'not_started';
  const pending = homework.filter((h) => statusOf(h) === 'submitted');
  const graded = homework.filter((h) => statusOf(h) === 'graded');

  const base = tab === 'pending' ? pending : tab === 'graded' ? graded : homework;
  const items = q ? base.filter((h) => (h.title ?? '').toLowerCase().includes(q.toLowerCase()) || (h.student?.full_name ?? '').toLowerCase().includes(q.toLowerCase())) : base;

  const onGraded = async () => { await load(); setReviewing(null); };

  return (
    <div className="view">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('hw_title')}</h1>
          <p className="page-sub">{t('hw_teacher_sub')}</p>
        </div>
        <button className="btn-soft" onClick={() => setShowForm((v) => !v)}>
          <Icon name="plus" size={15} />{showForm ? t('act_cancel') : t('hw_new')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={assign} className="form-card">
          <div className="fc-title">{t('hw_new_form')}</div>
          {error && <div className="err-box">{error}</div>}
          <div className="form-grid cols2">
            <div>
              <label className="fld-label">{t('hw_pick_student')}</label>
              <select className="fld" required value={form.student_id} onChange={(e) => setForm((f) => ({ ...f, student_id: e.target.value }))}>
                <option value="">—</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.full_name ?? s.email}</option>)}
              </select>
            </div>
            <div>
              <label className="fld-label">{t('hw_letter_optional')}</label>
              <select className="fld" value={form.letter_id} onChange={(e) => setForm((f) => ({ ...f, letter_id: e.target.value }))}>
                <option value="">—</option>
                {letters.map((l) => <option key={l.id} value={l.id}>{l.id}. {l.name} ({l.ar})</option>)}
              </select>
            </div>
          </div>
          <div className="form-grid" style={{ marginTop: 12 }}>
            <div>
              <label className="fld-label">{t('hw_name_ph')}</label>
              <input className="fld" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="fld-label">{t('hw_instructions_ph')}</label>
              <textarea className="fld" rows={3} value={form.instructions} onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))} />
            </div>
          </div>
          <div className="form-actions" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              {TYPES.map((ty) => (
                <label key={ty.id} className="chk"><input type="checkbox" checked={form.allowed_types.includes(ty.id)} onChange={() => toggleType(ty.id)} />{t(ty.key)}</label>
              ))}
              <label className="chk">{t('hw_due')}
                <input type="date" className="fld" style={{ width: 'auto', padding: '6px 10px' }} value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} />
              </label>
            </div>
            <button className="btn btn-primary" disabled={saving}>{saving ? t('hw_assigning') : t('hw_assign')}</button>
          </div>
        </form>
      )}

      <div className="tbl-toolbar">
        <div className="seg">
          <button className={tab === 'pending' ? 'on' : ''} onClick={() => setTab('pending')}>{t('q_pending')}<span className="sc">{pending.length}</span></button>
          <button className={tab === 'graded' ? 'on' : ''} onClick={() => setTab('graded')}>{t('q_graded')}<span className="sc">{graded.length}</span></button>
          <button className={tab === 'all' ? 'on' : ''} onClick={() => setTab('all')}>{t('q_all')}<span className="sc">{homework.length}</span></button>
        </div>
        <div style={{ flex: 1 }} />
        <div className="tbl-search" style={{ maxWidth: 300 }}>
          <Icon name="search" size={16} />
          <input placeholder={t('search_tasks_ph')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="dash-spin" />
      ) : items.length === 0 ? (
        <div className="card"><div className="empty"><div className="ei"><Icon name="checkCircle" size={26} /></div><h4>{t('queue_empty_h')}</h4><p>{t('queue_empty_p')}</p></div></div>
      ) : (
        <div className="card rows">
          {items.map((h) => {
            const sub = (h.homework_submissions ?? [])[0];
            const status = sub?.status ?? 'not_started';
            const letter = letters.find((l) => l.id === h.letter_id);
            const canReview = status === 'submitted' || status === 'graded';
            const badge = status === 'graded' ? ['ok', t('hw_graded_badge')] : status === 'submitted' ? ['warn', t('hw_pending_badge')] : ['neutral', t('hw_none_badge')];
            return (
              <div className="lrow" key={h.id}>
                <div className="tile ar">{letter?.ar ?? '؟'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lrow-title">{h.title}</div>
                  <div className="lrow-meta">
                    {h.student?.full_name ?? ''}
                    {sub && status !== 'not_started' && status !== 'in_progress' && <><span className="sep" /><Icon name="clock" size={12} />{fmtTime(sub.time_spent_seconds, lang)}</>}
                    {h.due_date && <><span className="sep" />{h.due_date}</>}
                    {status === 'graded' && sub?.teacher_grade != null && sub.teacher_grade !== '' && <><span className="sep" /><b>{t('dash_grade')}: {sub.teacher_grade}</b></>}
                  </div>
                </div>
                <span className={'badge ' + badge[0]}>{status === 'graded' && <Icon name="check" size={12} />}{badge[1]}</span>
                {canReview && (
                  <button className="btn-soft" onClick={() => setReviewing(h)}>
                    <Icon name="eye" size={15} />{status === 'submitted' ? t('btn_review') : t('dash_view')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {reviewing && <GradeModal hw={reviewing} onClose={() => setReviewing(null)} onGraded={onGraded} lang={lang} />}
    </div>
  );
}

// Modal: shows the student's answer + grade/feedback inputs, then confirm.
function GradeModal({ hw, onClose, onGraded, lang }) {
  const t = useT();
  const sub = (hw.homework_submissions ?? [])[0];
  const [grade, setGrade] = useState(sub?.teacher_grade ?? '');
  const [feedback, setFeedback] = useState(sub?.teacher_feedback ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const letter = letters.find((l) => l.id === hw.letter_id);
  const isGraded = sub?.status === 'graded';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const confirm = async () => {
    if (!sub) return;
    setSaving(true); setError(null);
    try { await homeworkQueries.gradeSubmission(sub.id, grade || null, feedback || null); await onGraded(); }
    catch (e) { setError(e.message); setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-brand-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-cream-50 border border-brand-700/10 rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {letter && <span className="font-arabic text-4xl text-brand-600">{letter.ar}</span>}
            <div>
              <h2 className="text-xl font-extrabold text-brand-700">{hw.title}</h2>
              <div className="text-xs text-brand-700/45">{hw.student?.full_name ?? ''} · ⏱ {fmtTime(sub?.time_spent_seconds, lang)} {t('hw_spent')}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-brand-700/40 hover:text-brand-700 text-2xl leading-none">×</button>
        </div>

        {hw.instructions && <p className="text-sm text-brand-700/60">{hw.instructions}</p>}

        <div className="space-y-3 border-t border-brand-700/10 pt-4">
          <div className="text-xs font-bold text-brand-700/50 uppercase tracking-wider">{t('hw_student_answer')}</div>
          {sub?.content_text && <p className="text-sm text-brand-700/80 bg-cream-100 border border-brand-700/10 rounded-xl p-3 whitespace-pre-wrap">{sub.content_text}</p>}
          {sub?.file_url && <a href={sub.file_url} target="_blank" rel="noreferrer" className="block"><img src={sub.file_url} alt="" className="max-h-60 rounded-xl border border-brand-700/10" /></a>}
          {sub?.audio_url && <audio controls src={sub.audio_url} className="w-full" />}
          {!sub?.content_text && !sub?.file_url && !sub?.audio_url && <p className="text-sm text-brand-700/40">{t('hw_answer_empty')}</p>}
        </div>

        <div className="space-y-3 border-t border-brand-700/10 pt-4">
          {error && <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-brand-700 mb-1.5">{t('hw_grade')}</label>
            <input placeholder={t('hw_grade_ph')} value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full bg-cream-100 border border-brand-700/15 text-brand-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-700 mb-1.5">{t('hw_feedback')}</label>
            <textarea rows={3} placeholder={t('hw_feedback_ph')} value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full bg-cream-100 border border-brand-700/15 text-brand-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold border border-brand-700/15 text-brand-700/60 hover:bg-cream-100 transition-all">{t('act_cancel')}</button>
            <button onClick={confirm} disabled={saving} className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all">
              {saving ? t('act_saving') : isGraded ? t('act_update') : t('act_confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

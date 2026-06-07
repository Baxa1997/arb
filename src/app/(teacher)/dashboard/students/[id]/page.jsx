'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { profileQueries, progressQueries, homeworkQueries } from '@/lib/queries';
import { letters } from '@/data/letters';
import { useT } from '@/i18n';
import { Spinner } from '@/components/ui/Spinner';

function fmtTime(sec = 0) {
  const m = Math.floor(sec / 60);
  return `${m}d ${sec % 60}s`;
}

export default function StudentDetailPage({ params }) {
  const t = useT();
  const studentId = params.id;
  const [student, setStudent] = useState(null);
  const [map, setMap] = useState({});
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, m, hw] = await Promise.all([
      profileQueries.getStudent(studentId),
      progressQueries.getProgressMap(studentId),
      homeworkQueries.getStudentHomework(studentId),
    ]);
    setStudent(s); setMap(m); setHomework(hw); setLoading(false);
  }, [studentId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8 text-brand-500" /></div>;
  if (!student) return <div className="text-center py-20 text-brand-700/60">{t('sd_not_found')}</div>;

  const empty = Object.keys(map).length === 0;
  const statusOf = (id) => map[id] ?? (empty && id === 1 ? 'current' : 'locked');
  const currentId = Number(Object.entries(map).find(([, st]) => st === 'current')?.[0]) || (empty ? 1 : null);
  const doneCount = Object.values(map).filter(s => s === 'done').length;
  const pct = Math.round((doneCount / 28) * 100);

  // Approval is gated on the current letter's homework being submitted.
  const hwStateFor = (letterId) => {
    if (!letterId) return 'none';
    const items = homework.filter(h => h.letter_id === letterId);
    if (items.length === 0) return 'none';
    return items.some(h => ['submitted', 'graded'].includes((h.homework_submissions ?? [])[0]?.status)) ? 'submitted' : 'pending';
  };
  const hwState = hwStateFor(currentId);
  const canApprove = !!currentId && hwState === 'submitted';

  const approve = async () => {
    if (!canApprove) return;
    setMarking(true); setError(null);
    try { await progressQueries.markLetterDone(studentId, currentId); await load(); }
    catch (e) { setError(e.message); }
    finally { setMarking(false); }
  };

  const STATUS = {
    done:    [t('st_done'), 'bg-brand-500/15 text-brand-600 border-brand-500/25'],
    current: [t('st_current'), 'bg-amber-500/15 text-amber-700 border-amber-500/25'],
    locked:  [t('st_locked'), 'bg-cream-200 text-brand-700/40 border-brand-700/10'],
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard/students" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium">{t('sd_back')}</Link>

      {/* Student header */}
      <div className="bg-cream-50 border border-brand-700/10 rounded-2xl p-6 flex items-center gap-4 flex-wrap">
        <div className="w-14 h-14 rounded-full bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-brand-600 font-extrabold text-xl">
          {student.full_name?.[0] ?? 'T'}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-brand-700 truncate">{student.full_name ?? student.email}</h1>
          <div className="text-sm text-brand-700/45">{student.email}</div>
          <div className="mt-3 flex items-center gap-3 max-w-xs">
            <div className="flex-1 h-2 bg-cream-300 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-bold text-brand-600">{doneCount}/28</span>
          </div>
        </div>

        {currentId && (
          <div className="text-center">
            <div className="text-[10px] text-brand-700/40 font-bold uppercase tracking-wider mb-1">{t('current_lesson')}</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-arabic text-3xl text-brand-600">{letters.find(l => l.id === currentId)?.ar}</span>
              <span className="font-bold text-brand-700">{letters.find(l => l.id === currentId)?.name}</span>
            </div>
            <button onClick={approve} disabled={!canApprove || marking}
              title={hwState === 'none' ? t('approve_tip_none') : hwState === 'pending' ? t('approve_tip_pending') : ''}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
              {marking ? '...' : t('approve_lesson')}
            </button>
            {hwState !== 'submitted' && (
              <div className="text-[11px] text-brand-700/40 mt-1">
                {hwState === 'none' ? t('approve_no_hw') : t('approve_pending_hw')}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">{error}</div>}

      {/* Curriculum — teacher can open any letter to teach */}
      <div>
        <h2 className="text-lg font-bold text-brand-700 mb-3">{t('sd_curriculum')}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
          {letters.map(l => {
            const st = statusOf(l.id);
            const badge = STATUS[st];
            return (
              <Link key={l.id} href={`/teach/${l.id}?from=${encodeURIComponent(`/dashboard/students/${studentId}`)}`}
                className="bg-cream-50 border border-brand-700/10 rounded-2xl p-3 text-center hover:border-brand-500/30 hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-brand-700/40">{l.id}</span>
                  {st === 'done' && <span className="text-brand-500 text-xs">✓</span>}
                  {st === 'current' && <span className="text-amber-600 text-xs">▶</span>}
                  {st === 'locked' && <span className="text-brand-700/30 text-xs">🔒</span>}
                </div>
                <div className="font-arabic text-3xl text-brand-600">{l.ar}</div>
                <div className="text-[11px] text-brand-700/60 mt-1 truncate">{l.name}</div>
                <span className={`inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badge[1]}`}>{badge[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Student homework */}
      <div>
        <h2 className="text-lg font-bold text-brand-700 mb-3">{t('sd_student_homework')}</h2>
        {homework.length === 0 ? (
          <div className="text-sm text-brand-700/40 bg-cream-50 border border-brand-700/10 rounded-2xl p-6 text-center">{t('hw_none')}</div>
        ) : (
          <div className="bg-cream-50 border border-brand-700/10 rounded-2xl divide-y divide-brand-700/10 overflow-hidden">
            {homework.map(h => {
              const sub = (h.homework_submissions ?? [])[0];
              const status = sub?.status ?? 'not_started';
              const badge = {
                not_started: [t('st_not_started'), 'bg-cream-200 text-brand-700/50'],
                in_progress: [t('st_in_progress'), 'bg-amber-500/15 text-amber-700'],
                submitted:   [t('st_to_review'), 'bg-amber-500/15 text-amber-700'],
                graded:      [`${t('hw_grade')}: ${sub?.teacher_grade ?? '✓'}`, 'bg-brand-500/15 text-brand-600'],
              }[status];
              const letter = letters.find(l => l.id === h.letter_id);
              return (
                <div key={h.id} className="flex items-center gap-3 px-5 py-3.5">
                  {letter && <span className="font-arabic text-2xl text-brand-600 w-7 text-center">{letter.ar}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-brand-700 text-sm truncate">{h.title}</div>
                    {(status === 'submitted' || status === 'graded') && (
                      <div className="text-xs text-brand-700/45">⏱ {fmtTime(sub?.time_spent_seconds)}</div>
                    )}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${badge[1]}`}>{badge[0]}</span>
                </div>
              );
            })}
          </div>
        )}
        <Link href="/dashboard/homework" className="inline-block mt-3 text-sm text-brand-600 hover:underline font-medium">{t('all')}</Link>
      </div>
    </div>
  );
}

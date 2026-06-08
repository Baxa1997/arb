'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { profileQueries, progressQueries, homeworkQueries } from '@/lib/queries';
import { letters } from '@/data/letters';
import { useT, useLang } from '@/i18n';
import Icon from '@/components/dash/Icon';

const TOTAL = 28;
function fmtTime(sec = 0, lang) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return lang === 'uz' ? `${m}d ${s}s` : `${m}m ${s}s`;
}

export default function StudentDetailPage({ params }) {
  const t = useT();
  const lang = useLang((s) => s.lang);
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

  if (loading) return <div className="dash-spin" />;
  if (!student) return <div className="card"><div className="empty"><div className="ei"><Icon name="students" size={26} /></div><h4>{t('sd_not_found')}</h4></div></div>;

  const empty = Object.keys(map).length === 0;
  const statusOf = (id) => map[id] ?? (empty && id === 1 ? 'current' : 'locked');
  const currentId = Number(Object.entries(map).find(([, st]) => st === 'current')?.[0]) || (empty ? 1 : null);
  const doneCount = Object.values(map).filter((s) => s === 'done').length;
  const pct = Math.round((doneCount / TOTAL) * 100);
  const currentLetter = letters.find((l) => l.id === currentId);
  const initial = (student.full_name?.[0] ?? student.email?.[0] ?? 'T').toUpperCase();

  const hwStateFor = (letterId) => {
    if (!letterId) return 'none';
    const items = homework.filter((h) => h.letter_id === letterId);
    if (items.length === 0) return 'none';
    return items.some((h) => ['submitted', 'graded'].includes((h.homework_submissions ?? [])[0]?.status)) ? 'submitted' : 'pending';
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

  return (
    <div className="view">
      <Link href="/dashboard/students" className="link-all" style={{ marginBottom: 14 }}>
        <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><Icon name="arrowR" size={15} /></span>{t('sd_back')}
      </Link>

      {/* header */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: 18 }}>
          <div className="avatar" style={{ width: 56, height: 56, borderRadius: 16, fontSize: 22 }}>{initial}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>{student.full_name ?? student.email}</div>
            <div style={{ color: 'var(--ink-mute)', fontSize: 13 }}>{student.email}</div>
            <div className="progress" style={{ marginTop: 12, maxWidth: 300 }}>
              <div className="bar"><i style={{ width: pct + '%' }} /></div>
              <span>{doneCount}/{TOTAL}</span>
            </div>
          </div>

          {currentLetter && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', minWidth: 0 }}>
              <div className="cap" style={{ fontSize: 10.5, color: 'var(--ink-faint)' }}>{t('current_lesson')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span className="ar" style={{ fontSize: 30, color: 'var(--brand)' }}>{currentLetter.ar}</span>
                <span style={{ fontWeight: 700 }}>{currentLetter.name} <span style={{ color: 'var(--ink-mute)', fontWeight: 600, fontSize: 12 }}>#{currentLetter.id}</span></span>
              </div>
              <button className="btn btn-primary" onClick={approve} disabled={!canApprove || marking}
                title={hwState === 'none' ? t('approve_tip_none') : hwState === 'pending' ? t('approve_tip_pending') : ''}>
                {marking ? '…' : <>{t('approve_lesson')}</>}
              </button>
              {hwState !== 'submitted' && (
                <div style={{ fontSize: 11, color: 'var(--ink-faint)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="alert" size={12} />{hwState === 'none' ? t('approve_no_hw') : t('approve_pending_hw')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && <div className="err-box" style={{ marginBottom: 18 }}>{error}</div>}

      {/* curriculum */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head"><div className="card-title"><span className="ct-ico"><Icon name="book" size={18} /></span>{t('sd_curriculum')}</div></div>
        <div style={{ padding: 16 }}>
          <div className="lessons">
            {letters.map((l) => {
              const st = statusOf(l.id);
              const cls = st === 'done' ? 'done' : st === 'current' ? 'current' : 'locked';
              return (
                <Link key={l.id} href={`/teach/${l.id}?from=${encodeURIComponent(`/dashboard/students/${studentId}`)}`} className={'lesson ' + cls}>
                  <div className="lesson-idx">{String(l.id).padStart(2, '0')}</div>
                  {st === 'done' && <div className="lesson-check"><Icon name="checkCircle" size={16} /></div>}
                  {st === 'locked' && <div className="lesson-lock"><Icon name="lock" size={14} /></div>}
                  <div className="lesson-gl">{l.ar}</div>
                  <div className="lesson-name">{l.name}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* homework */}
      <div className="card">
        <div className="card-head"><div className="card-title"><span className="ct-ico"><Icon name="fileCheck" size={18} /></span>{t('sd_student_homework')}</div>
          <Link className="link-all" href="/dashboard/homework">{t('all')}<Icon name="arrowR" size={14} /></Link>
        </div>
        {homework.length === 0 ? (
          <div className="empty"><div className="ei"><Icon name="fileCheck" size={26} /></div><p>{t('hw_none')}</p></div>
        ) : (
          <div className="rows">
            {homework.map((h) => {
              const sub = (h.homework_submissions ?? [])[0];
              const status = sub?.status ?? 'not_started';
              const letter = letters.find((l) => l.id === h.letter_id);
              const badge = status === 'graded' ? ['ok', `${t('hw_grade')}: ${sub?.teacher_grade ?? '✓'}`]
                : status === 'submitted' ? ['warn', t('st_to_review')]
                : status === 'in_progress' ? ['warn', t('st_in_progress')]
                : ['neutral', t('st_not_started')];
              return (
                <div className="lrow" key={h.id}>
                  {letter && <div className="tile ar">{letter.ar}</div>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="lrow-title">{h.title}</div>
                    {(status === 'submitted' || status === 'graded') && (
                      <div className="lrow-meta"><Icon name="clock" size={12} />{fmtTime(sub?.time_spent_seconds, lang)}</div>
                    )}
                  </div>
                  <span className={'badge ' + badge[0]}>{badge[1]}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

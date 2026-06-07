'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { homeworkQueries } from '@/lib/queries';
import { letters } from '@/data/letters';
import { useT, useLang } from '@/i18n';
import Icon from '@/components/dash/Icon';

function fmtTime(sec = 0, lang) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return lang === 'uz' ? `${m}d ${s}s` : `${m}m ${s}s`;
}

export default function StudentHomeworkPage() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const { profile } = useAuthStore();
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('todo');

  useEffect(() => {
    if (!profile?.id) return;
    homeworkQueries.getStudentHomework(profile.id).then(setHomework).catch(() => {}).finally(() => setLoading(false));
  }, [profile?.id]);

  const statusOf = (h) => (h.homework_submissions ?? [])[0]?.status ?? 'not_started';
  const todo = homework.filter((h) => ['not_started', 'in_progress'].includes(statusOf(h)));
  const submitted = homework.filter((h) => statusOf(h) === 'submitted');
  const graded = homework.filter((h) => statusOf(h) === 'graded');
  const items = tab === 'todo' ? todo : tab === 'submitted' ? submitted : graded;

  return (
    <div className="view">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('hw_title')}</h1>
          <p className="page-sub">{t('hw_student_sub')}</p>
        </div>
      </div>

      <div className="tbl-toolbar">
        <div className="seg">
          <button className={tab === 'todo' ? 'on' : ''} onClick={() => setTab('todo')}>{t('sec_todo')}<span className="sc">{todo.length}</span></button>
          <button className={tab === 'submitted' ? 'on' : ''} onClick={() => setTab('submitted')}>{t('sec_submitted')}<span className="sc">{submitted.length}</span></button>
          <button className={tab === 'graded' ? 'on' : ''} onClick={() => setTab('graded')}>{t('sec_graded')}<span className="sc">{graded.length}</span></button>
        </div>
      </div>

      {loading ? (
        <div className="dash-spin" />
      ) : items.length === 0 ? (
        <div className="card"><div className="empty"><div className="ei"><Icon name="fileCheck" size={26} /></div><h4>{t('hw_none')}</h4><p>{t('no_homework_short')}</p></div></div>
      ) : (
        <div className="card rows">
          {items.map((hw) => {
            const s = (hw.homework_submissions ?? [])[0];
            const status = s?.status ?? 'not_started';
            const letter = letters.find((l) => l.id === hw.letter_id);
            const badge = {
              not_started: ['neutral', t('st_not_started')],
              in_progress: ['warn', t('st_in_progress')],
              submitted: ['ok', t('st_submitted')],
              graded: ['ok', `${t('hw_grade')}: ${s?.teacher_grade ?? '✓'}`],
            }[status];
            return (
              <Link className="lrow" key={hw.id} href={`/student/homework/${hw.id}`} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
                {letter && <div className="tile ar">{letter.ar}</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lrow-title">{hw.title}</div>
                  <div className="lrow-meta">
                    {hw.due_date ? `${t('due_label')}: ${hw.due_date}` : t('no_due')}
                    {(status === 'submitted' || status === 'graded') && <><span className="sep" /><Icon name="clock" size={12} />{fmtTime(s?.time_spent_seconds, lang)}</>}
                  </div>
                </div>
                <span className={'badge ' + badge[0]}>{badge[1]}</span>
                <span style={{ color: 'var(--ink-faint)' }}><Icon name="chevR" size={16} /></span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

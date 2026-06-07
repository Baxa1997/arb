'use client';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { letters } from '@/data/letters';
import { letterContentQueries } from '@/lib/queries';
import { useT } from '@/i18n';
import Icon from '@/components/dash/Icon';

// The teacher's Lessons page is a teaching library: every letter is always
// accessible. Student progress (done/current/locked) is NOT applied here —
// that only governs students and is shown on the Dashboard mastery heatmap.
export default function TeacherLessonsPage() {
  const t = useT();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    letterContentQueries.getAll().then((c) => setContent(c || {})).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => {
    if (!q) return letters;
    const needle = q.toLowerCase();
    return letters.filter((l) => l.name.toLowerCase().includes(needle) || String(l.id).includes(needle) || (l.ar || '').includes(q));
  }, [q]);

  const ready = letters.filter((l) => {
    const c = content[l.id] || {};
    return c.video_url || c.audio_url || c.examples;
  }).length;

  if (loading) return <div className="dash-spin" />;

  return (
    <div className="view">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('lessons_title')}</h1>
          <p className="page-sub">{t('tlessons_sub')}</p>
        </div>
      </div>

      <div className="tbl-toolbar">
        <div className="summary-chips" style={{ margin: 0 }}>
          <div className="schip"><Icon name="book" size={15} /><b>{letters.length}</b> {t('lessons_all_chip')}</div>
          <div className="schip"><span className="lg-dot" style={{ background: 'var(--brand)' }} /><b>{ready}</b> {t('lessons_ready_chip')}</div>
        </div>
        <div style={{ flex: 1 }} />
        <div className="tbl-search" style={{ maxWidth: 300 }}>
          <Icon name="search" size={16} />
          <input placeholder={t('lessons_search_ph')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="lessons">
        {shown.map((l) => {
          const c = content[l.id] || {};
          return (
            <Link key={l.id} href={`/teach/${l.id}?from=${encodeURIComponent('/dashboard/lessons')}`} className="lesson">
              <div className="lesson-idx">{String(l.id).padStart(2, '0')}</div>
              <div className="lesson-gl">{l.ar}</div>
              <div className="lesson-name">{l.name}</div>
              <div className="lesson-foot">
                <span style={c.video_url ? undefined : { opacity: 0.25 }}><Icon name="video" size={13} /></span>
                <span style={c.audio_url ? undefined : { opacity: 0.25 }}><Icon name="sound" size={13} /></span>
                <span style={c.examples ? undefined : { opacity: 0.25 }}><Icon name="write" size={13} /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

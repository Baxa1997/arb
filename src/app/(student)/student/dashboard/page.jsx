'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProgress } from '@/hooks/useProgress';
import { homeworkQueries } from '@/lib/queries';
import { letters } from '@/data/letters';
import { useT } from '@/i18n';
import Icon from '@/components/dash/Icon';

const TOTAL = 28;

const MODULES = [
  { href: '/student/learn/alifbo', ar: 'ا', labelKey: 'nav_alphabet', descKey: 'mod_alifbo_desc' },
  { href: '/student/learn/harakatlar', ar: 'َ', labelKey: 'nav_harakat', descKey: 'mod_harakat_desc' },
  { href: '/student/learn/maxrajlar', icon: 'sound', labelKey: 'nav_makhraj', descKey: 'mod_makhraj_desc' },
  { href: '/student/learn/sifatlar', icon: 'star', labelKey: 'nav_sifat', descKey: 'mod_sifat_desc' },
];

export default function StudentDashboard() {
  const t = useT();
  const { profile } = useAuthStore();
  const { map, statusOf, doneCount, currentLetterId, loading } = useProgress();
  const [homework, setHomework] = useState([]);

  useEffect(() => {
    if (!profile?.id) return;
    homeworkQueries.getStudentHomework(profile.id).then(setHomework).catch(() => {});
  }, [profile?.id]);

  const pct = Math.round((doneCount / TOTAL) * 100);
  const currentLetter = letters.find((l) => l.id === currentLetterId);
  const pendingHw = homework.filter((h) => {
    const s = (h.homework_submissions ?? [])[0];
    return !s || s.status === 'in_progress';
  });

  if (loading) return <div className="dash-spin" />;

  return (
    <div className="view">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('welcome_name')}, {profile?.full_name ?? t('role_student')} 👋</h1>
          <p className="page-sub">{currentLetter ? `${t('keep_going')} — ${doneCount} ${t('letters_done_of')}` : t('all_done_sub')}</p>
        </div>
      </div>

      {/* current lesson banner */}
      {currentLetter ? (
        <div className="card" style={{ background: 'linear-gradient(120deg, var(--brand-50), var(--paper) 70%)', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, padding: '20px 22px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 0 }}>
              <div className="tile ar" style={{ width: 64, height: 64, borderRadius: 16, fontSize: 38 }}>{currentLetter.ar}</div>
              <div style={{ minWidth: 0 }}>
                <div className="cap" style={{ fontSize: 11, color: 'var(--brand)' }}>{t('current_lesson')}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', marginTop: 2 }}>{currentLetter.name}</div>
              </div>
            </div>
            <Link href={`/student/lessons/${currentLetter.id}`} className="btn btn-primary"><Icon name="book" size={16} />{t('open_lesson')}</Link>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 22 }}>
          <div className="empty"><div className="ei"><Icon name="checkCircle" size={26} /></div><h4>{t('all_done_title')}</h4><p>{t('all_done_sub')}</p></div>
        </div>
      )}

      {/* KPI strip */}
      <div className="kpis" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        <Kpi icon="checkCircle" tone="brand" num={doneCount} label={t('stat_done')} />
        <Kpi icon="target" tone="amber" num={TOTAL - doneCount} label={t('stat_left')} />
        <Kpi icon="fileCheck" tone="blue" num={pendingHw.length} label={t('nav_homework')} />
        <Kpi icon="star" tone="brand" num={pct} suffix="%" label={t('stat_progress')} />
      </div>

      <div className="grid-2">
        {/* alphabet mastery (own progress) */}
        <div className="card">
          <div className="card-head">
            <div className="card-title"><span className="ct-ico"><Icon name="chart" size={18} /></span>{t('alphabet_progress')}</div>
            <Link className="link-all" href="/student/learn/alifbo">{t('all')}<Icon name="arrowR" size={14} /></Link>
          </div>
          <div className="mastery-body">
            <div className="mastery-bar-row">
              <div className="mastery-pct">{pct}%</div>
              <div className="mbar"><i style={{ width: pct + '%' }} /></div>
              <div className="mastery-meta">{doneCount} / {TOTAL} {t('mastery_meta_uz')}</div>
            </div>
            <div className="alpha-grid">
              {letters.map((l) => {
                const st = statusOf(l.id);
                const cls = st === 'done' ? 'done' : st === 'current' ? 'current' : 'locked';
                return <div className={'alpha-cell ' + cls} key={l.id} title={l.name}>{l.ar}</div>;
              })}
            </div>
            <div className="alpha-legend">
              <span><i className="lg-dot" style={{ background: 'var(--brand)' }} />{t('lg_done')}</span>
              <span><i className="lg-dot" style={{ background: 'var(--amber)' }} />{t('lg_current')}</span>
              <span><i className="lg-dot" style={{ background: 'var(--cream-3)' }} />{t('lg_locked')}</span>
            </div>
          </div>
        </div>

        {/* homework */}
        <div className="card">
          <div className="card-head">
            <div className="card-title"><span className="ct-ico"><Icon name="fileCheck" size={18} /></span>{t('nav_homework')}</div>
            <Link className="link-all" href="/student/homework">{t('all')}<Icon name="arrowR" size={14} /></Link>
          </div>
          {homework.length === 0 ? (
            <div className="empty"><div className="ei"><Icon name="fileCheck" size={26} /></div><p>{t('no_homework_short')}</p></div>
          ) : (
            <div className="rows">
              {homework.slice(0, 5).map((hw) => {
                const s = (hw.homework_submissions ?? [])[0];
                const done = s && s.status !== 'in_progress';
                const letter = letters.find((l) => l.id === hw.letter_id);
                return (
                  <Link className="lrow" key={hw.id} href={`/student/homework/${hw.id}`} style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>
                    {letter && <div className="tile ar">{letter.ar}</div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="lrow-title">{hw.title}</div>
                      <div className="lrow-meta">{hw.due_date ? `${t('due_label')}: ${hw.due_date}` : t('no_due')}</div>
                    </div>
                    <span className={'badge ' + (done ? 'ok' : 'warn')}>{done ? t('st_submitted') : t('badge_pending')}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* learn modules */}
      <div className="card mt">
        <div className="card-head"><div className="card-title"><span className="ct-ico"><Icon name="book" size={18} /></span>{t('learn_modules')}</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: 12, padding: 16 }}>
          {MODULES.map((m) => (
            <Link key={m.href} href={m.href} className="lrow" style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--line)', textDecoration: 'none', color: 'inherit' }}>
              {m.ar ? <div className="tile ar">{m.ar}</div> : <div className="tile" style={{ background: 'var(--brand-50)', border: '1px solid var(--brand-line)', color: 'var(--brand)' }}><Icon name={m.icon} size={20} /></div>}
              <div style={{ minWidth: 0 }}>
                <div className="lrow-title">{t(m.labelKey)}</div>
                <div className="lrow-meta">{t(m.descKey)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, tone, num, suffix, label }) {
  const tones = {
    brand: { bg: 'var(--brand-50)', fg: 'var(--brand)' },
    amber: { bg: 'var(--amber-soft)', fg: 'var(--amber)' },
    blue: { bg: 'var(--blue-soft)', fg: 'var(--blue)' },
  }[tone] || {};
  return (
    <div className="kpi">
      <div className="kpi-top">
        <div className="kpi-ico" style={{ background: tones.bg, color: tones.fg }}><Icon name={icon} size={18} /></div>
      </div>
      <div className="kpi-num">{num}{suffix && <small>{suffix}</small>}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

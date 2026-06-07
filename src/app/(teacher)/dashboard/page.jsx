'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { profileQueries, progressQueries, homeworkQueries } from '@/lib/queries';
import { letters } from '@/data/letters';
import { useT, useLang } from '@/i18n';
import Icon from '@/components/dash/Icon';

const TOTAL = 28;

function fmtSpent(sec = 0, lang) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return lang === 'uz' ? `${m}d ${s}s` : `${m}m ${s}s`;
}

export default function TeacherDashboard() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const router = useRouter();
  const { profile } = useAuthStore();
  const [rows, setRows] = useState([]);       // [{ student, currentId, doneCount }]
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    let alive = true;
    (async () => {
      try {
        const [students, hw] = await Promise.all([
          profileQueries.listStudents(profile.id),
          homeworkQueries.getTeacherHomework(profile.id),
        ]);
        const withProgress = await Promise.all(students.map(async (s) => {
          const map = await progressQueries.getProgressMap(s.id);
          const currentId = Number(Object.entries(map).find(([, st]) => st === 'current')?.[0]) || null;
          const doneCount = Object.values(map).filter((st) => st === 'done').length;
          return { student: s, currentId, doneCount };
        }));
        if (!alive) return;
        setRows(withProgress); setHomework(hw);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [profile?.id]);

  const subs = homework.flatMap((h) => (h.homework_submissions ?? []).map((s) => ({ ...s, hw: h })));
  const pending = subs.filter((s) => s.status === 'submitted');
  const graded = subs.filter((s) => s.status === 'graded');
  const gradeNums = graded.map((s) => Number(s.teacher_grade)).filter((n) => !Number.isNaN(n));
  const avgGrade = gradeNums.length ? (gradeNums.reduce((a, b) => a + b, 0) / gradeNums.length).toFixed(1) : '—';

  const activeStudents = rows.filter((r) => r.student.is_active !== false).length;
  const lead = rows.slice().sort((a, b) => b.doneCount - a.doneCount)[0];
  const masteryDone = lead?.doneCount ?? 0;
  const masteryCurrentIdx = lead?.currentId ? lead.currentId - 1 : -1;
  const masteryPct = Math.round((masteryDone / TOTAL) * 100);

  // recent activity derived from submissions (honest)
  const activity = subs
    .filter((s) => s.submitted_at || s.graded_at)
    .map((s) => {
      const name = s.hw.student?.full_name ?? s.hw.student?.email ?? '—';
      const when = s.graded_at || s.submitted_at;
      if (s.status === 'graded') {
        return { icon: 'star', tone: 'ok', name, suffix: `${t('activity_graded')}${s.teacher_grade ? ' · ' + s.teacher_grade : ''}`, when };
      }
      return { icon: 'fileCheck', tone: 'ok', name, suffix: t('activity_submitted'), when };
    })
    .sort((a, b) => new Date(b.when) - new Date(a.when))
    .slice(0, 6);

  const relTime = (iso) => {
    if (!iso) return '';
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    const h = Math.floor(diff / 3600), d = Math.floor(diff / 86400);
    if (d >= 1) return lang === 'uz' ? `${d} kun oldin` : `${d}d ago`;
    if (h >= 1) return lang === 'uz' ? `${h} soat oldin` : `${h}h ago`;
    return lang === 'uz' ? 'Hozir' : 'Just now';
  };

  if (loading) return <div className="dash-spin" />;

  return (
    <div className="view">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('nav_dashboard')}</h1>
          <p className="page-sub">{t('dash_welcome')}</p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="kpis">
        <Kpi icon="students" tone="brand" num={rows.length} label={t('kpi_students')} delta={rows.length ? `${rows.length} ${t('chip_total')}` : t('delta_flat')} up={rows.length > 0} />
        <Kpi icon="user" tone="blue" num={activeStudents} label={t('kpi_active')} flat={t('delta_flat')} />
        <Kpi icon="hourglass" tone="amber" num={pending.length} label={t('kpi_pending')} delta={`${pending.length} ${t('delta_queue')}`} />
        <Kpi icon="star" tone="brand" num={avgGrade} label={t('kpi_avg')} delta={graded.length ? `${graded.length}` : t('delta_flat')} up={graded.length > 0} />
        <Kpi icon="target" tone="brand" num={masteryPct} suffix="%" label={t('kpi_mastery')} delta={`${masteryDone}/${TOTAL}`} up={masteryDone > 0} />
      </div>

      <div className="grid-2">
        {/* alphabet mastery */}
        <div className="card">
          <div className="card-head">
            <div className="card-title"><span className="ct-ico"><Icon name="chart" size={18} /></span>{t('mastery_title')}</div>
            <button className="link-all" onClick={() => router.push('/dashboard/lessons')}>{t('view_all')}<Icon name="arrowR" size={14} /></button>
          </div>
          <div className="mastery-body">
            <div className="mastery-bar-row">
              <div className="mastery-pct">{masteryPct}%</div>
              <div className="mbar"><i style={{ width: masteryPct + '%' }} /></div>
              <div className="mastery-meta">{masteryDone} / {TOTAL} {t('mastery_meta_uz')}</div>
            </div>
            <div className="alpha-grid">
              {letters.map((l, i) => {
                const cls = i < masteryDone ? 'done' : i === masteryCurrentIdx ? 'current' : 'locked';
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

        {/* grading queue */}
        <div className="card">
          <div className="card-head">
            <div className="card-title"><span className="ct-ico"><Icon name="inbox" size={18} /></span>{t('queue_title')}</div>
            {pending.length > 0 && <span className="badge warn">{pending.length}</span>}
          </div>
          {pending.length === 0 ? (
            <div className="empty">
              <div className="ei"><Icon name="checkCircle" size={26} /></div>
              <h4>{t('queue_empty_h')}</h4>
              <p>{t('queue_empty_p')}</p>
            </div>
          ) : (
            <div className="rows">
              {pending.slice(0, 5).map((s) => {
                const letter = letters.find((l) => l.id === s.hw.letter_id);
                return (
                  <div className="lrow" key={s.id} onClick={() => router.push('/dashboard/homework?new=0')} style={{ cursor: 'pointer' }}>
                    <div className="tile ar">{letter?.ar ?? '؟'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="lrow-title">{s.hw.title}</div>
                      <div className="lrow-meta">{s.hw.student?.full_name ?? ''}<span className="sep" /><Icon name="clock" size={12} />{fmtSpent(s.time_spent_seconds, lang)}</div>
                    </div>
                    <span className="badge warn">{t('hw_pending_badge')}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid-2 mt">
        {/* recent graded */}
        <div className="card">
          <div className="card-head">
            <div className="card-title"><span className="ct-ico"><Icon name="fileCheck" size={18} /></span>{t('recent_title')}</div>
            <button className="link-all" onClick={() => router.push('/dashboard/homework')}>{t('view_all')}<Icon name="arrowR" size={14} /></button>
          </div>
          {graded.length === 0 ? (
            <div className="empty"><div className="ei"><Icon name="fileCheck" size={26} /></div><p>{t('hw_none')}</p></div>
          ) : (
            <div className="rows">
              {graded.slice(0, 5).map((s) => {
                const letter = letters.find((l) => l.id === s.hw.letter_id);
                return (
                  <div className="lrow" key={s.id}>
                    <div className="tile ar">{letter?.ar ?? '؟'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="lrow-title">{s.hw.title}</div>
                      <div className="lrow-meta">{s.hw.student?.full_name ?? ''}<span className="sep" /><Icon name="clock" size={12} />{fmtSpent(s.time_spent_seconds, lang)}{s.teacher_grade != null && s.teacher_grade !== '' && <><span className="sep" /><b>{t('dash_grade')}: {s.teacher_grade}</b></>}</div>
                    </div>
                    <span className="badge ok"><Icon name="check" size={12} />{t('hw_graded_badge')}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* activity feed */}
        <div className="card">
          <div className="card-head"><div className="card-title"><span className="ct-ico"><Icon name="clock" size={18} /></span>{t('activity_title')}</div></div>
          {activity.length === 0 ? (
            <div className="empty"><div className="ei"><Icon name="clock" size={26} /></div><p>{t('queue_empty_p')}</p></div>
          ) : (
            <div className="feed">
              {activity.map((a, i) => (
                <div className="fitem" key={i}>
                  <div className={'fdot ' + a.tone}><Icon name={a.icon} size={15} /></div>
                  <div>
                    <div className="ftext"><b>{a.name}</b> {a.suffix}</div>
                    <div className="ftime">{relTime(a.when)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, tone, num, suffix, label, delta, up, flat }) {
  const tones = {
    brand: { bg: 'var(--brand-50)', fg: 'var(--brand)' },
    amber: { bg: 'var(--amber-soft)', fg: 'var(--amber)' },
    blue: { bg: 'var(--blue-soft)', fg: 'var(--blue)' },
  }[tone] || {};
  return (
    <div className="kpi">
      <div className="kpi-top">
        <div className="kpi-ico" style={{ background: tones.bg, color: tones.fg }}><Icon name={icon} size={18} /></div>
        {delta && <span className={'kpi-delta ' + (up ? 'up' : 'flat')}>{up && <Icon name="arrowUp" size={11} />}{delta}</span>}
        {!delta && flat && <span className="kpi-delta flat">{flat}</span>}
      </div>
      <div className="kpi-num">{num}{suffix && <small>{suffix}</small>}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

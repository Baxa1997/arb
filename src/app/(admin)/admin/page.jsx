'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { profileQueries } from '@/lib/queries';
import { useT } from '@/i18n';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminDashboard() {
  const t = useT();
  const [counts, setCounts] = useState({ teachers: 0, students: 0 });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, t] = await Promise.all([profileQueries.counts(), profileQueries.listTeachers()]);
        setCounts(c); setTeachers(t);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8 text-brand-500" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-700">{t('admin_dash_title')}</h1>
          <p className="text-brand-700/55 mt-1">{t('admin_dash_sub')}</p>
        </div>
        <Link href="/admin/teachers" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_8px_20px_rgba(46,125,79,0.25)] transition-all">
          {t('add_teacher')}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        {[
          { label: t('nav_teachers'), value: counts.teachers, icon: '👨‍🏫' },
          { label: t('nav_students'), value: counts.students, icon: '🎓' },
        ].map(s => (
          <div key={s.label} className="bg-cream-50 border border-brand-700/10 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xl mb-4">{s.icon}</div>
            <div className="text-3xl font-extrabold text-brand-700">{s.value}</div>
            <div className="text-sm text-brand-700/50 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-brand-700">{t('recent_teachers')}</h2>
          <Link href="/admin/teachers" className="text-sm text-brand-600 hover:underline font-medium">{t('all')}</Link>
        </div>
        <div className="space-y-2">
          {teachers.slice(0, 6).map(t => (
            <div key={t.id} className="flex items-center gap-3 bg-cream-50 border border-brand-700/10 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-full bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-brand-600 font-bold text-sm">{t.full_name?.[0] ?? 'O'}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-brand-700 truncate">{t.full_name ?? t.email}</div>
                <div className="text-xs text-brand-700/45 truncate">{t.email}</div>
              </div>
            </div>
          ))}
          {teachers.length === 0 && <div className="text-sm text-brand-700/40 bg-cream-50 border border-brand-700/10 rounded-2xl p-6 text-center">{t('no_teachers')}</div>}
        </div>
      </div>
    </div>
  );
}

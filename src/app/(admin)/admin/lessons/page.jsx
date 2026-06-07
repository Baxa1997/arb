'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { letters } from '@/data/letters';
import { letterContentQueries } from '@/lib/queries';
import { useT } from '@/i18n';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminLessonsPage() {
  const t = useT();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    letterContentQueries.getAll().then(setContent).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8 text-brand-500" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-700">{t('lessons_title')}</h1>
        <p className="text-brand-700/55 mt-1">{t('lessons_sub')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {letters.map(l => {
          const c = content[l.id];
          const hasVideo = !!c?.video_url;
          const hasAudio = !!c?.audio_url;
          const hasDesc = !!c?.description;
          return (
            <Link key={l.id} href={`/admin/lessons/${l.id}`}
              className="bg-cream-50 border border-brand-700/10 rounded-2xl p-4 hover:border-brand-500/30 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-cream-100 text-brand-700/50 px-2 py-0.5 rounded-md border border-brand-700/10">{l.id}</span>
                <span className="font-arabic text-3xl text-brand-600">{l.ar}</span>
              </div>
              <div className="font-bold text-brand-700">{l.name}</div>
              <div className="flex gap-1.5 mt-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${hasDesc ? 'bg-brand-500/10 text-brand-600 border-brand-500/20' : 'bg-cream-200 text-brand-700/40 border-brand-700/10'}`}>📖 {hasDesc ? t('badge_has') : t('badge_missing')}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${hasVideo ? 'bg-brand-500/10 text-brand-600 border-brand-500/20' : 'bg-cream-200 text-brand-700/40 border-brand-700/10'}`}>🎬 {hasVideo ? t('badge_has') : t('badge_missing')}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${hasAudio ? 'bg-brand-500/10 text-brand-600 border-brand-500/20' : 'bg-cream-200 text-brand-700/40 border-brand-700/10'}`}>🔊 {hasAudio ? t('badge_has') : t('badge_missing')}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

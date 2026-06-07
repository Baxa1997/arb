'use client';
import { useEffect, useState } from 'react';
import { letters } from '@/data/letters';
import { letterContentQueries, toEmbedUrl } from '@/lib/queries';
import TeachLesson from '@/components/TeachLesson';
import { useT } from '@/i18n';
import { Spinner } from '@/components/ui/Spinner';

// Full-screen, step-by-step teaching experience for one letter.
export default function TeachPage({ params, searchParams }) {
  const t = useT();
  const letterId = Number(params.id);
  const backHref = searchParams?.from || '/dashboard/lessons';
  const base = letters.find(l => l.id === letterId);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    letterContentQueries.getOne(letterId).then(setContent).catch(() => {}).finally(() => setLoading(false));
  }, [letterId]);

  if (!base) return <div className="text-center py-20 text-brand-700/60">{t('lesson_not_found')}</div>;
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="w-8 h-8 text-brand-500" /></div>;

  const letter = {
    ...base,
    description: content?.description || base.description,
    video: content?.video_url ? toEmbedUrl(content.video_url) : base.video,
    audio: content?.audio_url || null,
    examples: content?.examples || null,
    formNote: content?.form_note || base.formNote,
    extraNote: content?.extra_note || null,
  };

  return <TeachLesson letter={letter} letterId={letterId} backHref={backHref} />;
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { letters } from '@/data/letters';
import { useProgress } from '@/hooks/useProgress';
import { letterContentQueries, toEmbedUrl } from '@/lib/queries';
import LessonContent from '@/components/LessonContent';
import { Spinner } from '@/components/ui/Spinner';

export default function LessonPage({ params }) {
  const { id } = params;
  const letterId = Number(id);
  const base = letters.find(l => l.id === letterId);
  const { statusOf, loading } = useProgress();
  const [content, setContent] = useState(null);

  // Merge admin-edited content (description, video, notes) over the static base.
  useEffect(() => {
    letterContentQueries.getOne(letterId).then(setContent).catch(() => {});
  }, [letterId]);

  if (!base) {
    return <div className="text-center py-20 text-brand-700/60">Bunday harf topilmadi.</div>;
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner className="w-8 h-8 text-brand-500" /></div>;
  }

  const letter = {
    ...base,
    description: content?.description || base.description,
    video: content?.video_url ? toEmbedUrl(content.video_url) : base.video,
    audio: content?.audio_url || null,
    examples: content?.examples || null,
    formNote: content?.form_note || base.formNote,
    extraNote: content?.extra_note || null,
  };

  const status = statusOf(letterId);
  const locked = status === 'locked';

  return (
    <div className="space-y-6">
      <Link href="/student/learn/alifbo" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium">
        ← Alifboga qaytish
      </Link>

      {locked ? (
        <div className="max-w-lg mx-auto text-center bg-cream-50 border border-brand-700/10 rounded-3xl p-12 mt-8">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-brand-700 mb-2">Bu dars hali ochilmagan</h2>
          <p className="text-brand-700/60 text-sm">
            Avvalgi darslarni tugating. O'qituvchingiz joriy darsni tasdiqlaganida
            keyingi harf ochiladi.
          </p>
          <Link href="/student/learn/alifbo" className="inline-block mt-6 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">
            Darslarga qaytish
          </Link>
        </div>
      ) : (
        <>
          {status === 'current' && (
            <div className="max-w-4xl mx-auto bg-brand-500/10 border border-brand-500/20 text-brand-700 rounded-2xl px-5 py-3 text-sm font-medium flex items-center gap-2">
              ▶ Bu sizning joriy darsingiz. Tugatgach o'qituvchingiz tasdiqlaydi.
            </div>
          )}
          {status === 'done' && (
            <div className="max-w-4xl mx-auto bg-brand-500/10 border border-brand-500/20 text-brand-600 rounded-2xl px-5 py-3 text-sm font-medium flex items-center gap-2">
              ✓ Bu darsni tugatgansiz.
            </div>
          )}
          <LessonContent letter={letter} />
        </>
      )}
    </div>
  );
}

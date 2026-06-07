'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { letters } from '@/data/letters';
import { letterContentQueries, toEmbedUrl } from '@/lib/queries';
import { useT } from '@/i18n';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminLessonEditPage({ params }) {
  const t = useT();
  const letterId = Number(params.id);
  const letter = letters.find(l => l.id === letterId);

  const [form, setForm] = useState({ description: '', video_url: '', audio_url: '', examples: '', form_note: '', extra_note: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    letterContentQueries.getOne(letterId).then(c => {
      if (c) setForm({
        description: c.description ?? '',
        video_url: c.video_url ?? '',
        audio_url: c.audio_url ?? '',
        examples: c.examples ?? '',
        form_note: c.form_note ?? '',
        extra_note: c.extra_note ?? '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [letterId]);

  if (!letter) return <div className="text-center py-20 text-brand-700/60">{t('lesson_not_found')}</div>;
  if (loading) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8 text-brand-500" /></div>;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null); setSaved(false);
    try {
      await letterContentQueries.upsert(letterId, {
        description: form.description || null,
        video_url: form.video_url || null,
        audio_url: form.audio_url || null,
        examples: form.examples || null,
        form_note: form.form_note || null,
        extra_note: form.extra_note || null,
      });
      setSaved(true);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const onAudioFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError(null); setSaved(false);
    try {
      const url = await letterContentQueries.uploadAudio(letterId, file);
      setForm(f => ({ ...f, audio_url: url }));
    } catch (err) { setError(err.message); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const embed = toEmbedUrl(form.video_url);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/lessons" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium">{t('lesson_back')}</Link>

      <div className="bg-cream-50 border border-brand-700/10 rounded-2xl p-6 flex items-center gap-4">
        <span className="font-arabic text-6xl text-brand-600">{letter.ar}</span>
        <div>
          <h1 className="text-2xl font-extrabold text-brand-700">{letter.name}</h1>
          <p className="text-brand-700/50 text-sm">{letter.id} · {letter.type} · {letter.group}</p>
        </div>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">{error}</div>}
      {saved && <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 text-sm">{t('lesson_saved')}</div>}

      <form onSubmit={save} className="bg-cream-50 border border-brand-700/10 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-bold text-brand-700 mb-2">{t('f_desc')}</label>
          <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder={t('f_desc_ph')}
            className="w-full bg-cream-100 border border-brand-700/15 text-brand-700 placeholder-brand-700/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-700 mb-2">{t('f_video')}</label>
          <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full bg-cream-100 border border-brand-700/15 text-brand-700 placeholder-brand-700/30 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          {embed && (
            <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-black max-w-md">
              <iframe className="w-full h-full" src={embed} title="preview" allowFullScreen />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-700 mb-2">{t('f_audio')}</label>
          <p className="text-xs text-brand-700/45 mb-2">{t('f_audio_hint')}</p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 bg-brand-500/10 hover:bg-brand-500/15 text-brand-600 border border-brand-500/20 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors">
              {uploading ? t('audio_uploading') : t('audio_upload')}
              <input type="file" accept="audio/*" onChange={onAudioFile} disabled={uploading} className="hidden" />
            </label>
            {form.audio_url && (
              <>
                <audio controls src={form.audio_url} className="h-9 max-w-[220px]" />
                <button type="button" onClick={() => setForm(f => ({ ...f, audio_url: '' }))}
                  className="text-xs text-red-600 hover:underline">{t('act_delete')}</button>
              </>
            )}
          </div>
          <input value={form.audio_url} onChange={e => setForm(f => ({ ...f, audio_url: e.target.value }))}
            placeholder="yoki audio havolasi: https://.../alif.mp3"
            className="mt-3 w-full bg-cream-100 border border-brand-700/15 text-brand-700 placeholder-brand-700/30 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-700 mb-2">{t('f_examples')}</label>
          <p className="text-xs text-brand-700/45 mb-2">{t('f_examples_hint')}</p>
          <textarea rows={3} value={form.examples} onChange={e => setForm(f => ({ ...f, examples: e.target.value }))}
            placeholder={"بَاب — eshik\nكِتَاب — kitob"}
            className="w-full bg-cream-100 border border-brand-700/15 text-brand-700 placeholder-brand-700/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-700 mb-2">{t('f_formnote')}</label>
          <input value={form.form_note} onChange={e => setForm(f => ({ ...f, form_note: e.target.value }))}
            placeholder={letter.formNote || "Yozilish bo'yicha izoh"}
            className="w-full bg-cream-100 border border-brand-700/15 text-brand-700 placeholder-brand-700/30 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-700 mb-2">{t('f_extranote')}</label>
          <textarea rows={3} value={form.extra_note} onChange={e => setForm(f => ({ ...f, extra_note: e.target.value }))}
            placeholder={t('f_extranote_ph')}
            className="w-full bg-cream-100 border border-brand-700/15 text-brand-700 placeholder-brand-700/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
        </div>

        <div className="flex items-center gap-3">
          <button disabled={saving} className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all">
            {saving ? t('act_saving') : t('act_save')}
          </button>
        </div>
      </form>
    </div>
  );
}

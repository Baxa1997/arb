'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { homeworkQueries } from '@/lib/queries';
import { letters } from '@/data/letters';
import { useT } from '@/i18n';
import { Spinner } from '@/components/ui/Spinner';

function fmt(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function HomeworkDetailPage({ params }) {
  const t = useT();
  const { id } = params;
  const { profile } = useAuthStore();
  const router = useRouter();

  const [hw, setHw] = useState(null);
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const mimeRef = useRef('audio/webm');

  const readOnly = sub && sub.status !== 'in_progress';

  // Load homework + ensure an in-progress submission exists, then start timer.
  useEffect(() => {
    if (!profile?.id) return;
    (async () => {
      try {
        const data = await homeworkQueries.getHomework(id);
        setHw(data);
        if (!data) return;
        const existing = (data.homework_submissions ?? []).find(s => s.student_id === profile.id);
        if (existing && existing.status !== 'in_progress') {
          setSub(existing);
          setText(existing.content_text ?? '');
        } else {
          const started = await homeworkQueries.startSubmission(id, profile.id);
          setSub(started);
          setText(started.content_text ?? '');
          // Base the timer on started_at so the elapsed time survives refreshes
          // and reopening — otherwise the recorded "time spent" would reset to 0.
          if (started.started_at) {
            const elapsed = Math.floor((Date.now() - new Date(started.started_at).getTime()) / 1000);
            setSeconds(Math.max(0, elapsed));
          }
        }
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [id, profile?.id]);

  // Live timer (only while actively working).
  useEffect(() => {
    if (loading || readOnly) return;
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [loading, readOnly]);

  // Stable preview URLs — created only when the file/recording changes, NOT on
  // every timer tick (otherwise the <audio>/<img> src would reset each second
  // and the student could never play back their own recording).
  useEffect(() => {
    if (!audioBlob) { setAudioUrl(null); return; }
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioBlob]);

  useEffect(() => {
    if (!imageFile) { setImageUrl(null); return; }
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const startRecording = async () => {
    setError(null);
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError("Brauzer mikrofonni qo'llab-quvvatlamaydi (HTTPS yoki localhost kerak).");
      return;
    }
    if (typeof MediaRecorder === 'undefined') {
      setError('Bu brauzerda ovoz yozish imkoni yo\'q.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Pick a MIME type this browser actually supports (Safari ≠ Chrome).
      const candidates = ['audio/webm', 'audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg'];
      const mime = candidates.find(m => MediaRecorder.isTypeSupported?.(m)) || '';
      mimeRef.current = mime || 'audio/webm';
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        setAudioBlob(new Blob(chunksRef.current, { type: mimeRef.current }));
        stream.getTracks().forEach(t => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch (e) {
      const msg = e?.name === 'NotAllowedError'
        ? 'Mikrofonga ruxsat berilmadi. Brauzer sozlamalaridan ruxsat bering.'
        : `Mikrofondan foydalanib bo'lmadi: ${e?.message || e?.name || 'xatolik'}`;
      setError(msg);
    }
  };
  const stopRecording = () => { recorderRef.current?.stop(); setRecording(false); };

  const submit = async () => {
    if (recording) { setError(t('err_stop_recording')); return; }
    if (!text.trim() && !imageFile && !audioBlob) {
      setError(t('err_empty_submit'));
      return;
    }
    setSubmitting(true); setError(null);
    try {
      let file_url = null, audio_url = null;
      if (imageFile) file_url = await homeworkQueries.uploadFile('homework-images', profile.id, imageFile);
      if (audioBlob) {
        const ext = mimeRef.current.includes('mp4') ? 'm4a' : mimeRef.current.includes('ogg') ? 'ogg' : 'webm';
        audio_url = await homeworkQueries.uploadFile('homework-audio', profile.id, new File([audioBlob], `voice.${ext}`, { type: mimeRef.current }));
      }
      await homeworkQueries.submitHomework(sub.id, {
        content_text: text || null,
        file_url, audio_url,
        time_spent_seconds: seconds,
      });
      router.push('/student/homework');
    } catch (e) { setError(e.message); setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8 text-brand-500" /></div>;
  if (!hw) return <div className="text-center py-20 text-brand-700/60">{t('hw_not_found')}</div>;

  const allowed = hw.allowed_types ?? ['text', 'image', 'audio'];
  const letter = letters.find(l => l.id === hw.letter_id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/student/homework" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium">{t('hw_back')}</Link>

      {/* Header with live timer */}
      <div className="bg-cream-50 border border-brand-700/10 rounded-2xl p-6 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          {letter && <span className="font-arabic text-5xl text-brand-600">{letter.ar}</span>}
          <div>
            <h1 className="text-2xl font-extrabold text-brand-700">{hw.title}</h1>
            {hw.instructions && <p className="text-brand-700/60 text-sm mt-1 max-w-lg">{hw.instructions}</p>}
            {hw.due_date && <p className="text-brand-700/40 text-xs mt-2">{t('due_label')}: {hw.due_date}</p>}
          </div>
        </div>
        {!readOnly && (
          <div className="text-center bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-2">
            <div className="text-2xl font-extrabold text-brand-600 tabular-nums">{fmt(seconds)}</div>
            <div className="text-[10px] text-brand-700/50 font-bold uppercase tracking-wider">{t('hw_time')}</div>
          </div>
        )}
      </div>

      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">{error}</div>}

      {readOnly ? (
        /* ---- Submitted / graded view ---- */
        <div className="bg-cream-50 border border-brand-700/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-brand-500/15 text-brand-600 px-3 py-1 rounded-full font-bold">
              {sub.status === 'graded' ? `${t('hw_grade')}: ${sub.teacher_grade ?? '✓'}` : t('st_submitted')}
            </span>
            <span className="text-brand-700/50">⏱ {fmt(sub.time_spent_seconds ?? 0)} {t('hw_spent')}</span>
          </div>
          {sub.content_text && <p className="text-brand-700/80 bg-cream-100 border border-brand-700/10 rounded-xl p-3 whitespace-pre-wrap">{sub.content_text}</p>}
          {sub.file_url && <img src={sub.file_url} alt="" className="max-h-72 rounded-xl border border-brand-700/10" />}
          {sub.audio_url && <audio controls src={sub.audio_url} className="w-full" />}
          {sub.teacher_feedback && (
            <div className="bg-brand-500/8 border border-brand-500/15 rounded-xl p-4">
              <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">{t('hw_teacher_feedback')}</div>
              <p className="text-brand-700/80 text-sm">{sub.teacher_feedback}</p>
            </div>
          )}
        </div>
      ) : (
        /* ---- Working view ---- */
        <div className="space-y-5">
          {allowed.includes('text') && (
            <div className="bg-cream-50 border border-brand-700/10 rounded-2xl p-5">
              <label className="block text-sm font-bold text-brand-700 mb-2">{t('hw_written')}</label>
              <textarea rows={5} value={text} onChange={e => setText(e.target.value)} placeholder={t('hw_written_ph')}
                className="w-full bg-cream-100 border border-brand-700/15 text-brand-700 placeholder-brand-700/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
            </div>
          )}

          {allowed.includes('image') && (
            <div className="bg-cream-50 border border-brand-700/10 rounded-2xl p-5">
              <label className="block text-sm font-bold text-brand-700 mb-2">{t('hw_image')}</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-brand-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-500 file:text-white file:font-semibold hover:file:bg-brand-600" />
              {imageUrl && <img src={imageUrl} alt="" className="mt-3 max-h-52 rounded-xl border border-brand-700/10" />}
            </div>
          )}

          {allowed.includes('audio') && (
            <div className="bg-cream-50 border border-brand-700/10 rounded-2xl p-5">
              <label className="block text-sm font-bold text-brand-700 mb-2">{t('hw_voice')}</label>
              <div className="flex items-center gap-3">
                {recording ? (
                  <button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" /> {t('hw_stop')}
                  </button>
                ) : (
                  <button onClick={startRecording} className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm">{t('hw_record')}</button>
                )}
                {audioBlob && !recording && <span className="text-brand-600 text-sm font-medium">{t('hw_recorded')}</span>}
              </div>
              {audioUrl && <audio controls src={audioUrl} className="w-full mt-3" />}
            </div>
          )}

          <button onClick={submit} disabled={submitting}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-[0_10px_25px_rgba(46,125,79,0.25)] transition-all">
            {submitting ? t('hw_submitting') : `${t('hw_submit')} (${fmt(seconds)})`}
          </button>
          <p className="text-center text-xs text-brand-700/40">{t('hw_submit_note')}</p>
        </div>
      )}
    </div>
  );
}

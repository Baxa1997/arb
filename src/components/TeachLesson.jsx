'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AudioPlayer from './AudioPlayer';
import LanguageToggle from './LanguageToggle';
import { useT } from '@/i18n';
import { useLang } from '@/i18n';
import { parseSifatTerms, sifatDef } from '@/data/sifat';

// Muallim Sani-style reading combinations built from the isolated glyph.
function buildUsages(a) {
  return [
    { key: 'u_harakat', items: [`${a}َ`, `${a}ِ`, `${a}ُ`] },
    { key: 'u_tanwin',  items: [`${a}ً`, `${a}ٍ`, `${a}ٌ`] },
    { key: 'u_madd',    items: [`${a}َا`, `${a}ِي`, `${a}ُو`] },
    { key: 'u_sukun',   items: [`${a}ْ`] },
    { key: 'u_shadda',  items: [`${a}َّ`] },
  ];
}

function UsageGroup({ label, items, size = 'text-4xl' }) {
  return (
    <div className="bg-cream-100 border border-brand-700/10 rounded-2xl p-4">
      <div className="text-[11px] font-bold text-brand-500 uppercase tracking-wider mb-3">{label}</div>
      <div className="flex flex-wrap gap-3 justify-center" dir="rtl">
        {items.map((it, i) => (
          <span key={i} className={`font-arabic ${size} text-brand-700`}>{it}</span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Reusable presentation primitives
   ───────────────────────────────────────────── */
function StageShell({ icon, kicker, title, children }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-2xl">{icon}</span>
        <div>
          <div className="text-[11px] font-bold text-brand-500 uppercase tracking-widest">{kicker}</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-700 leading-tight">{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
}

function MouthDiagram({ letter }) {
  return (
    <div className="bg-cream-100 border border-brand-700/10 rounded-3xl flex items-center justify-center p-6">
      <svg viewBox="0 0 200 250" className="w-full max-w-[260px]" stroke="currentColor" fill="none">
        <defs>
          <linearGradient id="teachskin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EADFC4" />
            <stop offset="100%" stopColor="#D4C193" />
          </linearGradient>
        </defs>
        <path d="M 60 20 C 60 20, 10 50, 10 100 C 10 150, 30 180, 50 240 L 150 240 C 190 180, 190 120, 150 70 L 120 20 Z" fill="url(#teachskin)" stroke="#A88B4d" strokeWidth="2" opacity="0.85" />
        <path d="M 50 80 Q 70 70 100 85 Q 110 95 90 100 Q 70 100 50 80 Z" fill="#8AA193" opacity="0.4" />
        <path d="M 50 110 Q 70 100 100 100 Q 120 100 130 130" stroke="#1F3D2B" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
        <rect x="44" y="110" width="6" height="10" fill="#fff" stroke="#A88B4d" opacity="0.7" />
        <rect x="44" y="125" width="6" height="10" fill="#fff" stroke="#A88B4d" opacity="0.7" />
        <path d="M 50 130 Q 90 120 120 140 Q 130 170 130 200 L 90 200 Q 70 160 50 130 Z" fill="#c0392b" stroke="#7f1d1d" strokeWidth="2" opacity="0.5" />
        <g transform={`translate(${letter.makhrajX}, ${letter.makhrajY})`}>
          <circle cx="0" cy="0" r="16" fill="#2E7D4F" opacity="0.25" className="animate-ping" />
          <circle cx="0" cy="0" r="7" fill="#2E7D4F" />
          <circle cx="0" cy="0" r="2.5" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Build the teaching stages from the letter data.
   Empty stages (no examples / video / quiz) are skipped.
   ───────────────────────────────────────────── */
function useStages(letter, t, lang) {
  return useMemo(() => {
    const objective = lang === 'en'
      ? `Recognize, correctly pronounce, and write the letter “${letter.name}”.`
      : `“${letter.name}” harfini tanish, to‘g‘ri talaffuz qilish va yozishni o‘rganish.`;

    const stages = [];

    // 1 — Introduction
    stages.push({
      key: 'intro', icon: '🎯', title: t('stage_intro'),
      node: (
        <StageShell icon="🎯" kicker={`${t('teach_step')} 1`} title={t('stage_intro')}>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="bg-gradient-to-br from-brand-500/12 to-cream-50 border border-brand-500/20 rounded-3xl p-10 flex items-center justify-center">
              <span className="font-arabic text-[160px] leading-none text-brand-600">{letter.ar}</span>
            </div>
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className="bg-cream-100 border border-brand-700/10 text-brand-700/70 px-3 py-1 rounded-full text-xs font-medium">{letter.id} / 28</span>
                <span className="bg-brand-500/10 border border-brand-500/20 text-brand-600 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">{letter.type}</span>
                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-700 px-3 py-1 rounded-full text-xs font-medium capitalize">{letter.group}</span>
                {!letter.connects && <span className="bg-brand-700/10 border border-brand-700/15 text-brand-700 px-3 py-1 rounded-full text-xs font-medium">⛓️</span>}
              </div>
              <div className="bg-brand-500/8 border border-brand-500/15 rounded-2xl p-5">
                <div className="text-[11px] font-bold text-brand-500 uppercase tracking-widest mb-1">{t('teach_objective')}</div>
                <p className="text-brand-700 font-semibold leading-relaxed">{objective}</p>
              </div>
              {letter.description && <p className="text-brand-700/70 leading-relaxed">{letter.description}</p>}
            </div>
          </div>

          {/* Muallim Sani — different readings of the letter */}
          <div className="mt-6">
            <div className="text-sm font-bold text-brand-700 mb-3">📖 {t('teach_usages')}</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {buildUsages(letter.forms.alohida).map(g => (
                <UsageGroup key={g.key} label={t(g.key)} items={g.items} size="text-3xl" />
              ))}
            </div>
          </div>
        </StageShell>
      ),
    });

    // 2 — Pronunciation / makhraj
    stages.push({
      key: 'makhraj', icon: '🫁', title: t('stage_makhraj'),
      node: (
        <StageShell icon="🫁" kicker={t('stage_makhraj')} title={letter.makhraj}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="bg-brand-500/8 border border-brand-500/15 rounded-2xl p-5">
                <div className="text-sm font-bold text-brand-700 mb-1">🔊 {t('teach_listen')}</div>
                <p className="text-brand-700/60 text-sm mb-4">{t('teach_listen_hint')}</p>
                <AudioPlayer letter={letter} />
              </div>
              <div className="bg-cream-100 border border-brand-700/10 rounded-2xl p-5">
                <div className="text-brand-700/50 text-xs font-bold uppercase tracking-wider mb-2">{t('t_group_letters')}</div>
                <div className="font-bold text-brand-700 mb-2">{letter.makhrajGroup}</div>
                <div className="flex gap-2 flex-wrap">
                  {letter.makhrajGroupLetters.map((l, i) => (
                    <span key={i} className="font-arabic text-2xl bg-cream-50 w-11 h-11 flex items-center justify-center rounded-xl border border-brand-700/10 text-amber-700">{l}</span>
                  ))}
                </div>
              </div>
            </div>
            <MouthDiagram letter={letter} />
          </div>
        </StageShell>
      ),
    });

    // 3 — Characteristics / sifat
    if (letter.harakatliSifat || letter.sukunliSifat || letter.rules?.length) {
      stages.push({
        key: 'sifat', icon: '📋', title: t('stage_sifat'),
        node: (
          <StageShell icon="📋" kicker={t('stage_sifat')} title={t('stage_sifat')}>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div className="bg-cream-100 border border-brand-700/10 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-brand-500" />
                <div className="text-brand-700/60 font-medium mb-3 mt-1">{t('t_harakatli')}</div>
                <div className="bg-brand-500/10 text-brand-600 border border-brand-500/20 px-4 py-1.5 rounded-xl text-sm font-bold w-max mx-auto mb-4">{letter.harakatliSifat}</div>
                <div className="flex justify-center gap-5 font-arabic text-5xl text-brand-700" dir="rtl">
                  <span>{letter.forms.alohida}َ</span><span>{letter.forms.alohida}ِ</span><span>{letter.forms.alohida}ُ</span>
                </div>
              </div>
              <div className="bg-cream-100 border border-brand-700/10 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-red-500" />
                <div className="text-brand-700/60 font-medium mb-3 mt-1">{t('t_sukunli')}</div>
                <div className="bg-red-500/10 text-red-600 border border-red-500/20 px-4 py-1.5 rounded-xl text-sm font-bold w-max mx-auto mb-4">{letter.sukunliSifat}</div>
                <div className="flex justify-center gap-5 font-arabic text-5xl text-brand-700" dir="rtl">
                  <span>{letter.forms.alohida}ْ</span>
                </div>
              </div>
            </div>
            {/* Definitions of each sifat named on this letter */}
            {(() => {
              const terms = [...new Set([
                ...parseSifatTerms(letter.harakatliSifat),
                ...parseSifatTerms(letter.sukunliSifat),
              ])];
              const defined = terms.map(term => ({ term, def: sifatDef(term, lang) })).filter(x => x.def);
              if (defined.length === 0) return null;
              return (
                <div>
                  <div className="text-sm font-bold text-brand-700 mb-3">📖 {t('sifat_defs_title')}</div>
                  <div className="space-y-2.5">
                    {defined.map(({ term, def }, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-cream-100 border border-brand-700/10">
                        <span className="bg-brand-500/10 text-brand-600 border border-brand-500/20 px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">{term}</span>
                        <p className="text-brand-700/75 text-sm leading-relaxed pt-0.5">{def}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </StageShell>
        ),
      });
    }

    // 4 — Writing forms
    stages.push({
      key: 'writing', icon: '🔤', title: t('stage_writing'),
      node: (
        <StageShell icon="🔤" kicker={t('stage_writing')} title={t('t_writing_forms')}>
          <div className="bg-cream-100 rounded-3xl border border-brand-700/10 overflow-x-auto">
            <table className="w-full text-center min-w-[420px]" dir="rtl">
              <thead>
                <tr className="bg-cream-200 border-b border-brand-700/10 text-brand-700/60 text-sm">
                  <th className="py-3">{t('t_form_iso')}</th>
                  <th className="py-3">{t('t_form_init')}</th>
                  <th className="py-3">{t('t_form_med')}</th>
                  <th className="py-3">{t('t_form_final')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-arabic text-6xl text-brand-700">
                  <td className="py-10 border-l border-brand-700/10">{letter.forms.alohida}</td>
                  <td className="py-10 border-l border-brand-700/10">{letter.forms.boshida}</td>
                  <td className="py-10 border-l border-brand-700/10">{letter.forms.ortasida}</td>
                  <td className="py-10">{letter.forms.oxirida}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {letter.formNote && (
            <div className="mt-5 flex gap-3 text-brand-600 bg-brand-500/8 p-4 rounded-2xl border border-brand-500/15">
              <span className="text-lg">✍️</span>
              <p className="text-sm leading-relaxed">{letter.formNote}</p>
            </div>
          )}
        </StageShell>
      ),
    });

    // 5 — Examples (admin-provided)
    if (letter.examples) {
      stages.push({
        key: 'examples', icon: '📝', title: t('stage_examples'),
        node: (
          <StageShell icon="📝" kicker={t('stage_examples')} title={t('stage_examples')}>
            <div className="bg-cream-100 border border-brand-700/10 rounded-3xl p-6 md:p-8 text-brand-700/85 leading-loose whitespace-pre-wrap text-xl">
              {letter.examples}
            </div>
          </StageShell>
        ),
      });
    }

    // 7 — Video
    if (letter.video) {
      stages.push({
        key: 'video', icon: '🎬', title: t('stage_video'),
        node: (
          <StageShell icon="🎬" kicker={t('stage_video')} title={t('stage_video')}>
            <div className="relative w-full rounded-3xl overflow-hidden aspect-video bg-black shadow-lg">
              <iframe className="w-full h-full" src={letter.video} title={`${letter.name} video`} allowFullScreen />
            </div>
          </StageShell>
        ),
      });
    }

    // 8 — Practice: reading drill (more examples, not a test)
    stages.push({
      key: 'practice', icon: '🗣️', title: t('stage_practice'),
      node: (
        <StageShell icon="🗣️" kicker={t('stage_practice')} title={t('stage_practice')}>
          <p className="text-brand-700/60 mb-5">{t('teach_practice_hint')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {buildUsages(letter.forms.alohida).map(g => (
              <UsageGroup key={g.key} label={t(g.key)} items={g.items} size="text-5xl" />
            ))}
            {/* connected-form reading row */}
            <UsageGroup label={t('u_connected')} items={[letter.forms.boshida, letter.forms.ortasida, letter.forms.oxirida]} size="text-5xl" />
          </div>
          {letter.examples && (
            <div className="mt-5 bg-brand-500/8 border border-brand-500/15 rounded-2xl p-5">
              <div className="text-sm font-bold text-brand-700 mb-2">📝 {t('stage_examples')}</div>
              <div className="text-brand-700/80 leading-loose whitespace-pre-wrap text-lg">{letter.examples}</div>
            </div>
          )}
        </StageShell>
      ),
    });

    return stages;
  }, [letter, t, lang]);
}

/* ─────────────────────────────────────────────
   Main teaching experience
   ───────────────────────────────────────────── */
export default function TeachLesson({ letter, letterId, backHref = '/dashboard/lessons' }) {
  const t = useT();
  const lang = useLang(s => s.lang);
  const router = useRouter();
  const stages = useStages(letter, t, lang);
  const [step, setStep] = useState(0);

  // Keep the "where did I come from" context across letter navigation.
  const teachHref = (id) => `/teach/${id}?from=${encodeURIComponent(backHref)}`;

  // Reset to first stage whenever the letter changes.
  useEffect(() => { setStep(0); }, [letterId]);

  const atFirst = step === 0;
  const atLast = step === stages.length - 1;
  const prevId = letterId > 1 ? letterId - 1 : null;
  const nextId = letterId < 28 ? letterId + 1 : null;

  const goPrev = () => { if (!atFirst) setStep(s => s - 1); };
  const goNext = () => { if (!atLast) setStep(s => s + 1); else if (nextId) router.push(teachHref(nextId)); };

  // Keyboard: ← / → step through stages, Esc exits to where we came from.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') router.push(backHref);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, stages.length, nextId, backHref]);

  const pct = Math.round(((step + 1) / stages.length) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toolbar */}
      <header className="sticky top-0 z-20 bg-cream-50/95 backdrop-blur-xl border-b border-brand-700/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-arabic text-3xl text-brand-600">{letter.ar}</span>
            <div className="min-w-0">
              <div className="font-extrabold text-brand-700 leading-tight truncate">{letter.name}</div>
              <div className="text-[11px] text-brand-700/45">{t('teach_step')} {step + 1} / {stages.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={prevId ? teachHref(prevId) : '#'} aria-disabled={!prevId}
              className={`hidden sm:flex w-9 h-9 items-center justify-center rounded-xl border text-sm font-bold transition-all ${prevId ? 'border-brand-700/15 text-brand-700/60 hover:bg-brand-500/10 hover:text-brand-600' : 'border-brand-700/10 text-brand-700/25 pointer-events-none'}`}
              title={t('teach_prev_letter')}>‹‹</Link>
            <Link href={nextId ? teachHref(nextId) : '#'} aria-disabled={!nextId}
              className={`hidden sm:flex w-9 h-9 items-center justify-center rounded-xl border text-sm font-bold transition-all ${nextId ? 'border-brand-700/15 text-brand-700/60 hover:bg-brand-500/10 hover:text-brand-600' : 'border-brand-700/10 text-brand-700/25 pointer-events-none'}`}
              title={t('teach_next_letter')}>››</Link>
            <LanguageToggle />
            <Link href={backHref} title={t('teach_exit')}
              className="ml-1 w-9 h-9 flex items-center justify-center rounded-xl border border-brand-700/15 text-brand-700/60 hover:bg-red-500/10 hover:text-red-600 transition-all text-lg leading-none">✕</Link>
          </div>
        </div>
        {/* progress bar */}
        <div className="h-1 bg-cream-200">
          <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </header>

      {/* Stage roadmap (clickable) */}
      <div className="border-b border-brand-700/10 bg-cream-50/60">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex gap-2 overflow-x-auto">
          {stages.map((s, i) => (
            <button key={s.key} onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                i === step ? 'bg-brand-500 text-white border-brand-500'
                : i < step ? 'bg-brand-500/10 text-brand-600 border-brand-500/20'
                : 'bg-cream-100 text-brand-700/50 border-brand-700/10 hover:text-brand-700'
              }`}>
              <span>{s.icon}</span>{s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active stage */}
      <main className="flex-1 px-4 md:px-6 py-8 md:py-12">
        {stages[step]?.node}
      </main>

      {/* Footer nav */}
      <footer className="sticky bottom-0 bg-cream-50/95 backdrop-blur-xl border-t border-brand-700/10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <button onClick={goPrev} disabled={atFirst}
            className="px-5 py-2.5 rounded-xl text-sm font-bold border border-brand-700/15 text-brand-700/70 hover:bg-brand-500/10 hover:text-brand-600 disabled:opacity-30 disabled:pointer-events-none transition-all">
            ← {t('teach_prev')}
          </button>
          <div className="hidden sm:flex gap-1.5">
            {stages.map((s, i) => (
              <span key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-brand-500 w-5' : i < step ? 'bg-brand-500/40' : 'bg-brand-700/15'}`} />
            ))}
          </div>
          {atLast && !nextId ? (
            <Link href={backHref}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white transition-all">
              {t('teach_finish')} ✓
            </Link>
          ) : (
            <button onClick={goNext}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white transition-all">
              {atLast ? `${t('teach_next_letter')} →` : `${t('teach_next')} →`}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

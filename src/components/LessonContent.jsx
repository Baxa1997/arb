'use client';
import AudioPlayer from './AudioPlayer';
import QuizBlock from './QuizBlock';

function Section({ icon, title, children }) {
  return (
    <section className="bg-cream-50 border border-brand-700/10 rounded-3xl p-6 md:p-8 shadow-sm">
      <h2 className="flex items-center gap-3 text-lg font-bold text-brand-700 mb-6">
        <span className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xl">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const RULE_COLORS = {
  green:  'border-brand-500 bg-brand-500/5 text-brand-600',
  yellow: 'border-amber-500 bg-amber-500/5 text-amber-700',
  purple: 'border-brand-700 bg-brand-700/5 text-brand-700',
};

export default function LessonContent({ letter }) {
  if (!letter) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────── */}
      <div className="bg-gradient-to-br from-brand-500/10 to-cream-50 border border-brand-700/10 rounded-3xl p-6 md:p-8 flex items-center gap-6 shadow-sm">
        <div className="font-arabic text-7xl md:text-8xl text-brand-600 leading-none">{letter.ar}</div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-700 mb-3">{letter.name}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-cream-100 border border-brand-700/10 text-brand-700/70 px-3 py-1 rounded-full text-xs font-medium">{letter.id}-harf</span>
            <span className="bg-brand-500/10 border border-brand-500/20 text-brand-600 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">{letter.type} harfi</span>
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-700 px-3 py-1 rounded-full text-xs font-medium capitalize">{letter.group} guruh</span>
            {!letter.connects && (
              <span className="bg-brand-700/10 border border-brand-700/15 text-brand-700 px-3 py-1 rounded-full text-xs font-medium">⛓️ Ulanmaydigan</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Description / what is needed ───────── */}
      <Section icon="📖" title="Harf haqida">
        <p className="text-brand-700/75 leading-relaxed text-base">
          {letter.description ?? (
            <>
              <span className="font-semibold text-brand-700">{letter.name}</span> — arab alifbosining {letter.id}-harfi.
              Bu <span className="font-semibold">{letter.type}</span> harfi bo'lib, <span className="font-semibold">{letter.group}</span> guruhiga kiradi.
              Maxraji: {letter.makhraj}.
              {letter.connects ? ' Harf ikki tomonga ulanadi.' : ' Bu harf o\'zidan keyingi harfga ulanmaydi.'}
            </>
          )}
        </p>
        {letter.extraNote && (
          <div className="mt-4 bg-brand-500/8 border border-brand-500/15 rounded-2xl p-4 text-sm text-brand-700/80 whitespace-pre-wrap">
            {letter.extraNote}
          </div>
        )}
      </Section>

      {/* ── Examples / misollar (admin-editable) ── */}
      {letter.examples && (
        <Section icon="📝" title="Misollar">
          <div className="text-brand-700/80 leading-relaxed whitespace-pre-wrap text-base">{letter.examples}</div>
        </Section>
      )}

      {/* ── Pronunciation / talaffuz ──────────── */}
      <Section icon="🎙️" title="Talaffuz">
        <div className="space-y-6">
          <AudioPlayer letter={letter} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-cream-100 border border-brand-700/10 rounded-2xl p-5 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-brand-500" />
              <h4 className="text-brand-700/60 font-medium mb-4 mt-1">Harakatli holatda</h4>
              <div className="bg-brand-500/10 text-brand-600 border border-brand-500/20 px-4 py-1.5 rounded-xl text-sm font-bold w-max mx-auto mb-5">{letter.harakatliSifat}</div>
              <div className="flex justify-center gap-6 font-arabic text-5xl text-brand-700" dir="rtl">
                <span>{letter.forms.alohida}َ</span>
                <span>{letter.forms.alohida}ِ</span>
                <span>{letter.forms.alohida}ُ</span>
              </div>
            </div>
            <div className="bg-cream-100 border border-brand-700/10 rounded-2xl p-5 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-red-500" />
              <h4 className="text-brand-700/60 font-medium mb-4 mt-1">Sukunli holatda</h4>
              <div className="bg-red-500/10 text-red-600 border border-red-500/20 px-4 py-1.5 rounded-xl text-sm font-bold w-max mx-auto mb-5">{letter.sukunliSifat}</div>
              <div className="flex justify-center gap-6 font-arabic text-5xl text-brand-700" dir="rtl">
                <span>{letter.forms.alohida}ْأَ</span>
                <span>{letter.forms.alohida}ْإِ</span>
                <span>{letter.forms.alohida}ْأُ</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Writing forms ─────────────────────── */}
      <Section icon="🔤" title="Yozilish shakllari">
        <div className="bg-cream-100 rounded-2xl border border-brand-700/10 overflow-x-auto">
          <table className="w-full text-center min-w-[420px]" dir="rtl">
            <thead>
              <tr className="bg-cream-200 border-b border-brand-700/10 text-brand-700/60 text-sm">
                <th className="py-3">Alohida</th>
                <th className="py-3">Boshida</th>
                <th className="py-3">O'rtasida</th>
                <th className="py-3">Oxirida</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-arabic text-5xl text-brand-700">
                <td className="py-7 border-l border-brand-700/10">{letter.forms.alohida}</td>
                <td className="py-7 border-l border-brand-700/10">{letter.forms.boshida}</td>
                <td className="py-7 border-l border-brand-700/10">{letter.forms.ortasida}</td>
                <td className="py-7">{letter.forms.oxirida}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {letter.formNote && (
          <div className="mt-5 flex gap-3 text-brand-600 bg-brand-500/8 p-4 rounded-2xl border border-brand-500/15">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm leading-relaxed">{letter.formNote}</p>
          </div>
        )}
      </Section>

      {/* ── Makhraj — mouth illustration ──────── */}
      <Section icon="🫁" title="Maxraj (talaffuz manbasi)">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-cream-100 border border-brand-500/20 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-4 bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold">Maxraj mintaqasi</div>
            <p className="text-xl font-bold text-brand-700 mt-8 leading-snug">📍 {letter.makhraj}</p>
            <div className="mt-6 bg-cream-50 rounded-2xl p-4 border border-brand-700/10">
              <div className="text-brand-700/50 text-xs font-bold uppercase tracking-wider mb-2">Guruh harflari</div>
              <h4 className="text-brand-700 font-bold">{letter.makhrajGroup}</h4>
              {letter.makhrajGroupDesc && <p className="text-brand-700/60 text-sm mb-3 mt-1">{letter.makhrajGroupDesc}</p>}
              <div className="flex gap-2 flex-wrap mt-2">
                {letter.makhrajGroupLetters.map((l, i) => (
                  <span key={i} className="font-arabic text-2xl bg-cream-100 w-11 h-11 flex items-center justify-center rounded-xl border border-brand-700/10 text-amber-700">{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Head / mouth SVG with dynamic makhraj indicator */}
          <div className="bg-cream-100 border border-brand-700/10 rounded-2xl flex items-center justify-center p-6">
            <svg viewBox="0 0 200 250" className="w-full max-w-[230px]" stroke="currentColor" fill="none">
              <defs>
                <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EADFC4" />
                  <stop offset="100%" stopColor="#D4C193" />
                </linearGradient>
              </defs>
              <path d="M 60 20 C 60 20, 10 50, 10 100 C 10 150, 30 180, 50 240 L 150 240 C 190 180, 190 120, 150 70 L 120 20 Z" fill="url(#skin)" stroke="#A88B4d" strokeWidth="2" opacity="0.85" />
              <path d="M 50 80 Q 70 70 100 85 Q 110 95 90 100 Q 70 100 50 80 Z" fill="#8AA193" opacity="0.4" />
              <path d="M 50 110 Q 70 100 100 100 Q 120 100 130 130" stroke="#1F3D2B" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
              <rect x="44" y="110" width="6" height="10" fill="#fff" stroke="#A88B4d" opacity="0.7" />
              <rect x="44" y="125" width="6" height="10" fill="#fff" stroke="#A88B4d" opacity="0.7" />
              <path d="M 50 130 Q 90 120 120 140 Q 130 170 130 200 L 90 200 Q 70 160 50 130 Z" fill="#c0392b" stroke="#7f1d1d" strokeWidth="2" opacity="0.5" />
              <g transform={`translate(${letter.makhrajX}, ${letter.makhrajY})`}>
                <circle cx="0" cy="0" r="15" fill="#2E7D4F" opacity="0.25" className="animate-ping" />
                <circle cx="0" cy="0" r="6" fill="#2E7D4F" />
                <circle cx="0" cy="0" r="2" fill="#fff" />
              </g>
            </svg>
          </div>
        </div>
      </Section>

      {/* ── Video lesson ──────────────────────── */}
      <Section icon="🎬" title="Video dars">
        {letter.video ? (
          <div className="relative w-full rounded-2xl overflow-hidden aspect-video bg-black">
            <iframe className="w-full h-full" src={letter.video} title={`${letter.name} video`} allowFullScreen />
          </div>
        ) : (
          <div className="relative w-full h-56 bg-cream-100 rounded-2xl border border-brand-700/10 overflow-hidden flex items-center justify-center">
            <span className="absolute font-arabic text-[220px] text-brand-700/5 select-none pointer-events-none">{letter.ar}</span>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-500/15 text-brand-600 flex items-center justify-center mb-3">
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <span className="font-medium text-brand-700/70">Video dars tez orada — {letter.name}</span>
            </div>
          </div>
        )}
      </Section>

      {/* ── Sifat / rules ─────────────────────── */}
      <Section icon="📋" title="Sifatlar va qoidalar">
        {letter.rules?.length > 0 ? (
          <div className="space-y-3">
            {letter.rules.map((rule, idx) => {
              const c = RULE_COLORS[rule.color] ?? RULE_COLORS.green;
              return (
                <div key={idx} className={`flex items-start gap-4 p-4 rounded-2xl border-l-4 bg-cream-100 ${c.split(' ')[0]}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${c.split(' ')[1]} ${c.split(' ')[2]} border border-brand-700/5`}>{rule.icon}</div>
                  <div>
                    <h4 className="text-brand-700 font-bold mb-0.5">{rule.title}</h4>
                    {rule.desc && <p className="text-brand-700/70 leading-relaxed text-sm">{rule.desc}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-brand-700/50 text-center py-6">Maxsus qoidalar kiritilmagan.</p>
        )}
      </Section>

      {/* ── Quiz ──────────────────────────────── */}
      {letter.quiz?.length > 0 && (
        <Section icon="🧪" title="Bilimni tekshirish">
          <QuizBlock letter={letter} />
        </Section>
      )}
    </div>
  );
}

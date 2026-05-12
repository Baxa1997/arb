'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { letters } from '@/data/letters';

const FEATURES = [
  { icon: '🏫', color: '#10b981', title: "Sinf boshqaruvi", desc: "O'qituvchilar guruhlar yaratadi, talabalarni qo'shadi va ularning jarayonini real vaqtda kuzatadi." },
  { icon: '📚', color: '#f59e0b', title: "Interaktiv darslar", desc: "Har bir harf uchun audio, maxraj diagrammasi, shakllar va quiz — barchasi bir joyda." },
  { icon: '📊', color: '#6366f1', title: "Progress analitikasi", desc: "Har bir talabaning natijasi grafikda ko'rinadi. Qaysi harf qiyin — bir ko'rishda aniq." },
  { icon: '📝', color: '#3b82f6', title: "Uy ishi va baholash", desc: "Uy ishini yaratish, topshirish va baholash — barchasi platformada, email kerak emas." },
  { icon: '🎙️', color: '#ec4899', title: "Maxraj va sifatlar", desc: "28 ta harf uchun maxraji, sifati va tajvid qoidalari vizual diagramma bilan." },
  { icon: '🧪', color: '#14b8a6', title: "Testlar", desc: "Har bir harf o'rganilgandan so'ng bilimni mustahkamlash uchun avtomatik quiz." },
];

const STATS = [
  { value: '28',   label: 'Arab harfi',   color: '#10b981' },
  { value: '5',    label: 'Ta\'lim moduli', color: '#f59e0b' },
  { value: '100%', label: "Bepul foydalanish", color: '#6366f1' },
];

export default function LandingPage() {
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % letters.length), 3000);
    return () => clearInterval(t);
  }, []);

  const hero = letters[heroIdx];

  return (
    <div className="relative overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center">
        {/* Ambient blobs */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#10b981]/8 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-40 w-[500px] h-[500px] rounded-full bg-[#6366f1]/8 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#10b981]/10 text-[#10b981] px-4 py-1.5 rounded-full text-sm font-bold border border-[#10b981]/20">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              Yangi interaktiv versiya
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Arab tilini{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#6ee7b7] bg-clip-text text-transparent">
                  professional
                </span>
              </span>{' '}
              usulda o'qiting
            </h1>

            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              O'qituvchi va talaba uchun alohida portal. Sinflar yarating, darslar kiriting, uy ishi bering —
              va har bir talabaning rivojlanishini kuzating.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/login"
                className="bg-[#10b981] hover:bg-[#059669] text-white px-7 py-3.5 rounded-xl font-bold text-base shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5"
              >
                Boshlash →
              </Link>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-7 py-3.5 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5"
              >
                Ko'proq bilish
              </button>
            </div>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-white/45 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — animated letter card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-[320px] aspect-square">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#10b981]/20 to-[#6366f1]/20 blur-2xl scale-90" />

              <div className="relative w-full h-full bg-[#141d2e] rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] animate-float flex flex-col items-center justify-center p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/8 to-transparent pointer-events-none" />

                {/* Letter number badge */}
                <div className="absolute top-5 left-5 text-white/25 text-xs font-bold tracking-widest uppercase">
                  {hero.name}
                </div>

                {/* Main letter */}
                <div className="relative z-10 font-arabic text-[100px] leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-4 transition-all duration-500">
                  {hero.ar}
                </div>

                {/* Forms */}
                <div className="relative z-10 flex gap-5 font-arabic text-3xl text-[#10b981]">
                  <span className="hover:scale-125 transition-transform cursor-default">{hero.forms.alohida}َ</span>
                  <span className="hover:scale-125 transition-transform cursor-default">{hero.forms.alohida}ِ</span>
                  <span className="hover:scale-125 transition-transform cursor-default">{hero.forms.alohida}ُ</span>
                </div>

                {/* Type badge */}
                <div className="absolute bottom-5 right-5">
                  {hero.type === 'quyosh'
                    ? <span className="text-xs font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 px-2 py-1 rounded-full">☀️ Quyosh</span>
                    : <span className="text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/25 px-2 py-1 rounded-full">🌙 Oy</span>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#f59e0b]/10 text-[#f59e0b] px-4 py-1.5 rounded-full text-sm font-bold border border-[#f59e0b]/20">
              Platforma imkoniyatlari
            </div>
            <h2 className="text-4xl font-extrabold text-white">
              O'qituvchi va talaba uchun
            </h2>
            <p className="text-white/55 max-w-xl mx-auto text-lg">
              Bir platformada barcha kerakli vositalar — hech qanday qo'shimcha dastur kerak emas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-[#141d2e] border border-white/6 rounded-2xl p-6 hover:border-white/12 hover:-translate-y-1 transition-all group"
                style={{ '--col': f.color }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 border transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}15`, borderColor: `${f.color}25` }}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto bg-gradient-to-br from-[#10b981]/15 to-[#6366f1]/15 border border-white/10 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjwvZz48L3N2Zz4=')] opacity-40 pointer-events-none" />
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Bugun boshlang
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Demo akkaunt bilan tekshiring: <span className="text-[#10b981] font-mono font-bold">teacher@demo.com</span> / <span className="text-[#10b981] font-mono font-bold">demo1234</span>
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/login"
                className="bg-[#10b981] hover:bg-[#059669] text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all"
              >
                O'qituvchi sifatida kirish
              </Link>
              <Link
                href="/login"
                className="bg-[#6366f1]/20 hover:bg-[#6366f1]/30 border border-[#6366f1]/30 text-[#6366f1] px-8 py-3.5 rounded-xl font-bold text-base transition-all"
              >
                Talaba sifatida kirish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/35 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-arabic text-xl text-[#10b981]">اقرأ</span>
            <span className="font-bold text-white/60">Alifbo</span>
          </div>
          <span>Arab tilini o'rganish platformasi</span>
        </div>
      </footer>
    </div>
  );
}

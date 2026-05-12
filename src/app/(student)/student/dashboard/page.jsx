'use client';
import Link from 'next/link';
import { useLearned } from '@/hooks/useLearned';
import { letters } from '@/data/letters';

const MODULES = [
  { href: '/student/learn/alifbo', icon: 'ا', label: 'Alifbo', desc: '28 ta arab harfi', color: '#10b981', arabic: true },
  { href: '/student/learn/harakatlar', icon: 'َ', label: 'Harakatlar', desc: 'Qisqa unlilar belgilari', color: '#f59e0b', arabic: true },
  { href: '/student/learn/maxrajlar', icon: '🫁', label: 'Maxrajlar', desc: 'Talaffuz manbalari', color: '#6366f1' },
  { href: '/student/learn/sifatlar', icon: '🎙️', label: 'Sifatlar', desc: 'Harf xususiyatlari', color: '#3b82f6' },
  { href: '/student/learn/grammatika', icon: '📖', label: 'Grammatika', desc: 'Asosiy qoidalar', color: '#ec4899' },
];

const MOCK_HW = [
  { title: 'Alifbo takroriy yozuv', due: '2026-05-14', status: 'pending' },
  { title: 'Harakatlar mashqi', due: '2026-05-12', status: 'submitted' },
];

export default function StudentDashboard() {
  const { learned } = useLearned();
  const pct = Math.round((learned.length / 28) * 100);
  const streak = 5;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-br from-[#6366f1]/20 to-[#141d2e] border border-[#6366f1]/20 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#6366f1]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-[#6366f1] font-bold text-sm mb-1">Xush kelibsiz! 👋</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Bugun o'rganishda davom eting</h1>
          <p className="text-white/55 text-sm mb-4">Siz {learned.length} ta harfni o'rgandingiz. Maqsad: 28 ta harf!</p>
          <Link href="/student/learn/alifbo"
            className="inline-flex items-center gap-2 bg-[#6366f1] hover:bg-[#5558e8] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
            ▶ Davom etish
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "O'rganildi", value: learned.length, icon: '✅', color: '#10b981' },
          { label: 'Qoldi', value: 28 - learned.length, icon: '🎯', color: '#f59e0b' },
          { label: 'Streak', value: `${streak} kun`, icon: '🔥', color: '#ef4444' },
          { label: 'Ball', value: `${pct}%`, icon: '⭐', color: '#6366f1' },
        ].map(s => (
          <div key={s.label} className="bg-[#141d2e] border border-white/6 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
              {s.icon}
            </div>
            <div className="text-2xl font-extrabold text-white">{s.value}</div>
            <div className="text-xs text-white/45 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-[#141d2e] border border-white/6 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-white">Alifbo jarayoni</span>
          <span className="text-[#10b981] font-extrabold text-lg">{pct}%</span>
        </div>
        <div className="h-3 bg-white/6 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-1">
          {letters.map(l => (
            <div key={l.id} className={`flex-1 h-1.5 rounded-full transition-colors ${learned.includes(l.id) ? 'bg-[#10b981]' : 'bg-white/8'}`} />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning modules */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white">O'quv modullari</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {MODULES.map(m => (
              <Link key={m.href} href={m.href}
                className="flex items-center gap-4 bg-[#141d2e] border border-white/6 rounded-2xl p-4 hover:border-white/12 hover:-translate-y-0.5 transition-all group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}>
                  <span className={m.arabic ? 'font-arabic' : ''}>{m.icon}</span>
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-white/90">{m.label}</div>
                  <div className="text-xs text-white/45">{m.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Homework */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Uy ishi</h2>
            <Link href="/student/homework" className="text-sm text-[#6366f1] hover:underline font-medium">Barchasi →</Link>
          </div>
          <div className="space-y-3">
            {MOCK_HW.map((hw, i) => (
              <div key={i} className="bg-[#141d2e] border border-white/6 rounded-2xl p-4">
                <div className="font-semibold text-white text-sm mb-1">{hw.title}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/40">Muddat: {hw.due}</div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${hw.status === 'submitted' ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/25' : 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/25'}`}>
                    {hw.status === 'submitted' ? 'Topshirildi' : 'Kutilmoqda'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

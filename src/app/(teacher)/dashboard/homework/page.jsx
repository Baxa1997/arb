'use client';
import { useState } from 'react';

const MOCK_HW = [
  { id: 1, title: 'Alifbo takroriy yozuv', class: "Arabic 101", due: '2026-05-14', submissions: 7, total: 10, status: 'active' },
  { id: 2, title: 'Harakatlar mashqi', class: "Arabic 201", due: '2026-05-12', submissions: 8, total: 8, status: 'closed' },
  { id: 3, title: 'Qalqala harflari', class: 'Tajvid Kursi', due: '2026-05-18', submissions: 2, total: 6, status: 'active' },
];

export default function HomeworkPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', cls: '', due: '', desc: '' });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Uy Ishi</h1>
          <p className="text-white/50 mt-1">Topshiriqlarni boshqarish</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
          + Yangi Topshiriq
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_HW.map(hw => {
          const pct = Math.round((hw.submissions / hw.total) * 100);
          return (
            <div key={hw.id} className="bg-[#141d2e] border border-white/6 rounded-2xl p-5 hover:border-white/12 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-lg">{hw.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${hw.status === 'active' ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/25' : 'bg-white/6 text-white/40 border-white/10'}`}>
                      {hw.status === 'active' ? 'Faol' : 'Tugagan'}
                    </span>
                  </div>
                  <div className="text-sm text-white/45">{hw.class} · Muddat: <span className="text-white/70">{hw.due}</span></div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-white">{hw.submissions}<span className="text-white/35 text-lg">/{hw.total}</span></div>
                  <div className="text-xs text-white/40">topshirdi</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/6 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-bold text-[#10b981]">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5">Yangi Topshiriq</h2>
            <form onSubmit={e => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Topshiriq Nomi</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Alifbo yozuv..."
                  className="w-full bg-[#0a0f1a] border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Muddat</label>
                <input type="date" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))}
                  className="w-full bg-[#0a0f1a] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Sinf</label>
                <select value={form.cls} onChange={e => setForm(f => ({ ...f, cls: e.target.value }))}
                  className="w-full bg-[#0a0f1a] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all">
                  <option value="">Sinf tanlang...</option>
                  <option>Arabic 101</option>
                  <option>Arabic 201</option>
                  <option>Tajvid Kursi</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/6 text-white font-bold text-sm">Bekor</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#10b981] text-white font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">Yaratish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

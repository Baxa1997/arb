'use client';
import { useState } from 'react';

const MOCK_HW = [
  { id: 1, title: 'Alifbo takroriy yozuv', class: "Arabic 101", due: '2026-05-14', status: 'pending', desc: 'Har bir harfni kamida 3 marta yozing.' },
  { id: 2, title: 'Harakatlar mashqi', class: "Arabic 201", due: '2026-05-12', status: 'submitted', grade: 90, feedback: "Juda yaxshi! Faqat Kasra qismida e'tiborli bo'ling." },
  { id: 3, title: 'Qalqala harflari', class: 'Tajvid Kursi', due: '2026-05-18', status: 'graded', grade: 85, feedback: 'Yaxshi ish!' },
];

const STATUS = {
  pending:   { label: 'Kutilmoqda', color: '#f59e0b' },
  submitted: { label: 'Topshirildi', color: '#6366f1' },
  graded:    { label: 'Baholandi', color: '#10b981' },
};

export default function StudentHomeworkPage() {
  const [activeId, setActiveId] = useState(null);
  const [text, setText] = useState('');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Uy Ishi</h1>
        <p className="text-white/50 mt-1">Tayinlangan topshiriqlar</p>
      </div>

      <div className="space-y-4">
        {MOCK_HW.map(hw => {
          const s = STATUS[hw.status];
          return (
            <div key={hw.id} className="bg-[#141d2e] border border-white/6 rounded-2xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-bold text-white text-lg">{hw.title}</h3>
                    <p className="text-sm text-white/45 mt-0.5">{hw.class} · Muddat: {hw.due}</p>
                    {hw.desc && <p className="text-sm text-white/60 mt-2">{hw.desc}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {hw.grade && (
                      <span className="text-xl font-extrabold text-[#10b981]">{hw.grade}%</span>
                    )}
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full border" style={{ background: `${s.color}15`, borderColor: `${s.color}25`, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                </div>

                {hw.feedback && (
                  <div className="mt-3 p-3 rounded-xl bg-[#10b981]/8 border border-[#10b981]/15">
                    <p className="text-xs font-bold text-[#10b981] mb-1">O'qituvchi izohi:</p>
                    <p className="text-sm text-white/70">{hw.feedback}</p>
                  </div>
                )}

                {hw.status === 'pending' && (
                  <button onClick={() => setActiveId(activeId === hw.id ? null : hw.id)}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/25 text-sm font-bold hover:bg-[#6366f1]/25 transition-all">
                    {activeId === hw.id ? '▲ Yopish' : '▼ Topshirish'}
                  </button>
                )}
              </div>

              {activeId === hw.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  <textarea value={text} onChange={e => setText(e.target.value)}
                    placeholder="Javobingizni yozing..."
                    className="w-full h-28 bg-[#111827] border border-white/8 text-white placeholder-white/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]/40 transition-all resize-none" />
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setActiveId(null)} className="px-4 py-2 rounded-xl bg-white/6 text-white text-sm font-bold hover:bg-white/10 transition-all">Bekor</button>
                    <button onClick={() => { alert('Topshirildi!'); setActiveId(null); setText(''); }}
                      className="px-4 py-2 rounded-xl bg-[#6366f1] text-white text-sm font-bold hover:bg-[#5558e8] shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all">
                      Topshirish
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

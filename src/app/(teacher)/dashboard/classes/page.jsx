'use client';
import { useState } from 'react';
import Link from 'next/link';

const MOCK_CLASSES = [
  { id: 1, name: "Arabic 101 — Boshlang'ich", desc: "Arab alifbosi va asosiy harakatlar", level: "Boshlang'ich", students: 10, lessons: 7, color: '#10b981' },
  { id: 2, name: "Arabic 201 — O'rta", desc: "Tajvid qoidalari va kengaytirilgan grammatika", level: "O'rta", students: 8, lessons: 5, color: '#f59e0b' },
  { id: 3, name: "Tajvid Kursi", desc: "Maxrajlar, sifatlar va tilovot qoidalari", level: "Ilg'or", students: 6, lessons: 6, color: '#6366f1' },
];

const LEVELS = ["Boshlang'ich", "O'rta", "Ilg'or"];

export default function ClassesPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', desc: '', level: "Boshlang'ich" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Sinflar</h1>
          <p className="text-white/50 mt-1">Barcha o'quv guruhlaringiz</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
        >
          + Yangi Sinf
        </button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {MOCK_CLASSES.map(cls => (
          <div key={cls.id} className="bg-[#141d2e] border border-white/6 rounded-2xl overflow-hidden hover:border-white/12 hover:-translate-y-1 transition-all group">
            {/* Color bar */}
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${cls.color}, ${cls.color}80)` }} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-white text-lg leading-snug">{cls.name}</h3>
                  <p className="text-white/45 text-sm mt-1 leading-relaxed">{cls.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 mb-5">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full border" style={{ background: `${cls.color}15`, borderColor: `${cls.color}25`, color: cls.color }}>
                  {cls.level}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Talabalar', value: cls.students, icon: '🎓' },
                  { label: 'Darslar', value: cls.lessons, icon: '📚' },
                ].map(s => (
                  <div key={s.label} className="bg-[#111827] rounded-xl p-3 border border-white/5 text-center">
                    <div className="text-xl mb-0.5">{s.icon}</div>
                    <div className="text-xl font-extrabold text-white">{s.value}</div>
                    <div className="text-xs text-white/40">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/classes/${cls.id}`}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-bold bg-white/6 hover:bg-white/12 text-white transition-all"
                >
                  Ko'rish
                </Link>
                <Link
                  href={`/dashboard/lessons?class=${cls.id}`}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-bold border transition-all"
                  style={{ background: `${cls.color}15`, borderColor: `${cls.color}25`, color: cls.color }}
                >
                  Darslar
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Add card */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#141d2e] border border-dashed border-white/12 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#10b981]/40 hover:bg-[#10b981]/5 transition-all group min-h-[280px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-[#10b981]/15 border border-white/10 group-hover:border-[#10b981]/30 flex items-center justify-center text-2xl transition-all">+</div>
          <span className="font-bold text-white/40 group-hover:text-[#10b981] transition-colors text-sm">Yangi sinf qo'shish</span>
        </button>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5">Yangi Sinf Yaratish</h2>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Sinf Nomi</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Arabic 101..." required
                  className="w-full bg-[#0a0f1a] border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Tavsif</label>
                <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Sinf haqida..."
                  className="w-full bg-[#0a0f1a] border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all h-24 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Daraja</label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map(l => (
                    <button key={l} type="button" onClick={() => setForm(f => ({ ...f, level: l }))}
                      className={`py-2 rounded-xl text-sm font-bold border transition-all ${form.level === l ? 'bg-[#10b981]/15 border-[#10b981]/30 text-[#10b981]' : 'bg-white/4 border-white/10 text-white/50 hover:bg-white/8'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/6 hover:bg-white/10 text-white font-bold text-sm transition-all">Bekor</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">Yaratish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

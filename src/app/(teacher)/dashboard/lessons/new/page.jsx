'use client';
import { useState } from 'react';
import Link from 'next/link';

const TABS = ['Matn', 'Audio', 'Test'];

export default function NewLessonPage() {
  const [title, setTitle] = useState('');
  const [cls, setCls] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/lessons" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Yangi Dars</h1>
            <p className="text-white/45 text-sm">Dars mazmunini yarating</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="bg-[#141d2e] border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all">
            <option value="draft">Qoralama</option>
            <option value="published">Chiqarish</option>
          </select>
          <button onClick={handleSave}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${saved ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' : 'bg-[#10b981] hover:bg-[#059669] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
            {saved ? '✓ Saqlandi' : 'Saqlash'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Meta */}
        <div className="bg-[#141d2e] border border-white/6 rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Dars Sarlavhasi</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Alif — Birinchi Harf" required
              className="w-full bg-[#111827] border border-white/8 text-white placeholder-white/25 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Sinf</label>
            <select value={cls} onChange={e => setCls(e.target.value)}
              className="w-full bg-[#111827] border border-white/8 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all">
              <option value="">Sinf tanlang...</option>
              <option value="1">Arabic 101 — Boshlang'ich</option>
              <option value="2">Arabic 201 — O'rta</option>
              <option value="3">Tajvid Kursi</option>
            </select>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-[#141d2e] border border-white/6 rounded-2xl overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-white/6 bg-[#111827]/50 px-4">
            {TABS.map((tab, i) => (
              <button key={tab} type="button" onClick={() => setActiveTab(i)}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${activeTab === i ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-white/45 hover:text-white/80'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-white/45">Dars matnini kiriting. Arabic harflari uchun <span className="font-arabic text-[#10b981]">ب ت ث</span> yozishingiz mumkin.</p>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Dars mazmunini yozing..."
                  className="w-full h-56 bg-[#111827] border border-white/8 text-white placeholder-white/25 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all resize-none leading-relaxed"
                />
                <div className="flex items-center gap-2 text-xs text-white/35">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Matn, arab harflari va HTML formatni qo'llab-quvvatlaydi
                </div>
              </div>
            )}
            {activeTab === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-white/45">Audio fayl URL manzilini kiriting yoki yuklang</p>
                <input type="url" placeholder="https://example.com/audio.mp3"
                  className="w-full bg-[#111827] border border-white/8 text-white placeholder-white/25 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all" />
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#10b981]/30 transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">🎵</div>
                  <div className="text-sm text-white/40">Audio faylni bu yerga tashlang</div>
                  <div className="text-xs text-white/25 mt-1">MP3, WAV, OGG qo'llab-quvvatlanadi</div>
                </div>
              </div>
            )}
            {activeTab === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-white/45">Talabalar uchun savol-javob testini yarating</p>
                <div className="bg-[#111827] border border-white/6 rounded-xl p-4 space-y-3">
                  <input type="text" placeholder="Savol matni..." className="w-full bg-[#0a0f1a] border border-white/8 text-white placeholder-white/25 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all" />
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <div key={opt} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-white/6 flex items-center justify-center text-xs font-bold text-white/50">{opt}</span>
                      <input type="text" placeholder={`${opt} variantni kiriting...`} className="flex-1 bg-[#0a0f1a] border border-white/8 text-white placeholder-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all" />
                    </div>
                  ))}
                </div>
                <button type="button" className="text-sm text-[#10b981] hover:underline font-medium">+ Savol qo'shish</button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

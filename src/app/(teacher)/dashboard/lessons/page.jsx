'use client';
import { useState } from 'react';
import Link from 'next/link';

const MOCK_LESSONS = [
  { id: 1, title: 'Alif — Birinchi Harf', class: "Arabic 101", status: 'published', students: 10, completed: 8, date: '2026-05-01' },
  { id: 2, title: 'Baa, Taa, Thaa Harflari', class: "Arabic 101", status: 'published', students: 10, completed: 6, date: '2026-05-03' },
  { id: 3, title: "Halqum Harflari (Haa, Xoo, 'Ayn, G'ayn)", class: "Arabic 201", status: 'draft', students: 8, completed: 0, date: '2026-05-07' },
  { id: 4, title: 'Qalqala Qoidasi', class: 'Tajvid Kursi', status: 'published', students: 6, completed: 5, date: '2026-04-28' },
];

export default function LessonsPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_LESSONS.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) || l.class.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Darslar</h1>
          <p className="text-white/50 mt-1">Barcha darslaringiz</p>
        </div>
        <Link href="/dashboard/lessons/new"
          className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
          + Yangi Dars
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Dars qidirish..."
          className="w-full bg-[#141d2e] border border-white/8 text-white placeholder-white/25 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all" />
      </div>

      {/* Table */}
      <div className="bg-[#141d2e] border border-white/6 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/5 text-xs font-bold text-white/35 uppercase tracking-wider">
          <span>Dars nomi</span>
          <span className="hidden sm:block">Sinf</span>
          <span className="hidden md:block">Holat</span>
          <span className="hidden md:block">Bajarildi</span>
          <span>Amallar</span>
        </div>
        {filtered.map(lesson => {
          const pct = Math.round((lesson.completed / lesson.students) * 100);
          return (
            <div key={lesson.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
              <div>
                <div className="font-semibold text-white text-sm">{lesson.title}</div>
                <div className="text-xs text-white/40 mt-0.5 sm:hidden">{lesson.class}</div>
              </div>
              <span className="hidden sm:block text-sm text-white/55">{lesson.class}</span>
              <span className="hidden md:flex">
                {lesson.status === 'published'
                  ? <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20">Chiqarilgan</span>
                  : <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/6 text-white/50 border border-white/10">Qoralama</span>
                }
              </span>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-16 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-white/50">{pct}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/dashboard/lessons/${lesson.id}/edit`}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-white/40">Hech narsa topilmadi</div>
        )}
      </div>
    </div>
  );
}

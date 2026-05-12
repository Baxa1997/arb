'use client';
import { useState } from 'react';
import TeacherSidebar from '@/components/layout/TeacherSidebar';

export default function TeacherLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <TeacherSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="dashboard-main flex flex-col min-h-screen">
        {/* Top bar (mobile only) */}
        <header className="md:hidden sticky top-0 z-10 bg-[#0d1424]/95 backdrop-blur-xl border-b border-white/6 px-4 h-14 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-arabic text-xl text-[#10b981]">اقرأ</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

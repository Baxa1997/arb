'use client';
import { useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import RoleGuard from '@/components/RoleGuard';

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RoleGuard role="super_admin">
      <div className="dashboard-layout">
        <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="dashboard-main flex flex-col min-h-screen">
          <header className="md:hidden sticky top-0 z-10 bg-cream-100/95 backdrop-blur-xl border-b border-brand-700/10 px-4 h-14 flex items-center justify-between">
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg bg-cream-50 hover:bg-brand-500/5 transition-colors">
              <svg className="w-5 h-5 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span className="font-arabic text-xl text-brand-500">اقرأ</span>
            <div className="w-9" />
          </header>

          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}

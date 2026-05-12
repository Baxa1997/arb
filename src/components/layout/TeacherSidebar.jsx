'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const teacherNav = [
  { href: '/dashboard',          icon: '⬛', label: 'Dashboard' },
  { href: '/dashboard/classes',  icon: '🏫', label: 'Sinflar' },
  { href: '/dashboard/lessons',  icon: '📚', label: 'Darslar' },
  { href: '/dashboard/homework', icon: '📝', label: "Uy ishi" },
  { href: '/dashboard/progress', icon: '📊', label: 'Progress' },
];

export default function TeacherSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();
  const { profile, logout } = useAuthStore();

  return (
    <>
      {/* Overlay on mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={onClose} />
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? 'open' : ''} flex flex-col`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/6">
          <span className="font-arabic text-2xl text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">اقرأ</span>
          <div>
            <div className="font-bold text-white text-sm leading-tight">Alifbo</div>
            <div className="text-[10px] text-[#10b981] font-semibold uppercase tracking-widest">O'qituvchi</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {teacherNav.map(item => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20'
                    : 'text-white/55 hover:text-white hover:bg-white/6'
                }`}
              >
                <span className="text-lg w-6 text-center">{item.icon}</span>
                <span>{item.label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#10b981]" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 pb-4 border-t border-white/6 pt-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/4">
            <div className="w-8 h-8 rounded-full bg-[#10b981]/20 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] font-bold text-sm">
              {profile?.full_name?.[0] ?? 'O'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{profile?.full_name ?? "O'qituvchi"}</div>
              <div className="text-[11px] text-white/40 truncate">{profile?.email ?? ''}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Chiqish
          </button>
        </div>
      </aside>
    </>
  );
}

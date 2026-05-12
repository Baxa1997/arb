'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useLearned } from '@/hooks/useLearned';

const studentNav = [
  { href: '/student/dashboard',           icon: '🏠', label: 'Dashboard' },
  { href: '/student/learn/alifbo',        icon: 'ا',  label: 'Alifbo', arabic: true },
  { href: '/student/learn/harakatlar',    icon: 'َ',  label: 'Harakatlar', arabic: true },
  { href: '/student/learn/maxrajlar',     icon: '🫁', label: 'Maxrajlar' },
  { href: '/student/learn/sifatlar',      icon: '🎙️', label: 'Sifatlar' },
  { href: '/student/learn/grammatika',    icon: '📖', label: 'Grammatika' },
  { href: '/student/lessons',             icon: '📚', label: 'Darslar' },
  { href: '/student/homework',            icon: '📝', label: "Uy ishi" },
];

export default function StudentSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();
  const { profile, logout } = useAuthStore();
  const { learned } = useLearned();
  const pct = Math.round((learned.length / 28) * 100);

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={onClose} />
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? 'open' : ''} flex flex-col`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/6">
          <span className="font-arabic text-2xl text-[#6366f1] drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">اقرأ</span>
          <div>
            <div className="font-bold text-white text-sm leading-tight">Alifbo</div>
            <div className="text-[10px] text-[#6366f1] font-semibold uppercase tracking-widest">Talaba</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex justify-between text-xs text-white/50 mb-2 font-medium">
            <span>Alifbo Jarayoni</span>
            <span className="text-[#10b981] font-bold">{pct}%</span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-[11px] text-white/35 mt-1.5">{learned.length} / 28 harf o'rganildi</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {studentNav.map(item => {
            const active = pathname === item.href || (item.href.length > 20 && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/20'
                    : 'text-white/55 hover:text-white hover:bg-white/6'
                }`}
              >
                <span className={`text-lg w-6 text-center ${item.arabic ? 'font-arabic' : ''}`}>{item.icon}</span>
                <span>{item.label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6366f1]" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 pb-4 border-t border-white/6 pt-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/4">
            <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] font-bold text-sm">
              {profile?.full_name?.[0] ?? 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{profile?.full_name ?? 'Talaba'}</div>
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

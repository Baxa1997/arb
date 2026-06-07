'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useT } from '@/i18n';
import LanguageToggle from '@/components/LanguageToggle';

const adminNav = [
  { href: '/admin',          icon: '🏠', key: 'nav_dashboard' },
  { href: '/admin/teachers', icon: '👨‍🏫', key: 'nav_teachers' },
  { href: '/admin/lessons',  icon: '📚', key: 'nav_lessons' },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const { profile, logout } = useAuthStore();

  const handleLogout = async () => { await logout(); router.replace('/login'); };

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={onClose} />}

      <aside className={`dashboard-sidebar ${mobileOpen ? 'open' : ''} flex flex-col`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-700/10">
          <span className="font-arabic text-2xl text-brand-500">اقرأ</span>
          <div>
            <div className="font-bold text-brand-700 text-sm leading-tight">Arabic Education</div>
            <div className="text-[10px] text-brand-500 font-semibold uppercase tracking-widest">{t('role_admin')}</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {adminNav.map(item => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-brand-500/15 text-brand-600 border border-brand-500/20'
                         : 'text-brand-700/60 hover:text-brand-700 hover:bg-brand-500/5'
                }`}>
                <span className="text-lg w-6 text-center">{item.icon}</span>
                <span>{t(item.key)}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 border-t border-brand-700/10 pt-4 space-y-2">
          <div className="flex justify-end"><LanguageToggle /></div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-cream-50">
            <div className="w-8 h-8 rounded-full bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-brand-600 font-bold text-sm">
              {profile?.full_name?.[0] ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-brand-700 truncate">{profile?.full_name ?? 'Admin'}</div>
              <div className="text-[11px] text-brand-700/40 truncate">{profile?.email ?? ''}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-brand-700/50 hover:text-red-600 hover:bg-red-500/10 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
}

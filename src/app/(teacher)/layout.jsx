'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TeacherSidebar from '@/components/layout/TeacherSidebar';
import RoleGuard from '@/components/RoleGuard';
import Icon from '@/components/dash/Icon';
import { useT, useLang } from '@/i18n';

// Which dashboard section is active, from the pathname.
function routeOf(pathname) {
  if (pathname.startsWith('/dashboard/students')) return 'students';
  if (pathname.startsWith('/dashboard/lessons')) return 'lessons';
  if (pathname.startsWith('/dashboard/homework')) return 'homework';
  return 'dashboard';
}

export default function TeacherLayout({ children }) {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const route = routeOf(pathname);

  const dateStr = new Date().toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  // Context-aware primary action (matches the design's toolbar).
  const ctx = route === 'lessons'
    ? null
    : route === 'homework'
      ? { label: t('hw_new'), to: '/dashboard/homework?new=1' }
      : { label: t('add_student'), to: '/dashboard/students?new=1' };

  return (
    <RoleGuard role="teacher">
      <div className="aec-dash">
        <div className="app">
          {mobileOpen && <div className="sb-overlay" onClick={() => setMobileOpen(false)} />}
          <TeacherSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

          <main className="main">
            {/* mobile bar (hamburger) */}
            <div className="mobile-bar">
              <button className="ham" onClick={() => setMobileOpen(true)} aria-label={t('menu')}>
                <Icon name="menu" size={20} /><span>{t('menu')}</span>
              </button>
              <span className="ar" style={{ fontSize: 20, color: 'var(--brand)', marginLeft: 'auto' }}>اقرأ</span>
            </div>

            {/* toolbar */}
            <div className="toolbar">
              <div className="search">
                <Icon name="search" size={17} />
                <input placeholder={t('dash_search_ph')} />
                <kbd>⌘K</kbd>
              </div>
              <div className="tb-spacer" />
              <div className="tb-date"><Icon name="calendar" size={15} />{dateStr}</div>
              <button className="icon-btn" aria-label="notifications"><Icon name="bell" size={18} /><span className="nd" /></button>
              {ctx && (
                <>
                  <div className="tb-div" />
                  <button className="btn btn-primary" onClick={() => router.push(ctx.to)}>
                    <Icon name="plus" size={16} />{ctx.label}
                  </button>
                </>
              )}
            </div>

            <div className="content">
              <div className="content-inner">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}

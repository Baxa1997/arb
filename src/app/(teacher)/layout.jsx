'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TeacherSidebar from '@/components/layout/TeacherSidebar';
import RoleGuard from '@/components/RoleGuard';
import Icon from '@/components/dash/Icon';
import { useT, useLang } from '@/i18n';
import { useDashSearch } from '@/store/dashSearch';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const route = routeOf(pathname);
  const { q, setQ, clear } = useDashSearch();

  // Reset the search when moving between sections.
  useEffect(() => { clear(); }, [route, clear]);

  const searchable = route === 'students' || route === 'homework' || route === 'lessons';
  const searchPh = route === 'homework' ? t('search_tasks_ph')
    : route === 'lessons' ? t('lessons_search_ph')
    : t('search_students_ph');

  const dateStr = new Date().toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });

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

            {/* toolbar — on desktop the search shares this row with date + bell */}
            <div className="toolbar">
              {searchable ? (
                <div className="search">
                  <Icon name="search" size={17} />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPh} />
                </div>
              ) : (
                <div className="tb-spacer" />
              )}
              <div className="tb-date"><Icon name="calendar" size={15} />{dateStr}</div>
              <button className="icon-btn" aria-label="notifications"><Icon name="bell" size={18} /><span className="nd" /></button>
            </div>

            {/* full-width search row — mobile only (the toolbar is hidden there) */}
            {searchable && (
              <div className="toolbar-search">
                <div className="search">
                  <Icon name="search" size={17} />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPh} />
                </div>
              </div>
            )}

            <div className="content">
              <div className="content-inner">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}

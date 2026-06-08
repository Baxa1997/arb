'use client';
import { useState } from 'react';
import Link from 'next/link';
import StudentSidebar from '@/components/layout/StudentSidebar';
import RoleGuard from '@/components/RoleGuard';
import Icon from '@/components/dash/Icon';
import { useProgress } from '@/hooks/useProgress';
import { useT, useLang } from '@/i18n';

export default function StudentLayout({ children }) {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentLetterId } = useProgress();

  const dateStr = new Date().toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <RoleGuard role="student">
      <div className="aec-dash">
        <div className="app">
          {mobileOpen && <div className="sb-overlay" onClick={() => setMobileOpen(false)} />}
          <StudentSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

          <main className="main">
            <div className="mobile-bar">
              <button className="ham" onClick={() => setMobileOpen(true)} aria-label={t('menu')}>
                <Icon name="menu" size={20} /><span>{t('menu')}</span>
              </button>
              <span className="ar" style={{ fontSize: 20, color: 'var(--brand)', marginLeft: 'auto' }}>اقرأ</span>
            </div>

            <div className="toolbar">
              <div className="tb-spacer" />
              <div className="tb-date"><Icon name="calendar" size={15} />{dateStr}</div>
              {currentLetterId && (
                <>
                  <div className="tb-div" />
                  <Link className="btn btn-primary" href={`/student/lessons/${currentLetterId}`}>
                    <Icon name="book" size={16} />{t('resume_lesson')}
                  </Link>
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

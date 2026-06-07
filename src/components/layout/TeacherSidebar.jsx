'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profileQueries, homeworkQueries } from '@/lib/queries';
import { useT, useLang } from '@/i18n';
import Icon from '@/components/dash/Icon';

const NAV_MAIN = [
  { href: '/dashboard', icon: 'home', key: 'nav_dashboard', exact: true },
  { href: '/dashboard/students', icon: 'students', key: 'nav_students', countKey: 'students' },
];
const NAV_TEACH = [
  { href: '/dashboard/lessons', icon: 'book', key: 'nav_lessons' },
  { href: '/dashboard/homework', icon: 'pencil', key: 'nav_homework', countKey: 'pending' },
];

export default function TeacherSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const { profile, logout } = useAuthStore();
  const [counts, setCounts] = useState({ students: null, pending: null });

  useEffect(() => {
    if (!profile?.id) return;
    let alive = true;
    (async () => {
      try {
        const [students, hw] = await Promise.all([
          profileQueries.listStudents(profile.id),
          homeworkQueries.getTeacherHomework(profile.id),
        ]);
        if (!alive) return;
        const pending = hw.filter((h) => (h.homework_submissions ?? [])[0]?.status === 'submitted').length;
        setCounts({ students: students.length || null, pending: pending || null });
      } catch { /* ignore */ }
    })();
    return () => { alive = false; };
  }, [profile?.id]);

  const handleLogout = async () => { await logout(); router.replace('/login'); };

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/') || pathname === item.href;

  const NavItem = (item) => {
    const active = isActive(item);
    const count = item.countKey ? counts[item.countKey] : null;
    return (
      <Link key={item.href} href={item.href} onClick={onClose} className={'nav-i' + (active ? ' on' : '')}>
        <Icon name={item.icon} size={19} />
        <span>{t(item.key)}</span>
        {count != null && <span className="nv-count">{count}</span>}
      </Link>
    );
  };

  const initial = (profile?.full_name?.[0] ?? profile?.email?.[0] ?? 'O').toUpperCase();

  return (
    <aside className={'sb' + (mobileOpen ? ' open' : '')}>
      <div className="sb-logo">
        <div className="sb-mark ar">اقرأ</div>
        <div>
          <div className="sb-logo-name">Arabic Education</div>
          <div className="sb-logo-sub">{t('dash_brand_sub')}</div>
        </div>
      </div>

      <div className="sb-group">{t('dash_grp_main')}</div>
      <nav className="sb-nav">{NAV_MAIN.map(NavItem)}</nav>

      <div className="sb-group">{t('dash_grp_teach')}</div>
      <nav className="sb-nav">{NAV_TEACH.map(NavItem)}</nav>

      <div className="sb-foot">
        <div className="lang">
          <button className={lang === 'uz' ? 'on' : ''} onClick={() => setLang('uz')}>UZ</button>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
        <div className="user">
          <div className="avatar">{initial}</div>
          <div style={{ minWidth: 0 }}>
            <div className="user-name">{profile?.full_name ?? t('role_teacher')}</div>
            <div className="user-mail">{profile?.email ?? ''}</div>
          </div>
        </div>
        <button className="logout" onClick={handleLogout}><Icon name="logout" size={18} /><span>{t('logout')}</span></button>
      </div>
    </aside>
  );
}

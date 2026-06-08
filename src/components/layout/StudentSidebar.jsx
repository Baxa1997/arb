'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useProgress } from '@/hooks/useProgress';
import { useT, useLang } from '@/i18n';
import Icon from '@/components/dash/Icon';

const NAV_MAIN = [
  { href: '/student/dashboard', icon: 'home', key: 'nav_dashboard', exact: true },
];
const NAV_LEARN = [
  { href: '/student/learn/alifbo', ar: 'ا', key: 'nav_alphabet' },
  { href: '/student/learn/harakatlar', ar: 'َ', key: 'nav_harakat' },
  { href: '/student/learn/maxrajlar', icon: 'sound', key: 'nav_makhraj' },
  { href: '/student/learn/sifatlar', icon: 'star', key: 'nav_sifat' },
  { href: '/student/learn/grammatika', icon: 'book', key: 'nav_grammar' },
];
const NAV_TASKS = [
  { href: '/student/homework', icon: 'fileCheck', key: 'nav_homework' },
];

export default function StudentSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const { profile, logout } = useAuthStore();
  const { doneCount } = useProgress();
  const pct = Math.round((doneCount / 28) * 100);

  const handleLogout = async () => { await logout(); router.replace('/login'); };

  const isActive = (item) => item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/') || pathname.startsWith(item.href);

  const NavItem = (item) => {
    const active = isActive(item);
    return (
      <Link key={item.href} href={item.href} onClick={onClose} className={'nav-i' + (active ? ' on' : '')}>
        {item.ar ? <span className="nv-ar ar">{item.ar}</span> : <Icon name={item.icon} size={19} />}
        <span>{t(item.key)}</span>
      </Link>
    );
  };

  const initial = (profile?.full_name?.[0] ?? profile?.email?.[0] ?? 'T').toUpperCase();

  return (
    <aside className={'sb' + (mobileOpen ? ' open' : '')}>
      <div className="sb-logo">
        <div className="sb-mark ar">اقرأ</div>
        <div>
          <div className="sb-logo-name">Arabic Education</div>
          <div className="sb-logo-sub">{t('role_student')}</div>
        </div>
        <button className="sb-close" onClick={onClose} aria-label="close"><Icon name="x" size={18} /></button>
      </div>

      <div className="sb-progress">
        <div className="spr-top"><span>{t('alphabet_progress')}</span><span className="spr-pct">{pct}%</span></div>
        <div className="spr-bar"><i style={{ width: pct + '%' }} /></div>
        <div className="spr-meta">{doneCount} / 28 {t('mastery_meta_uz')}</div>
      </div>

      <div className="sb-group">{t('dash_grp_main')}</div>
      <nav className="sb-nav">{NAV_MAIN.map(NavItem)}</nav>

      <div className="sb-group">{t('student_grp_learn')}</div>
      <nav className="sb-nav">{NAV_LEARN.map(NavItem)}</nav>

      <div className="sb-group">{t('student_grp_tasks')}</div>
      <nav className="sb-nav">{NAV_TASKS.map(NavItem)}</nav>

      <div className="sb-foot">
        <div className="lang">
          <button className={lang === 'uz' ? 'on' : ''} onClick={() => setLang('uz')}>UZ</button>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
        <div className="user">
          <div className="avatar">{initial}</div>
          <div style={{ minWidth: 0 }}>
            <div className="user-name">{profile?.full_name ?? t('role_student')}</div>
            <div className="user-mail">{profile?.email ?? ''}</div>
          </div>
        </div>
        <button className="logout" onClick={handleLogout}><Icon name="logout" size={18} /><span>{t('logout')}</span></button>
      </div>
    </aside>
  );
}

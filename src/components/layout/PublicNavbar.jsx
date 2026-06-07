'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LanguageToggle from '@/components/LanguageToggle';
import { useT } from '@/i18n';

export default function PublicNavbar() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-cream-100/95 backdrop-blur-xl shadow-[0_1px_0_rgba(31,61,43,0.08)]' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 h-[72px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <span className="font-arabic text-3xl text-brand-500 group-hover:text-brand-600 transition-all">اقرأ</span>
          <span className="font-bold text-lg tracking-tight text-brand-700 hidden sm:inline">Arabic Education Center</span>
          <span className="font-bold text-lg tracking-tight text-brand-700 sm:hidden">AEC</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link href="/login" className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 shadow-[0_0_20px_rgba(46,125,79,0.25)] transition-all">
            {t('login')}
          </Link>
        </div>
      </div>
    </nav>
  );
}

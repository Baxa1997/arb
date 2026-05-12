'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLearned } from '@/hooks/useLearned';

const links = [
  { href: '/',            label: 'Bosh sahifa' },
  { href: '/harakatlar',  label: 'Harakatlar' },
  { href: '/maxrajlar',   label: 'Maxrajlar' },
  { href: '/sifatlar',    label: 'Sifatlar' },
  { href: '/grammatika',  label: 'Grammatika' },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const { learned } = useLearned();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-[#0a0f1a]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 h-[72px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <span className="font-arabic text-3xl text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.9)] transition-all">اقرأ</span>
          <span className="font-bold text-xl tracking-tight text-white">Alifbo</span>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-[#10b981]/15 text-[#10b981] px-2 py-0.5 rounded-full border border-[#10b981]/25">Beta</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? 'bg-white/10 text-white'
                  : 'text-white/55 hover:text-white hover:bg-white/6'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2 bg-[#141d2e] border border-white/10 px-3 py-1.5 rounded-full text-sm font-medium text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            {mounted ? learned.length : 0}/28
          </div>

          <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all hover:bg-white/5">
            Kirish
          </Link>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111827] border-t border-white/5 px-4 py-3 flex flex-col gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

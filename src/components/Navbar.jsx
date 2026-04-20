"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLearned } from '@/hooks/useLearned';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { learned } = useLearned();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: '/', label: 'Bosh Sahifa' },
    { href: '/harakatlar', label: 'Harakatlar' },
    { href: '/maxrajlar', label: 'Maxrajlar' },
    { href: '/sifatlar', label: 'Sifatlar' },
    { href: '/grammatika', label: 'Grammatika' }
  ];

  return (
    <nav className="fixed top-0 w-full z-40 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-arabic text-3xl md:text-4xl text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all">اقرأ</span>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-white/90">Alifbo</span>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded-full border border-[#10b981]/30">Beta</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => {
            const active = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  active 
                    ? 'bg-white/10 text-white shadow-inner' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3 bg-[#141d2e] border border-white/10 px-4 py-2 rounded-full shadow-lg">
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className="text-sm font-medium text-white/90">{mounted ? learned.length : 0}/28 harflar</span>
        </div>
      </div>
    </nav>
  );
}

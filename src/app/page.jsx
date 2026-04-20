"use client"
import Link from 'next/link';

import { useState, useMemo, useEffect } from 'react';
import { letters } from '@/data/letters';
import { useLearned } from '@/hooks/useLearned';
import LetterCard from '@/components/LetterCard';
import FilterBar from '@/components/FilterBar';
import LetterModal from '@/components/LetterModal';

export default function HomePage() {
  const { learned, toggle, isLearned } = useLearned();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState(null);
  
  // Hero cycle logic
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const int = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % letters.length);
    }, 3000);
    return () => clearInterval(int);
  }, []);
  const heroLetter = letters[heroIdx];

  const filteredLetters = useMemo(() => {
    return letters.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.ar.includes(searchQuery);
      if (!matchesSearch) return false;
      if (filterType === 'quyosh') return l.type === 'quyosh';
      if (filterType === 'oy') return l.type === 'oy';
      if (filterType === 'ulanmaydigan') return !l.connects;
      return true;
    });
  }, [searchQuery, filterType]);

  const nonConnectCount = letters.filter(l => !l.connects).length;

  return (
    <div className="container mx-auto px-4 pb-20">
      
      {/* Hero Section */}
      <div className="pt-6 pb-10 md:py-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="lg:w-1/2 flex flex-col items-start text-left space-y-6">
          <div className="bg-[#10b981]/10 text-[#10b981] px-4 py-1.5 rounded-full text-sm font-bold border border-[#10b981]/20">
            Yangi interaktiv versiya
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Arab <span className="bg-gradient-to-r from-[#10b981] to-[#34d399] bg-clip-text text-transparent drop-shadow-sm">Alifbosini</span> mukammal o'rganing
          </h1>
          <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl">
            Har bir harfning maxraji, sifati va tajvid qoidalarini innovatsion usulda tinglab o'rganing. Kunlik mashqlar orqali bilimingizni mustahkamlang.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button onClick={() => document.getElementById('alphabet-grid')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#10b981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-bold text-base shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all">
              ▶ O'rganishni boshlash
            </button>
            <Link href="/harakatlar" className="bg-[#141d2e] hover:bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-bold text-base transition-all inline-block hover:scale-[1.02]">
              Harakatlar →
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
           <div className="relative w-full max-w-xs aspect-square bg-[#141d2e] rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-float flex flex-col items-center justify-center p-6 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent"></div>
              <div className="relative z-10 font-arabic text-8xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-6 transition-all duration-500">
                {heroLetter.ar}
              </div>
              <div className="relative z-10 flex gap-4 font-arabic text-4xl text-[#10b981]">
                 <span>{heroLetter.forms.alohida}َ</span>
                 <span>{heroLetter.forms.alohida}ِ</span>
                 <span>{heroLetter.forms.alohida}ُ</span>
              </div>
              <div className="absolute top-6 left-6 text-white/30 font-bold tracking-widest uppercase">
                {heroLetter.name}
              </div>
           </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
         <div className="bg-[#141d2e] border border-white/5 p-4 rounded-3xl flex items-center gap-3 hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#10b981]/20 text-[#10b981] flex items-center justify-center text-xl">🟢</div>
            <div>
              <div className="text-2xl font-bold text-white">28</div>
              <div className="text-white/50 text-[10px] uppercase tracking-wider font-bold">Jami harflar</div>
            </div>
         </div>
         <div className="bg-[#141d2e] border border-white/5 p-4 rounded-3xl flex items-center gap-3 hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center text-xl">🟡</div>
            <div>
              <div className="text-2xl font-bold text-white">{learned.length}</div>
              <div className="text-white/50 text-[10px] uppercase tracking-wider font-bold">O'rganildi</div>
            </div>
         </div>
         <div className="bg-[#141d2e] border border-white/5 p-4 rounded-3xl flex items-center gap-3 hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#6366f1]/20 text-[#6366f1] flex items-center justify-center text-xl">🟣</div>
            <div>
              <div className="text-2xl font-bold text-white">{nonConnectCount}</div>
              <div className="text-white/50 text-[10px] uppercase tracking-wider font-bold">Ulanmaydigan</div>
            </div>
         </div>
         <div className="bg-[#141d2e] border border-white/5 p-4 rounded-3xl flex items-center gap-3 hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center text-xl">🔴</div>
            <div>
              <div className="text-2xl font-bold text-white">5</div>
              <div className="text-white/50 text-[10px] uppercase tracking-wider font-bold">Kun streak</div>
            </div>
         </div>
      </div>

      <FilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <div id="alphabet-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 mb-10 mt-6" dir="rtl">
        {filteredLetters.map(letter => (
          <LetterCard 
            key={letter.id} 
            letter={letter} 
            onClick={() => setSelectedLetter(letter)} 
            isLearned={isLearned(letter.id)}
          />
        ))}
        {filteredLetters.length === 0 && (
          <div className="col-span-full py-20 text-center text-white/50">
            Qidiruv bo'yicha hech narsa topilmadi.
          </div>
        )}
      </div>

      {/* Progress tracker */}
      <div className="bg-[#141d2e] border border-white/5 rounded-3xl p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Sizning natijangiz</h3>
            <p className="text-sm text-white/50">Jami 28 ta harfdan {learned.length} tasini o'rgandingiz</p>
          </div>
          <div className="text-4xl font-extrabold text-[#10b981]">
            {Math.round((learned.length / 28) * 100)}%
          </div>
        </div>
        
        <div className="h-4 bg-[#111827] rounded-full overflow-hidden mb-8 border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${(learned.length / 28) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between gap-1">
          {new Array(28).fill(0).map((_, i) => (
             <div 
               key={i}
               className={`h-2 flex-1 rounded-full transition-colors ${
                 learned.includes(i + 1) ? 'bg-[#10b981] shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-[#111827] border border-white/5'
               }`}
             ></div>
          ))}
        </div>
      </div>

      <LetterModal 
        letter={selectedLetter} 
        onClose={() => setSelectedLetter(null)} 
      />
    </div>
  );
}

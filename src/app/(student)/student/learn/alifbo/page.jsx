'use client';
import { useState, useMemo, useEffect } from 'react';
import { letters } from '@/data/letters';
import { useLearned } from '@/hooks/useLearned';
import LetterCard from '@/components/LetterCard';
import FilterBar from '@/components/FilterBar';
import LetterModal from '@/components/LetterModal';

export default function AlifboPage() {
  const { learned, toggle, isLearned } = useLearned();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const int = setInterval(() => setHeroIdx(p => (p + 1) % letters.length), 3000);
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

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-full text-xs font-bold border border-[#10b981]/20 mb-3">
            Arab Alifbosi
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Alifbo</h1>
          <p className="text-white/55 text-sm leading-relaxed">
            Har bir harfning maxraji, sifati va tajvid qoidalarini o'rganing. {learned.length}/28 harf o'rganildi.
          </p>

          {/* Inline progress */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 max-w-xs h-2 bg-white/8 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full transition-all duration-700"
                style={{ width: `${(learned.length / 28) * 100}%` }} />
            </div>
            <span className="text-sm font-bold text-[#10b981]">{Math.round((learned.length / 28) * 100)}%</span>
          </div>
        </div>

        {/* Mini hero card */}
        <div className="relative w-44 h-44 flex-shrink-0 bg-[#141d2e] border border-white/10 rounded-2xl flex flex-col items-center justify-center overflow-hidden animate-float">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent" />
          <div className="font-arabic text-7xl text-white mb-2 relative z-10">{heroLetter.ar}</div>
          <div className="text-[#10b981] font-bold text-sm relative z-10">{heroLetter.name}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Jami harflar', value: 28, color: '#10b981' },
          { label: "O'rganildi", value: learned.length, color: '#f59e0b' },
          { label: 'Ulanmaydigan', value: letters.filter(l => !l.connects).length, color: '#6366f1' },
          { label: 'Qoldi', value: 28 - learned.length, color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} className="bg-[#141d2e] border border-white/5 p-3 rounded-xl text-center">
            <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-white/45 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <FilterBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterType={filterType} setFilterType={setFilterType} />

      <div id="alphabet-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3" dir="rtl">
        {filteredLetters.map(letter => (
          <LetterCard key={letter.id} letter={letter} onClick={() => setSelectedLetter(letter)} isLearned={isLearned(letter.id)} />
        ))}
        {filteredLetters.length === 0 && (
          <div className="col-span-full py-16 text-center text-white/40">Hech narsa topilmadi</div>
        )}
      </div>

      <LetterModal letter={selectedLetter} onClose={() => setSelectedLetter(null)} />
    </div>
  );
}

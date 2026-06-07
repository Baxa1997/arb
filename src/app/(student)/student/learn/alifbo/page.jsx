'use client';
import { useState, useMemo } from 'react';
import { letters } from '@/data/letters';
import { useProgress } from '@/hooks/useProgress';
import LetterCard from '@/components/LetterCard';
import FilterBar from '@/components/FilterBar';
import { useT } from '@/i18n';
import { Spinner } from '@/components/ui/Spinner';

export default function AlifboPage() {
  const t = useT();
  const { statusOf, doneCount, loading } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

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

  const pct = Math.round((doneCount / 28) * 100);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-600 px-3 py-1 rounded-full text-xs font-bold border border-brand-500/20 mb-3">
          {t('alifbo_badge')}
        </div>
        <h1 className="text-3xl font-extrabold text-brand-700 mb-2">{t('alifbo_title')}</h1>
        <p className="text-brand-700/55 text-sm leading-relaxed">
          {t('keep_going')} — {doneCount}/28
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 max-w-xs h-2 bg-cream-300 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-bold text-brand-600">{pct}%</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('alifbo_letters_total'), value: 28 },
          { label: t('alifbo_done'), value: doneCount },
          { label: t('alifbo_unconnected'), value: letters.filter(l => !l.connects).length },
          { label: t('alifbo_left'), value: 28 - doneCount },
        ].map(s => (
          <div key={s.label} className="bg-cream-50 border border-brand-700/10 p-3 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-brand-600">{s.value}</div>
            <div className="text-xs text-brand-700/45 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <FilterBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterType={filterType} setFilterType={setFilterType} />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner className="w-8 h-8 text-brand-500" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {filteredLetters.map(letter => (
            <LetterCard key={letter.id} letter={letter} status={statusOf(letter.id)} />
          ))}
          {filteredLetters.length === 0 && (
            <div className="col-span-full py-16 text-center text-brand-700/40">{t('alifbo_nothing')}</div>
          )}
        </div>
      )}
    </div>
  );
}

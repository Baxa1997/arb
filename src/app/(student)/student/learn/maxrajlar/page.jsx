'use client';
import { useState } from 'react';
import { letters } from '@/data/letters';
import LetterModal from '@/components/LetterModal';

export default function MaxrajlarPage() {
  const [selectedLetter, setSelectedLetter] = useState(null);

  const groups = letters.reduce((acc, letter) => {
    if (!acc[letter.group]) acc[letter.group] = [];
    acc[letter.group].push(letter);
    return acc;
  }, {});

  const groupInfo = {
    'Halq': { desc: "Halqum bo'shlig'i va tomoq. Bular asosan chuqur va hams harflaridir.", icon: '🫁', color: '#6366f1' },
    'Til':  { desc: "Til usti, uchi va yon tomonlari. Eng ko'p harf ushbu mintaqadan chiqadi.", icon: '👅', color: '#10b981' },
    'Lab':  { desc: "Ikki labning quruq yoki ho'l qismlarining tegishishidan chiqadigan harflar.", icon: '👄', color: '#ec4899' },
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 bg-[#6366f1]/10 text-[#6366f1] px-3 py-1 rounded-full text-xs font-bold border border-[#6366f1]/20 mb-3">
          Tovush Manbalari
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Maxrajlar</h1>
        <p className="text-white/55 text-sm leading-relaxed max-w-xl">
          Harflarning talaffuz qilinish o'rinlari maxraj deb ataladi. Arab tilini to'g'ri o'qish uchun har birini bilish shart.
        </p>
      </div>

      <div className="space-y-5">
        {Object.entries(groups).map(([groupName, groupLetters]) => {
          const info = groupInfo[groupName] || { desc: '', icon: '📍', color: '#f59e0b' };
          return (
            <div key={groupName} className="bg-[#141d2e] border border-white/6 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-6 items-start hover:border-white/10 transition-colors">
              <div className="md:w-1/3">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 text-xl border" style={{ background: `${info.color}15`, borderColor: `${info.color}25` }}>
                  {info.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{groupName}</h2>
                <p className="text-white/55 text-sm leading-relaxed">{info.desc}</p>
                <div className="mt-3 text-xs font-bold text-white/35 uppercase tracking-widest bg-[#111827] px-3 py-1 rounded-md w-max border border-white/5">
                  {groupLetters.length} ta harf
                </div>
              </div>
              <div className="md:w-2/3 w-full bg-[#111827] p-5 rounded-xl border border-white/5">
                <div className="flex flex-wrap gap-2" dir="rtl">
                  {groupLetters.map(letter => (
                    <button key={letter.id} onClick={() => setSelectedLetter(letter)}
                      className="flex flex-col items-center justify-center w-18 h-20 w-[4.5rem] bg-[#141d2e] border border-white/6 rounded-xl hover:-translate-y-1 hover:border-white/20 transition-all group">
                      <span className="font-arabic text-4xl text-white group-hover:text-[#10b981] transition-colors">{letter.ar}</span>
                      <span className="text-[10px] text-white/40 mt-1 font-medium">{letter.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <LetterModal letter={selectedLetter} onClose={() => setSelectedLetter(null)} />
    </div>
  );
}

"use client"
import { useState } from 'react';
import { letters } from '@/data/letters';
import LetterModal from '@/components/LetterModal';

export default function MaxrajlarPage() {
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Group letters
  const groups = letters.reduce((acc, letter) => {
    if (!acc[letter.group]) acc[letter.group] = [];
    acc[letter.group].push(letter);
    return acc;
  }, {});

  const groupInfo = {
    'Halq': { desc: 'Halqum bo\'shlig\'i va tomoq. Bular asosan chuqur va hams harflaridir.', icon: '🫁', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    'Til': { desc: 'Til usti, uchi va yon tomonlari. Eng ko\'p harf ushbu mintaqadan chiqadi.', icon: '👅', color: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20' },
    'Lab': { desc: 'Ikki labning quruq yoki ho\'l qismlarining tegishishidan chiqadigan harflar.', icon: '👄', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' }
  };

  return (
    <div className="container mx-auto px-4 pb-20 pt-10">
      <div className="text-center mb-16">
         <div className="bg-[#10b981]/10 text-[#10b981] px-4 py-1.5 rounded-full text-sm font-bold border border-[#10b981]/20 w-max mx-auto mb-6">
           Tovush Manbalari
         </div>
         <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
           Maxrajlar
         </h1>
         <p className="text-lg text-white/60 max-w-2xl mx-auto">
           Harflarning talaffuz qilinish o'rinlari maxraj deb ataladi. Asosiy 5 ta mintaqa bor. Arab tilini to'g'ri o'qish uchun har birining aniq manbasini bilish shart.
         </p>
      </div>

      <div className="space-y-8 max-w-5xl mx-auto">
        {Object.entries(groups).map(([groupName, groupLetters]) => {
           const info = groupInfo[groupName] || { desc: '', icon: '📍', color: 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20' };
           
           return (
             <div key={groupName} className="bg-[#141d2e] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start hover:border-white/10 transition-colors">
               <div className="md:w-1/3">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 text-2xl border ${info.color}`}>
                    {info.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{groupName}</h2>
                  <p className="text-white/60 text-sm leading-relaxed">{info.desc}</p>
                  <div className="mt-4 text-xs font-bold text-white/30 uppercase tracking-widest bg-[#111827] px-3 py-1 rounded-md w-max border border-white/5">
                    {groupLetters.length} TA HARF
                  </div>
               </div>
               
               <div className="md:w-2/3 w-full bg-[#111827] p-6 rounded-2xl border border-white/5">
                  <div className="flex flex-wrap gap-3" dir="rtl">
                     {groupLetters.map(letter => (
                       <button
                         key={letter.id}
                         onClick={() => setSelectedLetter(letter)}
                         className="flex flex-col items-center justify-center w-20 h-24 bg-[#141d2e] border border-white/5 rounded-2xl hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:border-[#10b981]/50 transition-all group"
                       >
                         <span className="font-arabic text-4xl text-white group-hover:text-[#10b981] transition-colors drop-shadow-md">{letter.ar}</span>
                         <span className="text-xs text-white/50 mt-2 font-medium">{letter.name}</span>
                       </button>
                     ))}
                  </div>
               </div>
             </div>
           );
        })}
      </div>

      <LetterModal 
        letter={selectedLetter} 
        onClose={() => setSelectedLetter(null)} 
      />
    </div>
  );
}

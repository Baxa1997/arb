'use client';
import Link from 'next/link';
import { letters } from '@/data/letters';

export default function MaxrajlarPage() {
  const groups = letters.reduce((acc, letter) => {
    if (!acc[letter.group]) acc[letter.group] = [];
    acc[letter.group].push(letter);
    return acc;
  }, {});

  const groupInfo = {
    'Halq': { desc: "Halqum bo'shlig'i va tomoq. Bular asosan chuqur va hams harflaridir.", icon: '🫁' },
    'Til':  { desc: "Til usti, uchi va yon tomonlari. Eng ko'p harf ushbu mintaqadan chiqadi.", icon: '👅' },
    'Lab':  { desc: "Ikki labning quruq yoki ho'l qismlarining tegishishidan chiqadigan harflar.", icon: '👄' },
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-600 px-3 py-1 rounded-full text-xs font-bold border border-brand-500/20 mb-3">
          Tovush Manbalari
        </div>
        <h1 className="text-3xl font-extrabold text-brand-700 mb-2">Maxrajlar</h1>
        <p className="text-brand-700/55 text-sm leading-relaxed max-w-xl">
          Harflarning talaffuz qilinish o'rinlari maxraj deb ataladi. Arab tilini to'g'ri o'qish uchun har birini bilish shart.
        </p>
      </div>

      <div className="space-y-5">
        {Object.entries(groups).map(([groupName, groupLetters]) => {
          const info = groupInfo[groupName] || { desc: '', icon: '📍' };
          return (
            <div key={groupName} className="bg-cream-50 border border-brand-700/10 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-6 items-start hover:border-brand-500/20 transition-colors">
              <div className="md:w-1/3">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 text-xl border bg-brand-500/10 border-brand-500/20">
                  {info.icon}
                </div>
                <h2 className="text-2xl font-bold text-brand-700 mb-1">{groupName}</h2>
                <p className="text-brand-700/55 text-sm leading-relaxed">{info.desc}</p>
                <div className="mt-3 text-xs font-bold text-brand-700/35 uppercase tracking-widest bg-cream-100 px-3 py-1 rounded-md w-max border border-brand-700/10">
                  {groupLetters.length} ta harf
                </div>
              </div>
              <div className="md:w-2/3 w-full bg-cream-100 p-5 rounded-xl border border-brand-700/10">
                <div className="flex flex-wrap gap-2" dir="rtl">
                  {groupLetters.map(letter => (
                    <Link key={letter.id} href={`/student/lessons/${letter.id}`}
                      className="flex flex-col items-center justify-center h-20 w-[4.5rem] bg-cream-50 border border-brand-700/10 rounded-xl hover:-translate-y-1 hover:border-brand-500/40 transition-all group">
                      <span className="font-arabic text-4xl text-brand-700 group-hover:text-brand-600 transition-colors">{letter.ar}</span>
                      <span className="text-[10px] text-brand-700/40 mt-1 font-medium">{letter.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

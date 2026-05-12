'use client';
import { harakatlar } from '@/data/harakatlar';

export default function HarakatlarPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-full text-xs font-bold border border-[#10b981]/20 mb-3">
          Arab Tili Unlilari
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Harakatlar va Belgilar</h1>
        <p className="text-white/55 text-sm leading-relaxed max-w-xl">
          Arab tilida qisqa unlilar harflarning usti yoki ostiga qo'yiladigan maxsus belgilar yordamida ifodalanadi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {harakatlar.map((h, i) => (
          <div key={i} className="bg-[#141d2e] border border-white/6 rounded-2xl p-6 hover:border-[#10b981]/25 transition-all group">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{h.name}</h2>
                <p className="text-white/55 text-sm leading-relaxed min-h-[50px]">{h.desc}</p>
              </div>
              <div className="w-14 h-14 bg-[#111827] rounded-xl flex items-center justify-center border border-white/5 font-arabic text-4xl text-[#10b981] shadow-inner group-hover:scale-110 transition-transform flex-shrink-0 ml-3">
                {h.ar}
              </div>
            </div>
            <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
              <div className="text-xs font-bold text-white/35 uppercase tracking-wider mb-3">Misollar</div>
              <div className="flex justify-around" dir="rtl">
                {h.examples.map((ex, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-white/35 text-xs">{ex.letter}</span>
                    <span className="font-arabic text-4xl text-white">{ex.combined}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client"
import { harakatlar } from '@/data/harakatlar';

export default function HarakatlarPage() {
  return (
    <div className="container mx-auto px-4 pb-20 pt-10">
      <div className="text-center mb-16">
         <div className="bg-[#10b981]/10 text-[#10b981] px-4 py-1.5 rounded-full text-sm font-bold border border-[#10b981]/20 w-max mx-auto mb-6">
           Arab Tili Unlilari
         </div>
         <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
           Harakatlar va Belgilar
         </h1>
         <p className="text-lg text-white/60 max-w-2xl mx-auto">
           Arab tilida qisqa unlilar harflarning usti yoki ostiga qo'yiladigan maxsus belgilar yordamida ifodalanadi.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {harakatlar.map((h, i) => (
           <div key={i} className="bg-[#141d2e] border border-white/5 rounded-3xl p-8 hover:border-[#10b981]/30 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-white mb-2">{h.name}</h2>
                   <p className="text-white/60 text-sm leading-relaxed min-h-[60px]">{h.desc}</p>
                 </div>
                 <div className="w-16 h-16 bg-[#111827] rounded-2xl flex items-center justify-center border border-white/5 font-arabic text-4xl text-[#10b981] shadow-inner group-hover:scale-110 transition-transform">
                   {h.ar}
                 </div>
              </div>
              
              <div className="bg-[#111827] rounded-2xl p-4 border border-white/5">
                 <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Misollar</div>
                 <div className="flex justify-around" dir="rtl">
                    {h.examples.map((ex, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <span className="text-white/30 text-sm">{ex.letter}</span>
                        <span className="font-arabic text-4xl text-white drop-shadow-md">{ex.combined}</span>
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

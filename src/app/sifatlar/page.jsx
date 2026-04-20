"use client"
import { sifatlar } from '@/data/sifatlar';

export default function SifatlarPage() {
  return (
    <div className="container mx-auto px-4 pb-20 pt-10">
      <div className="text-center mb-16">
         <div className="bg-[#6366f1]/10 text-[#6366f1] px-4 py-1.5 rounded-full text-sm font-bold border border-[#6366f1]/20 w-max mx-auto mb-6">
           Fonetika va Tajvid
         </div>
         <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
           Sifatlar
         </h1>
         <p className="text-lg text-white/60 max-w-2xl mx-auto">
           Sifat - harf makhrajdan chiqayotganda paydo bo'ladigan ovoz holatlari. To'g'ri sifatlar tilovati go'zal qiladi.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {sifatlar.map((sifat, idx) => (
           <div key={idx} className="bg-[#141d2e] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors overflow-hidden relative">
              
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`w-3 h-3 rounded-full ${sifat.badgeColor} shadow-[0_0_10px_currentColor] opacity-80`}></span>
                       <h2 className="text-2xl font-bold text-white">{sifat.name_uz}</h2>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed max-w-sm">{sifat.desc}</p>
                 </div>
                 <div className="font-arabic text-3xl text-white/40 drop-shadow-sm font-bold bg-[#111827] px-4 py-2 rounded-xl border border-white/5">
                    {sifat.name_ar}
                 </div>
              </div>

              <div>
                 <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center justify-between">
                    <span>Qatnashuvchi harflar</span>
                    <span className="bg-[#111827] px-2 py-1 rounded bg-black/20 border border-white/5">{sifat.letters.length} ta harf</span>
                 </div>
                 <div className="flex flex-wrap gap-2" dir="rtl">
                    {sifat.letters.map((l, i) => (
                       <span 
                         key={i} 
                         className={`font-arabic text-2xl w-10 h-10 flex items-center justify-center rounded-lg border bg-[#111827] text-white transition-all 
                         hover:-translate-y-1 hover:text-white border-white/5 hover:border-${sifat.badgeColor.split('-')[1]}-500/50 hover:shadow-[0_0_10px_currentColor]`}
                       >
                          {l}
                       </span>
                    ))}
                 </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { sifatlar } from '@/data/sifatlar';

export default function SifatlarPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 bg-[#6366f1]/10 text-[#6366f1] px-3 py-1 rounded-full text-xs font-bold border border-[#6366f1]/20 mb-3">
          Fonetika va Tajvid
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Sifatlar</h1>
        <p className="text-white/55 text-sm leading-relaxed max-w-xl">
          Sifat — harf makhrajdan chiqayotganda paydo bo'ladigan ovoz holatlari. To'g'ri sifatlar tilovati go'zal qiladi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sifatlar.map((sifat, idx) => (
          <div key={idx} className="bg-[#141d2e] border border-white/6 rounded-2xl p-6 hover:border-white/12 transition-colors overflow-hidden">
            <div className="flex justify-between items-start mb-5 border-b border-white/5 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${sifat.badgeColor} opacity-80`} />
                  <h2 className="text-xl font-bold text-white">{sifat.name_uz}</h2>
                </div>
                <p className="text-white/55 text-sm leading-relaxed max-w-xs">{sifat.desc}</p>
              </div>
              <div className="font-arabic text-2xl text-white/35 font-bold bg-[#111827] px-3 py-2 rounded-xl border border-white/5 flex-shrink-0 ml-3">
                {sifat.name_ar}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>Qatnashuvchi harflar</span>
                <span className="bg-[#111827] px-2 py-0.5 rounded border border-white/5">{sifat.letters.length} ta</span>
              </div>
              <div className="flex flex-wrap gap-2" dir="rtl">
                {sifat.letters.map((l, i) => (
                  <span key={i} className="font-arabic text-2xl w-9 h-9 flex items-center justify-center rounded-lg border bg-[#111827] text-white hover:-translate-y-1 transition-all border-white/5 cursor-default">
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

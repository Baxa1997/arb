'use client';
import { sifatlar } from '@/data/sifatlar';

export default function SifatlarPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-600 px-3 py-1 rounded-full text-xs font-bold border border-brand-500/20 mb-3">
          Fonetika va Tajvid
        </div>
        <h1 className="text-3xl font-extrabold text-brand-700 mb-2">Sifatlar</h1>
        <p className="text-brand-700/55 text-sm leading-relaxed max-w-xl">
          Sifat — harf makhrajdan chiqayotganda paydo bo'ladigan ovoz holatlari. To'g'ri sifatlar tilovati go'zal qiladi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sifatlar.map((sifat, idx) => (
          <div key={idx} className="bg-cream-50 border border-brand-700/10 rounded-2xl p-6 hover:border-brand-500/25 transition-colors overflow-hidden">
            <div className="flex justify-between items-start mb-5 border-b border-brand-700/10 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${sifat.badgeColor} opacity-80`} />
                  <h2 className="text-xl font-bold text-brand-700">{sifat.name_uz}</h2>
                </div>
                <p className="text-brand-700/55 text-sm leading-relaxed max-w-xs">{sifat.desc}</p>
              </div>
              <div className="font-arabic text-2xl text-brand-600 font-bold bg-cream-100 px-3 py-2 rounded-xl border border-brand-700/10 flex-shrink-0 ml-3">
                {sifat.name_ar}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-brand-700/35 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>Qatnashuvchi harflar</span>
                <span className="bg-cream-100 px-2 py-0.5 rounded border border-brand-700/10">{sifat.letters.length} ta</span>
              </div>
              <div className="flex flex-wrap gap-2" dir="rtl">
                {sifat.letters.map((l, i) => (
                  <span key={i} className="font-arabic text-2xl w-9 h-9 flex items-center justify-center rounded-lg border bg-cream-100 text-brand-700 hover:-translate-y-1 transition-all border-brand-700/10 cursor-default">
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

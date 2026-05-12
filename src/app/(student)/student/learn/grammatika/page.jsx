'use client';

const rules = [
  { id: 'quyosh-oy', icon: '☀️🌙', color: '#f59e0b', title: 'Quyosh va Oy Harflari',
    desc: 'Arab tilida aniqlik artikli "Al-" (ال) qo\'shilganda so\'zning bosh harfiga qarab har xil o\'qiladi. Quyosh harflari "Lam" harfini yutib, ikkilantirib o\'qiladi. Oy harflarida "Lam" aniq o\'qiladi.',
    examples: [{ ar: 'الشَّمْس', txt: 'Ash-Shams (Quyosh harfi)' }, { ar: 'الْقَمَر', txt: 'Al-Qamar (Oy harfi)' }] },
  { id: 'ulanmaydigan', icon: '⛓️', color: '#6366f1', title: 'Ulanmaydigan 6 Harf',
    desc: 'Arab alifbosidagi barcha harflar o\'zidan keyingi kelgan harfga ulanadi, faqat 6 ta harfdan tashqari. Ular faqat o\'zlaridan oldingi harfga ulana oladi.',
    examples: [{ ar: 'ا د ذ ر ز و', txt: 'Alif, Daal, Zaal, Roo, Zaa, Vaav' }] },
  { id: 'shakllar', icon: '🔤', color: '#10b981', title: "Harflarning 4 ta Shakli",
    desc: "Harflar so'zning qayerida kelishiga qarab o'z shaklini o'zgartiradi. Boshida, o'rtasida, oxirida yoki alohida — 4 xil ko'rinish.",
    examples: [{ ar: 'ب بـ ـبـ ـب', txt: "Baa: Alohida, Boshida, O'rtasida, Oxirida" }] },
  { id: 'tanvin', icon: 'ً', color: '#ec4899', title: 'Tanvin Qoidasi',
    desc: "So'z oxiridagi harakat ikkilantirilgan bo'lsa (an, in, un), oxirida Nun harfi yozilmagan bo'lsada go'yo yozilgandek o'qiladi. Bu noaniqlikni anglatadi.",
    examples: [{ ar: 'كِتَابٌ', txt: 'Kitabun (Kitob)' }, { ar: 'بَيْتًا', txt: 'Baytan (Uyni)' }] },
  { id: 'qalqala', icon: '📳', color: '#3b82f6', title: 'Qalqala',
    desc: "Qalqala 'tebranish' degani. 5 ta maxsus harf (Qutb Jad) sukunli holatda kelganda to'xtab qolmasdan, bir oz pishib, tebranib talaffuz qilinadi.",
    examples: [{ ar: 'ق ط ب ج د', txt: 'Qoof, Too, Baa, Jiim, Daal' }] },
];

export default function GrammatikaPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 bg-[#f59e0b]/10 text-[#f59e0b] px-3 py-1 rounded-full text-xs font-bold border border-[#f59e0b]/20 mb-3">
          Asosiy Qoidalar
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Grammatika</h1>
        <p className="text-white/55 text-sm leading-relaxed max-w-xl">
          Yozish, o'qish hamda ulanishdagi eng asosiy, o'rganilishi shart bo'lgan tamoyillar yig'indisi.
        </p>
      </div>

      <div className="space-y-5">
        {rules.map((rule, idx) => (
          <div key={idx} className="bg-[#141d2e] border border-white/6 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-5 items-start">
            <div className="w-14 h-14 rounded-xl bg-[#111827] flex items-center justify-center text-2xl border border-white/5 flex-shrink-0" style={{ boxShadow: `0 0 20px ${rule.color}20` }}>
              {rule.icon}
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-xl font-bold text-white mb-2">{rule.title}</h2>
              <p className="text-white/65 leading-relaxed text-sm mb-4">{rule.desc}</p>
              <div className="space-y-2">
                {rule.examples.map((ex, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#111827] p-3 rounded-xl border border-white/5">
                    <span className="font-arabic text-3xl drop-shadow-sm" style={{ color: rule.color }} dir="rtl">{ex.ar}</span>
                    <span className="text-sm text-white/50">{ex.txt}</span>
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

"use client"

export default function GrammatikaPage() {
  const rules = [
    {
      id: 'quyosh-oy',
      icon: '☀️🌙',
      title: 'Quyosh va Oy Harflari',
      desc: 'Arab tilida aniqlik artikli "Al-" (ال) qo\'shilganda so\'zning bosh harfiga qarab har xil o\'qiladi. Quyosh harflari "Lam" (ل) harfini yutib yuboradi va o\'zi ikkilantirilib (tashdid bilan) o\'qiladi. Oy harflarida esa "Lam" aniq o\'qiladi.',
      examples: [
        { ar: 'الشَّمْس', txt: 'Ash-Shams (Al-Shams emas) - Quyosh harfi' },
        { ar: 'الْقَمَر', txt: 'Al-Qamar - Oy harfi' }
      ]
    },
    {
      id: 'ulanmaydigan',
      icon: '⛓️',
      title: 'Ulanmaydigan 6 Harf',
      desc: 'Arab alifbosidagi barcha harflar o\'zidan keyingi kelgan harfga ulanadi, faqat quyidagi 6 ta harfdan tashqari. Ular faqat o\'zlaridan oldingi harfga ulana oladi.',
      examples: [
        { ar: 'ا د ذ ر ز و', txt: 'Alif, Daal, Zaal, Roo, Zaa, Vaav' }
      ]
    },
    {
      id: 'shakllar',
      icon: '🔤',
      title: 'Harflarning 4 ta Shakli',
      desc: 'Harflar so\'zning qayerida (boshida, o\'rtasida, oxirida) kelishiga qarab o\'z shaklini o\'zgartiradi. Ayrim qismlari tushirilib qoldiriladi yoki cho\'ziladi.',
      examples: [
        { ar: 'ب بـ ـبـ ـب', txt: 'Baa harfining Alohida, Boshida, O\'rtasida, va Oxiridagi shakllari' }
      ]
    },
    {
      id: 'tanvin',
      icon: 'ً ٍ ٌ',
      title: 'Tanvin Qoidasi',
      desc: 'So\'zning oxiridagi harakat ochiq, ikkilantirilgan bo\'lsa (an, in, un), oxirida "Nun" harfi yozilmagan bo\'lsada, u go\'yo yozilgandek o\'qiladi. Bu noaniqlikni (biror) anglatadi.',
      examples: [
        { ar: 'كِتَابٌ', txt: 'Kitabun (Kitob)' },
        { ar: 'بَيْتًا', txt: 'Baytan (Uyni)' }
      ]
    },
    {
      id: 'qalqala',
      icon: '📳',
      title: 'Qalqala',
      desc: 'Qalqala "tebranish" degani. 5 ta maxsus harf (Qutb Jad) sukunli holatda (harakatsiz) kelganda to\'xtab qolmasdan, bir oz pishib, tebranib, chuqurroq talaffuz qilinadi.',
      examples: [
        { ar: 'ق ط ب ج د', txt: 'Qoof, Too, Baa, Jiim, Daal' },
        { ar: 'لَقَدْ', txt: 'Laqad (Tebranib chiqqan Daal)' }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 pb-20 pt-10">
      <div className="text-center mb-16">
         <div className="bg-[#f59e0b]/10 text-[#f59e0b] px-4 py-1.5 rounded-full text-sm font-bold border border-[#f59e0b]/20 w-max mx-auto mb-6">
           Asosiy Qoidalar
         </div>
         <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
           Grammatika
         </h1>
         <p className="text-lg text-white/60 max-w-2xl mx-auto">
           Yozish, o'qish hamda ulanishdagi eng asosiy, o'rganilishi shart bo'lgan tamoyillar yig'indisi.
         </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {rules.map((rule, idx) => (
           <div key={idx} className="bg-[#141d2e] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-[#111827] flex items-center justify-center text-3xl border border-white/5 flex-shrink-0 shadow-inner">
                {rule.icon}
              </div>
              <div className="flex-1 w-full">
                <h2 className="text-2xl font-bold text-white mb-4">{rule.title}</h2>
                <p className="text-white/70 leading-relaxed text-lg mb-6">
                  {rule.desc}
                </p>
                <div className="space-y-3">
                   {rule.examples.map((ex, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#111827] p-4 rounded-2xl border border-white/5">
                        <span className="font-arabic text-3xl text-[#10b981] drop-shadow-sm min-w-max" dir="rtl">{ex.ar}</span>
                        <span className="text-sm font-medium text-white/50">{ex.txt}</span>
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

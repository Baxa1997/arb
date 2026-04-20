export const harakatlar = [
  { 
    id: 'fatha', ar: 'َ', name: 'Fatha', 
    desc: 'Harf ustida yozilib, uni "a" (yoki ba\'zan "o") tovushi bilan o\'qitadi.', 
    examples: [{ letter: 'ب', combined: 'بَ' }, { letter: 'ت', combined: 'تَ' }, { letter: 'ج', combined: 'جَ' }] 
  },
  { 
    id: 'kasra', ar: 'ِ', name: 'Kasra', 
    desc: 'Harf ostida yozilib, uni "i" tovushi bilan o\'qitadi.', 
    examples: [{ letter: 'د', combined: 'دِ' }, { letter: 'س', combined: 'سِ' }, { letter: 'م', combined: 'مِ' }] 
  },
  { 
    id: 'damma', ar: 'ُ', name: 'Damma', 
    desc: 'Harf ustida yozilib, uni "u" tovushi bilan o\'qitadi.', 
    examples: [{ letter: 'ر', combined: 'رُ' }, { letter: 'ف', combined: 'فُ' }, { letter: 'ه', combined: 'هُ' }] 
  },
  { 
    id: 'sukun', ar: 'ْ', name: 'Sukun', 
    desc: 'Ushbu belgi harfda unli tovush yo\'qligini bildiradi. O\'zidan oldingi harakat bilan qo\'shib o\'qiladi.', 
    examples: [{ letter: 'ب', combined: 'أَبْ' }, { letter: 'م', combined: 'أَمْ' }, { letter: 'ل', combined: 'قُلْ' }] 
  },
  { 
    id: 'shadda', ar: 'ّ', name: 'Shadda', 
    desc: 'Tashdid (shadda) – bitta harfni ikki marta (biri sukunli, ikkinchisi harakatli) o\'qishni talab qiladi.', 
    examples: [{ letter: 'ر', combined: 'الرَّ' }, { letter: 'ش', combined: 'الشَّ' }, { letter: 'م', combined: 'مِّ' }] 
  },
  { 
    id: 'tanvin', ar: 'ً ٍ ٌ', name: 'Tanvin', 
    desc: 'So\'z oxirida kelganda qo\'shimcha "n" tovushini qo\'shadi: -an, -in, -un.', 
    examples: [{ letter: 'ب', combined: 'بًا' }, { letter: 'ت', combined: 'تٍ' }, { letter: 'م', combined: 'مٌ' }] 
  }
];

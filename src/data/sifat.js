// Definitions of the Arabic letter characteristics (sifat) used across the
// curriculum. Keys are normalised (lowercase, ' apostrophes). Used by the
// teaching page to explain each sifat named on a letter instead of raw notes.

export const SIFAT_DEFS = {
  istifola: {
    uz: "Til tanglayga ko'tarilmaydi — harf ingichka (yupqa) talaffuz qilinadi.",
    en: 'The tongue stays low; the letter is pronounced light (thin).',
  },
  "isti'lo": {
    uz: "Til orqasi yuqori tanglayga ko'tariladi — harf yo'g'on (qalin) talaffuz qilinadi.",
    en: 'The back of the tongue rises; the letter is pronounced heavy (thick).',
  },
  jahr: {
    uz: 'Harf talaffuzida nafas to\'xtaydi — ovoz jarangli chiqadi.',
    en: 'The breath is held; the sound is voiced.',
  },
  hams: {
    uz: 'Harf talaffuzida nafas erkin oqib chiqadi (jarangsiz).',
    en: 'Breath flows out with the letter (voiceless / whispered).',
  },
  shidda: {
    uz: 'Tovush to\'liq to\'xtab, keskin (portlab) chiqadi.',
    en: 'The sound stops fully and is released sharply (plosive).',
  },
  rohova: {
    uz: 'Tovush erkin, uzluksiz oqib chiqadi.',
    en: 'The sound flows out continuously.',
  },
  tavassut: {
    uz: 'Shidda va rohova orasidagi o\'rta holat — tovush qisman oqadi.',
    en: 'Between shidda and rohova — partial flow of sound.',
  },
  qalqala: {
    uz: 'Sukunli harf tebranib, sapchib (aks-sado bilan) talaffuz qilinadi.',
    en: 'A bouncing / echoing release when the letter carries sukun.',
  },
  safir: {
    uz: 'Til va tish orasidan xushtaksimon o\'tkir tovush chiqadi.',
    en: 'A sharp whistling sound between the tongue and teeth.',
  },
  lin: {
    uz: 'Harf yumshoq, qiyinchiliksiz, yengil talaffuz qilinadi (sukunli و/ي).',
    en: 'A soft, effortless glide (sukūn و/ي after fatḥa).',
  },
  inhirof: {
    uz: 'Tovush til chetiga burilib chiqadi.',
    en: 'The sound deflects along the side of the tongue.',
  },
  takror: {
    uz: 'Til uchi yengil titraydi (ر harfida).',
    en: 'A slight trill of the tongue tip (in ر).',
  },
  tafashshiy: {
    uz: 'Havo og\'iz ichida yoyilib tarqaladi (ش harfida).',
    en: 'Air spreads inside the mouth (in ش).',
  },
  istitola: {
    uz: 'Tovush til chetidan cho\'zilib chiqadi (ض harfida).',
    en: "The sound elongates along the tongue's edge (in ض).",
  },
  "g'unna": {
    uz: 'Tovush burun bo\'shlig\'i orqali chiqadi (م, ن).',
    en: 'A nasal sound through the nasal cavity (م, ن).',
  },
  tafxim: {
    uz: 'Harf yo\'g\'on (qalin) qilib talaffuz qilinadi.',
    en: 'The letter is pronounced heavy (thick).',
  },
  tarqiq: {
    uz: 'Harf ingichka (yupqa) qilib talaffuz qilinadi.',
    en: 'The letter is pronounced light (thin).',
  },
};

// Common synonyms that appear in the data.
const ALIAS = { yumshoq: 'istifola', qalin: "isti'lo" };

function norm(s) {
  return s.toLowerCase().replace(/[''ʼ`]/g, "'").trim();
}

// Extract the individual sifat terms from a string like
// "Shidda va Qalqala" or "Istifola (Yumshoq)" or "Rohova, Hams".
export function parseSifatTerms(str) {
  if (!str) return [];
  return str
    .split(/,| va /i)
    .map(s => s.replace(/\(.*?\)/g, '').trim()) // drop parentheticals
    .filter(Boolean);
}

export function sifatDef(term, lang = 'uz') {
  const key = ALIAS[norm(term)] || norm(term);
  const def = SIFAT_DEFS[key];
  return def ? def[lang] || def.uz : null;
}

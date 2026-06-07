'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLang } from '@/i18n';

/* ---------------- content ---------------- */
const COPY = {
  uz: {
    nav: ['Kurslar', 'Metod', 'Narxlar', 'Natijalar'],
    badge: 'Arabic Education Center',
    h1: ['Arab tilini ', 'professional', ' usulda o‘rganing'],
    sub: 'O‘qituvchi va talaba uchun yagona platforma. Har bir harf alohida dars bo‘lib, ketma-ket ochiladi — uy ishi, takrorlash va rivojlanish, barchasi bir joyda.',
    ctaPrimary: 'Hisobga kirish',
    ctaGhost: 'Demo ko‘rish',
    sub2: "Ta'lim platformasi",
    stats: [
      { n: '0', label: 'faol o‘quvchi' },
      { n: '28', label: 'harf darsi' },
      { n: '98%', label: 'darsni tugatish' },
    ],
    chip1: { t: 'Bugungi dars', s: 'Harf bo‘yicha mashq' },
    chip2: { t: 'Avtomatik baho', s: 'Uy ishi tekshiruvi' },
    listenWord: 'Tinglash',
    cardHint: 'harf',
  },
  en: {
    nav: ['Courses', 'Method', 'Pricing', 'Results'],
    badge: 'Arabic Education Center',
    h1: ['Learn Arabic the ', 'professional', ' way'],
    sub: 'One platform for teachers and students. Every letter is its own lesson, unlocked step by step — homework, review and progress, all in one place.',
    ctaPrimary: 'Sign in',
    ctaGhost: 'Watch demo',
    sub2: 'Learning platform',
    stats: [
      { n: '0', label: 'active learners' },
      { n: '28', label: 'letter lessons' },
      { n: '98%', label: 'lesson completion' },
    ],
    chip1: { t: "Today's lesson", s: 'Letter practice' },
    chip2: { t: 'Auto-graded', s: 'Homework review' },
    listenWord: 'Listen',
    cardHint: 'letter',
  },
};

const LETTERS = [
  { g: 'ا', name: 'ALIF', t: 'alif', vowels: [['اَ', 'a'], ['اِ', 'i'], ['اُ', 'u']], ex: 'اَب', exT: 'ab', muz: 'ota', men: 'father' },
  { g: 'ب', name: 'BAA', t: 'baa', vowels: [['بَ', 'ba'], ['بِ', 'bi'], ['بُ', 'bu']], ex: 'بَاب', exT: 'baab', muz: 'eshik', men: 'door' },
  { g: 'ت', name: 'TAA', t: 'taa', vowels: [['تَ', 'ta'], ['تِ', 'ti'], ['تُ', 'tu']], ex: 'تِين', exT: 'tiin', muz: 'anjir', men: 'fig' },
  { g: 'ج', name: 'JIIM', t: 'jiim', vowels: [['جَ', 'ja'], ['جِ', 'ji'], ['جُ', 'ju']], ex: 'جَمَل', exT: 'jamal', muz: 'tuya', men: 'camel' },
  { g: 'د', name: 'DAAL', t: 'daal', vowels: [['دَ', 'da'], ['دِ', 'di'], ['دُ', 'du']], ex: 'دَار', exT: 'daar', muz: 'uy', men: 'home' },
  { g: 'ر', name: 'RAA', t: 'raa', vowels: [['رَ', 'ra'], ['رِ', 'ri'], ['رُ', 'ru']], ex: 'رَأس', exT: "ra's", muz: 'bosh', men: 'head' },
  { g: 'س', name: 'SIIN', t: 'siin', vowels: [['سَ', 'sa'], ['سِ', 'si'], ['سُ', 'su']], ex: 'سَمَك', exT: 'samak', muz: 'baliq', men: 'fish' },
  { g: 'م', name: 'MIIM', t: 'miim', vowels: [['مَ', 'ma'], ['مِ', 'mi'], ['مُ', 'mu']], ex: 'مَاء', exT: "maa'", muz: 'suv', men: 'water' },
];

function Icon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    play: <path d="M7 5l12 7-12 7V5z" fill="currentColor" stroke="none" />,
    check: <path d="M20 6L9 17l-5-5" />,
    book: <path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5zM18 3v18" />,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

export default function LandingPage() {
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const [mounted, setMounted] = useState(false);
  const [idx, setIdx] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const c = COPY[lang] || COPY.uz;
  const L = LETTERS[idx];

  useEffect(() => { const r = setTimeout(() => setMounted(true), 60); return () => clearTimeout(r); }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % LETTERS.length), 3400);
    return () => clearInterval(id);
  }, [paused]);

  const speak = useCallback(() => {
    setPlaying(true);
    setTimeout(() => setPlaying(false), 900);
    try {
      const u = new SpeechSynthesisUtterance(L.t);
      u.lang = 'ar-SA'; u.rate = 0.8;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }, [L]);

  return (
    <div className={'aec-hero' + (mounted ? '' : ' preload')}>
      <div className="bg-layer bg-grid" />
      <div className="bg-layer bg-wash" style={{ opacity: 0.5 }} />

      {/* NAV */}
      <nav className="nav enter" style={{ transitionDelay: '0ms' }}>
        <div className="brand">
          <div className="brand-mark ar">اقرأ</div>
          <div>
            <div className="brand-name">Arabic Education Center</div>
            <div className="brand-sub">{c.sub2}</div>
          </div>
        </div>
        <div className="nav-links">
          {c.nav.map((n) => <a key={n} className="nav-link" href="#">{n}</a>)}
        </div>
        <div className="nav-right">
          <div className="lang">
            <button className={lang === 'uz' ? 'on' : ''} onClick={() => setLang('uz')}>UZ</button>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
          <Link href="/login" className="btn btn-primary">{c.ctaPrimary}<Icon name="arrow" size={16} /></Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="container">
        <div className="hero">
          {/* LEFT */}
          <div>
            <div className="badge enter" style={{ transitionDelay: '60ms' }}>
              <span className="ar">اقرأ</span>
              <span className="dot" />
              {c.badge}
            </div>

            <h1 className="headline enter" style={{ transitionDelay: '120ms' }} key={lang + 'h'}>
              {c.h1[0]}<span className="accent">{c.h1[1]}</span>{c.h1[2]}
            </h1>

            <p className="sub enter" style={{ transitionDelay: '200ms' }} key={lang + 's'}>{c.sub}</p>

            <div className="cta-row enter" style={{ transitionDelay: '280ms' }}>
              <Link href="/login" className="btn btn-primary lg">{c.ctaPrimary}<Icon name="arrow" size={18} /></Link>
              <Link href="/login" className="btn btn-ghost"><Icon name="play" size={15} />{c.ctaGhost}</Link>
            </div>

            <div className="stats enter" style={{ transitionDelay: '360ms' }} key={lang + 'st'}>
              {c.stats.map((s, i) => (
                <div key={i}>
                  <div className="stat-num">
                    {s.hl ? <>{s.n.replace(s.hl, '')}<span>{s.hl}</span></> : s.n}
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — showcase */}
          <div className="stage enter" style={{ transitionDelay: '240ms' }}>
            <div className="float f1">
              <span className="ico" style={{ background: 'var(--brand)' }}><Icon name="book" size={16} /></span>
              <div>{c.chip1.t}<small>{c.chip1.s}</small></div>
            </div>
            <div className="float f2">
              <span className="ico" style={{ background: 'var(--amber)' }}><Icon name="check" size={16} /></span>
              <div>{c.chip2.t}<small>{c.chip2.s}</small></div>
            </div>

            <div className="deck">
              <div className="card back2" />
              <div className="card back1" />
              <div
                className="card"
                onClick={() => setIdx((i) => (i + 1) % LETTERS.length)}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-top">
                  <div>
                    <div className="letter-name kufi">{L.name}</div>
                    <div className="letter-trans">/{L.t}/</div>
                  </div>
                  <div className="letter-idx">{c.cardHint} <b>{String(idx + 1).padStart(2, '0')}</b> / {String(LETTERS.length).padStart(2, '0')}</div>
                </div>

                <div className="glyph-wrap">
                  <div className="glyph-bg" key={'bg' + idx}>{L.g}</div>
                  <div className="glyph glyph-anim" key={'g' + idx}>{L.g}</div>
                </div>

                <div className="vowels" key={'v' + idx}>
                  {L.vowels.map(([ar, lat], i) => (
                    <div className="vowel" key={i}>
                      <div className="v-ar">{ar}</div>
                      <div className="v-lat">{lat}</div>
                    </div>
                  ))}
                </div>

                <div className="card-foot">
                  <div className="example" key={'e' + idx}>
                    <span className="ex-ar">{L.ex}</span>
                    <span className="ex-meta">
                      <span className="ex-w">{lang === 'uz' ? L.muz : L.men}</span>
                      <span className="ex-m">/{L.exT}/</span>
                    </span>
                  </div>
                  <button
                    className={'listen' + (playing ? ' playing' : '')}
                    onClick={(e) => { e.stopPropagation(); speak(); }}
                    title={c.listenWord}
                  >
                    <Icon name="play" size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="dots" style={{ position: 'absolute', bottom: -4, left: 0, right: 0 }}>
              {LETTERS.map((_, i) => (
                <i key={i} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

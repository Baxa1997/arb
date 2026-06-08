'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLang } from '@/i18n';

/* ---------------- content ---------------- */
const COPY = {
  uz: {
    eyebrow: 'Arabic Education Center',
    title: 'Arab tilini zamonaviy o‘rganing',
    sub: 'Har bir harf alohida dars. Uy ishlaringizni topshiring, o‘qituvchingiz rivojlanishingizni kuzatadi.',
    points: ['28 ta harf — ketma-ket ochiladigan darslar', 'Avtomatik tekshiriladigan uy ishlari', 'O‘qituvchi bilan jonli rivojlanish'],
    welcome: 'Xush kelibsiz',
    welcomeSub: 'Hisobingizga kiring',
    email: 'Email',
    emailPh: 'email@example.com',
    pass: 'Parol',
    remember: 'Eslab qolish',
    forgot: 'Parolni unutdingizmi?',
    submit: 'Kirish',
    submitting: 'Tekshirilmoqda…',
    foot: 'Hisob o‘qituvchi yoki markaz tomonidan beriladi.',
    back: 'Bosh sahifaga qaytish',
    errEmail: 'To‘g‘ri email kiriting',
    errPass: 'Parolni kiriting',
  },
  en: {
    eyebrow: 'Arabic Education Center',
    title: 'Learn Arabic the modern way',
    sub: 'Every letter is its own lesson. Submit your homework and let your teacher track your progress.',
    points: ['28 letters — lessons unlocked step by step', 'Auto-graded homework', 'Live progress with your teacher'],
    welcome: 'Welcome back',
    welcomeSub: 'Sign in to your account',
    email: 'Email',
    emailPh: 'email@example.com',
    pass: 'Password',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    submit: 'Sign in',
    submitting: 'Checking…',
    foot: 'Accounts are issued by your teacher or center.',
    back: 'Back to home',
    errEmail: 'Enter a valid email',
    errPass: 'Enter your password',
  },
};

const WM_LETTERS = ['ج', 'ب', 'س', 'ع', 'م', 'ت'];
const POINT_ICONS = ['layers', 'check', 'pulse'];

function Icon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
    eyeoff: <><path d="M9.9 5.1A9.8 9.8 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3 3.8M6.1 6.1A17 17 0 002 12s3.5 7 10 7a9.8 9.8 0 004.1-.9" /><path d="M3 3l18 18" /></>,
    check: <path d="M20 6L9 17l-5-5" />,
    arrowleft: <path d="M19 12H5M11 6l-6 6 6 6" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.5" /></>,
    layers: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />,
    pulse: <path d="M3 12h4l2-6 4 14 2-8h6" />,
    warn: <><path d="M12 9v4M12 17h.01" /><path d="M10.3 4.3 2.6 18a1.8 1.8 0 001.6 2.7h15.6A1.8 1.8 0 0021.4 18L13.7 4.3a1.8 1.8 0 00-3.4 0z" /></>,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

export default function LoginPage() {
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const { signIn, loading, error } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [wmIdx, setWmIdx] = useState(0);

  const c = COPY[lang] || COPY.uz;

  useEffect(() => { const r = setTimeout(() => setMounted(true), 60); return () => clearTimeout(r); }, []);
  useEffect(() => {
    const id = setInterval(() => setWmIdx((i) => (i + 1) % WM_LETTERS.length), 4200);
    return () => clearInterval(id);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) er.email = c.errEmail;
    if (!password) er.pass = c.errPass;
    setErrors(er);
    if (Object.keys(er).length) return;
    await signIn(email, password);
  };

  return (
    <div className={'aec-login' + (mounted ? '' : ' preload')}>
      {/* LEFT — brand panel */}
      <aside className="brandside enter">
        <div className="watermark wm-fade ar" key={wmIdx}>{WM_LETTERS[wmIdx]}</div>

        <div className="b-logo">
          <div className="b-mark ar">اقرأ</div>
          <div className="b-logo-name">Arabic Education Center</div>
        </div>

        <div className="b-mid">
          <span className="b-eyebrow"><span className="ar">اقرأ</span>{c.eyebrow}</span>
          <h1 className="b-title">{c.title}</h1>
          <p className="b-sub">{c.sub}</p>
          <div className="b-points">
            {c.points.map((pt, i) => (
              <div className="b-point" key={i}>
                <span className="pc"><Icon name={POINT_ICONS[i]} size={17} /></span>{pt}
              </div>
            ))}
          </div>
        </div>

        <div className="b-foot">© {new Date().getFullYear()} Arabic Education Center</div>
      </aside>

      {/* RIGHT — login card */}
      <main className="formside">
        <div className="wrap enter" style={{ transitionDelay: '160ms' }}>
          <div className="login-mobile-brand">
            <div className="lmb-mark ar">اقرأ</div>
            <div className="lmb-name">Arabic Education Center</div>
          </div>
          <div className="card">
            <div className="c-head">
              <div>
                <div className="c-title">{c.welcome}</div>
                <div className="c-sub">{c.welcomeSub}</div>
              </div>
              <div className="lang">
                <button type="button" className={lang === 'uz' ? 'on' : ''} onClick={() => setLang('uz')}>UZ</button>
                <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
              </div>
            </div>

            <form className="form" onSubmit={submit} noValidate>
              <div className="field">
                <label>{c.email}</label>
                <div className="input-wrap">
                  <input
                    className={'input' + (errors.email ? ' err' : '')}
                    type="email" placeholder={c.emailPh} value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: null })); }}
                    autoComplete="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false}
                  />
                </div>
                {errors.email && <div className="err-msg"><Icon name="warn" size={14} />{errors.email}</div>}
              </div>

              <div className="field">
                <label>{c.pass}</label>
                <div className="input-wrap">
                  <input
                    className={'input has-icon' + (errors.pass ? ' err' : '')}
                    type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.pass) setErrors((p) => ({ ...p, pass: null })); }}
                    autoComplete="current-password"
                  />
                  <button type="button" className="eye" onClick={() => setShowPass((s) => !s)} aria-label="toggle password">
                    <Icon name={showPass ? 'eyeoff' : 'eye'} size={19} />
                  </button>
                </div>
                {errors.pass && <div className="err-msg"><Icon name="warn" size={14} />{errors.pass}</div>}
              </div>

              {error && <div className="err-msg"><Icon name="warn" size={14} />{error}</div>}

              <div className="row-between">
                <div className="remember" onClick={() => setRemember((r) => !r)}>
                  <span className={'check' + (remember ? ' on' : '')}>{remember && <Icon name="check" size={13} />}</span>
                  {c.remember}
                </div>
                <a className="link" href="#">{c.forgot}</a>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? c.submitting : c.submit}
              </button>
            </form>

            <div className="c-foot"><span className="ic"><Icon name="info" size={14} /></span>{c.foot}</div>
          </div>

          <Link className="back" href="/"><Icon name="arrowleft" size={16} />{c.back}</Link>
        </div>
      </main>
    </div>
  );
}

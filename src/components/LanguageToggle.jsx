'use client';
import { useLang } from '@/i18n';

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`inline-flex items-center rounded-lg border border-brand-700/15 bg-cream-50 p-0.5 text-xs font-bold ${className}`}>
      {['uz', 'en'].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-md uppercase transition-colors ${
            lang === l ? 'bg-brand-500 text-white' : 'text-brand-700/55 hover:text-brand-700'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dictionaries } from './dictionaries';

export const useLang = create(
  persist(
    (set) => ({
      lang: 'uz',
      setLang: (lang) => set({ lang }),
      toggle: () => set((s) => ({ lang: s.lang === 'uz' ? 'en' : 'uz' })),
    }),
    { name: 'aec-lang' }
  )
);

// Translation hook: const t = useT(); t('login')
export function useT() {
  const lang = useLang((s) => s.lang);
  return (key) => dictionaries[lang]?.[key] ?? dictionaries.uz[key] ?? key;
}

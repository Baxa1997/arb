import { Plus_Jakarta_Sans, Noto_Naskh_Arabic, Bricolage_Grotesque, Amiri, Reem_Kufi, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const arabic = Noto_Naskh_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
});
// Display + Arabic faces used by the marketing hero.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-amiri',
  display: 'swap',
});
const kufi = Reem_Kufi({
  weight: ['500', '600', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-kufi',
  display: 'swap',
});
const mono = JetBrains_Mono({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: "Arabic Education Center — Arab Tilini O'rganing",
  description: "Arab alifbosini interaktiv va zamonaviy usulda o'rganing. O'qituvchi va talabalar uchun to'liq platforma.",
  keywords: ['arab tili', 'alifbo', 'tajvid', 'makhraj', 'arabic', 'arabic education center'],
};

// Explicit mobile viewport. No maximumScale so pinch-zoom stays available
// (accessibility); iOS auto-zoom-on-focus is prevented via 16px inputs in CSS.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${jakarta.variable} ${arabic.variable} ${display.variable} ${amiri.variable} ${kufi.variable} ${mono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-cream-100 text-brand-700 overflow-x-hidden">
        <div id="modal-root" />
        {children}
      </body>
    </html>
  );
}

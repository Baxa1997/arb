import { Plus_Jakarta_Sans, Noto_Naskh_Arabic } from 'next/font/google';
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

export const metadata = {
  title: "Alifbo — Arab Tilini O'rganing",
  description: "Arab alifbosini interaktiv va zamonaviy usulda o'rganing. O'qituvchilar uchun kuchli dashboard.",
  keywords: ['arab tili', 'alifbo', 'tajvid', 'makhraj', 'arabic'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${jakarta.variable} ${arabic.variable}`}>
      <body className="font-sans antialiased bg-[#0a0f1a] text-white overflow-x-hidden">
        <div id="modal-root" />
        {children}
      </body>
    </html>
  );
}

import { Plus_Jakarta_Sans, Noto_Naskh_Arabic } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-sans' 
});

const arabic = Noto_Naskh_Arabic({ 
  weight: ['400', '500', '600', '700'], 
  subsets: ['arabic'], 
  variable: '--font-arabic' 
});

export const metadata = {
  title: "Alifbo - Arab Alifbosini o'rganing",
  description: "Arab alifbosini interaktiv, zamonaviy usulda o'rganing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${jakarta.variable} ${arabic.variable}`}>
      <body className="font-sans antialiased bg-[#0a0f1a] text-white overflow-x-hidden pt-20">
        <Navbar />
        <div id="modal-root"></div>
        {children}
      </body>
    </html>
  );
}

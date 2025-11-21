import type { Metadata } from 'next';
import { Lalezar, Vazirmatn } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { LanguageProvider } from '@/contexts/LanguageContext';

const lalezar = Lalezar({
  weight: '400',
  subsets: ['arabic'],
  variable: '--font-lalezar',
  display: 'swap',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Karava | کاراوا',
  description: 'اولین بازار آنلاین کار شیفتی در ایران',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${lalezar.variable} ${vazirmatn.variable} font-body bg-concrete dark:bg-ink text-ink dark:text-concrete selection:bg-safety dark:selection:bg-safety selection:text-ink dark:selection:text-ink transition-colors duration-300`}
      >
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}

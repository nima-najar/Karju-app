'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Globe } from 'lucide-react';

const guestLinks = (
  language: 'fa' | 'en',
): Array<{ id: string; label: string; href: string }> => [
  {
    id: 'contact',
    label: language === 'fa' ? 'تماس با ما' : 'Contact us',
    href: '/contact',
  },
  {
    id: 'about',
    label: language === 'fa' ? 'درباره کارجو' : 'About Karju',
    href: '/about',
  },
  {
    id: 'applicants',
    label: language === 'fa' ? 'برای متقاضیان' : 'For applicants',
    href: '/for-applicants',
  },
  {
    id: 'business',
    label: language === 'fa' ? 'برای کسب‌وکارها' : 'For businesses',
    href: '/for-business',
  },
];

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const loadUser = () => {
      setUser(getUser());
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    window.addEventListener('user-login', loadUser);
    window.addEventListener('user-logout', loadUser);
    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('user-login', loadUser);
      window.removeEventListener('user-logout', loadUser);
    };
  }, []);

  const handleLanguageChange = (lang: 'en' | 'fa') => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  // Check if we're on a page that should show login/register buttons instead of hire/find buttons
  const isAppPage = pathname?.startsWith('/shifts') || 
                    pathname?.startsWith('/dashboard') || 
                    pathname?.startsWith('/profile') ||
                    pathname === '/login' ||
                    pathname === '/register';
  
  const primaryLabel = isAppPage 
    ? (language === 'fa' ? 'ثبت نام' : 'Sign up')
    : (language === 'fa' ? 'استخدام نیرو' : 'Hire talent');
  const secondaryLabel = isAppPage
    ? (language === 'fa' ? 'ورود' : 'Login')
    : (language === 'fa' ? 'شروع جستجوی شغل' : 'Find shifts');
  
  const primaryHref = isAppPage ? '/register' : '/register';
  const secondaryHref = isAppPage ? '/login' : '/shifts';

  return (
    <nav className="bg-[#6a35c1] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-white">
              کارجو
            </Link>
            <div className="flex items-center gap-5 sm:gap-8 text-sm sm:text-base font-semibold">
              {guestLinks(language).map((link) => (
                <Link key={link.id} href={link.href} className="hover:text-primary-100 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 rtl:space-x-reverse">
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 text-white hover:text-primary-100 font-semibold"
              >
                <Globe className="w-5 h-5" />
                <span>{language === 'fa' ? 'فارسی' : 'English'}</span>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white text-neutral-800 rounded-md shadow-lg py-1 z-50 rtl:left-0 rtl:right-auto">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-purple-50 ${
                      language === 'en' ? 'bg-purple-100 text-purple-700' : 'text-neutral-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fa')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-purple-50 ${
                      language === 'fa' ? 'bg-purple-100 text-purple-700' : 'text-neutral-700'
                    }`}
                  >
                    فارسی
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-4 text-white">
                {pathname !== '/dashboard' && (
                  <Link
                    href="/dashboard"
                    className="font-semibold hover:text-primary-100"
                  >
                    {language === 'fa' ? 'داشبورد' : 'Dashboard'}
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 font-semibold hover:text-primary-100"
                >
                  <User className="w-5 h-5" />
                  <span>{user.firstName}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href={primaryHref}
                  className="px-4 py-2 rounded-full bg-white text-[#6a35c1] font-semibold hover:bg-primary-100 hover:text-[#4c1d95] transition"
                >
                  {primaryLabel}
                </Link>
                <Link
                  href={secondaryHref}
                  className="font-semibold text-white hover:text-primary-100"
                >
                  {secondaryLabel}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}




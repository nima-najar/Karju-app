'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Hexagon, User, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Load user on mount
    const loadUser = () => {
      const currentUser = getUser();
      setUser(currentUser);
    };
    loadUser();

    // Listen for login/logout events
    const handleUserLogin = () => {
      loadUser();
    };
    const handleUserLogout = () => {
      setUser(null);
    };

    window.addEventListener('user-login', handleUserLogin);
    window.addEventListener('user-logout', handleUserLogout);

    // Load theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('karava-theme');
      const darkMode = savedTheme === 'dark';
      setIsDark(darkMode);
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('user-login', handleUserLogin);
      window.removeEventListener('user-logout', handleUserLogout);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('karava-theme', newTheme ? 'dark' : 'light');
      if (newTheme) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-6 px-4">
      <div
        className={`max-w-7xl mx-auto px-6 py-4 flex justify-between items-center transition-all duration-300 border-2 border-ink dark:border-concrete rounded-full ${
          isScrolled
            ? 'bg-concrete-light dark:bg-ink/90 shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e0ded9]'
            : 'bg-concrete-light/80 dark:bg-ink/80 backdrop-blur-sm'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-safety border-2 border-ink dark:border-concrete flex items-center justify-center text-ink dark:text-safety group-hover:-translate-y-1 group-hover:shadow-[2px_2px_0px_0px_#1a1a1a] dark:group-hover:shadow-[2px_2px_0px_0px_#e0ded9] transition-all">
            <Hexagon className="w-6 h-6" />
          </div>
          <span className="font-display text-3xl tracking-tight text-ink dark:text-concrete pt-1">
            {language === 'fa' ? 'کاراوا.' : 'Karava.'}
          </span>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center bg-white dark:bg-ink border-2 border-ink dark:border-concrete px-1 py-1 gap-1 rounded-full">
          <Link
            href="/"
            className="px-6 py-2 text-sm font-bold transition-all duration-200 text-ink dark:text-concrete hover:bg-concrete-dark dark:hover:bg-concrete/20 rounded-full"
          >
            {language === 'fa' ? 'خانه' : 'Home'}
          </Link>
          <Link
            href="/freelancers"
            className="px-6 py-2 text-sm font-bold transition-all duration-200 text-ink dark:text-concrete hover:bg-concrete-dark dark:hover:bg-concrete/20 rounded-full"
          >
            {language === 'fa' ? 'برای فریلنسرها' : 'For Freelancers'}
          </Link>
          <Link
            href="/employers"
            className="px-6 py-2 text-sm font-bold transition-all duration-200 text-ink dark:text-concrete hover:bg-concrete-dark dark:hover:bg-concrete/20 rounded-full"
          >
            {language === 'fa' ? 'برای کارفرمایان' : 'For Employers'}
          </Link>
          <Link
            href="/shifts"
            className="px-6 py-2 text-sm font-bold transition-all duration-200 text-ink dark:text-concrete hover:bg-concrete-dark dark:hover:bg-concrete/20 rounded-full"
          >
            {t('navbar.browseShifts')}
          </Link>
        </div>
        {/* CTA / Auth Buttons */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-ink bg-white dark:bg-ink hover:shadow-[2px_2px_0px_0px_#1a1a1a] transition-all"
            aria-label={isDark ? (language === 'fa' ? 'تغییر به حالت روشن' : 'Switch to light mode') : (language === 'fa' ? 'تغییر به حالت تاریک' : 'Switch to dark mode')}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-safety" />
            ) : (
              <Moon className="w-5 h-5 text-ink" />
            )}
          </button>
          
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden md:block text-ink dark:text-concrete font-bold px-4 py-2 hover:underline decoration-2 decoration-safety underline-offset-4 font-body"
              >
                {t('navbar.dashboard')}
              </Link>
              <Link
                href="/profile"
                className="bg-moss text-concrete border-2 border-ink px-6 py-2 font-bold text-sm hover:shadow-[4px_4px_0px_0px_#1a1a1a] hover:-translate-y-1 transition-all flex items-center gap-2 rounded-full"
              >
                <User className="w-5 h-5" />
                <span>{t('navbar.account')}</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:block text-ink dark:text-concrete font-bold px-4 py-2 hover:underline decoration-2 decoration-safety underline-offset-4 font-body"
              >
                {t('navbar.login')}
              </Link>
              <Link
                href="/register"
                className="bg-moss text-concrete border-2 border-ink px-6 py-2 font-bold text-sm hover:shadow-[4px_4px_0px_0px_#1a1a1a] hover:-translate-y-1 transition-all flex items-center gap-2 rounded-full"
              >
                <span>{t('navbar.signUp')}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

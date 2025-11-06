'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUser, logout } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, User, Briefcase, LogOut, Bell, Settings, Globe } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleLanguageChange = (lang: 'en' | 'fa') => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Karju
            </Link>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 rtl:space-x-reverse"
              >
                <Globe className="w-5 h-5" />
                <span>{language === 'fa' ? 'فارسی' : 'English'}</span>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 rtl:left-0 rtl:right-auto">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      language === 'en' ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fa')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      language === 'fa' ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                    }`}
                  >
                    فارسی
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <>
                <Link
                  href={user.userType === 'worker' ? '/shifts' : '/dashboard'}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 rtl:space-x-reverse"
                >
                  {user.userType === 'worker' ? (
                    <>
                      <Search className="w-5 h-5" />
                      <span>{t('navbar.browseShifts')}</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-5 h-5" />
                      <span>{t('navbar.dashboard')}</span>
                    </>
                  )}
                </Link>

                <Link
                  href="/notifications"
                  className="relative text-gray-700 hover:text-primary-600"
                >
                  <Bell className="w-5 h-5" />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 rtl:space-x-reverse"
                  >
                    <User className="w-5 h-5" />
                    <span>{user.firstName}</span>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 rtl:left-0 rtl:right-auto">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        {t('navbar.profile')}
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        {t('navbar.dashboard')}
                      </Link>
                      <Link
                        href="/admin/shifts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        <Settings className="w-4 h-4 inline mr-2 rtl:mr-0 rtl:ml-2" />
                        {t('navbar.manageShifts')}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 inline mr-2 rtl:mr-0 rtl:ml-2" />
                        {t('navbar.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600"
                >
                  {t('navbar.login')}
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                >
                  {t('navbar.signUp')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}




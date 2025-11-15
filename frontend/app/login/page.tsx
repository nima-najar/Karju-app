'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      router.push('/profile');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '';
      if (errorMessage.includes('Invalid credentials') || errorMessage.includes('invalid') || errorMessage.toLowerCase().includes('credentials')) {
        setError(language === 'fa' ? 'ایمیل یا رمز عبور اشتباه است' : 'Invalid email or password');
      } else {
        setError(language === 'fa' ? 'ورود ناموفق بود. لطفاً دوباره تلاش کنید.' : 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.signIn')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {language === 'fa' ? (
              <>
                یا{' '}
                <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  حساب جدید ایجاد کنید
                </Link>
              </>
            ) : (
              <>
                Or{' '}
                <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  create a new account
                </Link>
              </>
            )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field rounded-t-md"
                placeholder={language === 'fa' ? 'ایمیل' : 'Email address'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field rounded-b-md"
                placeholder={language === 'fa' ? 'رمز عبور' : 'Password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-1" dir={language === 'fa' ? 'rtl' : 'ltr'}>
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
            >
              {loading ? (language === 'fa' ? 'در حال ورود...' : 'Signing in...') : (language === 'fa' ? 'ورود' : 'Sign in')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




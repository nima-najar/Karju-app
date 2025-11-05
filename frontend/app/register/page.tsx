'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Briefcase, User, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: 'worker',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      router.push('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.createAccount')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.or')}{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              {t('auth.signInExisting')}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('auth.iAm')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'worker' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.userType === 'worker'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <User className={`w-8 h-8 mb-2 ${
                      formData.userType === 'worker' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      formData.userType === 'worker' ? 'text-primary-600' : 'text-gray-700'
                    }`}>
                      {t('auth.worker')}
                    </span>
                    {formData.userType === 'worker' && (
                      <span className="text-xs text-primary-600 mt-1">{t('auth.selected')}</span>
                    )}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'business' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.userType === 'business'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Briefcase className={`w-8 h-8 mb-2 ${
                      formData.userType === 'business' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      formData.userType === 'business' ? 'text-primary-600' : 'text-gray-700'
                    }`}>
                      {t('auth.business')}
                    </span>
                    {formData.userType === 'business' && (
                      <span className="text-xs text-primary-600 mt-1">{t('auth.selected')}</span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.firstName')}
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="input-field bg-white text-gray-900"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.lastName')}
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="input-field bg-white text-gray-900"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field bg-white text-gray-900"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.phone')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input-field bg-white text-gray-900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="input-field pr-10 rtl:pl-10 rtl:pr-4 bg-white text-gray-900"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t('auth.passwordPlaceholder')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">{t('auth.passwordMin')}</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
            >
              {loading ? t('auth.creatingAccount') : t('auth.createAccountBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




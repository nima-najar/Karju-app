'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Briefcase, Users, Clock, Shield } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('home.subtitle')}
            </p>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              <Link href="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {t('home.getStarted')}
              </Link>
              <Link href="/shifts" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors border border-white">
                {t('home.browseShifts')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.whyChoose')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <Briefcase className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.flexibleWork')}</h3>
              <p className="text-gray-600">
                {t('home.flexibleWorkDesc')}
              </p>
            </div>

            <div className="card text-center">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.verifiedWorkers')}</h3>
              <p className="text-gray-600">
                {t('home.verifiedWorkersDesc')}
              </p>
            </div>

            <div className="card text-center">
              <Clock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.quickMatching')}</h3>
              <p className="text-gray-600">
                {t('home.quickMatchingDesc')}
              </p>
            </div>

            <div className="card text-center">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.securePayments')}</h3>
              <p className="text-gray-600">
                {t('home.securePaymentsDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.howItWorks')}</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">{t('home.forWorkers')}</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 rtl:mr-0 rtl:ml-4 flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold">{t('home.signUpVerify')}</h4>
                    <p className="text-gray-600">{t('home.signUpVerifyDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 rtl:mr-0 rtl:ml-4 flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold">{t('home.browseApply')}</h4>
                    <p className="text-gray-600">{t('home.browseApplyDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 rtl:mr-0 rtl:ml-4 flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold">{t('home.workEarn')}</h4>
                    <p className="text-gray-600">{t('home.workEarnDesc')}</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">{t('home.forBusinesses')}</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 rtl:mr-0 rtl:ml-4 flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold">{t('home.registerVerify')}</h4>
                    <p className="text-gray-600">{t('home.registerVerifyDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 rtl:mr-0 rtl:ml-4 flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold">{t('home.postShifts')}</h4>
                    <p className="text-gray-600">{t('home.postShiftsDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 rtl:mr-0 rtl:ml-4 flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold">{t('home.reviewHire')}</h4>
                    <p className="text-gray-600">{t('home.reviewHireDesc')}</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('home.readyToStart')}</h2>
          <p className="text-xl mb-8">
            {t('home.readyToStartDesc')}
          </p>
          <Link
            href="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            {t('home.createAccount')}
          </Link>
        </div>
      </section>
    </div>
  );
}




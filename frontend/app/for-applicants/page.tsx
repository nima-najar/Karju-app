'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarClock, CheckCircle2, Clock, Search, Shield, Sparkle } from 'lucide-react';
import { cx } from '@/lib/utils';

const industries = {
  fa: [
    'رویدادها و همایش‌ها',
    'رستوران و کافه',
    'هتل و گردشگری',
    'خرده‌فروشی',
    'انبارداری و لجستیک',
    'خدمات نظافتی',
    'فروش و بازاریابی',
    'ساختمان و تعمیرات',
    'مراقبت و بهداشت',
  ],
  en: [
    'Events & hospitality',
    'Restaurants & cafés',
    'Hotels & tourism',
    'Retail',
    'Logistics & warehousing',
    'Cleaning services',
    'Sales & marketing',
    'Construction & repairs',
    'Care & wellbeing',
  ],
};

const steps = {
  fa: [
    {
      title: 'ثبت‌نام کنید',
      description: 'پروفایل خود را در چند دقیقه بسازید، رایگان و بدون هیچ هزینه‌ای',
      icon: <Sparkle className="w-5 h-5" />,
    },
    {
      title: 'شیفت انتخاب کنید',
      description: 'از بین صدها شیفت موجود، گزینه‌ای که بهترین تناسب دارد را انتخاب کنید',
      icon: <Search className="w-5 h-5" />,
    },
    {
      title: 'شروع به کار کنید',
      description: 'در وقت مقرر حاضر شوید، کار کنید و حقوق خود را دریافت کنید',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ],
  en: [
    {
      title: 'Create your profile',
      description: 'Set up your account in minutes. It’s completely free.',
      icon: <Sparkle className="w-5 h-5" />,
    },
    {
      title: 'Pick your shifts',
      description: 'Choose from hundreds of available shifts that match your schedule.',
      icon: <Search className="w-5 h-5" />,
    },
    {
      title: 'Start working',
      description: 'Show up on time, complete your shift, and get paid promptly.',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ],
};

const benefits = {
  fa: [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'انعطاف کامل',
      description: 'شما تصمیم می‌گیرید چه روزی و چه ساعتی کار کنید. بدون تعهد، بدون برنامه‌ ثابت.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'درآمد مطمئن',
      description: 'حقوق خود را سریع دریافت کنید؛ پرداخت هفتگی یا روزانه، شفاف و بدون تاخیر.',
    },
    {
      icon: <CalendarClock className="w-6 h-6" />,
      title: 'کارفرمایان معتبر',
      description: 'با بهترین شرکت‌ها در صنایع مختلف همکاری کنید؛ رستوران‌ها، هتل‌ها، فروشگاه‌ها و بیشتر.',
    },
  ],
  en: [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Total flexibility',
      description: 'Choose when and how many hours you work—no commitments or fixed schedules.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Reliable earnings',
      description: 'Get paid fast with weekly or daily payouts that are transparent and on time.',
    },
    {
      icon: <CalendarClock className="w-6 h-6" />,
      title: 'Trusted employers',
      description: 'Work with vetted partners across restaurants, retail, hospitality, and more.',
    },
  ],
};

export default function ApplicantsPage() {
  const { language } = useLanguage();
  const dir = language === 'fa' ? 'rtl' : 'ltr';
  const copy = {
    heroTitle: language === 'fa' ? 'کار کنید، هر زمان که می‌خواهید' : 'Work whenever you want',
    heroSubtitle:
      language === 'fa'
        ? 'با کارجو، خودتان تعیین می‌کنید کجا و چقدر کار کنید. انعطاف کامل، درآمد مطمئن.'
        : 'With Karju you decide where and when to work. Full flexibility with reliable pay.',
    heroCta: language === 'fa' ? 'پیدا کردن شیفت' : 'Find a shift',
    whyTitle: language === 'fa' ? 'چرا کارجو؟' : 'Why Karju?',
    howTitle: language === 'fa' ? 'چطور شروع کنم؟' : 'How do I get started?',
    categoriesTitle: language === 'fa' ? 'در چه حوزه‌هایی می‌توانید کار کنید؟' : 'Which industries can you work in?',
    categoriesSubtitle:
      language === 'fa'
        ? 'هزاران شیفت در صنایع مختلف منتظر شماست'
        : 'Thousands of shifts available across multiple industries',
    ctaTitle: language === 'fa' ? 'همین امروز شروع کنید' : 'Start today',
    ctaSubtitle:
      language === 'fa'
        ? 'به هزاران نفری که از پلتفرم ما برای یافتن شغل استفاده می‌کنند بپیوندید.'
        : 'Join thousands of workers already finding shifts through Karju.',
    ctaPrimary: language === 'fa' ? 'ثبت‌نام رایگان' : 'Sign up free',
    ctaSecondary: language === 'fa' ? 'درخواست مشاوره' : 'Request consultation',
  };

  return (
    <div dir={dir} className="bg-[#f5f6ff] min-h-screen">
      <section className="bg-[#dcdcfb]">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 mb-6">{copy.heroTitle}</h1>
          <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto mb-10">
            {copy.heroSubtitle}
          </p>
          <Link
            href="/shifts"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#6256ff] to-[#8e75ff] text-white px-8 py-3 rounded-full shadow-lg font-semibold hover:opacity-90 transition"
          >
            {copy.heroCta}
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        <div className="text-center space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">{copy.whyTitle}</h2>
            <p className="text-neutral-600">
              {language === 'fa'
                ? 'ما به شما کنترل کامل بر زمان و درآمدتان می‌دهیم'
                : 'We give you full control over your time and earnings.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits[language].map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-8 shadow-sm border border-[#ecefff] text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-[22px] bg-[#edeaff] flex items-center justify-center text-[#6256ff]">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">{item.title}</h3>
                <p className="text-sm text-neutral-600 leading-6">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-neutral-900">{copy.howTitle}</h2>
            <p className="text-neutral-600">
              {language === 'fa'
                ? 'فقط سه قدم ساده تا اولین شیفت شما فاصله است.'
                : 'Only three easy steps stand between you and your first shift.'}
            </p>
          </div>
          <div className="space-y-4">
            {steps[language].map((step, index) => (
              <div key={step.title} className="flex items-start gap-4 bg-white rounded-2xl p-6 border border-[#ecefff]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#6256ff]/10 text-[#6256ff] flex items-center justify-center font-bold">
                  {language === 'fa' ? (index + 1).toLocaleString('fa-IR') : index + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-semibold text-neutral-900">{step.title}</h4>
                  <p className="text-sm text-neutral-600 leading-6">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold text-neutral-900">{copy.categoriesTitle}</h2>
          <p className="text-neutral-600">{copy.categoriesSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {industries[language].map((item) => (
              <span
                key={item}
                className="px-5 py-2 bg-white border border-[#ecefff] rounded-full text-sm font-medium text-neutral-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#6256ff] to-[#8e75ff] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">{copy.ctaTitle}</h2>
          <p className="text-white/80 max-w-2xl mx-auto leading-7">{copy.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#4b28b0] rounded-full font-semibold shadow-lg hover:bg-primary-50 transition"
            >
              {copy.ctaPrimary}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white/10 border border-white/40 text-white rounded-full font-semibold backdrop-blur-sm hover:bg-white/20 transition"
            >
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


'use client';

import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  LifeBuoy,
  LineChart,
  Facebook,
  Instagram,
  Linkedin,
  Search,
  Send,
  Sparkle,
  TrendingUp,
  Twitter,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

type LocalisedCopy = {
  fa: string;
  en: string;
};

type Step = {
  id: number;
  title: LocalisedCopy;
  description: LocalisedCopy;
  icon: ReactNode;
};

type Feature = {
  title: LocalisedCopy;
  description: LocalisedCopy;
  icon: ReactNode;
};

const heroCopy = {
  heading: {
    fa: 'پیدا کردن کار مناسب،',
    en: 'Finding the right job,',
  },
  highlight: {
    fa: 'آسان‌تر از همیشه',
    en: 'easier than ever',
  },
  subheading: {
    fa: 'کارجو پلی است میان کسب‌وکارها و متقاضیان. کافیست تصمیم بگیرید کارجو شوید یا نیروی جدید جذب کنید و مسیر مناسب خود را انتخاب کنید.',
    en: 'Karju bridges businesses and talent—decide whether you want to work shifts or hire a workforce and we guide you the rest of the way.',
  },
  primaryCta: {
    fa: 'استخدام نیرو',
    en: 'Hire talent',
  },
  secondaryCta: {
    fa: 'شروع جستجوی شغل',
    en: 'Start job search',
  },
};

const seekerSteps: Step[] = [
  {
    id: 1,
    title: { fa: 'جستجو کنید', en: 'Search smartly' },
    description: {
      fa: 'از بین هزاران شغل فعال، موقعیت‌های مناسب خود را با فیلترهای پیشرفته پیدا کنید.',
      en: 'Browse thousands of active shifts and fine-tune results with advanced filters.',
    },
    icon: <Search className="w-6 h-6 text-white" />,
  },
  {
    id: 2,
    title: { fa: 'درخواست دهید', en: 'Apply quickly' },
    description: {
      fa: 'پروفایل کامل بسازید و تنها با چند کلیک برای فرصت‌های دلخواه درخواست ارسال کنید.',
      en: 'Complete your profile and apply to roles you love in just a few clicks.',
    },
    icon: <Send className="w-6 h-6 text-white" />,
  },
  {
    id: 3,
    title: { fa: 'شروع کنید', en: 'Start working' },
    description: {
      fa: 'پس از تایید کارفرما، آماده شروع کار و دریافت دستمزد به موقع باشید.',
      en: 'Once approved, show up for shifts and get paid reliably.',
    },
    icon: <Sparkle className="w-6 h-6 text-white" />,
  },
];

const seekerFeatures: Feature[] = [
  {
    title: { fa: 'جستجوی هوشمند', en: 'Smart search' },
    description: {
      fa: 'با فیلترهای دقیق، فرصت‌های متناسب با مهارت و زمان خود را پیدا کنید.',
      en: 'Use precise filters to match opportunities to your skills and schedule.',
    },
    icon: <Search className="w-5 h-5 text-primary-500" />,
  },
  {
    title: { fa: 'پرداخت سریع', en: 'Fast payouts' },
    description: {
      fa: 'دریافت حقوق به صورت هفتگی یا پس از اتمام هر شیفت بدون تاخیر.',
      en: 'Receive your earnings weekly or right after each shift finishes.',
    },
    icon: <DollarSign className="w-5 h-5 text-primary-500" />,
  },
  {
    title: { fa: 'پشتیبانی ۲۴/۷', en: '24/7 support' },
    description: {
      fa: 'تیم پشتیبانی کارجو همیشه همراه شماست تا با خیال راحت کار کنید.',
      en: 'Our support team is available around the clock whenever you need help.',
    },
    icon: <LifeBuoy className="w-5 h-5 text-primary-500" />,
  },
];

const businessFeatures: Feature[] = [
  {
    title: { fa: 'دسترسی به استعدادها', en: 'Access to talent' },
    description: {
      fa: 'از بین هزاران متقاضی تایید شده، نیروهای مورد نیاز خود را انتخاب کنید.',
      en: 'Browse a pool of vetted professionals and hire the best fit fast.',
    },
    icon: <Users className="w-5 h-5 text-primary-500" />,
  },
  {
    title: { fa: 'مدیریت آسان شیفت‌ها', en: 'Easy shift management' },
    description: {
      fa: 'شیفت‌ها را تنها با چند کلیک برنامه‌ریزی و مدیریت کنید.',
      en: 'Plan and manage staffing schedules with a few simple clicks.',
    },
    icon: <CalendarClock className="w-5 h-5 text-primary-500" />,
  },
  {
    title: { fa: 'کاهش هزینه‌ها', en: 'Lower hiring costs' },
    description: {
      fa: 'با حذف مراحل طولانی استخدام تا ۶۰٪ در زمان و هزینه صرفه‌جویی کنید.',
      en: 'Skip lengthy hiring cycles and cut hiring costs by up to 60%.',
    },
    icon: <TrendingUp className="w-5 h-5 text-primary-500" />,
  },
  {
    title: { fa: 'گزارش‌دهی دقیق', en: 'Insightful analytics' },
    description: {
      fa: 'آمار دقیق از عملکرد نیروها و هزینه‌ها در اختیار داشته باشید.',
      en: 'Track workforce performance and spending with detailed analytics.',
    },
    icon: <LineChart className="w-5 h-5 text-primary-500" />,
  },
];

const closingCopy = {
  heading: { fa: 'همین امروز شروع کنید', en: 'Get started today' },
  subheading: {
    fa: 'به جمع هزاران کارجو و کسب‌وکار در کارجو بپیوندید و تجربه‌ای نو از همکاری را آغاز کنید.',
    en: 'Join thousands of workers and businesses already hiring smarter with Karju.',
  },
  primary: { fa: 'ثبت‌نام کارجو', en: 'Sign up as worker' },
  secondary: { fa: 'ثبت‌نام کسب‌وکار', en: 'Sign up as business' },
};

export default function HomePage() {
  const { language } = useLanguage();
  const dir = language === 'fa' ? 'rtl' : 'ltr';

  const renderCopy = (copy: LocalisedCopy) => (language === 'fa' ? copy.fa : copy.en);

  const seekerStepsWithLocale = useMemo(
    () =>
      seekerSteps.map((step) => ({
        ...step,
        idLabel: language === 'fa' ? step.id.toLocaleString('fa-IR') : step.id,
      })),
    [language],
  );

  return (
    <div dir={dir} className="min-h-screen bg-[#f5f7ff]">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#9371f0] via-[#7f5be4] to-[#5f3ec0]" />
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-24 text-center text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.25] mb-6">
            <span>{renderCopy(heroCopy.heading)}</span>
            <br />
            <span className="bg-gradient-to-r from-[#90a3ff] to-white text-transparent bg-clip-text">
              {renderCopy(heroCopy.highlight)}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto mb-10">
            {renderCopy(heroCopy.subheading)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register-business"
              className="inline-flex items-center justify-center bg-white text-[#4b28b0] px-8 py-3 rounded-2xl font-semibold shadow-[0px_10px_25px_rgba(93,95,225,0.35)] hover:bg-primary-50 transition"
            >
              {renderCopy(heroCopy.primaryCta)}
            </Link>
            <Link
              href="/shifts"
              className="inline-flex items-center justify-center bg-white/10 border border-white/40 text-white px-8 py-3 rounded-2xl font-semibold backdrop-blur-sm hover:bg-white/20 transition"
            >
              {renderCopy(heroCopy.secondaryCta)}
            </Link>
          </div>
        </div>
      </header>

      <main className="space-y-28 py-24">
        <section id="for-applicants" className="px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-[0px_18px_40px_rgba(15,23,42,0.08)] p-10 relative overflow-hidden border border-[#eef0ff]">
            <div className="absolute inset-y-0 -left-24 w-72 bg-gradient-to-b from-[#eef2ff] to-transparent rounded-full blur-3xl opacity-70" />
            <div className="relative grid lg:grid-cols-[320px_1fr] gap-12 items-start">
              <div className="space-y-4 text-center lg:text-start">
                <span className="inline-flex items-center gap-2 bg-[#585bdb]/10 text-[#585bdb] px-4 py-1.5 rounded-full text-sm font-semibold">
                  <Sparkle className="w-4 h-4" />
                  {language === 'fa' ? 'برای متقاضیان شغل' : 'For job seekers'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                  {language === 'fa' ? 'در سه قدم ساده به شغل دلخواه برسید' : 'Land the right shift in three easy steps'}
                </h2>
                <p className="text-sm text-neutral-600 leading-6">
                  {language === 'fa'
                    ? 'کارجو فرآیند یافتن شغل را ساده کرده است؛ فقط کافی است پروفایل خود را تکمیل کنید و از پیشنهادهای هوشمند لذت ببرید.'
                    : 'Karju streamlines your job search—complete your profile and enjoy personalised, smart recommendations.'}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                {seekerStepsWithLocale.map((step) => (
                  <div key={step.id} className="bg-[#f8f9ff] rounded-2xl p-6 border border-[#e6e9fc] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#585bdb] to-[#7d50e2] flex items-center justify-center shadow-lg">
                        {step.icon}
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-[#585bdb] to-[#7d50e2] text-transparent bg-clip-text">
                        {step.idLabel as string}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {renderCopy(step.title)}
                      </h3>
                      <p className="text-sm leading-6 text-neutral-600">
                        {renderCopy(step.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="for-business" className="px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <div className="bg-white rounded-3xl shadow-[0px_18px_40px_rgba(15,23,42,0.08)] p-10 border border-[#eef0ff]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#585bdb]/10 flex items-center justify-center text-[#585bdb]">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                    {language === 'fa' ? 'مزایای کارجویان' : 'Benefits for job seekers'}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {language === 'fa'
                      ? 'فرصت‌های مناسب با پرداخت به‌موقع و پشتیبانی همیشگی'
                      : 'Fair opportunities, reliable payouts, and full-time support.'}
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                {seekerFeatures.map((feature) => (
                  <div key={feature.title.fa} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#eef0ff] flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-900 mb-1">
                        {renderCopy(feature.title)}
                      </h4>
                      <p className="text-sm text-neutral-600 leading-6">
                        {renderCopy(feature.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-[0px_18px_40px_rgba(15,23,42,0.08)] p-10 border border-[#eef0ff]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#585bdb]/10 flex items-center justify-center text-[#585bdb]">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                    {language === 'fa' ? 'راهکار کسب‌وکارها' : 'Solutions for businesses'}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {language === 'fa'
                      ? 'فرآیند استخدام سریع، شفاف و مقرون‌به‌صرفه'
                      : 'Fast, transparent, and cost-effective hiring in one platform.'}
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                {businessFeatures.map((feature) => (
                  <div key={feature.title.fa} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#eef0ff] flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-900 mb-1">
                        {renderCopy(feature.title)}
                      </h4>
                      <p className="text-sm text-neutral-600 leading-6">
                        {renderCopy(feature.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#585bdb] to-[#7d50e2] rounded-3xl text-white p-10 sm:p-14 text-center shadow-[0px_24px_48px_rgba(82,86,225,0.35)]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-semibold">
                <Sparkle className="w-4 h-4" />
                {language === 'fa' ? 'آماده شروع هستید؟' : 'Ready to begin?'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                {renderCopy(closingCopy.heading)}
              </h2>
              <p className="text-white/80 leading-7 max-w-3xl mx-auto">
                {renderCopy(closingCopy.subheading)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center bg-white text-[#4b28b0] px-8 py-3 rounded-2xl font-semibold shadow-lg hover:bg-primary-50 transition"
                >
                  {renderCopy(closingCopy.primary)}
                  <ArrowRight className={cx('w-5 h-5', language === 'fa' ? 'mr-2' : 'ml-2')} />
                </Link>
                <Link
                  href="/register-business"
                  className="inline-flex items-center justify-center bg-white/10 border border-white/40 text-white px-8 py-3 rounded-2xl font-semibold backdrop-blur-sm hover:bg-white/20 transition"
                >
                  {renderCopy(closingCopy.secondary)}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e5e7f5] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
          <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)] items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#585bdb] to-[#7d50e2] flex items-center justify-center text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-neutral-900">کارجو</span>
              </div>
              <p className="text-sm leading-6 text-neutral-600">
                پلتفرم هوشمند یافتن شغل و نیروی کار در ایران؛ اتصال سریع و آسان بین کسب‌وکارها و متقاضیان.
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <p className="text-neutral-900 font-semibold mb-1">برای متقاضیان</p>
              <Link href="/shifts" className="hover:text-[#585bdb] transition">جستجوی شغل</Link>
              <Link href="/register" className="hover:text-[#585bdb] transition">ثبت‌نام</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">راهنمای استفاده</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">سوالات متداول</Link>
            </div>

            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <p className="text-neutral-900 font-semibold mb-1">برای کسب‌وکارها</p>
              <Link href="/404" className="hover:text-[#585bdb] transition">استخدام نیرو</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">درخواست مشاوره</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">تعرفه‌ها</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">قوانین و مقررات</Link>
            </div>

            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <p className="text-neutral-900 font-semibold mb-1">شرکت</p>
              <Link href="/404" className="hover:text-[#585bdb] transition">درباره ما</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">تماس با ما</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">وبلاگ</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">فرصت‌های شغلی</Link>
            </div>

            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <p className="text-neutral-900 font-semibold mb-1">پشتیبانی</p>
              <Link href="/404" className="hover:text-[#585bdb] transition">مرکز راهنمایی</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">گزارش مشکل</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">حریم خصوصی</Link>
              <Link href="/404" className="hover:text-[#585bdb] transition">شرایط استفاده</Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[#eceffd] pt-8">
            <div className="flex items-center gap-4 text-[#6a35c1]">
              <Link href="/404" className="w-10 h-10 rounded-full bg-[#ecebfd] flex items-center justify-center hover:bg-[#dcd5ff] transition">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="/404" className="w-10 h-10 rounded-full bg-[#ecebfd] flex items-center justify-center hover:bg-[#dcd5ff] transition">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="/404" className="w-10 h-10 rounded-full bg-[#ecebfd] flex items-center justify-center hover:bg-[#dcd5ff] transition">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="/404" className="w-10 h-10 rounded-full bg-[#ecebfd] flex items-center justify-center hover:bg-[#dcd5ff] transition">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-neutral-500">© ۱۴۰۳ کارجو. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

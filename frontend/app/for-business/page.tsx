'use client';

import Link from 'next/link';
import { Briefcase, Building2, CalendarDays, ClipboardCheck, DollarSign, ShieldCheck, Users } from 'lucide-react';

const heroCopy = {
  heading: 'نیروی کار مناسب، در زمان مناسب',
  subheading:
    'با کارجو، دسترسی فوری به هزاران نیروی واجد شرایط داشته باشید، بدون فرآیند طولانی استخدام. تنها کافی است درخواست خود را ثبت کنید.',
  primaryCta: 'درخواست مشاوره',
};

const reasons = [
  {
    title: 'صرفه‌جویی در هزینه',
    description: 'تا ۶۰٪ در هزینه‌های استخدام می‌توانید صرفه‌جویی کنید. فقط برای ساعات کار پرداخت کنید.',
    icon: <DollarSign className="w-6 h-6 text-white" />,
  },
  {
    title: 'نیروهای واجد شرایط',
    description: 'دسترسی به هزاران نیروی تأیید شده با مهارت‌های مختلف که همه بررسی و تایید شده‌اند.',
    icon: <Users className="w-6 h-6 text-white" />,
  },
  {
    title: 'کارفرمایان معتبر',
    description: 'با بهترین شرکت‌ها در صنایع مختلف همکاری کنید، از فروشگاه‌ها تا رستوران‌ها و هتل‌ها.',
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
  },
  {
    title: 'پشتیبانی همیشگی',
    description: 'تیم ما در تمام مراحل کنار شماست تا سریع‌ترین مسیر را برای یافتن نیرو ارائه دهیم.',
    icon: <ClipboardCheck className="w-6 h-6 text-white" />,
  },
];

const steps = [
  {
    id: '۱',
    title: 'مشاوره با تیم ما',
    description: 'با تیم ما صحبت کنید تا نیازهای شما را بررسی کنیم و بهترین راه‌حل را ارائه دهیم.',
  },
  {
    id: '۲',
    title: 'ثبت اطلاعات شیفت',
    description: 'جزئیات مورد نیاز مثل نوع کار، زمان، مکان و شرایط استخدام را ثبت کنید.',
  },
  {
    id: '۳',
    title: 'انتخاب متقاضی',
    description: 'از بین متقاضیان واجد شرایط، بهترین نیروها را انتخاب و تایید کنید.',
  },
];

const industries = [
  'رویدادها و همایش‌ها',
  'رستوران و کافه',
  'هتل و گردشگری',
  'خرده‌فروشی',
  'خودروسازی',
  'حمل و نقل',
  'فروش و بازاریابی',
  'انبارداری و لجستیک',
  'ساختمان و تعمیرات',
  'مراقبت و بهداشت',
];

export default function ForBusinessPage() {
  return (
    <div dir="rtl" className="bg-[#f4f6ff] text-neutral-800">
      <main className="min-h-screen">
        <section className="relative overflow-hidden bg-[#c9cbff]/40">
          <div className="absolute inset-0 bg-gradient-to-b from-[#dedfff] via-[#cfcfff] to-[#f4f6ff]" />
          <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
            <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/70 text-sm font-semibold text-[#6a48d7] mb-6">
              کارجو برای کسب‌وکارها
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 leading-snug mb-6">{heroCopy.heading}</h1>
            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-3xl mx-auto mb-10">
              {heroCopy.subheading}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-[#724bdb] text-white px-8 py-3 rounded-2xl font-semibold shadow-[0_14px_30px_rgba(101,64,219,0.35)] hover:bg-[#623fbe] transition"
            >
              {heroCopy.primaryCta}
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-neutral-900">چرا کارجو؟</h2>
            <p className="text-neutral-600 text-base">ما به شما کمک می‌کنیم تا بهترین نیروها را در کمترین زمان پیدا کنید.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className="bg-white rounded-3xl p-8 border border-[#e7e9ff] shadow-[0px_18px_40px_rgba(15,23,42,0.07)] flex flex-col gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#724bdb] to-[#9a77ff] flex items-center justify-center shadow-lg">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{reason.title}</h3>
                <p className="text-sm leading-7 text-neutral-600">{reason.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#724bdb] font-semibold mb-3">چطور شروع کنم؟</p>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">فقط سه قدم ساده تا یافتن بهترین نیروها</h2>
              <p className="text-base text-neutral-600 leading-7">
                فرآیند همکاری با کارجو سریع و شفاف است. با ثبت اطلاعات شیفت‌های مورد نیاز، ما بهترین متقاضیان تأیید شده را
                برای شما معرفی می‌کنیم تا فقط انتخاب و تایید کنید.
              </p>
            </div>

            <div className="space-y-5">
              {steps.map((step, index) => (
                <div key={step.id} className="bg-[#f7f7ff] border border-[#ecebff] rounded-2xl p-6 flex gap-4 shadow-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#ded8ff] flex items-center justify-center mb-2 font-black text-[#724bdb]">
                      {step.id}
                    </div>
                    {index !== steps.length - 1 && (
                      <div className="hidden sm:block w-px flex-1 bg-gradient-to-b from-[#ded8ff] to-transparent" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
                    <p className="text-sm leading-6 text-neutral-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-neutral-900">در چه حوزه‌هایی می‌توانید کارمند پیدا کنید؟</h2>
            <p className="text-neutral-600 text-base">صنایع متنوعی که می‌توانند از کارجو استفاده کنند</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {industries.map((industry) => (
              <span
                key={industry}
                className="px-5 py-2 rounded-full bg-white border border-[#e6e9ff] text-sm font-semibold text-neutral-700 shadow-sm"
              >
                {industry}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#663fd1] via-[#8050ef] to-[#a268ff] text-white">
          <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
            <h2 className="text-3xl font-bold">همین امروز شروع کنید</h2>
            <p className="text-white/80 text-base leading-7">
              به هزاران کسب‌وکاری که از کارجو برای یافتن نیروی حرفه‌ای استفاده می‌کنند بپیوندید.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/70 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white/10 transition"
            >
              درخواست مشاوره
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-[#e4e7fb]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#724bdb] to-[#9e7eff] flex items-center justify-center text-white">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-neutral-900">کارجو</span>
            </div>
            <p className="text-sm leading-6 text-neutral-600">
              پلتفرم هوشمند یافتن شغل و نیروی کار در ایران؛ اتصال سریع و آسان بین کسب‌وکارها و متقاضیان.
            </p>
          </div>

          <div className="text-sm text-neutral-600 space-y-3">
            <p className="text-neutral-900 font-semibold">برای متقاضیان</p>
            <Link href="/shifts" className="block hover:text-[#5b36c4] transition">
              جستجوی شغل
            </Link>
            <Link href="/register" className="block hover:text-[#5b36c4] transition">
              ثبت‌نام
            </Link>
            <Link href="/faq" className="block hover:text-[#5b36c4] transition">
              سوالات متداول
            </Link>
          </div>

          <div className="text-sm text-neutral-600 space-y-3">
            <p className="text-neutral-900 font-semibold">برای کسب‌وکارها</p>
            <Link href="/register-business" className="block hover:text-[#5b36c4] transition">
              استخدام نیرو
            </Link>
            <Link href="/contact" className="block hover:text-[#5b36c4] transition">
              درخواست مشاوره
            </Link>
            <Link href="/pricing" className="block hover:text-[#5b36c4] transition">
              تعرفه‌ها
            </Link>
          </div>

          <div className="text-sm text-neutral-600 space-y-3">
            <p className="text-neutral-900 font-semibold">شرکت</p>
            <Link href="/about" className="block hover:text-[#5b36c4] transition">
              درباره ما
            </Link>
            <Link href="/contact" className="block hover:text-[#5b36c4] transition">
              تماس با ما
            </Link>
            <Link href="/support" className="block hover:text-[#5b36c4] transition">
              پشتیبانی
            </Link>
          </div>
        </div>
        <div className="border-t border-[#eceffd] py-6 text-center text-xs text-neutral-500">
          © ۱۴۰۳ کارجو. تمامی حقوق محفوظ است.
        </div>
      </footer>
    </div>
  );
}



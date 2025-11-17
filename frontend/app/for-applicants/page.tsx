'use client';

import Link from 'next/link';
import { Briefcase, CalendarCheck, CheckCircle2, Clock, DollarSign, ShieldCheck } from 'lucide-react';

const heroCopy = {
  heading: 'کار کنید، هر زمان که می‌خواهید',
  subheading:
    'با کارجو، خودتان تعیین می‌کنید کجا و چند روز کار کنید. انعطاف کامل، درآمد مطمئن و کارفرمایان معتبر در انتظار شماست.',
  primaryCta: 'پیدا کردن شیفت',
};

const reasons = [
  {
    title: 'انعطاف کامل',
    description: 'شما تصمیم می‌گیرید چه روزی و چه ساعتی کار کنید. تعهد بلندمدت، بدون قرارداد ثابت.',
    icon: <Clock className="w-6 h-6 text-white" />,
  },
  {
    title: 'درآمد مطمئن',
    description: 'حقوق خود را پس از هر شیفت دریافت کنید. پرداخت مطمئن و بدون تاخیر.',
    icon: <DollarSign className="w-6 h-6 text-white" />,
  },
  {
    title: 'کارفرمایان معتبر',
    description: 'با جدیدترین شرکت‌ها در صنایع مختلف کار کنید. هر شیفت تضمین شده و تایید شده است.',
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
  },
];

const steps = [
  {
    id: '۱',
    title: 'ثبت‌نام کنید',
    description: 'پروفایل خود را در چند دقیقه بسازید. رایگان و بدون هیچ هزینه‌ای.',
    icon: <CheckCircle2 className="w-6 h-6 text-[#7c4dff]" />,
  },
  {
    id: '۲',
    title: 'شیفت انتخاب کنید',
    description: 'از بین صدها شیفت موجود، آن‌هایی که برایتان مناسب است را انتخاب کنید.',
    icon: <CalendarCheck className="w-6 h-6 text-[#7c4dff]" />,
  },
  {
    id: '۳',
    title: 'شروع به کار کنید',
    description: 'سر وقت حاضر شوید، کار کنید و حقوق خود را دریافت کنید.',
    icon: <Briefcase className="w-6 h-6 text-[#7c4dff]" />,
  },
];

const categories = [
  'رستوران و کافه',
  'هتل و گردشگری',
  'خرده‌فروشی',
  'رویدادها و همایش‌ها',
  'حمل و نقل',
  'فروش و بازاریابی',
  'خدمات نظافتی',
  'انبارداری و لجستیک',
  'ساختمان و تعمیرات',
  'مراقبت و بهداشت',
];

export default function ApplicantsPage() {
  return (
    <div dir="rtl" className="bg-[#f4f6ff] text-neutral-800">
      <main className="min-h-screen">
        <section className="relative overflow-hidden bg-[#c9cbff]/40">
          <div className="absolute inset-0 bg-gradient-to-b from-[#e0e4ff] via-[#cfd4ff] to-[#f4f6ff]" />
          <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
            <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/70 text-sm font-semibold text-[#6f4bdb] mb-6">
              کارجو برای متقاضیان
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 leading-snug mb-6">{heroCopy.heading}</h1>
            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-3xl mx-auto mb-10">
              {heroCopy.subheading}
            </p>
            <Link
              href="/shifts"
              className="inline-flex items-center justify-center bg-[#7c4dff] text-white px-8 py-3 rounded-2xl font-semibold shadow-[0_14px_30px_rgba(96,57,255,0.35)] hover:bg-[#6b41e0] transition"
            >
              {heroCopy.primaryCta}
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-neutral-900">چرا کارجو؟</h2>
            <p className="text-neutral-600 text-base">
              ما به شما کنترل کامل بر زمان و درآمدتان می‌دهیم. تنها کافیست تصمیم بگیرید.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className="h-full bg-white rounded-3xl p-8 border border-[#e7e9ff] shadow-[0px_18px_40px_rgba(15,23,42,0.07)] flex flex-col gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#7c4dff] to-[#9775ff] flex items-center justify-center shadow-lg">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{reason.title}</h3>
                <p className="text-sm leading-7 text-neutral-600">{reason.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[#7c4dff] font-semibold mb-3">چطور شروع کنم؟</p>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">فقط سه قدم ساده تا اولین شیفت شما</h2>
              <p className="text-base text-neutral-600 leading-7">
                فرآیند ثبت نام در کارجو کمتر از ده دقیقه زمان می‌برد. پس از تایید، می‌توانید به سرعت شیفت‌های مناسب را
                انتخاب کنید و وارد کار شوید.
              </p>
            </div>

            <div className="space-y-5">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="bg-[#f7f7ff] border border-[#ecebff] rounded-2xl p-6 flex items-start gap-4 shadow-sm"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#ded8ff] flex items-center justify-center mb-2 font-black text-[#7c4dff]">
                      {step.id}
                    </div>
                    <div className="hidden sm:block w-px flex-1 bg-gradient-to-b from-[#ded8ff] to-transparent" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      {step.icon}
                      <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-6 text-neutral-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-neutral-900">در چه حوزه‌هایی می‌توانید کار کنید؟</h2>
            <p className="text-neutral-600 text-base">
              هزاران شیفت در صنایع مختلف منتظر شماست؛ موقعیت مناسب خود را انتخاب کنید.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <span
                key={category}
                className="px-5 py-2 rounded-full bg-white border border-[#e6e9ff] text-sm font-semibold text-neutral-700 shadow-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#6b41e0] via-[#8652ff] to-[#b26dff] text-white">
          <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
            <h2 className="text-3xl font-bold">همین امروز شروع کنید</h2>
            <p className="text-white/80 text-base leading-7">
              به هزاران نفری که از پلتفرم ما برای یافتن شغل یا استخدام نیرو استفاده می‌کنند بپیوندید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-white text-[#6b41e0] px-8 py-3 rounded-2xl font-semibold shadow-lg"
              >
                ثبت‌نام رایگان
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center border border-white/60 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white/10 transition"
              >
                ورود به حساب کاربری
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-[#e4e7fb]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#7c4dff] to-[#9e7eff] flex items-center justify-center text-white">
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
            <Link href="/shifts" className="block hover:text-[#6b41e0] transition">
              جستجوی شغل
            </Link>
            <Link href="/register" className="block hover:text-[#6b41e0] transition">
              ثبت‌نام
            </Link>
            <Link href="/faq" className="block hover:text-[#6b41e0] transition">
              سوالات متداول
            </Link>
          </div>

          <div className="text-sm text-neutral-600 space-y-3">
            <p className="text-neutral-900 font-semibold">برای کسب‌وکارها</p>
            <Link href="/register-business" className="block hover:text-[#6b41e0] transition">
              استخدام نیرو
            </Link>
            <Link href="/contact" className="block hover:text-[#6b41e0] transition">
              درخواست مشاوره
            </Link>
            <Link href="/pricing" className="block hover:text-[#6b41e0] transition">
              تعرفه‌ها
            </Link>
          </div>

          <div className="text-sm text-neutral-600 space-y-3">
            <p className="text-neutral-900 font-semibold">شرکت</p>
            <Link href="/about" className="block hover:text-[#6b41e0] transition">
              درباره ما
            </Link>
            <Link href="/contact" className="block hover:text-[#6b41e0] transition">
              تماس با ما
            </Link>
            <Link href="/support" className="block hover:text-[#6b41e0] transition">
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

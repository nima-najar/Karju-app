'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { isAuthenticated, setToken, setUser } from '@/lib/auth';
import { CalendarCheck, CheckCircle2, Clock, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
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
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/profile');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      // Dispatch event to notify Navbar immediately
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('user-login'));
      }
      // Use window.location.href to ensure full page refresh and Navbar update
      window.location.href = '/profile';
    } catch (err: any) {
      setError(err.response?.data?.message || 'ثبت‌نام با خطا مواجه شد');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Clock className="w-5 h-5 text-[#6b41e0]" />,
      title: 'زمان کاملاً دست خودت',
      description: 'شیفت‌ها را بر اساس برنامه شخصی‌ات انتخاب کن و هر زمان آزاد بودی کار کن.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#6b41e0]" />,
      title: 'پرداخت مطمئن و سریع',
      description: 'حقوق هر شیفت را بدون تأخیر و با گزارش شفاف دریافت می‌کنی.',
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-[#6b41e0]" />,
      title: 'پیشنهادهای متنوع',
      description: 'هزاران شیفت در صنایع مختلف، از رویدادها تا رستوران‌ها و فروشگاه‌ها.',
    },
  ];

  const steps = [
    {
      icon: <Sparkles className="w-5 h-5 text-white" />,
      title: 'ثبت‌نام کن',
      description: 'پروفایل کامل خودت را بساز تا پیشنهادهای دقیق دریافت کنی.',
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-white" />,
      title: 'شیفت انتخاب کن',
      description: 'از بین شیفت‌های موجود، گزینه‌ای که مناسب توست را رزرو کن.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
      title: 'کار کن و دستمزد بگیر',
      description: 'سر وقت حاضر شو، شیفت را انجام بده و درآمدت را دریافت کن.',
    },
  ];

  const inputClass =
    'w-full rounded-2xl border-2 border-ink/15 dark:border-concrete/30 bg-white/90 px-4 py-3 text-sm text-ink focus:border-safety focus:ring-0 outline-none transition';

  return (
    <div dir="rtl" className="min-h-screen bg-concrete dark:bg-ink text-ink dark:text-concrete pt-24 sm:pt-28">
      <div className="bg-gradient-to-b from-ink to-moss text-concrete border-b-4 border-safety">
        <div className="max-w-6xl mx-auto px-4 py-14 space-y-6">
          <div className="flex flex-col items-center text-center space-y-5">
            <span className="inline-flex items-center justify-center px-5 py-2 rounded-full border-2 border-concrete text-xs font-bold tracking-widest">
              ثبت‌نام متقاضیان کارجو
            </span>
            <h1 className="text-4xl sm:text-5xl font-display leading-tight">
              در چند دقیقه <br className="hidden sm:block" /> به اکوسیستم شیفت‌های منعطف بپیوند
            </h1>
            <p className="max-w-3xl text-base text-white/80 font-body leading-relaxed">
              اطلاعاتت را وارد کن تا دقیق‌ترین شیفت‌ها را برایت پیدا کنیم. با کارجو همیشه فرصت‌هایی متناسب با انرژی و
              زمان تو آماده است.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="px-6 py-2 rounded-full font-display border-2 border-concrete bg-concrete text-ink hover:-translate-y-0.5 transition"
              >
                برای متقاضیان
              </button>
              <Link
                href="/for-business"
                className="px-6 py-2 rounded-full font-display border-2 border-white/50 text-white hover:bg-white/10 transition"
              >
                برای کسب‌وکارها
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] border-2 border-ink dark:border-concrete bg-white dark:bg-ink/40 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-display text-ink dark:text-concrete">فرم ثبت‌نام</h2>
            <p className="text-sm text-ink/70 dark:text-concrete/70">اطلاعات را دقیق وارد کنید تا سریع‌تر تأیید شوید.</p>
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-2xl text-sm">{error}</div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-bold">
                نام
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className={inputClass}
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="مثلاً علی"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-bold">
                نام خانوادگی
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className={inputClass}
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="مثلاً حسینی"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold">
              ایمیل
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={inputClass}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-bold">
              شماره تماس
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={inputClass}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="09xxxxxxxxx"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-bold">
              رمز عبور
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className={`${inputClass} pr-10 rtl:pl-10 rtl:pr-4`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="حداقل ۶ کاراکتر"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-ink/50"
                aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-ink/60 dark:text-concrete/70">رمز عبور باید حداقل ۶ کاراکتر باشد.</p>
          </div>

          <div className="flex items-start gap-3 bg-concrete/40 dark:bg-ink/30 border-2 border-ink/15 dark:border-concrete/30 rounded-2xl p-4">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-ink/30 text-safety focus:ring-safety"
              required
            />
            <label htmlFor="terms" className="text-sm leading-6">
              من{' '}
              <Link href="/terms" className="text-safety font-semibold hover:underline" target="_blank">
                قوانین و مقررات کارجو
              </Link>{' '}
              را مطالعه کرده‌ام و با آن موافقم.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !acceptTerms}
            className="w-full bg-safety text-ink py-3 rounded-2xl font-display text-lg border-2 border-ink hover:-translate-y-0.5 transition disabled:opacity-40"
          >
            {loading ? 'در حال ایجاد حساب...' : 'ثبت‌نام و شروع'}
          </button>

          <p className="text-center text-sm text-ink/70 dark:text-concrete/70">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link href="/login" className="text-safety font-semibold">
              وارد شوید
            </Link>
          </p>
        </form>

        <div className="space-y-6">
          <div className="rounded-[32px] border-2 border-ink bg-gradient-to-br from-moss to-ink text-concrete p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)] space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-display">چرا ثبت‌نام در کارجو؟</h3>
              <p className="text-sm text-white/80">
                کارجو به تو کمک می‌کند در کوتاه‌ترین زمان، شیفت مناسب خودت را پیدا کنی. زمان کاری منعطف، کارفرماهای معتبر و
                پرداخت به‌موقع تنها بخشی از مزایای ماست.
              </p>
            </div>
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-white/10 rounded-2xl p-4 flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-white text-moss flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-base">{benefit.title}</p>
                    <p className="text-sm text-white/80">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border-2 border-ink dark:border-concrete bg-white dark:bg-ink/40 p-8 space-y-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]">
            <h3 className="text-xl font-display text-ink dark:text-concrete">چطور کار می‌کند؟</h3>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-2xl border-2 border-ink bg-concrete flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-ink dark:text-concrete">{step.title}</p>
                    <p className="text-sm text-ink/70 dark:text-concrete/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

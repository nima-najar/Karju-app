'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
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
    'w-full rounded-2xl border border-[#e0e0ff] bg-white px-4 py-3 text-sm text-neutral-800 focus:border-[#7c4dff] focus:ring-[#7c4dff]/20 outline-none transition';

  return (
    <div dir="rtl" className="min-h-screen bg-[#f3f4ff] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-5">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white text-sm font-semibold text-[#6b41e0] shadow">
            ثبت‌نام متقاضیان کارجو
          </span>
          <h1 className="text-4xl font-black text-neutral-900">فقط چند دقیقه تا یافتن شیفت مناسب</h1>
          <p className="text-base text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            اطلاعات خود را وارد کنید تا بتوانیم بهترین فرصت‌های شغلی را به شما پیشنهاد دهیم. کارجو به شما کمک می‌کند در
            سریع‌ترین زمان، شیفت مورد علاقه‌تان را پیدا کنید و درآمد مطمئن داشته باشید.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              className="px-5 py-2 rounded-full text-sm font-semibold bg-[#6b41e0] text-white shadow-lg"
            >
              برای متقاضیان
            </button>
            <Link
              href="/404"
              className="px-5 py-2 rounded-full text-sm font-semibold bg-white text-neutral-700 border border-[#e0e0ff] hover:border-[#6b41e0] transition"
            >
              برای کسب‌وکارها
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <form onSubmit={handleSubmit} className="bg-white border border-[#ecebff] rounded-3xl p-8 shadow-lg space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">فرم ثبت‌نام</h2>
              <p className="text-sm text-neutral-500">اطلاعات را دقیق وارد کنید تا سریع‌تر تأیید شوید.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">{error}</div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-semibold text-neutral-700">
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
                <label htmlFor="lastName" className="text-sm font-semibold text-neutral-700">
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
              <label htmlFor="email" className="text-sm font-semibold text-neutral-700">
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
              <label htmlFor="phone" className="text-sm font-semibold text-neutral-700">
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
              <label htmlFor="password" className="text-sm font-semibold text-neutral-700">
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
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-neutral-500">رمز عبور باید حداقل ۶ کاراکتر باشد.</p>
            </div>

            <div className="flex items-start gap-3 bg-[#f7f7ff] border border-[#e6e5ff] rounded-2xl p-4">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-[#d4d1ff] text-[#6b41e0] focus:ring-[#6b41e0]"
                required
              />
              <label htmlFor="terms" className="text-sm text-neutral-600 leading-6">
                من{' '}
                <Link href="/terms" className="text-[#6b41e0] font-semibold hover:text-[#4d27b6]" target="_blank">
                  قوانین و مقررات کارجو
                </Link>{' '}
                را مطالعه کرده‌ام و با آن موافقم.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full bg-[#6b41e0] text-white py-3 rounded-2xl font-semibold shadow-lg hover:bg-[#5b35c7] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'در حال ایجاد حساب...' : 'ثبت‌نام و شروع'}
            </button>

            <p className="text-center text-sm text-neutral-500">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link href="/login" className="text-[#6b41e0] font-semibold hover:text-[#4d27b6]">
                وارد شوید
              </Link>
            </p>
          </form>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#6f49d4] to-[#9f7bff] rounded-3xl text-white p-8 space-y-6 shadow-xl">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">چرا ثبت‌نام در کارجو؟</h3>
                <p className="text-sm text-white/90">
                  کارجو به شما کمک می‌کند در کوتاه‌ترین زمان، شیفت مناسب خود را پیدا کنید. زمان کاری منعطف، کارفرماهای
                  معتبر و پرداخت به موقع تنها بخشی از مزایای ماست.
                </p>
              </div>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="bg-white/10 rounded-2xl p-4 flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-2xl bg-white text-[#6b41e0] flex items-center justify-center">
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

            <div className="bg-white rounded-3xl border border-[#ecebff] p-8 space-y-5 shadow-md">
              <h3 className="text-xl font-bold text-neutral-900">چطور کار می‌کند؟</h3>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.title} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-2xl bg-[#6b41e0]/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{step.title}</p>
                      <p className="text-sm text-neutral-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




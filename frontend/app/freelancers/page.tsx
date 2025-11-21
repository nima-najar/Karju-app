'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/lib/auth';
import {
  Clock,
  Shield,
  DollarSign,
  Search,
  CheckCircle,
  ArrowUpLeft,
  Briefcase,
  Coffee,
  Truck,
  ShoppingBag,
  Star,
  Layout,
  Heart,
  CalendarClock,
  User,
} from 'lucide-react';

const whyKarava = [
  {
    title: 'کارفرمایان معتبر',
    desc: 'با بهترین شرکت‌ها در صنایع مختلف کار کنید؛ از رستوران و هتل تا فروشگاه و لجستیک.',
    icon: Shield,
    color: 'bg-[#e0ded9]',
  },
  {
    title: 'درآمد مطمئن',
    desc: 'حقوق خود را سریع و شفاف دریافت کنید؛ پرداخت هفتگی یا حتی روزانه بدون تاخیر.',
    icon: DollarSign,
    color: 'bg-[#ff5e00]',
  },
  {
    title: 'انعطاف کامل',
    desc: 'خودتان تصمیم می‌گیرید چه زمانی و در کجا کار کنید؛ بدون قرارداد ثابت یا تعهد طولانی.',
    icon: Clock,
    color: 'bg-[#4a5d23] text-white',
  },
] as const;

const howItWorks = [
  {
    step: '۱',
    title: 'ثبت نام سریع',
    desc: 'پروفایل خود را در چند دقیقه بسازید؛ کاملأ رایگان و آنلاین.',
  },
  {
    step: '۲',
    title: 'انتخاب شیفت',
    desc: 'از بین صدها شیفت فعال، دقیقا همان چیزی را که با زندگی شما سازگار است انتخاب کنید.',
  },
  {
    step: '۳',
    title: 'شروع به کار',
    desc: 'سر وقت حاضر شوید، تجربه کسب کنید و در پایان شیفت درآمد خود را دریافت کنید.',
  },
] as const;

const categories = [
  { label: 'رستوران و کافه', icon: Coffee },
  { label: 'هتل و گردشگری', icon: Briefcase },
  { label: 'خرده‌فروشی', icon: ShoppingBag },
  { label: 'حمل و نقل', icon: Truck },
  { label: 'رویدادها و مهمانی‌ها', icon: Star },
  { label: 'انبارداری و لجستیک', icon: Layout },
  { label: 'خدمات نظافتی', icon: Shield },
  { label: 'مراقبت و بهداشت', icon: Heart },
] as const;

const heroStats = [
  { label: 'ساعت کار این هفته', value: '۳۲+', accent: 'bg-[#4a5d23]' },
  { label: 'مشتری‌های جدید', value: '۴', accent: 'bg-[#ff5e00]' },
  { label: 'امتیاز عملکرد', value: '۴.۹/۵', accent: 'bg-white text-[#1a1a1a]' },
] as const;

export default function FreelancersPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const updateAuth = () => setIsLoggedIn(isAuthenticated());
    updateAuth();
    window.addEventListener('user-login', updateAuth);
    window.addEventListener('user-logout', updateAuth);
    return () => {
      window.removeEventListener('user-login', updateAuth);
      window.removeEventListener('user-logout', updateAuth);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#e0ded9] font-body text-[#1a1a1a] overflow-x-hidden pt-20">
      {/* HERO */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 text-center lg:text-right order-2 lg:order-1">
          <h1 className="text-6xl lg:text-8xl font-display leading-[0.9]">
            کار کنید،
            <br />
            <span className="text-[#ff5e00]">هر زمان</span> که
            <br />
            می‌خواهید
          </h1>
          <p className="text-xl font-medium text-[#1a1a1a]/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
            با کاراوا، خودتان تعیین می‌کنید کِی، کجا و چقدر کار کنید. انعطاف کامل به همراه درآمد مطمئن.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link href="/shifts" className="btn-primary text-lg py-4 px-10 shadow-[6px_6px_0px_0px_#4a5d23]">
              پیدا کردن شیفت
            </Link>
            <Link
              href={isLoggedIn ? '/profile' : '/register'}
              className="px-10 py-4 border-2 border-[#1a1a1a] rounded-xl font-display text-lg bg-white hover:-translate-y-1 transition-transform"
            >
              {isLoggedIn ? 'حساب کاربری' : 'ثبت‌نام فریلنسر'}
            </Link>
          </div>
          <div className="flex items-center justify-center lg:justify-end gap-4 text-sm font-bold">
            <Search className="w-5 h-5" />
            <span>صدها شیفت فعال روزانه در سراسر ایران</span>
          </div>
        </div>

        <div className="relative h-[520px] bg-[#f5f2ec] rounded-[3rem] border-4 border-[#1a1a1a] overflow-hidden shadow-[12px_12px_0px_0px_#ff5e00] order-1 lg:order-2">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740758-90de60502266?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-multiply" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(#1a1a1a15 1px, transparent 1px), linear-gradient(90deg, #1a1a1a15 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute -right-16 bottom-0 w-64 h-64 bg-[#ff5e00]/30 blur-3xl opacity-80" />
          <div className="absolute -left-12 top-8 w-48 h-48 bg-[#4a5d23]/30 blur-3xl opacity-90" />
          <div className="absolute inset-6 border-4 border-dashed border-[#1a1a1a]/30 rounded-[2.5rem]" />

          <div className="absolute top-8 left-8 bg-white border-2 border-[#1a1a1a] px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-[4px_4px_0px_0px_#ff5e00]">
            <span className="w-2 h-2 rounded-full bg-[#4a5d23] animate-pulse" />
            وضعیت: آماده کار
          </div>

          <div className="absolute top-14 right-6 flex flex-col gap-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="w-48 bg-white border-2 border-[#1a1a1a] rounded-2xl p-4 shadow-[5px_5px_0px_0px_#1a1a1a]">
                <div className={`w-10 h-2 rounded-full ${stat.accent} mb-3`} />
                <p className="text-sm font-bold opacity-70">{stat.label}</p>
                <p className="text-2xl font-display">{stat.value}</p>
              </div>
            ))}
            <button className="w-48 border-2 border-[#1a1a1a] rounded-full py-2 text-sm font-bold bg-white hover:bg-[#ffeadb] transition-colors">
              مشاهده داشبورد
            </button>
          </div>

          <div className="absolute bottom-8 right-8 left-8 grid lg:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-[#1a1a1a] p-6 rounded-[1.8rem] shadow-[6px_6px_0px_0px_#1a1a1a] space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#cccdc6] rounded-2xl border-2 border-[#1a1a1a] flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display text-2xl">سارا</p>
                  <p className="text-sm font-bold text-[#1a1a1a]/70">سطح: +۳</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm font-bold">
                <span>شیفت‌های تکمیل‌شده</span>
                <span>۴۲</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold">
                <span>امتیاز مشتری</span>
                <span>۴.۹ ⭐️</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['کافه', 'رویداد', 'فروشگاه'].map((pill) => (
                  <span key={pill} className="px-3 py-1 border-2 border-[#1a1a1a] rounded-full text-xs font-bold bg-[#f5f5f5]">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-[#1a1a1a] text-white border-2 border-white p-6 rounded-[1.8rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full border border-white/30 flex items-center justify-center">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-70">شیفت بعدی</p>
                  <p className="font-display text-xl">کافه اطلس</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm font-bold">
                <span>سه‌شنبه • ۱۸:۰۰</span>
                <span>منطقه ۳</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'ورود', time: '۱۸:۰۰', done: true },
                  { label: 'استراحت', time: '۲۰:۱۵', done: false },
                  { label: 'خروج', time: '۲۲:۳۰', done: false },
                ].map((slot) => (
                  <div key={slot.label} className="flex items-center gap-3 text-sm font-bold">
                    <div className={`w-4 h-4 border border-white rounded-full ${slot.done ? 'bg-white' : ''}`} />
                    <span className="flex-1">{slot.label}</span>
                    <span className="opacity-70">{slot.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#fff9f4] border-2 border-[#1a1a1a] p-6 rounded-[1.8rem] shadow-[6px_6px_0px_0px_#1a1a1a] space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#1a1a1a]/70">درآمد امروز</p>
                <span className="text-xs font-black text-[#ff5e00]">+۲۸٪</span>
              </div>
              <p className="text-4xl font-display text-[#4a5d23]">۸۵۰,۰۰۰ تومان</p>
              <div className="space-y-3">
                {[
                  { label: 'انعام', value: '+ ۷۰,۰۰۰' },
                  { label: 'پاداش وقت‌شناسی', value: '+ ۳۰,۰۰۰' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm font-bold">
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
              </div>
              <button className="w-full border-2 border-[#1a1a1a] rounded-full py-2 font-bold text-sm bg-white hover:bg-[#f5f5f5] transition-colors">
                برداشت فوری
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY KARAVA */}
      <section className="py-20 bg-white border-y-4 border-[#1a1a1a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-display mb-4">چرا کاراوا؟</h2>
            <p className="text-xl font-medium text-[#1a1a1a]/70">کنترل کامل زمان، مکان و درآمد در دستان شماست</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {whyKarava.map((item) => (
              <div
                key={item.title}
                className={`${item.color} border-4 border-[#1a1a1a] p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_#1a1a1a] hover:-translate-y-2 transition-transform`}
              >
                <div className="w-16 h-16 bg-white border-2 border-[#1a1a1a] rounded-full flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-[#1a1a1a]" />
                </div>
                <h3 className="text-2xl font-display mb-4">{item.title}</h3>
                <p className="font-medium leading-relaxed opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-[#e0ded9] overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-display mb-12">چطور شروع کنم؟</h2>
              <div className="space-y-8">
                {howItWorks.map((item) => (
                  <div key={item.step} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 bg-[#1a1a1a] text-white font-display text-2xl flex items-center justify-center rounded-xl border-2 border-[#1a1a1a] group-hover:bg-[#ff5e00] transition-colors flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-2xl font-display mb-2">{item.title}</h3>
                      <p className="font-medium text-[#1a1a1a]/80 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5e00] border-4 border-[#1a1a1a] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
              <div className="bg-white border-4 border-[#1a1a1a] rounded-[3rem] p-8 shadow-[16px_16px_0px_0px_#1a1a1a] rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-4">
                  {[1, 2, 3].map((card) => (
                    <div key={card} className="flex items-center gap-4 p-4 border-2 border-[#1a1a1a] rounded-xl bg-[#f5f5f5]">
                      <div className="w-12 h-12 bg-[#cccdc6] rounded-full border-2 border-[#1a1a1a]" />
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-[#1a1a1a] rounded mb-2" />
                        <div className="h-3 w-16 bg-[#1a1a1a]/30 rounded" />
                      </div>
                      <div className="w-8 h-8 bg-[#4a5d23] rounded-full border-2 border-[#1a1a1a] flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-[#1a1a1a] text-[#e0ded9]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-display mb-12">در چه حوزه‌هایی می‌توانید کار کنید؟</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <div
                key={cat.label}
                className="bg-[#e0ded9] text-[#1a1a1a] border-2 border-white px-6 py-3 rounded-full font-bold hover:bg-[#ff5e00] hover:border-[#ff5e00] hover:text-white transition-all cursor-default flex items-center gap-2"
              >
                <cat.icon className="w-5 h-5" />
                {cat.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#4a5d23] text-[#e0ded9] text-center border-t-4 border-[#1a1a1a]">
        <div className="container mx-auto px-6">
          <p className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border-2 border-white rounded-full text-sm font-bold mb-8">
            <ArrowUpLeft className="w-4 h-4" />
            آماده کار و درآمد
          </p>
          <h2 className="text-5xl lg:text-7xl font-display mb-8">همین امروز شروع کنید</h2>
          <p className="text-xl font-medium mb-12 max-w-2xl mx-auto">
            به هزاران فریلنسری بپیوندید که هر روز از کاراوا برای پیدا کردن شیفت‌های منعطف استفاده می‌کنند.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              href={isLoggedIn ? '/profile' : '/register'}
              className="bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] px-10 py-4 text-xl font-bold rounded-xl shadow-[6px_6px_0px_0px_#1a1a1a] hover:-translate-y-1 transition-transform"
            >
              {isLoggedIn ? 'حساب کاربری' : 'ثبت‌نام رایگان'}
            </Link>
            <Link
              href="/shifts"
              className="px-10 py-4 text-xl font-bold rounded-xl border-2 border-white text-white hover:bg-white hover:text-[#1a1a1a] transition-colors"
            >
              مشاهده شیفت‌ها
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}



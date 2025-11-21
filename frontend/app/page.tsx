'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowUpLeft,
  User,
  Search,
  MapPin,
  Layout,
  Briefcase,
  Heart,
  Shield,
  Trees,
  Wind,
  Sun,
  Star,
  Leaf,
  Hexagon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { isAuthenticated } from '@/lib/auth';

// Mock Data for the Phone Visual
const MOCK_SHIFTS = [
  {
    id: 1,
    title: 'باریستا',
    company: 'کافه اطلس',
    distance: '۱.۲ کیلومتر',
    pay: '۲۲۰,۰۰۰',
    unit: 'تومان/ساعت',
    category: 'کافه',
    bgColor: 'bg-[#e0ded9]',
    textColor: 'text-[#1a1a1a]',
    iconColor: 'bg-[#1a1a1a] text-[#e0ded9]',
    borderColor: 'border-[#1a1a1a]',
  },
  {
    id: 2,
    title: 'گارسون',
    company: 'رستوران شیراز',
    distance: '۳.۵ کیلومتر',
    pay: '۱۹۵,۰۰۰',
    unit: 'تومان/ساعت',
    category: 'رستوران',
    bgColor: 'bg-[#cccdc6]',
    textColor: 'text-[#1a1a1a]',
    iconColor: 'bg-[#4a5d23] text-[#e0ded9]',
    borderColor: 'border-[#1a1a1a]',
  },
  {
    id: 3,
    title: 'صندوقدار',
    company: 'فروشگاه ونوس',
    distance: '۵.۰ کیلومتر',
    pay: '۲۵۰,۰۰۰',
    unit: 'تومان/ساعت',
    category: 'فروشگاه',
    bgColor: 'bg-[#ff5e00]',
    textColor: 'text-[#1a1a1a]',
    iconColor: 'bg-[#1a1a1a] text-[#ff5e00]',
    borderColor: 'border-[#1a1a1a]',
  },
];

export default function Home() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(isAuthenticated());
    };

    updateAuthState();
    window.addEventListener('user-login', updateAuthState);
    window.addEventListener('user-logout', updateAuthState);

    return () => {
      window.removeEventListener('user-login', updateAuthState);
      window.removeEventListener('user-logout', updateAuthState);
    };
  }, []);

  return (
    <div className="min-h-screen bg-concrete dark:bg-ink font-body text-ink dark:text-concrete overflow-x-hidden transition-colors duration-300">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20">
        {/* Abstract Shapes */}
        <div className="absolute top-20 right-[-5%] w-[400px] h-[400px] border-4 border-ink dark:border-concrete rounded-full opacity-10 dark:opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-10 left-[-5%] w-[300px] h-[300px] bg-ink dark:bg-concrete opacity-5 dark:opacity-10 rotate-12 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-10 text-center lg:text-right order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white dark:bg-concrete-dark border-2 border-ink dark:border-concrete shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e0ded9] text-ink dark:text-white text-sm font-bold rounded-full">
              <div className="w-3 h-3 bg-safety rounded-full animate-pulse"></div>
              <span>{language === 'fa' ? 'رویکردی ارگانیک به کار' : 'Organic approach to work'}</span>
            </div>

            <h1 className="text-6xl lg:text-8xl text-ink dark:text-concrete leading-[0.95] tracking-tighter font-display">
              {language === 'fa' ? (
                <>
                  جریانِ کار <br />
                  <span className="text-moss dark:text-moss">طبیعـی</span> برای <br />
                  <span className="relative inline-block px-4 bg-safety text-white dark:text-ink mt-2 transform -rotate-2 border-2 border-ink dark:border-concrete">
                    زندگی مدرن
                  </span>
                </>
              ) : (
                <>
                  Natural flow <br />
                  <span className="text-moss dark:text-moss">of work</span> for <br />
                  <span className="relative inline-block px-4 bg-safety text-white dark:text-ink mt-2 transform -rotate-2 border-2 border-ink dark:border-concrete">
                    modern life
                  </span>
                </>
              )}
            </h1>

            <p className="text-xl text-ink dark:text-concrete font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed font-body border-r-4 border-safety pr-6">
              {language === 'fa'
                ? 'شغلی را پرورش دهید که نفس می‌کشد. ما شما را به فرصت‌هایی متصل می‌کنیم که با ریتم شما همسو هستند، نه علیه آن.'
                : 'Cultivate a career that breathes. We connect you to opportunities that align with your rhythm, not against it.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              <Link
                href="/shifts"
                className="px-10 py-5 bg-ink dark:bg-concrete text-white dark:text-ink border-2 border-ink dark:border-concrete text-xl hover:bg-safety dark:hover:bg-safety hover:text-black dark:hover:text-ink transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_#4a5d23] dark:shadow-[6px_6px_0px_0px_#e0ded9] font-display rounded-xl"
              >
                {language === 'fa' ? 'کاوش نوبت‌ها' : 'Explore Shifts'}
                <ArrowUpLeft className="w-6 h-6" />
              </Link>
              <Link
                href={isLoggedIn ? '/profile' : '/register'}
                className="px-10 py-5 bg-transparent text-ink dark:text-concrete border-2 border-ink dark:border-concrete text-xl hover:bg-white dark:hover:bg-concrete-dark hover:shadow-[6px_6px_0px_0px_#1a1a1a] dark:hover:shadow-[6px_6px_0px_0px_#e0ded9] hover:-translate-y-1 transition-all font-display rounded-xl"
              >
                {language === 'fa'
                  ? isLoggedIn
                    ? 'حساب کاربری'
                    : 'ثبت نام کنید'
                  : isLoggedIn
                    ? 'Account'
                    : 'Sign Up'}
              </Link>
            </div>
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-4 border-t-2 border-ink/20 dark:border-concrete/20 mt-8 max-w-md">
              <div className="flex -space-x-4 space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 border-2 border-ink dark:border-concrete bg-concrete-dark dark:bg-concrete flex items-center justify-center text-ink dark:text-white font-bold text-sm relative z-10 rounded-full hover:z-20 transition-all hover:-translate-y-1"
                  >
                    <User className="w-5 h-5" />
                  </div>
                ))}
              </div>
              <p className="text-ink dark:text-white text-sm font-bold font-body">
                {language === 'fa' ? 'بیش از ۱۰،۰۰۰ عضو فعال' : 'Over 10,000 active members'}
              </p>
            </div>
          </div>
          {/* Visual / Mockup - Brutalist Phone */}
          <div className="lg:col-span-6 relative h-[700px] flex items-center justify-center order-1 lg:order-2">
            {/* Background Shapes */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-moss dark:bg-moss border-2 border-ink dark:border-concrete rounded-none"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-safety rounded-full border-2 border-ink dark:border-concrete mix-blend-normal z-0"></div>
            {/* The Phone */}
            <div className="relative w-[360px] h-[700px] bg-concrete-light dark:bg-concrete-dark border-[4px] border-ink dark:border-concrete rounded-[2rem] shadow-[15px_15px_0px_0px_rgba(26,26,26,0.2)] dark:shadow-[15px_15px_0px_0px_rgba(224,222,217,0.3)] overflow-hidden z-20 flex flex-col">
              {/* App Header */}
              <div className="pt-12 pb-4 px-6 bg-concrete-light dark:bg-ink/90 border-b-2 border-ink dark:border-concrete sticky top-0 z-10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-xs font-bold text-moss dark:text-moss uppercase tracking-widest mb-1 font-body">
                      {language === 'fa' ? 'صبح بخیر' : 'Good Morning'}
                    </p>
                    <h1 className="text-3xl font-display text-ink dark:text-white">
                      {language === 'fa' ? 'سلام، سارا' : 'Hello, Sarah'}
                    </h1>
                  </div>
                  <div className="w-12 h-12 bg-ink dark:bg-concrete text-safety border-2 border-ink dark:border-concrete flex items-center justify-center shadow-[2px_2px_0px_0px_#ff5e00] rounded-full">
                    <User className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-ink/80 p-3 border-2 border-ink dark:border-concrete flex items-center gap-3 shadow-[4px_4px_0px_0px_#4a5d23] dark:shadow-[4px_4px_0px_0px_#e0ded9] rounded-lg">
                  <Search className="w-5 h-5 text-ink dark:text-white" />
                  <span className="text-ink dark:text-white/90 text-sm font-bold opacity-50 dark:opacity-70">
                    {language === 'fa' ? 'جستجو در جریان...' : 'Searching...'}
                  </span>
                </div>
              </div>
              {/* App Content */}
              <div className="flex-1 px-4 space-y-4 overflow-y-auto no-scrollbar pb-24 pt-4 bg-concrete dark:bg-ink">
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1">
                  {(language === 'fa' ? ['نزدیک من', 'منعطف', 'طبیعت', 'آرام'] : ['Near Me', 'Flexible', 'Nature', 'Calm']).map(
                    (tag, i) => (
                      <span
                        key={i}
                        className={`px-4 py-2 text-xs font-bold border-2 border-ink dark:border-concrete whitespace-nowrap transition-all rounded-full cursor-default ${
                          i === 0
                            ? 'bg-ink dark:bg-concrete text-safety dark:text-safety shadow-[2px_2px_0px_0px_#ff5e00]'
                            : 'bg-white dark:bg-ink/60 text-ink dark:text-white border-ink dark:border-concrete'
                        }`}
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
                {MOCK_SHIFTS.map((shift, i) => (
                  <div key={i} className="group relative">
                    <div className={`p-5 ${shift.bgColor} dark:bg-ink/70 border-2 ${shift.borderColor} dark:border-concrete shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e0ded9] rounded-xl`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase text-ink dark:text-white mb-1 bg-white dark:bg-ink/80 inline-block px-2 py-0.5 border border-ink dark:border-concrete rounded-md w-fit">
                            {shift.category}
                          </span>
                          <h3 className={`text-xl font-display ${shift.textColor} dark:text-white`}>{shift.title}</h3>
                        </div>
                        <div
                          className={`w-8 h-8 flex items-center justify-center border-2 border-ink dark:border-concrete rounded-full ${shift.iconColor} dark:bg-concrete dark:text-ink`}
                        >
                          <ArrowUpLeft className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-ink dark:text-white/90">
                          <MapPin className="w-3 h-3" />
                          {shift.company} • {shift.distance}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t-2 border-ink/10 dark:border-white/20">
                          <div className={`text-sm font-black ${shift.textColor} dark:text-white`}>
                            {shift.pay}
                            <span className="text-xs font-medium mr-1">{shift.unit}</span>
                          </div>
                          <div className="px-3 py-1 bg-white dark:bg-ink/80 border-2 border-ink dark:border-concrete text-[10px] font-bold rounded-md text-ink dark:text-white">
                            {language === 'fa' ? 'درخواست' : 'Apply'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Tab Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-concrete-light dark:bg-ink/90 border-t-4 border-ink dark:border-concrete flex justify-around items-center z-30">
                <div className="flex flex-col items-center gap-1 text-ink dark:text-white">
                  <div className="w-8 h-1 bg-safety mb-1 rounded-full"></div>
                  <Layout className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-center gap-1 text-ink/50 dark:text-white/60">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-center gap-1 text-ink/50 dark:text-white/60">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --- MARQUEE SECTION --- */}
      <div className="bg-safety border-y-4 border-ink dark:border-concrete py-6 overflow-hidden rotate-1 my-12">
        <div className="whitespace-nowrap animate-marquee flex gap-16 items-center font-display text-2xl text-ink dark:text-concrete">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="uppercase tracking-wide">
                {language === 'fa' ? 'به سبک خودت کار کن' : 'Work Your Way'}
              </span>
              <div className="w-3 h-3 bg-ink dark:bg-concrete rounded-full"></div>
              <span className="uppercase tracking-wide opacity-70">
                {language === 'fa' ? 'پول نقد همین امروز' : 'Cash Today'}
              </span>
              <div className="w-3 h-3 bg-ink dark:bg-concrete rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
      {/* --- FEATURES SECTION --- */}
      <section className="py-32 bg-ink dark:bg-concrete-dark text-concrete dark:text-ink relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `linear-gradient(#e0ded9 1px, transparent 1px), linear-gradient(90deg, #e0ded9 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        ></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5 sticky top-32">
              <div className="inline-block p-4 bg-safety border-2 border-concrete dark:border-ink mb-8 shadow-[4px_4px_0px_0px_#e0ded9] dark:shadow-[4px_4px_0px_0px_#1a1a1a] rounded-xl">
                <Sun className="w-8 h-8 text-ink dark:text-concrete" />
              </div>
              <h2 className="text-6xl md:text-7xl font-display mb-6 leading-[0.9] text-concrete dark:text-white">
                {language === 'fa' ? (
                  <>
                    رشدی که <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-moss to-concrete-dark dark:from-moss dark:to-white italic px-2">
                      ارگانیک
                    </span>{' '}
                    است.
                  </>
                ) : (
                  <>
                    Growth that <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-moss to-concrete-dark dark:from-moss dark:to-white italic px-2">
                      is organic
                    </span>
                    .
                  </>
                )}
              </h2>
              <p className="text-xl text-concrete-dark dark:text-white/90 leading-relaxed mb-8 font-body pl-8 border-l-4 border-moss">
                {language === 'fa'
                  ? 'درست همانطور که طبیعت با فصول سازگار می‌شود، کاراوا با شما سازگار می‌شود. بدون قراردادهای خشک، بدون ساعات اجباری. فقط یک اکوسیستم سیال از فرصت‌ها.'
                  : 'Just as nature adapts to seasons, Karava adapts to you. No rigid contracts, no forced hours. Just a fluid ecosystem of opportunities.'}
              </p>
              <button className="text-safety dark:text-safety text-lg font-bold border-b-4 border-safety pb-1 hover:text-white dark:hover:text-concrete transition-all">
                {language === 'fa' ? 'خواندن فلسفه ما' : 'Read Our Philosophy'}
              </button>
              <div className="mt-10 border-4 border-concrete dark:border-ink rounded-[2rem] overflow-hidden shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)]">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                  alt={language === 'fa' ? 'فریلنسرها و کارفرمایان در حال همکاری' : 'Freelancers collaborating with employers'}
                  className="w-full h-72 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="md:col-span-7 grid gap-8">
              {[
                {
                  title: language === 'fa' ? 'ثبات ریشه‌دار' : 'Rooted Stability',
                  desc:
                    language === 'fa'
                      ? 'کارفرمایان تایید شده و پرداخت‌های تضمین شده اطمینان می‌دهند که پایه و اساس شما محکم است.'
                      : 'Verified employers and guaranteed payments ensure your foundation is solid.',
                  icon: Shield,
                  color: 'bg-concrete dark:bg-concrete-dark',
                  textColor: 'text-ink dark:text-white',
                },
                {
                  title: language === 'fa' ? 'پیشرفت طبیعی' : 'Natural Progress',
                  desc:
                    language === 'fa'
                      ? 'سیستم امتیازدهی ما پروفایل شما را پرورش می‌دهد و سطوح بالاتر را به طور طبیعی باز می‌کند.'
                      : 'Our rating system nurtures your profile and naturally unlocks higher tiers.',
                  icon: Trees,
                  color: 'bg-moss',
                  textColor: 'text-concrete',
                },
                {
                  title: language === 'fa' ? 'برنامه سیال' : 'Fluid Schedule',
                  desc:
                    language === 'fa'
                      ? 'کار در زندگی شما جریان می‌یابد، نه بر روی آن. نوبت‌هایی را انتخاب کنید که با انرژی شما مطابقت دارند.'
                      : 'Work flows into your life, not over it. Choose shifts that match your energy.',
                  icon: Wind,
                  color: 'bg-safety',
                  textColor: 'text-ink dark:text-ink',
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`${feature.color} ${feature.textColor} p-8 border-4 border-white dark:border-concrete shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] dark:shadow-[8px_8px_0px_0px_rgba(224,222,217,0.3)] hover:translate-x-2 hover:-translate-y-2 transition-all flex flex-col md:flex-row gap-6 items-center md:items-start rounded-[2rem]`}
                >
                  <div className="w-16 h-16 border-2 border-current flex flex-shrink-0 items-center justify-center rounded-full">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-display mb-3">{feature.title}</h3>
                    <p className="leading-relaxed font-body text-lg opacity-90">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-32 bg-concrete-dark dark:bg-ink relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center bg-concrete dark:bg-concrete-dark border-4 border-ink dark:border-concrete p-12 shadow-[12px_12px_0px_0px_#1a1a1a] dark:shadow-[12px_12px_0px_0px_#e0ded9] rounded-[3rem]">
            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-8 h-8 fill-ink dark:fill-white text-ink dark:text-white" />
              ))}
            </div>
            <h3 className="text-3xl md:text-5xl font-display text-ink dark:text-white leading-tight mb-12">
              {language === 'fa'
                ? '"این حس یک اپلیکیشن کاری را ندارد. حس یک باغ محلی را دارد که می‌توانم کاری را که متناسب با فصل زندگی‌ام است بچینم."'
                : '"It doesn\'t feel like a work app. It feels like a community garden where I can pick the work that suits my season of life."'}
            </h3>
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-moss border-4 border-ink dark:border-concrete shadow-[4px_4px_0px_0px_#ff5e00] rounded-full overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-concrete dark:text-white">
                  <User className="w-12 h-12" />
                </div>
              </div>
              <div>
                <p className="font-display text-2xl text-ink dark:text-white mb-1">
                  {language === 'fa' ? 'سارا جلالی' : 'Sarah Jalali'}
                </p>
                <div className="inline-block px-3 py-1 bg-safety border-2 border-ink dark:border-concrete rounded-lg">
                  <p className="text-ink dark:text-white text-sm font-bold font-body">
                    {language === 'fa' ? 'باریستا' : 'Barista'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --- FOOTER SECTION --- */}
      <footer className="bg-ink dark:bg-concrete-dark text-concrete dark:text-white pt-24 pb-12 border-t-8 border-safety">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 mb-20 pb-12 border-b-2 border-concrete/20 dark:border-white/20">
            <div className="md:col-span-5 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-concrete dark:bg-ink border-2 border-safety flex items-center justify-center text-ink dark:text-white rounded-xl">
                  <Hexagon className="w-8 h-8" />
                </div>
                <span className="font-display text-4xl tracking-tight text-concrete dark:text-white">
                  {language === 'fa' ? 'کاراوا.' : 'Karava.'}
                </span>
              </div>
              <p className="text-concrete-dark dark:text-white/90 font-medium text-lg leading-relaxed max-w-sm font-body pl-4 border-l-2 border-moss">
                {language === 'fa' ? (
                  <>
                    بازگرداندن تعادل به نیروی کار مدرن. <br />
                    یک نوبت در هر زمان.
                  </>
                ) : (
                  <>
                    Restoring balance to the modern workforce. <br />
                    One shift at a time.
                  </>
                )}
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              {[
                {
                  title: language === 'fa' ? 'اکوسیستم' : 'Ecosystem',
                  items:
                    language === 'fa'
                      ? ['یافتن کار', 'ثبت آگهی', 'قیمت‌گذاری اخلاقی']
                      : ['Find Work', 'Post Jobs', 'Ethical Pricing'],
                },
                {
                  title: language === 'fa' ? 'ریشه‌ها' : 'Roots',
                  items:
                    language === 'fa'
                      ? ['داستان ما', 'مانیفست', 'مجله']
                      : ['Our Story', 'Manifesto', 'Magazine'],
                },
                {
                  title: language === 'fa' ? 'پشتیبانی' : 'Support',
                  items:
                    language === 'fa'
                      ? ['جامعه', 'قوانین', 'تماس']
                      : ['Community', 'Guidelines', 'Contact'],
                },
              ].map((col, idx) => (
                <div key={idx}>
                  <h4 className="font-display text-safety mb-6 text-xl">{col.title}</h4>
                  <ul className="space-y-4 font-body">
                    {col.items.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-concrete-dark dark:text-white/90 hover:text-white dark:hover:text-white hover:translate-x-2 transition-transform inline-block"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center font-body">
            <p className="text-concrete-dark/60 dark:text-white/60 text-sm">
              {language === 'fa' ? '© ۱۴۰۳ کاراوا. تمامی حقوق محفوظ است.' : '© 2024 Karava. All rights reserved.'}
            </p>
            <div className="flex gap-3 mt-4 md:mt-0 items-center bg-[#2a2a2a] dark:bg-concrete px-4 py-2 rounded-full border border-moss">
              <span className="w-3 h-3 rounded-full bg-moss animate-pulse"></span>
              <span className="text-xs font-bold text-concrete dark:text-white tracking-widest">
                {language === 'fa' ? 'سیستم‌ها سالم هستند' : 'Systems Healthy'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

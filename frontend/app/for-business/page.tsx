'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Star,
  Zap,
  Briefcase,
  User,
  DollarSign,
  Clock,
  Shield,
  Search,
  Users,
  BarChart3,
  Layers,
} from 'lucide-react';

export default function ForBusinessPage() {
  const { t, language } = useLanguage();
  const isRtl = language === 'fa';

  return (
    <div className="min-h-screen bg-concrete dark:bg-ink text-ink dark:text-concrete font-body selection:bg-safety selection:text-ink overflow-x-hidden transition-colors duration-300">
      {/* --- Background Pattern --- */}
      <div
        className="fixed inset-0 opacity-5 dark:opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#24D76C 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-32 pb-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8 order-2 lg:order-1">
            <div className="inline-block bg-primary dark:bg-safety text-white dark:text-ink border-3 border-ink dark:border-concrete px-4 py-2 font-black shadow-brutal-sm -rotate-2">
              {language === 'fa' ? 'مخصوص کارفرمایان و مدیران' : 'FOR BUSINESSES & MANAGERS'}
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight text-ink dark:text-white">
              {language === 'fa' ? (
                <>
                  نیروی کار،<br />
                  <span className="text-safety dark:text-safety text-stroke-black">در لحظه.</span>
                </>
              ) : (
                <>
                  STAFFING<br />
                  <span className="text-safety dark:text-safety text-stroke-black">SOLVED.</span>
                </>
              )}
            </h1>

            <p className="text-xl font-bold text-ink/70 dark:text-white/80 max-w-lg border-l-4 border-safety dark:border-safety pl-6">
              {language === 'fa'
                ? 'بدون دردسر استخدام و قرارداد. دسترسی فوری به هزاران نیروی کار احراز هویت شده برای شیفت‌های شما.'
                : 'No hiring hassle, no contracts. Instant access to thousands of verified workers for your shifts.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/register"
                className="btn-brutal-accent group flex items-center justify-center gap-2 bg-safety dark:bg-safety text-ink dark:text-white border-3 border-ink dark:border-concrete px-8 py-4 font-black text-xl shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all"
              >
                {language === 'fa' ? 'استخدام کنید' : 'Start Hiring'}
                <ArrowLeft
                  className={`w-6 h-6 transition-transform ${isRtl ? '' : 'rotate-180 group-hover:translate-x-1'}`}
                />
              </Link>
            </div>
          </div>

          {/* Interactive Visual (Dashboard/Profile Stack) */}
          <div className="lg:w-1/2 relative w-full flex justify-center order-1 lg:order-2">
            <div className="relative w-80 h-96">
              {/* Decorative Back Cards */}
              <div className="absolute inset-0 bg-ink dark:bg-ink rounded-none transform -rotate-3 border-3 border-ink dark:border-concrete"></div>
              <div className="absolute inset-0 bg-primary dark:bg-safety rounded-none transform rotate-3 border-3 border-ink dark:border-concrete"></div>

              {/* Main Dashboard Card */}
              <div className="absolute inset-0 bg-white dark:bg-concrete-dark dark:bg-concrete-dark border-3 border-ink dark:border-concrete p-0 flex flex-col transform transition-transform hover:scale-105 duration-300 shadow-brutal-lg overflow-hidden">
                {/* Fake Browser Header */}
                <div className="bg-ink dark:bg-ink p-2 flex gap-2 border-b-3 border-ink dark:border-concrete">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    <div className="h-8 w-8 bg-safety dark:bg-safety border-2 border-ink dark:border-concrete rounded-full"></div>
                  </div>

                  {/* Candidate Row 1 */}
                  <div className="flex items-center gap-3 p-3 border-2 border-ink dark:border-concrete bg-gray-50 hover:bg-safety dark:bg-safety hover:border-ink dark:border-concrete transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-primary rounded-full border-2 border-ink dark:border-concrete"></div>
                    <div className="flex-1">
                      <div className="h-3 w-20 bg-ink dark:bg-ink mb-1"></div>
                      <div className="h-2 w-12 bg-gray-400"></div>
                    </div>
                    <Check className="w-6 h-6 text-green-600" />
                  </div>

                  {/* Candidate Row 2 */}
                  <div className="flex items-center gap-3 p-3 border-2 border-ink dark:border-concrete bg-gray-50 hover:bg-safety dark:bg-safety hover:border-ink dark:border-concrete transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-yellow-300 rounded-full border-2 border-ink dark:border-concrete"></div>
                    <div className="flex-1">
                      <div className="h-3 w-24 bg-ink dark:bg-ink mb-1"></div>
                      <div className="h-2 w-16 bg-gray-400"></div>
                    </div>
                    <div className="bg-ink dark:bg-ink text-white text-xs px-2 py-1 font-bold">
                      {language === 'fa' ? 'استخدام' : 'HIRE'}
                    </div>
                  </div>

                  {/* Stats Graph */}
                  <div className="mt-auto flex items-end gap-2 h-16">
                    <div className="w-1/4 h-3/4 bg-primary border-2 border-ink dark:border-concrete"></div>
                    <div className="w-1/4 h-1/2 bg-gray-300 border-2 border-ink dark:border-concrete"></div>
                    <div className="w-1/4 h-full bg-safety dark:bg-safety border-2 border-ink dark:border-concrete"></div>
                    <div className="w-1/4 h-2/3 bg-gray-300 border-2 border-ink dark:border-concrete"></div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -left-6 top-16 bg-white dark:bg-concrete-dark p-3 border-3 border-ink dark:border-concrete shadow-brutal font-black uppercase flex items-center gap-2 animate-wiggle z-20">
                <Users className="w-6 h-6 text-primary" />
                <span>
                  +5000 {language === 'fa' ? 'کارجو' : 'Workers'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className="bg-primary border-y-4 border-ink dark:border-concrete py-4 overflow-hidden -rotate-1 scale-105 z-20 relative text-white">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center font-black text-2xl">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="flex items-center gap-4">
              {language === 'fa' ? (
                <>
                  استعداد تایید شده <Shield className="w-6 h-6 fill-current" /> استخدام فوری{' '}
                  <Zap className="w-6 h-6 fill-current" />
                </>
              ) : (
                <>
                  VERIFIED TALENT <Shield className="w-6 h-6 fill-current" /> INSTANT STAFFING{' '}
                  <Zap className="w-6 h-6 fill-current" />
                </>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* --- WHY KARJU FOR BUSINESS (Bento Grid) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-2">
              {language === 'fa' ? 'چرا کارجو؟' : 'WHY KARJU?'}
            </h2>
            <p className="text-xl font-bold text-gray-500">
              {language === 'fa' ? 'راه حل نهایی برای کمبود نیرو' : 'The ultimate solution for staffing shortages'}
            </p>
          </div>
          <div className="bg-ink dark:bg-ink text-white px-4 py-2 font-mono font-bold">
            {language === 'fa' ? 'راهکارهای کسب‌وکار' : 'BUSINESS SOLUTIONS'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {/* Box 1: Verified */}
          <div className="border-3 border-ink dark:border-concrete bg-white dark:bg-concrete-dark p-8 shadow-brutal hover:shadow-brutal-lg transition-all md:col-span-2 flex flex-col md:flex-row items-center gap-8 group">
            <div className="flex-1">
              <h3 className="text-3xl font-black mb-4 uppercase group-hover:text-primary transition-colors">
                {language === 'fa' ? 'نیروی تایید شده' : 'VERIFIED WORKERS'}
              </h3>
              <p className="font-medium text-gray-600 text-lg">
                {language === 'fa'
                  ? 'خیالتان راحت باشد. تمام کارجویان فرآیند احراز هویت دقیق ما (شامل مدارک شناسایی و گواهی عدم سوء پیشینه) را طی کرده‌اند.'
                  : 'Rest easy. All workers have passed our rigorous verification process including ID checks and background screening.'}
              </p>
            </div>
            <div className="w-32 h-32 bg-gray-100 rounded-full border-3 border-ink dark:border-concrete flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Shield className="w-16 h-16 text-ink dark:text-white" />
            </div>
          </div>

          {/* Box 2: Fast */}
          <div className="border-3 border-ink dark:border-concrete bg-safety dark:bg-safety p-8 shadow-brutal hover:shadow-brutal-lg transition-all flex flex-col justify-between group">
            <div className="w-14 h-14 bg-white dark:bg-concrete-dark border-3 border-ink dark:border-concrete flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-ink dark:text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2 uppercase">{language === 'fa' ? 'سرعت بالا' : 'SUPER FAST'}</h3>
              <p className="font-bold">
                {language === 'fa' ? 'شیفت را پست کنید، در کمتر از ۱ ساعت نیرو بگیرید.' : 'Post a shift, get staff in under 1 hour.'}
              </p>
            </div>
          </div>

          {/* Box 3: Flexible */}
          <div className="border-3 border-ink dark:border-concrete bg-primary text-white p-8 shadow-brutal hover:shadow-brutal-lg transition-all flex flex-col justify-between group">
            <div className="w-14 h-14 bg-white dark:bg-concrete-dark border-3 border-ink dark:border-concrete flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-ink dark:text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2 uppercase">{language === 'fa' ? 'مدیریت آسان' : 'EASY MANAGE'}</h3>
              <p className="font-medium opacity-90">
                {language === 'fa'
                  ? 'داشبورد اختصاصی برای مدیریت شیفت‌ها و پرداخت‌ها.'
                  : 'Dedicated dashboard to manage shifts and payments.'}
              </p>
            </div>
          </div>

          {/* Box 4: Cost */}
          <div className="border-3 border-ink dark:border-concrete bg-white dark:bg-concrete-dark p-8 shadow-brutal hover:shadow-brutal-lg transition-all md:col-span-2 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-500 w-12 h-12 border-3 border-ink dark:border-concrete flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black uppercase">
                {language === 'fa' ? 'هزینه شفاف' : 'TRANSPARENT PRICING'}
              </h3>
            </div>
            <p className="font-medium text-gray-600 text-lg border-l-4 border-green-500 pl-4">
              {language === 'fa'
                ? 'فقط برای ساعات کاری پرداخت کنید. هزینه پلتفرم ثابت و مشخص (۲۰۰,۰۰۰ ریال/ساعت). بدون هزینه‌های پنهان.'
                : 'Pay only for hours worked. Fixed platform fee (200,000 IRR/hr). No hidden costs.'}
            </p>
          </div>
        </div>
      </section>

      {/* --- STEPS SECTION --- */}
      <section className="py-20 px-4 bg-ink dark:bg-ink text-white border-t-4 border-ink dark:border-concrete">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase text-accent mb-4">
              {language === 'fa' ? 'شروع همکاری' : 'HOW IT WORKS'}
            </h2>
            <div className="w-24 h-2 bg-white dark:bg-concrete-dark mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: '01',
                title: language === 'fa' ? 'ثبت نام شرکت' : 'Register Business',
                desc:
                  language === 'fa'
                    ? 'اطلاعات کسب‌وکار خود را وارد کنید تا تایید شود.'
                    : 'Enter your business details for verification.',
                icon: Briefcase,
              },
              {
                id: '02',
                title: language === 'fa' ? 'تعریف شیفت' : 'Post a Shift',
                desc:
                  language === 'fa'
                    ? 'زمان، تخصص مورد نیاز و دستمزد را مشخص کنید.'
                    : 'Specify time, skills needed, and hourly wage.',
                icon: Clock,
              },
              {
                id: '03',
                title: language === 'fa' ? 'انتخاب نیرو' : 'Hire & Review',
                desc:
                  language === 'fa'
                    ? 'پروفایل‌ها را ببینید، انتخاب کنید و امتیاز دهید.'
                    : 'View profiles, select workers, and rate them.',
                icon: Star,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white dark:bg-concrete-dark/10 border-2 border-white/20 p-8 hover:bg-white dark:bg-concrete-dark/20 transition-colors group"
              >
                <div className="absolute -top-6 left-6 text-6xl font-black text-white/10 group-hover:text-accent/20 transition-colors">
                  {step.id}
                </div>
                <div className="mb-6 text-accent">
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 px-4 text-center relative overflow-hidden bg-safety dark:bg-safety border-t-4 border-ink dark:border-concrete">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-white dark:bg-concrete-dark border-3 border-ink dark:border-concrete rotate-12"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary border-3 border-ink dark:border-concrete rounded-full -rotate-12"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase text-ink dark:text-white">
            {language === 'fa' ? 'نیروی کار بعدی شما اینجاست' : 'YOUR NEXT HIRE IS HERE'}
          </h2>
          <Link
            href="/register"
            className="inline-block bg-white dark:bg-concrete-dark text-ink dark:text-white text-2xl font-black px-12 py-6 border-4 border-ink dark:border-concrete shadow-brutal hover:bg-ink dark:bg-ink hover:text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            {language === 'fa' ? 'رایگان شروع کنید' : 'START FOR FREE'}
          </Link>
          <p className="mt-6 font-bold text-ink dark:text-white/70">
            {language === 'fa' ? 'بدون نیاز به کارت اعتباری • لغو در هر زمان' : 'No credit card required • Cancel anytime'}
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white dark:bg-concrete-dark border-t-4 border-ink dark:border-concrete py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-4xl font-black tracking-tighter">{language === 'fa' ? 'کارجو.' : 'KARJU.'}</div>
          <div className="flex gap-8 font-bold">
            <a href="#" className="hover:text-primary hover:underline decoration-2">
              {language === 'fa' ? 'درباره' : 'About'}
            </a>
            <a href="#" className="hover:text-primary hover:underline decoration-2">
              {language === 'fa' ? 'پشتیبانی' : 'Support'}
            </a>
            <a href="#" className="hover:text-primary hover:underline decoration-2">
              {language === 'fa' ? 'قوانین' : 'Terms'}
            </a>
          </div>
          <div className="text-gray-500 font-mono">
            {language === 'fa' ? '© ۱۴۰۴ پلتفرم کارجو' : '© 2025 Karju Platform'}
          </div>
        </div>
      </footer>
    </div>
  );
}

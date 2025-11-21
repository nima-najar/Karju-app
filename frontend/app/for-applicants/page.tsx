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
  Smile,
  Target,
  TrendingUp,
} from 'lucide-react';

export default function ForApplicantsPage() {
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
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-block bg-safety dark:bg-safety border-3 border-ink dark:border-concrete px-4 py-2 font-black shadow-brutal-sm rotate-2 text-ink dark:text-white">
              {language === 'fa' ? 'مخصوص کارجویان و فریلنسرها' : 'FOR WORKERS & FREELANCERS'}
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight text-ink dark:text-white">
              {language === 'fa' ? (
                <>
                  رئیست<br />
                  <span className="text-primary dark:text-safety">خودتی.</span>
                </>
              ) : (
                <>
                  BE YOUR<br />
                  <span className="text-primary dark:text-safety">OWN BOSS.</span>
                </>
              )}
            </h1>

            <p className="text-xl font-bold text-ink/70 dark:text-white/80 max-w-lg border-l-4 border-ink dark:border-concrete pl-6">
              {language === 'fa'
                ? 'آزادی عمل، درآمد بالا و امنیت شغلی. با کارجو، هر وقت و هر جا که خواستی کار کن.'
                : 'Freedom, high income, and job security. With Karju, work whenever and wherever you want.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/register"
                className="btn-brutal group flex items-center justify-center gap-2 bg-primary dark:bg-safety text-white dark:text-ink border-3 border-ink dark:border-concrete px-8 py-4 font-black text-xl shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all"
              >
                {language === 'fa' ? 'همین الان شروع کن' : 'Start Now'}
                <ArrowLeft
                  className={`w-6 h-6 transition-transform ${isRtl ? '' : 'rotate-180 group-hover:translate-x-1'}`}
                />
              </Link>
            </div>
          </div>

          {/* Interactive Visual */}
          <div className="lg:w-1/2 relative w-full flex justify-center">
            {/* Card Stack Effect */}
            <div className="relative w-80 h-96">
              <div className="absolute inset-0 bg-ink dark:bg-ink rounded-2xl transform rotate-6 border-3 border-ink dark:border-concrete"></div>
              <div className="absolute inset-0 bg-safety dark:bg-safety rounded-2xl transform -rotate-3 border-3 border-ink dark:border-concrete"></div>
              <div className="absolute inset-0 bg-white dark:bg-concrete-dark rounded-2xl border-3 border-ink dark:border-concrete p-6 flex flex-col justify-between transform transition-transform hover:scale-105 hover:rotate-0 duration-300 shadow-brutal-lg">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-concrete rounded-full border-3 border-ink dark:border-concrete overflow-hidden">
                    {/* Placeholder Avatar */}
                    <div className="w-full h-full flex items-center justify-center bg-yellow-300 dark:bg-safety text-2xl">😊</div>
                  </div>
                  <div className="bg-green-400 dark:bg-moss text-ink dark:text-white text-xs font-black px-2 py-1 border-2 border-ink dark:border-concrete rounded-full">
                    {language === 'fa' ? 'تایید شده' : 'VERIFIED'}
                  </div>
                </div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-concrete mb-2 rounded border-2 border-ink dark:border-concrete"></div>
                  <div className="h-8 w-48 bg-primary/20 dark:bg-safety/20 mb-4 rounded border-2 border-primary dark:border-safety"></div>
                  <div className="flex gap-2">
                    <span className="bg-gray-100 dark:bg-concrete px-2 py-1 text-xs font-bold border-2 border-ink dark:border-concrete rounded text-ink dark:text-white">
                      {language === 'fa' ? 'کافه' : 'Barista'}
                    </span>
                    <span className="bg-gray-100 dark:bg-concrete px-2 py-1 text-xs font-bold border-2 border-ink dark:border-concrete rounded text-ink dark:text-white">
                      {language === 'fa' ? 'رویداد' : 'Event'}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t-3 border-dashed border-ink dark:border-concrete flex justify-between items-center">
                  <span className="font-black text-2xl text-ink dark:text-white">
                    4.9 <Star className="w-5 h-5 inline text-safety fill-safety mb-1" />
                  </span>
                  <span className="font-bold text-green-600 dark:text-moss">
                    {language === 'fa' ? '+۱۲ شیفت' : '+12 Shifts'}
                  </span>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-12 top-20 bg-white dark:bg-concrete-dark p-3 border-3 border-ink dark:border-concrete shadow-brutal font-bold flex items-center gap-2 animate-float text-ink dark:text-white">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-moss" />
                <span>{language === 'fa' ? 'تسویه آنی' : 'Instant Pay'}</span>
              </div>
              <div className="absolute -left-8 bottom-12 bg-white dark:bg-concrete-dark p-3 border-3 border-ink dark:border-concrete shadow-brutal font-bold flex items-center gap-2 animate-wiggle text-ink dark:text-white">
                <Shield className="w-6 h-6 text-primary dark:text-safety" />
                <span>{language === 'fa' ? 'بیمه' : 'Insurance'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className="bg-safety dark:bg-safety border-y-4 border-ink dark:border-concrete py-4 overflow-hidden rotate-1 scale-105 z-20 relative">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center font-black text-2xl text-ink dark:text-white">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="flex items-center gap-4">
              {language === 'fa' ? (
                <>
                  کار منعطف <Zap className="w-6 h-6 fill-current" /> پرداخت سریع <Star className="w-6 h-6 fill-current" />
                </>
              ) : (
                <>
                  FLEXIBLE WORK <Zap className="w-6 h-6 fill-current" /> GET PAID FAST{' '}
                  <Star className="w-6 h-6 fill-current" />
                </>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* --- BENEFITS GRID --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-4">
            {language === 'fa' ? 'چرا کارجو؟' : 'Why Karju?'}
          </h2>
          <p className="text-xl font-bold text-gray-500">
            {language === 'fa' ? 'مزایایی که در هیچ جای دیگر پیدا نمی‌کنید' : 'Benefits you won\'t find anywhere else'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border-3 border-dark p-8 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-2 transition-all group">
            <div className="w-16 h-16 bg-primary text-white border-3 border-dark flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4">
              {language === 'fa' ? 'ساعت کاری دست خودته' : 'Your Schedule, Your Rules'}
            </h3>
            <p className="font-medium text-gray-600">
              {language === 'fa'
                ? 'دیگه نگران تداخل کار با دانشگاه یا زندگی شخصی نباش. شیفت‌هایی رو انتخاب کن که با برنامت جوره.'
                : 'No more worrying about conflicts with school or personal life. Choose shifts that fit your schedule.'}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-accent border-3 border-dark p-8 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-2 transition-all group">
            <div className="w-16 h-16 bg-white text-dark border-3 border-dark flex items-center justify-center mb-6 group-hover:-rotate-12 transition-transform">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4">
              {language === 'fa' ? 'درآمد مطمئن و سریع' : 'Reliable & Fast Income'}
            </h3>
            <p className="font-medium text-dark">
              {language === 'fa'
                ? 'پرداخت‌ها شفاف و تضمین شده‌ست. می‌تونی انتخاب کنی که ماهانه تسویه کنی یا بعد از هر شیفت.'
                : 'Payments are transparent and guaranteed. You can choose monthly settlement or after each shift.'}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border-3 border-dark p-8 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-2 transition-all group">
            <div className="w-16 h-16 bg-green-400 dark:bg-moss text-ink dark:text-white border-3 border-ink dark:border-concrete flex items-center justify-center mb-6 group-hover:scale-110 transition-transform rounded-full">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-ink dark:text-white">
              {language === 'fa' ? 'رزومه قوی بساز' : 'Build a Strong Resume'}
            </h3>
            <p className="font-medium text-ink/70 dark:text-white/80">
              {language === 'fa'
                ? 'با کار کردن در شرکت‌های مختلف و گرفتن امتیاز، پروفایلت قوی‌تر میشه و پیشنهادهای بهتری می‌گیری.'
                : 'By working at different companies and earning ratings, your profile gets stronger and you receive better offers.'}
            </p>
          </div>
        </div>
      </section>

      {/* --- FAQ / STEPS SECTION --- */}
      <section className="py-20 px-4 bg-ink dark:bg-ink text-concrete dark:text-white border-t-4 border-ink dark:border-concrete">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h2 className="text-5xl font-black mb-6 text-safety dark:text-safety">
                {language === 'fa' ? 'چطور کار میکنه؟' : 'How It Works?'}
              </h2>
              <p className="text-xl font-bold text-concrete/80 dark:text-white/80">
                {language === 'fa' ? '۳ مرحله ساده تا اولین درآمد شما' : '3 Simple Steps to Your First Income'}
              </p>
            </div>

            <div className="md:w-2/3 space-y-6">
              {[
                {
                  id: '01',
                  title: language === 'fa' ? 'ثبت نام و احراز هویت' : 'Sign Up & Verification',
                  desc:
                    language === 'fa'
                      ? 'مدارک شناسایی و مهارت‌هاتو آپلود کن. زیر ۲۴ ساعت تایید میشی.'
                      : 'Upload your ID and skills. Get verified within 24 hours.',
                },
                {
                  id: '02',
                  title: language === 'fa' ? 'انتخاب شیفت' : 'Choose Shifts',
                  desc:
                    language === 'fa'
                      ? 'بین صدها موقعیت شغلی بگرد و اونی که دوست داری رو رزرو کن.'
                      : 'Browse hundreds of job opportunities and reserve the one you like.',
                },
                {
                  id: '03',
                  title: language === 'fa' ? 'کار و دریافت پول' : 'Work & Get Paid',
                  desc:
                    language === 'fa'
                      ? 'سر شیفت حاضر شو، کار رو انجام بده و پولتو بگیر. به همین سادگی!'
                      : 'Show up for your shift, do the work, and get paid. It\'s that simple!',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="bg-concrete/20 dark:bg-concrete-dark/30 border-2 border-concrete/30 dark:border-concrete/30 p-6 rounded-xl hover:bg-concrete/30 dark:hover:bg-concrete-dark/40 transition-colors flex gap-6 items-start"
                >
                  <span className="text-4xl font-black text-safety dark:text-safety opacity-80">/{step.id}</span>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-concrete dark:text-white">{step.title}</h3>
                    <p className="text-concrete/80 dark:text-white/80">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 px-4 text-center relative overflow-hidden bg-concrete dark:bg-ink">
        <div className="absolute top-10 left-10 w-20 h-20 bg-safety dark:bg-safety rounded-full border-3 border-ink dark:border-concrete animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary dark:bg-safety rounded-full border-3 border-ink dark:border-concrete animate-pulse"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase text-ink dark:text-white">
            {language === 'fa' ? 'آماده شروع هستی؟' : 'Ready to Start?'}
          </h2>
          <Link
            href="/register"
            className="inline-block bg-ink dark:bg-concrete text-white dark:text-ink text-2xl font-black px-12 py-6 border-4 border-transparent hover:bg-white dark:hover:bg-concrete-dark hover:text-ink dark:hover:text-white hover:border-ink dark:hover:border-concrete hover:shadow-brutal transition-all transform hover:-rotate-1"
          >
            {language === 'fa' ? 'عضویت رایگان' : 'Free Sign Up'}
          </Link>
          <p className="mt-6 font-bold text-ink/70 dark:text-white/70">
            {language === 'fa' ? 'بدون هزینه اولیه • لغو در هر زمان' : 'No upfront cost • Cancel anytime'}
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white dark:bg-concrete-dark border-t-4 border-ink dark:border-concrete py-12 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-bold">
          <div className="text-2xl tracking-tighter text-ink dark:text-white">{language === 'fa' ? 'کارجو.' : 'KARJU.'}</div>
          <div className="text-ink/70 dark:text-white/70">
            © 2025 {language === 'fa' ? 'پلتفرم کارجو' : 'Karju Platform'}
          </div>
        </div>
      </footer>
    </div>
  );
}

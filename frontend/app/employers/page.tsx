'use client';

import Link from 'next/link';
import {
  Users,
  Search,
  FileCheck,
  Zap,
  BarChart3,
  Briefcase,
  CheckSquare,
  Building2,
  ShieldCheck,
  CalendarClock,
  Sparkles,
  Target,
  Layers,
  MessageCircle,
} from 'lucide-react';

const steps = [
  {
    step: '۱',
    title: 'جستجو کنید',
    desc: 'از بین هزاران پروفایل تاییدشده، نیروی مناسب را بر اساس مهارت، تجربه و دستمزد فیلتر کنید.',
    icon: Search,
  },
  {
    step: '۲',
    title: 'شیفت ثبت کنید',
    desc: 'با چند کلیک، نیازمندی شیفت یا موقعیت باز خود را منتشر و دسترسی تیم خود را مدیریت کنید.',
    icon: Users,
  },
  {
    step: '۳',
    title: 'شروع همکاری',
    desc: 'زمان‌بندی و حضور نیرو به صورت خودکار هماهنگ می‌شود و پرداخت امن انجام می‌گیرد.',
    icon: CheckSquare,
  },
] as const;

const featureList = [
  {
    title: 'جستجوی هوشمند',
    desc: 'با فیلترهای پیشرفته دقیقاً نیرویی را که می‌خواهید پیدا کنید.',
    icon: Search,
  },
  {
    title: 'انعطاف‌پذیری کامل',
    desc: 'خودتان ساعات کار و تعداد شیفت‌ها را مشخص کنید و در لحظه تغییر دهید.',
    icon: Zap,
  },
  {
    title: 'پرداخت و تسویه سریع',
    desc: 'پرداخت حقوق پس از هر شیفت یا به صورت هفتگی با صورتحساب شفاف.',
    icon: FileCheck,
  },
  {
    title: 'پشتیبانی ۲۴ ساعته',
    desc: 'تیم پشتیبانی ما همیشه پاسخگوی شماست تا فرآیند بدون وقفه پیش برود.',
    icon: Users,
  },
] as const;

const trustStats = [
  { label: 'نیروهای تایید شده', value: '+۱۲,۰۰۰', desc: 'پروفایل فعال با مدارک معتبر' },
  { label: 'سفارشات تکمیل‌شده', value: '+۵۴,۰۰۰', desc: 'شیفت موفق در ۲۴ شهر' },
  { label: 'میانگین زمان جذب', value: '۳۶ دقیقه', desc: 'از انتشار تا تایید نیرو' },
] as const;

const serviceHighlights = [
  {
    title: 'مدیریت ناوگان انسانی',
    desc: 'همه شیفت‌ها، حضور و غیاب و KPI‌ها را در یک داشبورد یکپارچه ببینید.',
    icon: Building2,
  },
  {
    title: 'امنیت و اطمینان',
    desc: 'تمام نیروها احراز هویت شده و بیمه مسئولیت حرفه‌ای پوشش داده شده‌اند.',
    icon: ShieldCheck,
  },
  {
    title: 'برنامه‌ریزی پویا',
    desc: 'با کمک هوش مصنوعی ظرفیت‌ها را پیش‌بینی کرده و شیفت‌ها را هوشمندانه توزیع کنید.',
    icon: CalendarClock,
  },
] as const;

const faqItems = [
  {
    title: 'چطور مطمئن می‌شوم نیروها قابل اعتماد هستند؟',
    answer: 'هر نیرو از سه مرحله راستی‌آزمایی (احراز هویت، بررسی سوابق و مصاحبه مهارتی) عبور می‌کند و امتیاز عملکرد عمومی دارد.',
  },
  {
    title: 'آیا می‌توانم چند شعبه را مدیریت کنم؟',
    answer: 'بله، داشبورد کاراوا از چند موقعیتی بودن پشتیبانی می‌کند و می‌توانید برای هر شعبه دسترسی اختصاص دهید.',
  },
  {
    title: 'پرداخت‌ها چطور انجام می‌شود؟',
    answer: 'پس از تایید شیفت، اظهارنامه هزینه صادر می‌شود و تسویه از طریق درگاه بانکی یا حواله شرکتی انجام خواهد شد.',
  },
] as const;

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-[#cccdc6] font-body text-[#1a1a1a] overflow-x-hidden pt-20">
      {/* HERO */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-[#e0ded9] border-4 border-[#1a1a1a] rounded-[3rem] p-8 lg:p-16 shadow-[12px_12px_0px_0px_#1a1a1a] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />
          <div className="absolute -left-10 top-10 w-40 h-40 bg-[#4a5d23] border-4 border-[#1a1a1a] rounded-full mix-blend-multiply opacity-50 blur-3xl" />
          <div className="absolute -right-16 bottom-10 w-52 h-52 bg-[#ff5e00]/70 border-4 border-[#1a1a1a] rounded-[45%] rotate-12 opacity-40" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#1a1a1a] text-white rounded-full text-sm font-bold">
                <Briefcase className="w-4 h-4" />
                <span>راهکار سازمانی کاراوا</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-display leading-tight">
                پیدا کردن نیروی کار مناسب،
                <br />
                <span className="text-[#ff5e00] bg-white px-2 border-2 border-[#1a1a1a] transform rotate-1 inline-block mt-4">
                  آسان‌تر از همیشه
                </span>
              </h1>
              <p className="text-xl font-medium text-[#1a1a1a]/80">
                پلتفرم هوشمند اتصال کسب‌وکارها به متقاضیان واجد شرایط؛ بدون فرآیندهای پیچیده و با سرعتی متناسب با نیاز عملیاتی شما.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  href="/post-shift"
                  className="btn-primary bg-[#4a5d23] text-white hover:bg-[#3a4b1b] text-lg py-4 px-10 shadow-[6px_6px_0px_0px_#1a1a1a]"
                >
                  استخدام نیرو
                </Link>
                <Link
                  href="#workflow"
                  className="btn-primary bg-white text-[#1a1a1a] hover:bg-[#f5f5f5] text-lg py-4 px-10 shadow-[6px_6px_0px_0px_#1a1a1a]"
                >
                  چطور کار می‌کند؟
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-bold pt-4">
                <Sparkles className="w-5 h-5" />
                <span>مناسب رستوران‌ها، هتل‌ها، لجستیک و رویدادها</span>
              </div>
            </div>

            <div className="relative bg-white border-4 border-[#1a1a1a] rounded-[2.5rem] p-8 shadow-[10px_10px_0px_0px_#1a1a1a]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-bold text-[#4a5d23] uppercase mb-1">Dashboard</p>
                  <h3 className="text-2xl font-display">خلاصه نیروی انسانی</h3>
                </div>
                <Layers className="w-8 h-8 text-[#ff5e00]" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'شیفت‌های امروز', value: '۳۲', accent: 'bg-[#ff5e00]' },
                  { label: 'نیروهای فعال', value: '۱۴۵', accent: 'bg-[#4a5d23]' },
                  { label: 'درخواست‌های جدید', value: '۱۷', accent: 'bg-[#1a1a1a]' },
                  { label: 'درصد تکمیل', value: '۹۸٪', accent: 'bg-[#ff5e00]' },
                ].map((card) => (
                  <div key={card.label} className="border-2 border-[#1a1a1a] rounded-2xl p-4 text-right">
                    <div className={`w-10 h-2 rounded-full ${card.accent} mb-3`} />
                    <p className="text-sm font-medium opacity-70">{card.label}</p>
                    <p className="text-2xl font-display">{card.value}</p>
                  </div>
                ))}
              </div>
              <div className="border-2 border-dashed border-[#1a1a1a] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">فرصت ویژه</p>
                  <p className="text-xs opacity-70">نیروهای VIP آماده همکاری</p>
                </div>
                <ArrowBadge />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="workflow" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display mb-4">چگونه کار می‌کند؟</h2>
            <p className="text-lg font-medium opacity-70">در سه گام ساده نیروی مورد نظر خود را بیابید</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div
                key={item.title}
                className="bg-white border-2 border-[#1a1a1a] p-8 rounded-[2rem] text-center relative group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-[#4a5d23] text-white border-2 border-[#1a1a1a] rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#1a1a1a]">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display mb-4">{item.title}</h3>
                <p className="font-medium opacity-80">{item.desc}</p>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE HIGHLIGHTS */}
      <section className="py-20 bg-white border-y-4 border-[#1a1a1a]">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 gap-6">
              {featureList.map((feat) => (
                <div key={feat.title} className="flex gap-4 items-start p-4 hover:bg-[#f0f0f0] rounded-xl transition-colors cursor-default">
                  <div className="w-12 h-12 bg-[#e0ded9] border-2 border-[#1a1a1a] rounded-full flex items-center justify-center text-[#ff5e00] flex-shrink-0">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{feat.title}</h4>
                    <p className="text-sm font-medium opacity-70">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 text-center lg:text-right space-y-6">
            <h2 className="text-4xl lg:text-5xl font-display">طراحی شده برای کسب‌وکارها</h2>
            <p className="text-xl font-medium opacity-80 leading-relaxed">
              امکانات ویژه برای یافتن بهترین نیروها و مدیریت شیفت‌ها. ما چالش‌های استخدام را ساده کرده‌ایم تا روی رشد کسب‌وکار تمرکز کنید.
            </p>
            <div className="bg-[#4a5d23] text-white p-8 rounded-[2rem] border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a] inline-block w-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">کاهش هزینه‌ها</p>
                  <p className="text-sm opacity-90">بدون نیاز به فرآیند طولانی منابع انسانی</p>
                </div>
              </div>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE MODULES */}
      <section className="py-20 bg-[#e0ded9] border-b-4 border-[#1a1a1a]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start gap-8 mb-12">
            <div className="flex-1">
              <p className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#1a1a1a] rounded-full text-sm font-bold mb-4">
                <Target className="w-4 h-4" />
                ماژول‌های سازمانی
              </p>
              <h2 className="text-4xl font-display mb-4">بسته کامل برای مدیریت نیروی کار</h2>
              <p className="text-lg text-[#1a1a1a]/80">
                سه ماژول اصلی برای تیم‌های عملیات، منابع انسانی و مالی طراحی شده است تا کل چرخه جذب، برنامه‌ریزی و پرداخت را یکپارچه کنند.
              </p>
            </div>
            <div className="flex gap-4">
              {serviceHighlights.map((highlight) => (
                <div key={highlight.title} className="bg-white border-4 border-[#1a1a1a] rounded-[2rem] p-6 w-64 shadow-[6px_6px_0px_0px_#1a1a1a]">
                  <div className="w-12 h-12 bg-[#cccdc6] border-2 border-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
                    <highlight.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-xl mb-2">{highlight.title}</h4>
                  <p className="text-sm opacity-70">{highlight.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-24 bg-[#1a1a1a] text-white border-b-4 border-[#1a1a1a] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-safety text-sm font-bold uppercase mb-4">صدای مشتری</p>
            <h3 className="text-4xl font-display leading-tight mb-6">
              «کاراوا به ما کمک کرد شبکه نیروهای پاره‌وقت خود را در سه شهر مدیریت کنیم. حالا می‌توانیم روی توسعه منو تمرکز کنیم.»
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-[#ff5e00] text-[#1a1a1a] font-display text-2xl">
                ن
              </div>
              <div>
                <p className="font-bold text-lg">ندا مومنی</p>
                <p className="text-sm text-white/70">مدیر عملیات گروه رستوران‌های نارون</p>
              </div>
            </div>
          </div>
          <div className="bg-[#333333] border-4 border-white rounded-[2.5rem] p-8 shadow-[10px_10px_0px_0px_rgba(255,255,255,0.3)]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold">پیشخوان پشتیبانی</span>
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="space-y-4">
              {['پشتیبانی شیفت‌های آخر هفته', 'هماهنگی سرویس رفت و برگشت', 'تمدید دسترسی مدیر شعبه'].map((ticket, idx) => (
                <div key={ticket} className="border-2 border-white rounded-xl p-4 flex items-center justify-between">
                  <span>{ticket}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full border border-white/40">
                    {idx === 0 ? 'حل شد' : idx === 1 ? 'در حال انجام' : 'در انتظار'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16">
          <div>
            <p className="inline-flex items-center gap-2 px-4 py-2 bg-[#e0ded9] border-2 border-[#1a1a1a] rounded-full text-sm font-bold mb-4">
              <QuestionBadge />
              سوالات پرتکرار
            </p>
            <h2 className="text-4xl font-display mb-4">پاسخ به دغدغه‌های رایج</h2>
            <p className="text-lg text-[#1a1a1a]/80">
              اگر هنوز سوالی دارید، تیم پشتیبانی ۲۴/۷ ما در کنار شماست. همین حالا با ما صحبت کنید تا راهکار مناسب کسب‌وکار شما طراحی شود.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/contact"
                className="px-10 py-4 rounded-xl border-2 border-[#1a1a1a] font-display bg-[#e0ded9] hover:-translate-y-1 transition-transform shadow-[6px_6px_0px_0px_#1a1a1a]"
              >
                صحبت با مشاور
              </Link>
              <Link href="/register" className="btn-primary px-10 py-4 text-lg">
                شروع رایگان
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <details key={faq.title} className="border-2 border-[#1a1a1a] rounded-2xl p-4 bg-[#f7f5f0] shadow-[4px_4px_0px_0px_#1a1a1a]">
                <summary className="cursor-pointer text-lg font-display flex items-center justify-between">
                  {faq.title}
                  <span className="text-sm font-body">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#4a5d23] text-white text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="inline-flex items-center gap-2 px-4 py-2 border border-white rounded-full text-sm font-bold mb-6">
            <ArrowUp />
            همکاری بدون مرز
          </p>
          <h2 className="text-5xl font-display mb-8">همین امروز شروع کنید</h2>
          <p className="text-xl font-medium mb-12 opacity-90">
            به صدها کسب‌وکاری بپیوندید که از کاراوا برای استخدام سریع و مطمئن نیرو استفاده می‌کنند.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/register"
              className="bg-white text-[#4a5d23] border-2 border-white px-10 py-4 text-xl font-bold rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-transform"
            >
              ثبت‌نام رایگان
            </Link>
            <Link
              href="/contact"
              className="bg-transparent text-white border-2 border-white px-10 py-4 text-xl font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              درخواست مشاوره
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowBadge() {
  return (
    <div className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center bg-[#ff5e00]/20 text-[#1a1a1a] font-bold">
      ↑
    </div>
  );
}

function QuestionBadge() {
  return (
    <div className="w-5 h-5 border border-[#1a1a1a] rounded-full flex items-center justify-center text-xs font-bold">؟</div>
  );
}

function ArrowUp() {
  return (
    <div className="w-4 h-4 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </div>
  );
}



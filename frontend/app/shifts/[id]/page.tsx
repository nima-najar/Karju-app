'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { shiftsAPI, applicationsAPI } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPersianDate, formatPersianCurrency, formatPersianNumber, gregorianToJalali, toPersianNum, formatPersianTime, getPersianIndustry } from '@/lib/persianUtils';
import { format } from 'date-fns';
import { MapPin, Star, Mail, XCircle, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { getUser } from '@/lib/auth';

export default function ShiftDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const isRTL = language === 'fa';
  const backButtonClasses =
    'inline-flex items-center justify-center w-14 h-14 rounded-full border-[3px] border-white/80 text-white bg-transparent hover:bg-white/10 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]';
  const cardClasses =
    'rounded-[24px] border-2 border-ink dark:border-concrete bg-white dark:bg-concrete-dark shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]';
  const [shift, setShift] = useState<any>(null);
  const [similarShifts, setSimilarShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
    loadShift();
  }, []);

  const loadShift = async () => {
    try {
      const response = await shiftsAPI.getById(params.id as string);
      setShift(response.data.shift);
      setSelectedShiftId(response.data.shift.id);
      
      // Load similar shifts from the same business
      if (response.data.shift.business_name) {
        loadSimilarShifts(response.data.shift.business_name, response.data.shift.id);
      }
    } catch (error) {
      console.error('Error loading shift:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarShifts = async (businessName: string, currentShiftId: string) => {
    try {
      const response = await shiftsAPI.getAll({});
      const shifts = response.data.shifts || [];
      // Filter by same business name and exclude current shift
      const similar = shifts
        .filter((s: any) => 
          s.business_name === businessName && 
          s.id !== currentShiftId && 
          s.status === 'open'
        )
        .slice(0, 3); // Show max 3 similar shifts
      setSimilarShifts(similar);
    } catch (error) {
      console.error('Error loading similar shifts:', error);
    }
  };

  const calculateTotalIncome = (shift: any) => {
    const start = parseInt(shift.start_time.split(':')[0]);
    const end = parseInt(shift.end_time.split(':')[0]);
    const hours = end > start ? end - start : (24 - start) + end;
    // hourly_wage is in rials, convert to tomans (divide by 10)
    const hourlyWageTomans = shift.hourly_wage / 10;
    return hours * hourlyWageTomans; // Return in tomans
  };

  const formatIncomeTomans = (amount: number) => {
    const amountInt = Math.floor(amount);
    const amountStr = amountInt.toLocaleString();
    if (language === 'fa') {
      return `${formatPersianNumber(amountStr)} تومان`;
    }
    return `${amountStr} Toman`;
  };

  const getDistance = (shift: any) => {
    return ((shift.id?.charCodeAt(0) || 0) % 50) / 10 + 1.5;
  };

  // Extract role from shift title or industry
  const getRole = (shift: any) => {
    const titleLower = shift.title?.toLowerCase() || '';
    const descLower = shift.description?.toLowerCase() || '';
    const combined = titleLower + ' ' + descLower;
    
    if (language === 'fa') {
      if (combined.includes('waiter') || combined.includes('گارسون') || combined.includes('server')) {
        return 'گارسون';
      }
      if (combined.includes('barista') || combined.includes('باریستا')) {
        return 'باریستا';
      }
      if (combined.includes('cashier') || combined.includes('صندوقدار')) {
        return 'صندوقدار';
      }
      if (combined.includes('dj') || combined.includes('دی‌جی')) {
        return 'DJ';
      }
      if (combined.includes('employee') || combined.includes('کارمند')) {
        return 'کارمند';
      }
      return shift.industry === 'رستوران و پذیرایی' ? 'کارمند' : 'کارمند';
    } else {
      if (combined.includes('waiter') || combined.includes('server')) {
        return 'Waiter';
      }
      if (combined.includes('barista')) {
        return 'Barista';
      }
      if (combined.includes('cashier')) {
        return 'Cashier';
      }
      if (combined.includes('dj')) {
        return 'DJ';
      }
      return 'Employee';
    }
  };

  // Extract neighborhood from location
  const getNeighborhood = (location: string) => {
    if (!location) return '';
    
    // Remove common prefixes
    let neighborhood = location
      .replace(/^خیابان\s+/, '')
      .replace(/^بلوار\s+/, '')
      .replace(/^کوچه\s+/, '')
      .replace(/^میدان\s+/, '');
    
    // Split by comma and take first part
    const parts = neighborhood.split('،');
    neighborhood = parts[0].trim();
    
    // If it still contains "تهران", remove it
    neighborhood = neighborhood.replace(/\s*تهران\s*$/, '').trim();
    
    return neighborhood || location;
  };

  // Render stars based on rating
  const renderStars = (rating: number | null) => {
    const stars = [];
    const ratingValue = rating ? parseFloat(rating.toString()) : 0;
    const filledStars = Math.round(ratingValue);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            i <= filledStars && ratingValue > 0
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  const getPersianDateLabel = (date: Date) => {
    if (language === 'fa') {
      const [jy, jm, jd] = gregorianToJalali(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      const persianWeekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
      const dayOfWeek = persianWeekDays[date.getDay()];
      const persianMonths = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
      return `${dayOfWeek} ${toPersianNum(jd.toString())} ${persianMonths[jm]}`;
    }
    return format(date, 'EEEE, MMMM dd');
  };

  const handleContinue = async () => {
    if (!user || user.userType !== 'worker') {
      router.push('/login');
      return;
    }

    router.push(`/shifts/${selectedShiftId || shift.id}/confirm`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-concrete dark:bg-ink flex items-center justify-center">
        <div className="text-center text-ink dark:text-concrete space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-4 border-ink/30 dark:border-concrete/40 border-t-ink dark:border-t-concrete animate-spin"></div>
          <p className="font-display text-lg">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="min-h-screen bg-concrete dark:bg-ink flex items-center justify-center">
        <p className="text-ink dark:text-concrete text-lg font-display">{t('shifts.shiftNotFound')}</p>
      </div>
    );
  }

  const distance = getDistance(shift);
  const descriptionText = shift.description || '';
  const shouldTruncate = descriptionText.length > 200;
  const displayDescription = expandedDescription || !shouldTruncate 
    ? descriptionText 
    : descriptionText.substring(0, 200) + '...';

  // Parse dress code if it's a string, otherwise use as is
  const dressCodeItems = shift.dress_code 
    ? (typeof shift.dress_code === 'string' ? shift.dress_code.split(',').map((s: string) => s.trim()) : shift.dress_code)
    : [];

  const distanceLabel =
    language === 'fa'
      ? `${formatPersianNumber(distance.toFixed(1))} کیلومتر`
      : `${distance.toFixed(1)} km`;

  const shiftOptions = [shift, ...similarShifts.filter((item) => item.id !== shift.id)];

  return (
    <div
      className="min-h-screen bg-concrete dark:bg-ink text-ink dark:text-concrete pt-28 pb-16"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-gradient-to-b from-ink to-moss text-concrete border-b-4 border-safety">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-4">
          <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                <h1 className="text-3xl font-display text-white">
                  {shift.business_name || 'کسب‌وکار'} • {getRole(shift)}
                </h1>
                <Link href="/shifts" className={backButtonClasses} aria-label={language === 'fa' ? 'بازگشت به لیست شیفت‌ها' : 'Back to shifts'}>
                  {isRTL ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
                </Link>
              </div>
              <p className="text-white/80 font-body">
                {language === 'fa'
                  ? 'جزئیات کامل شیفت، قوانین و فرصت‌های مشابه این کارفرما را ببینید.'
                  : 'Review the full shift details, rules, and other opportunities from this employer.'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <span className="text-sm font-bold">{language === 'fa' ? 'وضعیت' : 'Status'}:</span>
              <span className="px-4 py-2 border-2 border-white rounded-full font-display text-white">
                {shift.status === 'open'
                  ? language === 'fa'
                    ? 'در دسترس'
                    : 'Open'
                  : language === 'fa'
                  ? 'ناموجود'
                  : 'Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-6 lg:grid-cols-[320px_1fr]" dir="ltr">
        <aside className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="rounded-[24px] border-2 border-moss bg-gradient-to-b from-moss to-moss/80 text-concrete shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)] p-6 space-y-4">
            <h2 className="text-lg font-display text-white">
              {language === 'fa' ? 'انتخاب شیفت' : 'Select a shift'}
            </h2>
            <div className="space-y-3">
              {shiftOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedShiftId(item.id)}
                  className={`w-full text-right rounded-2xl border-2 px-4 py-4 transition-all ${
                    selectedShiftId === item.id
                      ? 'border-safety bg-gradient-to-r from-safety to-amber-400 text-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                      : 'border-ink/20 dark:border-concrete/30 bg-white dark:bg-ink/20 hover:border-safety/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {selectedShiftId === item.id ? (
                      <CheckCircle2 className="w-5 h-5 text-white mt-0.5" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-ink/30 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className={`font-display text-sm ${selectedShiftId === item.id ? 'text-white' : 'text-ink dark:text-concrete'}`}>
                        {getPersianDateLabel(new Date(item.shift_date))}
                      </p>
                      <p className={`text-xs ${selectedShiftId === item.id ? 'text-white/80' : 'text-ink/70 dark:text-concrete/70'}`}>
                        {language === 'fa'
                          ? `${formatPersianTime(item.start_time)} تا ${formatPersianTime(item.end_time)}`
                          : `${item.start_time} – ${item.end_time}`}
                      </p>
                      <p className={`text-xs font-bold ${selectedShiftId === item.id ? 'text-white' : 'text-ink dark:text-concrete'}`}>
                        {language === 'fa' ? 'ساعت:' : 'Hour:'}{' '}
                        {language === 'fa'
                          ? formatPersianNumber(Math.floor(item.hourly_wage / 10))
                          : Math.floor(item.hourly_wage / 10).toLocaleString()}{' '}
                        {language === 'fa' ? 'تومان' : 'Toman'}
                      </p>
                      <p className={`text-xs ${selectedShiftId === item.id ? 'text-white/80' : 'text-ink/70 dark:text-concrete/70'}`}>
                        {language === 'fa' ? 'درآمد کل' : 'Total'}: {formatIncomeTomans(calculateTotalIncome(item))}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleContinue}
              className="w-full rounded-2xl bg-ink text-concrete dark:bg-concrete dark:text-ink font-display text-lg py-3 border-2 border-ink dark:border-concrete hover:bg-safety hover:text-ink dark:hover:bg-safety transition-all"
            >
              {language === 'fa' ? 'درخواست این شیفت' : 'Apply for this shift'}
            </button>
          </div>

          <div className={`${cardClasses} p-5 space-y-3`}>
            <p className="text-xs font-bold text-ink/70 dark:text-concrete/70">
              {language === 'fa'
                ? 'در صورت انتخاب، مراحل بعدی از طریق داشبورد اطلاع‌رسانی می‌شود.'
                : 'If selected, the next steps will appear in your dashboard.'}
            </p>
            <div className="rounded-xl border-2 border-dashed border-ink/30 dark:border-concrete/40 p-4 text-xs text-ink/60 dark:text-concrete/70">
              {language === 'fa'
                ? 'لغو بدون جریمه تا ۴۸ ساعت قبل از شروع شیفت امکان‌پذیر است.'
                : 'You may cancel without penalty up to 48 hours before the shift.'}
            </div>
          </div>
        </aside>

        <section className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className={`${cardClasses} overflow-hidden`}>
            <div className="w-full h-72 bg-ink/10 dark:bg-ink/40 flex items-center justify-center">
              {shift.image_url ? (
                <img src={shift.image_url} alt={shift.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-6xl">🏢</div>
              )}
            </div>
          </div>

          <div className={`${cardClasses} p-6 space-y-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2 text-right flex-1">
                <h2 className="text-2xl font-display text-ink dark:text-concrete">
                  {shift.business_name || 'کسب‌وکار'} • {getNeighborhood(shift.location)}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-moss font-bold">
                  <span>{getRole(shift)}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {distanceLabel}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(shift.business_rating)}
                {shift.business_rating && (
                  <span className="text-sm font-bold text-ink dark:text-concrete">
                    {parseFloat(shift.business_rating).toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-ink/80 dark:text-concrete/80 leading-relaxed">
              {shift.business_type === 'رستوران و پذیرایی'
                ? 'این رستوران با تمرکز بر تجربه مشتری، محیطی گرم و حرفه‌ای برای اعضای تیم فراهم می‌کند.'
                : shift.business_type === 'خرده‌فروشی'
                ? 'این فروشگاه با ارائه محصولات منتخب، به دنبال تیمی پویاست تا تجربه خرید متمایزی ایجاد کند.'
                : 'این کسب‌وکار با فرهنگ یادگیری و همکاری، فرصت رشد را برای کارکنان فراهم می‌سازد.'}
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: language === 'fa' ? 'تاریخ و ساعت' : 'Date & Time',
                  value:
                    language === 'fa'
                      ? `${getPersianDateLabel(new Date(shift.shift_date))} • ${formatPersianTime(shift.start_time)}-${formatPersianTime(shift.end_time)}`
                      : `${format(new Date(shift.shift_date), 'MMM dd')} • ${shift.start_time}-${shift.end_time}`,
                },
                {
                  label: language === 'fa' ? 'دستمزد ساعتی' : 'Hourly Rate',
                  value: language === 'fa'
                    ? `${formatPersianNumber(Math.floor(shift.hourly_wage / 10))} تومان`
                    : `${Math.floor(shift.hourly_wage / 10).toLocaleString()} Toman`,
                },
                {
                  label: language === 'fa' ? 'درآمد تخمینی' : 'Estimated Income',
                  value: formatIncomeTomans(calculateTotalIncome(shift)),
                },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border-2 border-ink/10 dark:border-concrete/30 bg-concrete/40 dark:bg-ink/20 p-4 text-sm">
                  <p className="text-ink/60 dark:text-concrete/70 font-bold mb-1">{item.label}</p>
                  <p className="font-display text-ink dark:text-concrete">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardClasses} p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display text-ink dark:text-concrete">
                {language === 'fa' ? 'توضیحات کار' : 'Job Description'}
              </h3>
              <span className="text-xs font-bold text-ink/50 dark:text-concrete/60">
                {language === 'fa' ? 'از کارفرما' : 'From employer'}
              </span>
            </div>
            <p className="text-sm leading-7 text-ink/90 dark:text-concrete/90 whitespace-pre-line">
              {displayDescription}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setExpandedDescription(!expandedDescription)}
                className="inline-flex items-center gap-2 text-xs font-bold text-ink dark:text-concrete underline"
              >
                {expandedDescription ? (language === 'fa' ? 'کم‌تر' : 'Show less') : language === 'fa' ? 'جزئیات بیشتر' : 'Show more'}
              </button>
            )}
          </div>

          <div className={`${cardClasses} p-6 space-y-4`}>
            <h3 className="text-xl font-display text-ink dark:text-concrete">
              {language === 'fa' ? 'قوانین و هماهنگی' : 'Rules & Coordination'}
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-ink/70 dark:text-concrete/70 mt-0.5" />
                <p className="text-ink/80 dark:text-concrete/80">
                  {language === 'fa'
                    ? 'در صورت تأیید، جزئیات نهایی از طریق پیامک و ایمیل ارسال خواهد شد.'
                    : 'If accepted, final details will be shared via SMS and email.'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-ink/70 dark:text-concrete/70 mt-0.5" />
                <p className="text-ink/80 dark:text-concrete/80">
                  {language === 'fa'
                    ? `لغو کمتر از ${formatPersianNumber(shift.cancellation_deadline_hours || 48)} ساعت مانده به شروع شیفت، ممکن است بر امتیاز شما تأثیر بگذارد.`
                    : `Cancelling within ${shift.cancellation_deadline_hours || 48} hours of the shift may impact your rating.`}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ink/70 dark:text-concrete/70 mt-0.5" />
                <p className="text-ink/80 dark:text-concrete/80">
                  {language === 'fa'
                    ? 'لطفاً حداقل ۱۵ دقیقه پیش از شروع شیفت در محل حاضر باشید.'
                    : 'Arrive at least 15 minutes before the shift starts.'}
                </p>
              </div>
            </div>
          </div>

          {shift.required_skills && shift.required_skills.length > 0 && (
            <div className={`${cardClasses} p-6 space-y-4`}>
              <h3 className="text-xl font-display text-ink dark:text-concrete">
                {language === 'fa' ? 'مهارت‌های مورد نیاز' : 'Required Skills'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {shift.required_skills.map((skill: string, idx: number) => (
                  <span key={idx} className="px-4 py-2 rounded-full border-2 border-ink/20 dark:border-concrete/40 text-xs font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dressCodeItems.length > 0 && (
            <div className={`${cardClasses} p-6 space-y-4`}>
              <h3 className="text-xl font-display text-ink dark:text-concrete">
                {language === 'fa' ? 'قوانین ظاهر و لباس' : 'Appearance & Dress Code'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {dressCodeItems.map((item: string, idx: number) => (
                  <span key={idx} className="px-4 py-2 rounded-full border-2 border-ink/20 dark:border-concrete/40 text-xs font-bold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

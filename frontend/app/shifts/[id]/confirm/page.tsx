'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, MapPin, Wallet, ArrowLeft, ArrowRight } from 'lucide-react';
import { shiftsAPI, applicationsAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPersianNumber, formatPersianTime, gregorianToJalali, toPersianNum } from '@/lib/persianUtils';

const fallbackRequirements = [
  'تجربه کار با دستگاه‌های قهوه‌ساز (حداقل ۶ ماه)',
  'مهارت خدمات مشتری و ارتباط مؤثر',
  'دسترسی در ساعات مشخص شده شیفت',
  'توانایی ایستادن و فعالیت طولانی‌مدت',
  'آشنایی با اصول بهداشت مواد غذایی',
];

const agreementItems = [
  {
    id: 'terms',
    link: '/terms',
    linkText: 'شرایط و ضوابط استفاده',
    textBefore: 'من ',
    textAfter: ' را مطالعه کرده‌ام و می‌پذیرم',
  },
  {
    id: 'privacy',
    link: '/privacy',
    linkText: 'سیاست حفظ حریم خصوصی',
    textBefore: 'من ',
    textAfter: ' را مطالعه کرده‌ام و با پردازش اطلاعات شخصی‌ام موافقم',
  },
];

export default function ShiftConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === 'fa';
  const backButtonClasses =
    'inline-flex items-center justify-center w-14 h-14 rounded-full border-[3px] border-white/80 text-white bg-transparent hover:bg-white/10 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]';
  const cardClasses =
    'rounded-[24px] border-2 border-ink dark:border-concrete bg-white dark:bg-concrete-dark shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]';
  const [shift, setShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requirementsState, setRequirementsState] = useState<Record<string, boolean>>({});
  const [agreementsState, setAgreementsState] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
    loadShift();
  }, []);

  const loadShift = async () => {
    try {
      const response = await shiftsAPI.getById(params.id as string);
      setShift(response.data.shift);
    } catch (error) {
      console.error('Error loading shift', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const requirementList = shift?.required_skills?.length ? shift.required_skills : fallbackRequirements;
    const reqState = requirementList.reduce((acc: Record<string, boolean>, item: string) => {
      acc[item] = false;
      return acc;
    }, {});
    setRequirementsState(reqState);

    const agreementState = agreementItems.reduce((acc: Record<string, boolean>, item) => {
      acc[item.id] = false;
      return acc;
    }, {});
    setAgreementsState(agreementState);
  }, [shift]);

  const allRequirementsChecked = useMemo(
    () => Object.values(requirementsState).length > 0 && Object.values(requirementsState).every(Boolean),
    [requirementsState],
  );

  const allAgreementsChecked = useMemo(
    () => Object.values(agreementsState).length > 0 && Object.values(agreementsState).every(Boolean),
    [agreementsState],
  );

  const formattedDate = useMemo(() => {
    if (!shift) return '';
    const shiftDate = new Date(shift.shift_date);
    const [jy, jm, jd] = gregorianToJalali(shiftDate.getFullYear(), shiftDate.getMonth() + 1, shiftDate.getDate());
    const persianWeekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    const persianMonths = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    return `${persianWeekDays[shiftDate.getDay()]}، ${toPersianNum(jd.toString())} ${persianMonths[jm]}`;
  }, [shift]);

  const totalIncome = useMemo(() => {
    if (!shift) return 0;
    const start = parseInt(shift.start_time.split(':')[0], 10);
    const end = parseInt(shift.end_time.split(':')[0], 10);
    const hours = end > start ? end - start : 24 - start + end;
    return (shift.hourly_wage / 10) * hours;
  }, [shift]);

  const handleRequirementToggle = (item: string) => {
    setRequirementsState((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleAgreementToggle = (id: string) => {
    setAgreementsState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async () => {
    if (!user || user.userType !== 'worker') {
      router.push('/login');
      return;
    }
    if (!shift) return;
    if (!allRequirementsChecked || !allAgreementsChecked) return;

    setSubmitting(true);
    try {
      await applicationsAPI.apply({ shiftId: shift.id, applicationText: '' });
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.message || 'در ارسال درخواست مشکلی پیش آمد.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-concrete dark:bg-ink flex items-center justify-center">
        <div className="text-center text-ink dark:text-concrete space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-4 border-ink/30 dark:border-concrete/40 border-t-ink dark:border-t-concrete animate-spin"></div>
          <p className="font-display text-lg">{language === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="min-h-screen bg-concrete dark:bg-ink flex items-center justify-center">
        <div className="text-center text-ink dark:text-concrete font-display">
          {language === 'fa' ? 'شیفت مورد نظر یافت نشد.' : 'Shift not found.'}
        </div>
      </div>
    );
  }

  const requirementList = shift.required_skills?.length ? shift.required_skills : fallbackRequirements;

  return (
    <div
      className="min-h-screen bg-concrete dark:bg-ink text-ink dark:text-concrete pt-28 pb-16"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-gradient-to-b from-ink to-moss text-concrete border-b-4 border-safety">
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
          <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                <h1 className="text-3xl font-display text-white">
                  {language === 'fa' ? 'تأیید درخواست شیفت' : 'Confirm Shift Request'}
                </h1>
                <Link
                  href={`/shifts/${shift.id}`}
                  className={backButtonClasses}
                  aria-label={language === 'fa' ? 'بازگشت به جزئیات شیفت' : 'Back to shift'}
                >
                  {isRTL ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
                </Link>
              </div>
              <p className="text-white/80 font-body">
                {language === 'fa'
                  ? `${shift.business_name || 'کسب‌وکار'} • ${shift.industry || 'صنعت خدماتی'}`
                  : `${shift.business_name || 'Business'} • ${shift.industry || 'Service industry'}`}
              </p>
            </div>
            <div className="text-white/80 font-display text-xl">
              {language === 'fa'
                ? `۱ شیفت • ${formatPersianTime(shift.start_time)} تا ${formatPersianTime(shift.end_time)}`
                : `1 shift • ${shift.start_time}–${shift.end_time}`}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className={`${cardClasses} p-6 sm:p-8 space-y-6`}>
          <div className="flex flex-wrap items-center gap-4 text-sm text-ink/70 dark:text-concrete/70">
            <span>{language === 'fa' ? 'نرخ ساعتی' : 'Hourly rate'}</span>
            <span className="text-2xl font-display text-ink dark:text-concrete">
              {language === 'fa'
                ? `${formatPersianNumber(Math.floor(shift.hourly_wage / 10).toLocaleString())} تومان`
                : `${Math.floor(shift.hourly_wage / 10).toLocaleString()} Toman`}
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl border-2 border-ink/10 dark:border-concrete/30 bg-concrete/40 dark:bg-ink/20 p-4">
              <div className="flex items-center gap-2 text-ink/60 dark:text-concrete/70 mb-2">
                <CalendarDays className="w-4 h-4" />
                {language === 'fa' ? 'زمان شیفت' : 'Shift time'}
              </div>
              <div className="font-semibold text-ink dark:text-concrete">
                {formattedDate} • {formatPersianTime(shift.start_time)} تا {formatPersianTime(shift.end_time)}
              </div>
            </div>
            <div className="rounded-2xl border-2 border-ink/10 dark:border-concrete/30 bg-concrete/40 dark:bg-ink/20 p-4">
              <div className="flex items-center gap-2 text-ink/60 dark:text-concrete/70 mb-2">
                <Clock3 className="w-4 h-4" />
                {language === 'fa' ? 'لغو بدون جریمه' : 'Free cancellation'}
              </div>
              <div className="font-semibold text-ink dark:text-concrete">
                {language === 'fa'
                  ? `${shift.cancellation_deadline_hours || 48} ساعت پیش از شروع`
                  : `${shift.cancellation_deadline_hours || 48}h before start`}
              </div>
            </div>
            <div className="rounded-2xl border-2 border-ink/10 dark:border-concrete/30 bg-concrete/40 dark:bg-ink/20 p-4">
              <div className="flex items-center gap-2 text-ink/60 dark:text-concrete/70 mb-2">
                <Wallet className="w-4 h-4" />
                {language === 'fa' ? 'درآمد کل' : 'Total income'}
              </div>
              <div className="font-semibold text-ink dark:text-concrete">
                {language === 'fa'
                  ? `${formatPersianNumber(totalIncome.toLocaleString())} تومان`
                  : `${totalIncome.toLocaleString()} Toman`}
              </div>
            </div>
          </div>
        </div>

        <section className={`${cardClasses} p-6 sm:p-8 space-y-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display text-ink dark:text-concrete">
                {language === 'fa' ? 'شرایط و مهارت‌ها' : 'Requirements & skills'}
              </h2>
              <p className="text-sm text-ink/70 dark:text-concrete/70">
                {language === 'fa' ? 'لطفاً تأیید کنید که تمام موارد زیر را دارید.' : 'Confirm you meet all of the following.'}
              </p>
            </div>
            <CheckCircle2 className={`w-6 h-6 ${allRequirementsChecked ? 'text-moss' : 'text-ink/30 dark:text-concrete/40'}`} />
          </div>
          <div className="space-y-4">
            {requirementList.map((item) => (
              <label
                key={item}
                className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition ${
                  requirementsState[item] ? 'border-moss bg-moss/10' : 'border-ink/15 dark:border-concrete/30 bg-white dark:bg-ink/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={requirementsState[item] || false}
                  onChange={() => handleRequirementToggle(item)}
                  className="w-5 h-5 rounded border-ink/30 text-moss focus:ring-moss"
                />
                <span className="text-sm text-ink/80 dark:text-concrete/80">{item}</span>
              </label>
            ))}
          </div>
          {!allRequirementsChecked && (
            <div className="flex items-center gap-2 text-xs text-safety border-2 border-safety/40 bg-safety/10 rounded-2xl px-4 py-3">
              <AlertCircle className="w-4 h-4" />
              {language === 'fa' ? 'لطفاً تمام موارد بالا را تأیید کنید تا بتوانید ادامه دهید.' : 'Please confirm all requirements to continue.'}
            </div>
          )}
        </section>

        <section className={`${cardClasses} p-6 sm:p-8 space-y-6`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display text-ink dark:text-concrete">
              {language === 'fa' ? 'قوانین و مقررات' : 'Agreements'}
            </h2>
            <MapPin className="w-5 h-5 text-ink/60 dark:text-concrete/70" />
          </div>
          <div className="space-y-4">
            {agreementItems.map((item) => (
              <label
                key={item.id}
                className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition ${
                  agreementsState[item.id] ? 'border-moss bg-moss/10' : 'border-ink/15 dark:border-concrete/30 bg-white dark:bg-ink/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={agreementsState[item.id] || false}
                  onChange={() => handleAgreementToggle(item.id)}
                  className="w-5 h-5 rounded border-ink/30 text-moss focus:ring-moss"
                />
                <span className="text-sm text-ink/80 dark:text-concrete/80">
                  {item.textBefore}
                  <Link href={item.link} className="text-ink font-semibold underline decoration-dotted" target="_blank">
                    {item.linkText}
                  </Link>
                  {item.textAfter}
                </span>
              </label>
            ))}
          </div>
          {!allAgreementsChecked && (
            <div className="flex items-start gap-3 text-xs text-safety border-2 border-safety/40 bg-safety/10 rounded-2xl px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <p>{language === 'fa' ? 'برای ثبت درخواست، نیاز است با سیاست‌ها موافقت کنید.' : 'You must agree to the policies before applying.'}</p>
            </div>
          )}
          <div className="flex items-start gap-3 text-xs text-white bg-ink rounded-2xl px-4 py-3 border-2 border-ink dark:bg-concrete dark:text-ink dark:border-concrete">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <p>
              {language === 'fa'
                ? `با ثبت درخواست، متعهد می‌شوید در زمان مشخص شده حاضر شوید. لغو کمتر از ${shift.cancellation_deadline_hours || 48} ساعت پیش از شروع، ممکن است امتیاز شما را کاهش دهد.`
                : `Submitting a request means you commit to show up. Cancelling within ${shift.cancellation_deadline_hours || 48} hours may reduce your score.`}
            </p>
          </div>
        </section>

        <div className={`${cardClasses} p-6 sm:p-8 space-y-4 text-center`}>
          <p className="text-sm text-ink/70 dark:text-concrete/70">
            {language === 'fa'
              ? 'پس از تأیید همه موارد، با دکمه زیر درخواست شما ثبت می‌شود.'
              : 'Once everything is confirmed, submit your shift request below.'}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!allRequirementsChecked || !allAgreementsChecked || submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-2xl font-display text-lg text-concrete bg-ink border-2 border-ink hover:bg-safety hover:text-ink transition disabled:opacity-40 dark:bg-concrete dark:text-ink dark:border-concrete"
          >
            {submitting
              ? language === 'fa'
                ? 'در حال ارسال...'
                : 'Submitting...'
              : language === 'fa'
              ? 'ثبت درخواست شیفت'
              : 'Submit shift request'}
          </button>
        </div>
      </div>
    </div>
  );
}



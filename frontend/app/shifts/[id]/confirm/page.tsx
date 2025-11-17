'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, MapPin, Wallet } from 'lucide-react';
import { shiftsAPI, applicationsAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
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
      <div className="min-h-screen flex items-center justify-center bg-[#f5f3ff]">
        <div className="text-center text-[#6b41e0]">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f3ff]">
        <div className="text-center text-neutral-600">شیفت مورد نظر یافت نشد.</div>
      </div>
    );
  }

  const requirementList = shift.required_skills?.length ? shift.required_skills : fallbackRequirements;

  return (
    <div dir="rtl" className="min-h-screen bg-[#4c1fdc] pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-12 text-white space-y-2">
          <p className="text-sm text-white/80">{shift.business_name || 'کسب‌وکار'} • {shift.industry || 'صنعت خدماتی'}</p>
          <h1 className="text-3xl sm:text-4xl font-black">شما در حال درخواست برای ۱ شیفت هستید</h1>
        </header>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-[#ecebff]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-neutral-500 text-sm">نرخ ساعتی</div>
                <div className="text-2xl font-black text-[#6b41e0]">
                  {formatPersianNumber(Math.floor(shift.hourly_wage / 10).toLocaleString())} تومان
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-[#f8f6ff] p-4 border border-[#ece8ff]">
                  <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                    <CalendarDays className="w-4 h-4 text-[#6b41e0]" />
                    زمان شیفت
                  </div>
                  <div className="font-semibold text-neutral-900">
                    {formattedDate} • {formatPersianTime(shift.start_time)} تا {formatPersianTime(shift.end_time)}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#f8f6ff] p-4 border border-[#ece8ff]">
                  <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                    <Clock3 className="w-4 h-4 text-[#6b41e0]" />
                    لغو شیفت
                  </div>
                  <div className="font-semibold text-neutral-900">
                    {shift.cancellation_deadline_hours || 48} ساعت قبل از شروع
                  </div>
                </div>
                <div className="rounded-2xl bg-[#f8f6ff] p-4 border border-[#ece8ff]">
                  <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                    <Wallet className="w-4 h-4 text-[#6b41e0]" />
                    درآمد کل
                  </div>
                  <div className="font-semibold text-neutral-900">{formatPersianNumber(totalIncome.toLocaleString())} تومان</div>
                </div>
              </div>
            </div>
          </div>

          <section className="bg-white rounded-3xl shadow-xl border border-[#ecebff] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">شرایط و مهارت‌های مورد نیاز</h2>
                <p className="text-sm text-neutral-500">لطفاً تأیید کنید که تمام موارد زیر را دارید.</p>
              </div>
              <CheckCircle2 className={`w-6 h-6 ${allRequirementsChecked ? 'text-[#4caf50]' : 'text-neutral-300'}`} />
            </div>

            <div className="space-y-4">
              {requirementList.map((item) => (
                <label
                  key={item}
                  className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition ${
                    requirementsState[item] ? 'border-[#6b41e0] bg-[#f7f4ff]' : 'border-[#e5e5f5] bg-[#fbfbff]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={requirementsState[item] || false}
                    onChange={() => handleRequirementToggle(item)}
                    className="w-5 h-5 rounded border-[#d4d1ff] text-[#6b41e0] focus:ring-[#6b41e0]"
                  />
                  <span className="text-sm text-neutral-700">{item}</span>
                </label>
              ))}
            </div>

            {!allRequirementsChecked && (
              <div className="flex items-center gap-2 text-sm text-[#c67b1f] bg-[#fff6e4] border border-[#ffd9a4] rounded-2xl px-4 py-3">
                <AlertCircle className="w-4 h-4" />
                لطفاً تمام موارد بالا را تأیید کنید تا بتوانید ادامه دهید.
              </div>
            )}
          </section>

          <section className="bg-white rounded-3xl shadow-xl border border-[#ecebff] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900">قوانین و مقررات</h2>
              <MapPin className="w-5 h-5 text-[#6b41e0]" />
            </div>
            <div className="space-y-4">
              {agreementItems.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition ${
                    agreementsState[item.id] ? 'border-[#6b41e0] bg-[#f7f4ff]' : 'border-[#e5e5f5] bg-[#fbfbff]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={agreementsState[item.id] || false}
                    onChange={() => handleAgreementToggle(item.id)}
                    className="w-5 h-5 rounded border-[#d4d1ff] text-[#6b41e0] focus:ring-[#6b41e0]"
                  />
                  <span className="text-sm text-neutral-700">
                    {item.textBefore}
                    <Link href={item.link} className="text-[#6b41e0] font-semibold hover:text-[#4d27b6]" target="_blank">
                      {item.linkText}
                    </Link>
                    {item.textAfter}
                  </span>
                </label>
              ))}
            </div>

            {!allAgreementsChecked && (
              <div className="flex items-start gap-3 text-xs text-[#c67b1f] bg-[#fff6e4] border border-[#ffd9a4] rounded-2xl px-4 py-3">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <p>برای ثبت درخواست، لازم است با شرایط و سیاست‌های کارجو موافقت کنید.</p>
              </div>
            )}

            <div className="flex items-start gap-3 text-xs text-white bg-[#6b41e0] rounded-2xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-white mt-0.5" />
              <p>
                با ثبت درخواست، شما متعهد می‌شوید که در زمان مشخص شده حاضر شوید. در صورت لغو شیفت کمتر از{' '}
                {shift.cancellation_deadline_hours || 48} ساعت قبل از شروع، ممکن است امتیاز شما کاهش یابد.
              </p>
            </div>
          </section>

          <div className="bg-white rounded-3xl shadow-xl border border-[#ecebff] p-6 sm:p-8 space-y-4 text-center">
            <p className="text-sm text-neutral-500">
              لطفاً تمام موارد را تأیید کنید. با کلیک روی دکمه زیر، درخواست شما برای این شیفت ثبت می‌شود.
            </p>
            <button
              onClick={handleSubmit}
              disabled={!allRequirementsChecked || !allAgreementsChecked || submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold text-white bg-[#6b41e0] shadow-lg hover:bg-[#5b35c7] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'در حال ارسال درخواست...' : 'ثبت درخواست شیفت'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



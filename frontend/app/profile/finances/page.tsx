'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dashboardAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  formatPersianCurrencyTomans,
  formatPersianNumber,
  gregorianToJalali,
  toPersianNum,
} from '@/lib/persianUtils';
import { ArrowRight, Download, TrendingUp, Wallet, PiggyBank, CalendarRange, Info } from 'lucide-react';

type ChartPoint = {
  label: string;
  value: number;
};

type Transaction = {
  id: string;
  title: string;
  business: string;
  date: Date;
  hours: number;
  amount: number;
  status: 'paid' | 'pending';
};

const MONTH_LABELS_FA = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const WEEK_LABELS_FA = ['هفته ۱', 'هفته ۲', 'هفته ۳', 'هفته ۴'];

const MONTH_LABELS_EN = ['Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar', 'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'];
const WEEK_LABELS_EN = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

const toTomans = (rialValue: number | string | null | undefined) => {
  if (!rialValue) return 0;
  const num = typeof rialValue === 'string' ? parseFloat(rialValue) : rialValue;
  if (Number.isNaN(num)) return 0;
  return Math.floor(num / 10);
};

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}`;

export default function WorkerFinancesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState<'monthly' | 'weekly'>('monthly');

  useEffect(() => {
    const current = getUser();
    if (!current) {
      router.push('/login');
      return;
    }
    if (current.userType !== 'worker') {
      router.push('/dashboard');
      return;
    }
    setUser(current);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getWorkerDashboard();
      setDashboardData(response.data || {});
    } catch (error) {
      console.error('Failed to load finances data:', error);
      setDashboardData({});
    } finally {
      setLoading(false);
    }
  };

  const safeData = dashboardData || {};
  const completedShifts: any[] = safeData.completedShifts || [];
  const incomeStats = safeData.incomeStats || {};

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyIncome = useMemo(() => {
    return completedShifts.reduce((sum, shift) => {
      if (!shift.shift_date) return sum;
      const date = new Date(shift.shift_date);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        if (shift.worker_payment) {
          return sum + toTomans(shift.worker_payment);
        }
        const hourly = toTomans(shift.hourly_wage || 0);
        const start = parseInt((shift.start_time || '00:00').split(':')[0], 10);
        const end = parseInt((shift.end_time || '00:00').split(':')[0], 10);
        const hours = end > start ? end - start : (24 - start) + end;
        return sum + hours * hourly;
      }
      return sum;
    }, 0);
  }, [completedShifts, currentMonth, currentYear]);

  const lastMonthIncome = useMemo(() => {
    const previousMonth = new Date(currentYear, currentMonth - 1, 1);
    const prevMonthIndex = previousMonth.getMonth();
    const prevYear = previousMonth.getFullYear();

    return completedShifts.reduce((sum, shift) => {
      if (!shift.shift_date) return sum;
      const date = new Date(shift.shift_date);
      if (date.getMonth() === prevMonthIndex && date.getFullYear() === prevYear) {
        if (shift.worker_payment) {
          return sum + toTomans(shift.worker_payment);
        }
        const hourly = toTomans(shift.hourly_wage || 0);
        const start = parseInt((shift.start_time || '00:00').split(':')[0], 10);
        const end = parseInt((shift.end_time || '00:00').split(':')[0], 10);
        const hours = end > start ? end - start : (24 - start) + end;
        return sum + hours * hourly;
      }
      return sum;
    }, 0);
  }, [completedShifts, currentMonth, currentYear]);

  const monthlyGrowth = (() => {
    if (lastMonthIncome === 0) return monthlyIncome > 0 ? 100 : 0;
    return ((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100;
  })();

  const totalIncome = toTomans(incomeStats.total_earnings || completedShifts.reduce((sum, shift) => {
    if (shift.worker_payment) return sum + shift.worker_payment;
    const hourly = shift.hourly_wage || 0;
    const start = parseInt((shift.start_time || '00:00').split(':')[0], 10);
    const end = parseInt((shift.end_time || '00:00').split(':')[0], 10);
    const hours = end > start ? end - start : (24 - start) + end;
    return sum + hours * hourly;
  }, 0));

  const pendingPayout = toTomans(
    incomeStats.pending_payout ||
      incomeStats.pending_payout_rials ||
      incomeStats.pendingPayout ||
      incomeStats.pending ||
      Math.max(monthlyIncome - (incomeStats.paid_this_month || 0), 0),
  );

  const chartDataMonthly: ChartPoint[] = useMemo(() => {
    const totals = new Map<string, number>();

    completedShifts.forEach((shift) => {
      if (!shift.shift_date) return;
      const date = new Date(shift.shift_date);
      const key = monthKey(date);
      const value = shift.worker_payment ? toTomans(shift.worker_payment) : toTomans(shift.hourly_wage || 0);
      const start = parseInt((shift.start_time || '00:00').split(':')[0], 10);
      const end = parseInt((shift.end_time || '00:00').split(':')[0], 10);
      const hours = end > start ? end - start : (24 - start) + end;
      const total = shift.worker_payment ? value : value * hours;
      totals.set(key, (totals.get(key) || 0) + total);
    });

    const points: ChartPoint[] = [];
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const key = monthKey(date);
      const [jy, jm] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, 1);
      const label = language === 'fa' ? MONTH_LABELS_FA[jm - 1] : MONTH_LABELS_EN[jm - 1];
      points.push({
        label,
        value: totals.get(key) || 0,
      });
    }
    return points;
  }, [completedShifts, currentMonth, currentYear, language]);

  const chartDataWeekly: ChartPoint[] = useMemo(() => {
    const totals = [0, 0, 0, 0];
    completedShifts.forEach((shift) => {
      if (!shift.shift_date) return;
      const date = new Date(shift.shift_date);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        const weekIndex = Math.min(Math.floor((date.getDate() - 1) / 7), 3);
        const value = shift.worker_payment ? toTomans(shift.worker_payment) : toTomans(shift.hourly_wage || 0);
        const start = parseInt((shift.start_time || '00:00').split(':')[0], 10);
        const end = parseInt((shift.end_time || '00:00').split(':')[0], 10);
        const hours = end > start ? end - start : (24 - start) + end;
        totals[weekIndex] += shift.worker_payment ? value : value * hours;
      }
    });

    return totals.map((value, index) => ({
      label: language === 'fa' ? WEEK_LABELS_FA[index] : WEEK_LABELS_EN[index],
      value,
    }));
  }, [completedShifts, currentMonth, currentYear, language]);

  const chartData = chartView === 'monthly' ? chartDataMonthly : chartDataWeekly;

  const maxChartValue = Math.max(...chartData.map((point) => point.value), 1);

  const chartPoints = chartData.map((point, index) => {
    const denominator = chartData.length > 1 ? chartData.length - 1 : 1;
    const x = (600 / denominator) * index;
    const y = 260 - (point.value / maxChartValue) * 220;
    return { ...point, x, y };
  });

  const areaPath = chartPoints.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${path} L ${point.x} ${point.y}`;
  }, '');

  const areaPathWithBase =
    chartPoints.length > 0
      ? `${areaPath} L ${chartPoints[chartPoints.length - 1].x} 260 L ${chartPoints[0].x} 260 Z`
      : '';

  const transactions: Transaction[] = useMemo(() => {
    const items = completedShifts
      .filter((shift) => shift.shift_date)
      .map((shift) => {
        const date = new Date(shift.shift_date);
        const hours = shift.start_time && shift.end_time
          ? (() => {
              const start = parseInt(shift.start_time.split(':')[0], 10);
              const end = parseInt(shift.end_time.split(':')[0], 10);
              return end > start ? end - start : (24 - start) + end;
            })()
          : 0;
        const amount = shift.worker_payment
          ? toTomans(shift.worker_payment)
          : (() => {
              const hourly = toTomans(shift.hourly_wage || 0);
              return hourly * hours;
            })();

        const status: Transaction['status'] =
          shift.payment_status === 'paid' || shift.worker_payment_status === 'paid' || shift.paid_at
            ? 'paid'
            : 'pending';

        return {
          id: String(shift.id || shift.shift_id || Math.random()),
          title: shift.role || shift.title || 'شیفت',
          business: shift.business_name || 'کارفرما',
          date,
          hours,
          amount,
          status,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 6);

    return items;
  }, [completedShifts, language]);

  const formatAmount = (value: number) => {
    if (language === 'fa') {
      return formatPersianCurrencyTomans(value);
    }
    return `${value.toLocaleString('en-US')} Toman`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          <p className="text-primary-700 mt-4">
            {language === 'fa' ? 'در حال بارگذاری اطلاعات مالی...' : 'Loading financial data...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-[#f9f9f9] text-neutral-900"
      dir={language === 'fa' ? 'rtl' : 'ltr'}
    >
      <div className="bg-gradient-to-b from-[#5b21b6] to-[#1a25a2] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 p-2 hover:bg-white/20 transition"
                aria-label={language === 'fa' ? 'بازگشت' : 'Back'}
              >
                <ArrowRight className={`w-5 h-5 ${language === 'fa' ? '' : 'rotate-180'}`} />
              </button>
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'fa' ? 'امور مالی من' : 'My Finances'}
                </h1>
                <p className="text-white/80">
                  {language === 'fa'
                    ? 'وضعیت درآمد و پرداخت‌های خود را در یک نگاه مشاهده کنید'
                    : 'Track your income, payouts and financial performance at a glance'}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm">
              <CalendarRange className="w-4 h-4" />
              <span>
                {language === 'fa' ? 'این ماه' : 'This month'}
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <MetricCard
              icon={<Wallet className="w-6 h-6" />}
              title={language === 'fa' ? 'در انتظار پرداخت' : 'Pending payout'}
              helper={language === 'fa' ? 'پرداخت بعدی آخر ماه واریز می‌شود' : 'Next payout scheduled for end of month'}
              value={formatAmount(pendingPayout)}
              accent="from-white/20 to-white/10"
            />
            <MetricCard
              icon={<TrendingUp className="w-6 h-6" />}
              title={language === 'fa' ? 'درآمد این ماه' : 'Monthly income'}
              helper={
                language === 'fa'
                  ? `تغییر نسبت به ماه گذشته ${toPersianNum(monthlyGrowth.toFixed(1))}%`
                  : `Change vs last month ${monthlyGrowth.toFixed(1)}%`
              }
              value={formatAmount(monthlyIncome)}
              accent="from-[#00D4AA] to-[#00D4AA]/60"
              chipLabel={
                monthlyGrowth >= 0
                  ? language === 'fa'
                    ? 'رشد مثبت'
                    : 'Positive growth'
                  : language === 'fa'
                  ? 'رشد منفی'
                  : 'Negative growth'
              }
              chipTone={monthlyGrowth >= 0 ? 'positive' : 'negative'}
            />
            <MetricCard
              icon={<PiggyBank className="w-6 h-6" />}
              title={language === 'fa' ? 'کل درآمد' : 'Total earnings'}
              helper={language === 'fa' ? 'مجموع درآمد تأیید شده شما' : 'All confirmed earnings to date'}
              value={formatAmount(totalIncome)}
              accent="from-white/20 to-white/10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <section className="bg-white rounded-[20px] shadow-[0px_10px_30px_-20px_rgba(26,37,162,0.35)] border border-gray-100 overflow-hidden">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold">
                {language === 'fa' ? 'نمودار درآمد' : 'Income chart'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'نمای کلی از درآمد شما در بازه‌های زمانی مختلف'
                  : 'Overview of your earnings across different time ranges'}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <button
                type="button"
                onClick={() => setChartView('monthly')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                  chartView === 'monthly'
                    ? 'bg-white shadow text-[#1a25a2]'
                    : 'text-gray-600'
                }`}
              >
                {language === 'fa' ? 'ماهانه' : 'Monthly'}
              </button>
              <button
                type="button"
                onClick={() => setChartView('weekly')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                  chartView === 'weekly'
                    ? 'bg-white shadow text-[#1a25a2]'
                    : 'text-gray-600'
                }`}
              >
                {language === 'fa' ? 'هفتگی' : 'Weekly'}
              </button>
            </div>
          </div>

          <div className="px-6 pt-8 pb-6">
            <div className="relative h-72 bg-gradient-to-b from-[#f8f8ff] to-white rounded-[16px] border border-gray-100 overflow-hidden">
              <svg viewBox="0 0 600 280" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5b21b6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#5b21b6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <g stroke="#E5E7EB" strokeDasharray="6 8">
                  <line x1="0" y1="240" x2="600" y2="240" />
                  <line x1="0" y1="180" x2="600" y2="180" />
                  <line x1="0" y1="120" x2="600" y2="120" />
                  <line x1="0" y1="60" x2="600" y2="60" />
                </g>
                {areaPathWithBase && (
                  <path
                    d={areaPathWithBase}
                    fill="url(#chartGradient)"
                    stroke="#5b21b6"
                    strokeWidth={3}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}
                {chartPoints.map((point) => (
                  <g key={point.label}>
                    <circle cx={point.x} cy={point.y} r={5} fill="#1a25a2" stroke="white" strokeWidth={2} />
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-between text-xs text-gray-500">
                {chartData.map((point) => (
                  <span key={point.label}>
                    {language === 'fa' ? toPersianNum(point.label) : point.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[20px] shadow-[0px_10px_30px_-20px_rgba(26,37,162,0.25)] border border-gray-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold">
                {language === 'fa' ? 'تراکنش‌های اخیر' : 'Recent transactions'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'گزارش پرداخت‌های اخیر شما در پلتفرم'
                  : 'Track the most recent payouts from your shifts'}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[12px] border border-[#1a25a2] px-4 py-2 text-sm font-medium text-[#1a25a2] hover:bg-[#1a25a2]/5 transition"
            >
              <Download className="w-4 h-4" />
              {language === 'fa' ? 'دانلود PDF' : 'Download PDF'}
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-gray-500">
                {language === 'fa'
                  ? 'هنوز تراکنشی انجام نشده است.'
                  : 'No transactions recorded yet.'}
              </div>
            ) : (
              transactions.map((tx) => {
                const [jy, jm, jd] = gregorianToJalali(
                  tx.date.getFullYear(),
                  tx.date.getMonth() + 1,
                  tx.date.getDate(),
                );
                const dateLabel =
                  language === 'fa'
                    ? `${toPersianNum(jd)} ${MONTH_LABELS_FA[jm - 1]} ${toPersianNum(jy)}`
                    : tx.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });

                return (
                  <div
                    key={tx.id}
                    className="px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-[#f3f4ff] text-[#1a25a2] flex items-center justify-center text-xl">
                        💼
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-gray-900">
                            {language === 'fa' ? toPersianNum(tx.title) : tx.title}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              tx.status === 'paid'
                                ? 'bg-[#00d4aa]/10 text-[#0f766e]'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {tx.status === 'paid'
                              ? language === 'fa'
                                ? 'پرداخت شده'
                                : 'Paid'
                              : language === 'fa'
                              ? 'در انتظار پرداخت'
                              : 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {language === 'fa'
                            ? `${tx.business} • ${toPersianNum(tx.hours)} ساعت`
                            : `${tx.business} • ${tx.hours} hrs`}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="font-semibold text-sm text-[#1a25a2]">
                        {language === 'fa'
                          ? formatPersianCurrencyTomans(tx.amount)
                          : `${tx.amount.toLocaleString('en-US')} Toman`}
                      </p>
                      <span className="text-xs text-gray-400">{dateLabel}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="bg-white rounded-[20px] shadow-[0px_10px_30px_-20px_rgba(26,37,162,0.2)] border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-3">
              {language === 'fa' ? 'جزئیات پرداخت' : 'Payout details'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {language === 'fa'
                ? 'خلاصه‌ای از پرداخت‌های آینده و گذشته شما'
                : 'Summary of your upcoming and previous payouts'}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryItem
                label={language === 'fa' ? 'پرداخت بعدی' : 'Next payout'}
                value={formatAmount(pendingPayout)}
                helper={language === 'fa' ? 'آخرین روز ماه' : 'End of this month'}
              />
              <SummaryItem
                label={language === 'fa' ? 'پرداخت‌های انجام شده' : 'Paid this month'}
                value={formatAmount(toTomans(incomeStats.paid_this_month || 0))}
                helper={language === 'fa' ? 'کل پرداخت‌های واریز شده' : 'Total deposits this month'}
              />
              <SummaryItem
                label={language === 'fa' ? 'میانگین درآمد شیفت' : 'Average shift income'}
                value={formatAmount(
                  transactions.length
                    ? Math.round(
                        transactions.reduce((sum, tx) => sum + tx.amount, 0) /
                          transactions.length,
                      )
                    : 0,
                )}
                helper={language === 'fa' ? 'بر اساس ۶ تراکنش اخیر' : 'Based on last 6 payouts'}
              />
              <SummaryItem
                label={language === 'fa' ? 'ساعات کار این ماه' : 'Hours this month'}
                value={
                  language === 'fa'
                    ? `${toPersianNum(
                        completedShifts
                          .filter((shift) => {
                            if (!shift.shift_date) return false;
                            const date = new Date(shift.shift_date);
                            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                          })
                          .reduce((sum, shift) => {
                            const start = parseInt((shift.start_time || '00:00').split(':')[0], 10);
                            const end = parseInt((shift.end_time || '00:00').split(':')[0], 10);
                            return sum + (end > start ? end - start : (24 - start) + end);
                          }, 0),
                      )} ساعت`
                    : `${completedShifts
                        .filter((shift) => {
                          if (!shift.shift_date) return false;
                          const date = new Date(shift.shift_date);
                          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                        })
                        .reduce((sum, shift) => {
                          const start = parseInt((shift.start_time || '00:00').split(':')[0], 10);
                          const end = parseInt((shift.end_time || '00:00').split(':')[0], 10);
                          return sum + (end > start ? end - start : (24 - start) + end);
                        }, 0)} hrs`
                }
                helper={language === 'fa' ? 'ساعات کار تایید شده' : 'Confirmed working hours'}
              />
            </div>
          </div>

          <aside className="bg-white rounded-[20px] shadow-[0px_10px_30px_-20px_rgba(26,37,162,0.2)] border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#f3f4ff] text-[#1a25a2] flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">
                  {language === 'fa' ? 'راهنمای پرداخت' : 'Payment guide'}
                </h4>
                <p className="text-xs text-gray-500">
                  {language === 'fa'
                    ? 'پرداخت‌ها به صورت ماهانه و پس از تأیید شیفت‌ها انجام می‌شود.'
                    : 'Payouts are processed monthly after all shifts are verified.'}
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-xs leading-5 text-gray-600">
              <li>
                {language === 'fa'
                  ? 'درآمدهای تایید شده تا تاریخ ۲۹ هر ماه، در تاریخ ۳۰ همان ماه به حساب شما واریز می‌شود.'
                  : 'Confirmed earnings up to the 29th of each month are deposited into your account on the 30th.'}
              </li>
              <li>
                {language === 'fa'
                  ? 'برای تسریع در پرداخت، مطمئن شوید اطلاعات بانکی شما در بخش اطلاعات شخصی کامل است.'
                  : 'Make sure your bank information is complete in the personal info section to avoid payout delays.'}
              </li>
              <li>
                {language === 'fa'
                  ? 'در صورت وجود هرگونه مغایرت در مبلغ پرداختی، با پشتیبانی تماس بگیرید.'
                  : 'If you notice discrepancies in payout amounts, please contact support.'}
              </li>
            </ul>
            <Link
              href="/profile/edit#personal-info"
              className="inline-flex items-center justify-center rounded-[12px] bg-[#1a25a2] px-4 py-2 text-sm font-medium text-white hover:bg-[#161c85] transition"
            >
              {language === 'fa' ? 'ویرایش اطلاعات بانکی' : 'Update bank information'}
            </Link>
          </aside>
        </section>
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: React.ReactNode;
  title: string;
  helper: string;
  value: string;
  accent: string;
  chipLabel?: string;
  chipTone?: 'positive' | 'negative';
};

function MetricCard({ icon, title, helper, value, accent, chipLabel, chipTone }: MetricCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-[18px] border border-white/20 bg-gradient-to-br ${accent} p-6`}>
      <div className="absolute inset-0 bg-white/5" />
      <div className="relative space-y-4">
        <div className="inline-flex items-center justify-center rounded-full bg-white/10 p-3 text-white">
          {icon}
        </div>
        <div>
          <p className="text-sm text-white/70">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <p className="text-xs text-white/70">
          {helper}
        </p>
        {chipLabel && (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              chipTone === 'positive'
                ? 'bg-[#00d4aa]/20 text-white'
                : 'bg-red-500/20 text-white'
            }`}
          >
            {chipLabel}
          </span>
        )}
      </div>
    </div>
  );
}

type SummaryItemProps = {
  label: string;
  value: string;
  helper: string;
};

function SummaryItem({ label, value, helper }: SummaryItemProps) {
  return (
    <div className="rounded-[16px] border border-gray-100 bg-gray-50/60 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-[#1a25a2]">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{helper}</p>
    </div>
  );
}


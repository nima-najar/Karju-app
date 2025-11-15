'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dashboardAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPersianDate, formatPersianCurrency, formatPersianCurrencyTomans, formatPersianNumber, gregorianToJalali, toPersianNum, formatPersianTime } from '@/lib/persianUtils';
import { format } from 'date-fns';
import { Briefcase, Clock, Coins, Calendar, Info, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadDashboard(currentUser);
  }, []);

  const loadDashboard = async (currentUser: any) => {
    try {
      setLoading(true);
      const api = currentUser?.userType === 'worker' ? dashboardAPI.getWorkerDashboard : dashboardAPI.getBusinessDashboard;
      const response = await api();
      console.log('Dashboard response:', response.data);
      setDashboardData(response.data || {});
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Set empty data to prevent infinite loading
      setDashboardData({});
    } finally {
      setLoading(false);
    }
  };

  // Use empty object as fallback
  const safeDashboardData = dashboardData || {};

  // Group shifts by date (hooks must be before any conditional returns)
  const groupedUpcomingShifts = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    const shifts = safeDashboardData?.upcomingShifts || [];
    shifts.forEach((shift: any) => {
      if (shift.shift_date) {
        const dateKey = typeof shift.shift_date === 'string' 
          ? shift.shift_date.split('T')[0] 
          : new Date(shift.shift_date).toISOString().split('T')[0];
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(shift);
      }
    });
    return groups;
  }, [safeDashboardData]);

  const groupedPendingShifts = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    const apps = safeDashboardData?.pendingApplications || [];
    apps.forEach((app: any) => {
      if (app.shift_date) {
        const dateKey = typeof app.shift_date === 'string' 
          ? app.shift_date.split('T')[0] 
          : new Date(app.shift_date).toISOString().split('T')[0];
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(app);
      }
    });
    return groups;
  }, [safeDashboardData]);

  // Calculate monthly income (this month)
  const monthlyIncome = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Sum up earnings from completed shifts this month
    const completedShifts = safeDashboardData?.completedShifts || [];
    let total = 0;
    
    completedShifts.forEach((shift: any) => {
      const shiftDate = new Date(shift.shift_date);
      if (shiftDate.getMonth() === currentMonth && shiftDate.getFullYear() === currentYear) {
        // Use worker_payment if available (in rials), convert to tomans
        if (shift.worker_payment) {
          total += shift.worker_payment / 10;
        } else {
          // Fallback to calculation
          const start = parseInt((shift.start_time || '00:00').split(':')[0]);
          const end = parseInt((shift.end_time || '00:00').split(':')[0]);
          const hours = end > start ? end - start : (24 - start) + end;
          const hourlyWageTomans = (shift.hourly_wage || 0) / 10;
          total += hours * hourlyWageTomans;
        }
      }
    });
    
    return total;
  }, [safeDashboardData]);

  // Helper functions (must be defined before any conditional returns)
  const getRole = (shift: any) => {
    const titleLower = (shift.title || '').toLowerCase();
    const descLower = (shift.description || '').toLowerCase();
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
      return 'کارمند';
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
      return 'Employee';
    }
  };

  const getNeighborhood = (location: string) => {
    if (!location) return '';
    let neighborhood = location
      .replace(/^خیابان\s+/, '')
      .replace(/^بلوار\s+/, '')
      .replace(/^کوچه\s+/, '')
      .replace(/^میدان\s+/, '');
    const parts = neighborhood.split('،');
    neighborhood = parts[0].trim();
    neighborhood = neighborhood.replace(/\s*تهران\s*$/, '').trim();
    return neighborhood || location;
  };

  const getDistance = (shift: any) => {
    const id = shift.id || shift.shift_id || shift.application_id || '0';
    const idStr = typeof id === 'string' ? id : id.toString();
    return ((idStr.charCodeAt(0) || 0) % 50) / 10 + 1.5;
  };

  const calculateEstimatedIncome = (shift: any) => {
    const startTime = shift.start_time || shift.startTime || '00:00';
    const endTime = shift.end_time || shift.endTime || '00:00';
    const hourlyWage = shift.hourly_wage || shift.hourlyWage || 0;
    
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    const hours = end > start ? end - start : (24 - start) + end;
    const hourlyWageTomans = hourlyWage / 10;
    return hours * hourlyWageTomans;
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

  if (!user) {
    return null;
  }

  if (user.userType === 'worker') {
    const incomeStats = safeDashboardData?.incomeStats || {};
    const profile = safeDashboardData?.profile || {};
    const upcomingShifts = safeDashboardData?.upcomingShifts || [];
    const pendingApplications = safeDashboardData?.pendingApplications || [];
    const completedShifts = safeDashboardData?.completedShifts || [];

    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors text-primary-600"
                aria-label="بازگشت به پروفایل"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
            </div>
          </div>

          <div className="flex gap-6" dir="rtl">
            {/* Right Panel - Income Card (first in RTL = right side) */}
            <div className="w-80 flex-shrink-0" style={{ order: 2 }}>
              <div className="bg-white rounded-lg shadow-md p-6" dir="rtl">
                <h2 className="text-center text-lg font-semibold text-gray-900 mb-4">
                  درآمد این ماه
                </h2>
                
                {/* Monthly Income Amount */}
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="text-3xl font-bold text-gray-900 text-center">
                    {formatPersianCurrencyTomans(monthlyIncome)}
                  </p>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-2 mb-6 p-3 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    پرداخت درآمد فقط هر آخر ماه صورت می‌گیرد
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {profile.average_rating ? parseFloat(profile.average_rating).toFixed(1) : '۰'}
                    </p>
                    <p className="text-xs text-gray-600">میانگین امتیاز</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {formatPersianNumber(incomeStats.total_shifts_completed || 0)}
                    </p>
                    <p className="text-xs text-gray-600">شیفت‌های انجام شده</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Panel - Shifts (second in RTL = left side) */}
            <div className="flex-1" style={{ order: 1 }}>
              <div className="bg-white rounded-lg shadow-md">
                {/* Tabs */}
                <div className="flex border-b border-gray-200" dir="rtl">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'upcoming'
                        ? 'text-gray-900 bg-white'
                        : 'text-gray-500 bg-gray-50'
                    }`}
                  >
                    شیفت‌های بعدی
                  </button>
                  <button
                    onClick={() => setActiveTab('previous')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'previous'
                        ? 'text-gray-900 bg-white'
                        : 'text-gray-500 bg-gray-50'
                    }`}
                  >
                    شیفت‌های قبلی
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'upcoming' ? (
                    <>
                      {/* Upcoming Shifts */}
                      {Object.keys(groupedUpcomingShifts).length === 0 ? (
                        <p className="text-gray-600 text-center py-8">{t('profile.noUpcomingShifts')}</p>
                      ) : (
                        Object.entries(groupedUpcomingShifts)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([dateKey, shifts]) => {
                            const date = new Date(dateKey);
                            return (
                              <div key={dateKey} className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-semibold text-blue-600">
                                      {formatPersianNumber(shifts.length)}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {getPersianDateLabel(date)}
                                  </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                                  {shifts.map((shift: any) => {
                                    const estimatedIncome = calculateEstimatedIncome(shift);
                                    const distance = getDistance(shift);
                                    return (
                                      <Link
                                        key={shift.id}
                                        href={`/shifts/${shift.id}`}
                                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
                                      >
                                        <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                                          {shift.image_url ? (
                                            <img
                                              src={shift.image_url}
                                              alt={shift.title}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <div className="text-gray-400 text-4xl">🏢</div>
                                          )}
                                        </div>
                                        <div className="p-4" dir="rtl">
                                          <h4 className="font-bold text-base mb-1 text-gray-900">
                                            {shift.business_name || 'فروشگاه'} - {getNeighborhood(shift.location)}
                                          </h4>
                                          <p className="text-purple-600 text-xs font-medium mb-2">
                                            {getRole(shift)} {formatPersianNumber(distance.toFixed(2))} کیلومتر
                                          </p>
                                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2" dir="rtl">
                                            <span>
                                              {formatPersianNumber(Math.floor(shift.hourly_wage / 10))} تومان / ساعت
                                            </span>
                                            <span>
                                              {formatPersianTime(shift.start_time)} - {formatPersianTime(shift.end_time)}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-500">
                                            برآورد درآمد {formatPersianCurrencyTomans(estimatedIncome)}
                                          </p>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })
                      )}

                      {/* Pending Applications (Shifts Under Review) */}
                      {Object.keys(groupedPendingShifts).length > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-blue-600">
                                {formatPersianNumber(Object.values(groupedPendingShifts).flat().length)}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                              شیفت‌های در حال بررسی
                            </h3>
                          </div>
                          {Object.entries(groupedPendingShifts)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([dateKey, apps]) => {
                              const date = new Date(dateKey);
                              return (
                                <div key={dateKey} className="mb-6">
                                  <h4 className="text-base font-semibold text-gray-800 mb-3">
                                    {getPersianDateLabel(date)}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                                    {apps.map((app: any) => {
                                      const shift = app;
                                      const estimatedIncome = calculateEstimatedIncome(shift);
                                      const distance = getDistance(shift);
                                      return (
                                        <Link
                                          key={app.id || shift.id}
                                          href={`/shifts/${shift.id || app.shift_id}`}
                                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
                                        >
                                          <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                                            {shift.image_url ? (
                                              <img
                                                src={shift.image_url}
                                                alt={shift.title}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="text-gray-400 text-4xl">🏢</div>
                                            )}
                                          </div>
                                          <div className="p-4" dir="rtl">
                                            <h4 className="font-bold text-base mb-1 text-gray-900">
                                              {shift.business_name || app.business_name || 'فروشگاه'} - {getNeighborhood(shift.location || app.location)}
                                            </h4>
                                            <p className="text-purple-600 text-xs font-medium mb-2">
                                              {getRole(shift)} {formatPersianNumber(distance.toFixed(2))} کیلومتر
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-2" dir="rtl">
                                              <span>
                                                {formatPersianNumber(Math.floor((shift.hourly_wage || app.hourly_wage) / 10))} تومان / ساعت
                                              </span>
                                              <span>
                                                {formatPersianTime(shift.start_time || app.start_time)} - {formatPersianTime(shift.end_time || app.end_time)}
                                              </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                              برآورد درآمد {formatPersianCurrencyTomans(estimatedIncome)}
                                            </p>
                                          </div>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <p className="text-gray-600 text-center py-8">شیفت‌های قبلی</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Business Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Business Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600">Total Shifts</p>
          <p className="text-2xl font-bold">{dashboardData.stats?.total_shifts || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Applications</p>
          <p className="text-2xl font-bold">{dashboardData.stats?.total_applications || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Accepted</p>
          <p className="text-2xl font-bold">{dashboardData.stats?.accepted_applications || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Active Shifts</p>
          <p className="text-2xl font-bold">{dashboardData.activeShifts?.length || 0}</p>
        </div>
      </div>

      {/* Active Shifts */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Shifts</h2>
        {dashboardData.activeShifts?.length === 0 ? (
          <p className="text-gray-600">No active shifts</p>
        ) : (
          <div className="space-y-4">
            {dashboardData.activeShifts?.map((shift: any) => (
              <div key={shift.id} className="border-l-4 border-primary-600 pl-4 py-2">
                <h3 className="font-semibold">{shift.title}</h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(shift.shift_date), 'MMM dd, yyyy')} • {shift.start_time} - {shift.end_time}
                </p>
                <p className="text-sm text-gray-600">
                  {shift.filled_positions || 0} / {shift.number_of_positions} positions filled
                  {shift.pending_applications > 0 && (
                    <span className="ml-2 text-primary-600">
                      • {shift.pending_applications} pending applications
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Applications */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
        {dashboardData.recentApplications?.length === 0 ? (
          <p className="text-gray-600">No recent applications</p>
        ) : (
          <div className="space-y-4">
            {dashboardData.recentApplications?.map((app: any) => (
              <div key={app.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                <h3 className="font-semibold">{app.first_name} {app.last_name}</h3>
                <p className="text-sm text-gray-600">{app.title}</p>
                {app.average_rating > 0 && (
                  <p className="text-sm text-gray-600">
                    Rating: {parseFloat(app.average_rating).toFixed(1)} ({app.total_ratings} reviews)
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




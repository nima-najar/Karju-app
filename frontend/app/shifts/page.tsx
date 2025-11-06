'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { shiftsAPI } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPersianDate, formatPersianCurrency, formatPersianNumber, gregorianToJalali, toPersianNum } from '@/lib/persianUtils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from 'date-fns';
import { Filter, ChevronLeft, ChevronRight, User, Bell } from 'lucide-react';

interface Shift {
  id: number;
  title: string;
  description: string;
  city: string;
  location: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  hourly_wage: number;
  industry: string;
  business_name?: string;
  image_url?: string;
  number_of_positions: number;
  filled_positions: number;
  userApplication?: any;
}

export default function ShiftsPage() {
  const { t, language } = useLanguage();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [filters, setFilters] = useState({
    startTime: '10:00',
    location: '',
    distance: 30,
    employer: '',
    industry: 'all',
  });

  useEffect(() => {
    loadShifts();
  }, [filters]);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.industry && filters.industry !== 'all') params.industry = filters.industry;
      // Only filter by city if location is provided and not empty
      if (filters.location && filters.location.trim()) {
        // Try to match Tehran variations
        const locationLower = filters.location.toLowerCase();
        if (locationLower.includes('تهران') || locationLower.includes('tehran')) {
          params.city = 'Tehran';
        } else {
          params.city = filters.location;
        }
      }
      // Note: employer filter would need backend support - removing for now
      // if (filters.employer) params.business_name = filters.employer;

      const response = await shiftsAPI.getAll(params);
      setShifts(response.data.shifts || []);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group shifts by date
  const groupedShifts = useMemo(() => {
    const groups: { [key: string]: Shift[] } = {};
    shifts.forEach(shift => {
      const dateKey = shift.shift_date.split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(shift);
    });
    return groups;
  }, [shifts]);

  // Calculate estimated income
  const calculateEstimatedIncome = (shift: Shift) => {
    const start = parseInt(shift.start_time.split(':')[0]);
    const end = parseInt(shift.end_time.split(':')[0]);
    const hours = end > start ? end - start : (24 - start) + end;
    return hours * shift.hourly_wage;
  };

  // Get distance (mock for now - you can add real distance calculation based on user location)
  const getDistance = (shift: Shift) => {
    // Mock distance - replace with real calculation using geolocation API
    // For now, using a consistent value based on shift ID for demo purposes
    return ((shift.id % 50) / 10 + 1.5).toFixed(2);
  };

  // Calendar helpers
  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get first day of month offset (Persian week starts on Saturday = 0)
  const firstDayOfWeek = getDay(monthStart);
  // Convert to Persian week (Saturday = 0, Sunday = 1, ..., Friday = 6)
  const persianFirstDay = firstDayOfWeek === 6 ? 0 : firstDayOfWeek + 1;
  const persianWeekDays = language === 'fa' 
    ? ['شنبه', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه']
    : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const getPersianMonthName = (date: Date) => {
    if (language === 'fa') {
      const [jy, jm] = gregorianToJalali(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      const persianMonths = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
      ];
      return `${persianMonths[jm - 1]} ${toPersianNum(jy.toString())}`;
    }
    return format(date, 'MMMM yyyy');
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
      return `${dayOfWeek} ${toPersianNum(jd.toString())} ${['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'][jm]}`;
    }
    return format(date, 'EEEE, MMMM dd');
  };

  const industryTypes = [
    { value: 'all', label: language === 'fa' ? 'همه' : 'All' },
    { value: 'hospitality', label: language === 'fa' ? 'رستوران' : 'Restaurant' },
    { value: 'events', label: language === 'fa' ? 'رویدادها' : 'Events' },
    { value: 'logistics', label: language === 'fa' ? 'لجستیک' : 'Logistics' },
    { value: 'retail', label: language === 'fa' ? 'خرده‌فروشی' : 'Retail' },
  ];

  // Extract role from shift title or industry
  const getRole = (shift: Shift) => {
    const titleLower = shift.title.toLowerCase();
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
      return shift.industry === 'hospitality' ? 'کارمند' : 'کارمند';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-6 p-6" style={{ direction: 'ltr' }}>
        {/* Shifts List - Left side */}
        <div className="flex-1" style={{ order: 1 }}>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </div>
          ) : Object.keys(groupedShifts).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{t('shifts.noShiftsFound')}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedShifts)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([dateKey, dateShifts]) => {
                  const date = new Date(dateKey);
                  return (
                    <div key={dateKey}>
                      <h2 className="text-xl font-bold mb-4 text-gray-800">
                        {getPersianDateLabel(date)}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dateShifts.map((shift) => {
                          const estimatedIncome = calculateEstimatedIncome(shift);
                          const distance = getDistance(shift);
                          const hasLowApplicants = (shift.number_of_positions - shift.filled_positions) < 3;
                          
                          return (
                            <Link
                              key={shift.id}
                              href={`/shifts/${shift.id}`}
                              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                              <div className="relative">
                                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                                  {shift.image_url ? (
                                    <img
                                      src={shift.image_url}
                                      alt={shift.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  <div className={`absolute inset-0 flex items-center justify-center text-gray-400 text-6xl ${shift.image_url ? 'hidden' : ''}`}>
                                    🏢
                                  </div>
                                </div>
                                {hasLowApplicants && (
                                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                    {language === 'fa' ? 'متقاضی کم' : 'Low Applicants'}
                                  </div>
                                )}
                              </div>
                              <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 text-gray-900">{shift.title}</h3>
                                <p className="text-gray-600 text-sm mb-3">{getRole(shift)}</p>
                                
                                <div className="space-y-2 text-sm text-gray-700 mb-3">
                                  <div className="flex items-center justify-between">
                                    <span>{language === 'fa' ? 'فاصله' : 'Distance'}:</span>
                                    <span className="font-medium">{language === 'fa' ? formatPersianNumber(distance) : distance} {language === 'fa' ? 'کیلومتر' : 'km'}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>{language === 'fa' ? 'دستمزد ساعتی' : 'Hourly Rate'}:</span>
                                    <span className="font-medium">
                                      {language === 'fa' 
                                        ? `ت ${formatPersianNumber(Math.floor(shift.hourly_wage / 10))} / ساعت`
                                        : `${Math.floor(shift.hourly_wage / 10).toLocaleString()} T / hour`}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>{language === 'fa' ? 'زمان' : 'Time'}:</span>
                                    <span className="font-medium">{shift.start_time} - {shift.end_time}</span>
                                  </div>
                                </div>
                                
                                <div className="pt-3 border-t border-gray-200">
                                  <p className="text-sm font-semibold text-gray-900">
                                    {language === 'fa' ? 'برآورد درآمد' : 'Estimated Income'}: {language === 'fa' 
                                      ? formatPersianCurrency(estimatedIncome)
                                      : `${estimatedIncome.toLocaleString()} T`}
                                  </p>
                                </div>
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
        </div>

        {/* Filters - Right side */}
        <div className="w-80 bg-white rounded-lg shadow-md p-6 h-fit sticky top-6" style={{ order: 2 }}>
          {/* Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-semibold text-gray-800">{getPersianMonthName(calendarMonth)}</h3>
              <button
                onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {persianWeekDays.map((day, idx) => (
                <div key={idx} className="text-center text-xs text-gray-600 font-medium py-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: persianFirstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square"></div>
              ))}
              {calendarDays.map((day) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const dayNumber = language === 'fa' ? toPersianNum(day.getDate().toString()) : day.getDate();
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square rounded-full text-sm hover:bg-gray-100 transition-colors ${
                      isSelected ? 'bg-purple-600 text-white' : 'text-gray-700'
                    }`}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div>
            <div className="flex items-center gap-2 mb-4 justify-end">
              <h3 className="font-semibold text-gray-800">{language === 'fa' ? 'فیلترها' : 'Filters'}</h3>
              <Filter className="w-5 h-5 text-purple-600" />
            </div>

            <div className="space-y-4">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {language === 'fa' ? 'زمان شروع' : 'Start Time'}
                </label>
                <input
                  type="time"
                  value={filters.startTime}
                  onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {language === 'fa' ? 'محل' : 'Location'}
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  placeholder={language === 'fa' ? 'تهران' : 'Tehran'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Distance */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {language === 'fa' ? 'فاصله' : 'Distance'}: {language === 'fa' ? formatPersianNumber(filters.distance) : filters.distance} {language === 'fa' ? 'کیلومتر' : 'km'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={filters.distance}
                  onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Employer */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {language === 'fa' ? 'کارفرما' : 'Employer'}
                </label>
                <input
                  type="text"
                  value={filters.employer}
                  onChange={(e) => setFilters({ ...filters, employer: e.target.value })}
                  placeholder={language === 'fa' ? 'نام کارفرما' : 'Employer Name'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Industry Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {language === 'fa' ? 'نوع صنعت' : 'Industry Type'}
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {industryTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFilters({ ...filters, industry: type.value })}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filters.industry === type.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setFilters({
                    startTime: '10:00',
                    location: '',
                    distance: 30,
                    employer: '',
                    industry: 'all',
                  });
                  setSelectedDate(null);
                }}
                className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {language === 'fa' ? 'پاک کردن' : 'Clear Filters'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

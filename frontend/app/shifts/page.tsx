'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { shiftsAPI } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPersianDate, formatPersianCurrency, formatPersianCurrencyTomans, formatPersianNumber, gregorianToJalali, jalaliToGregorian, toPersianNum, formatPersianTime, getPersianIndustry } from '@/lib/persianUtils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from 'date-fns';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [{ jalaliYear, jalaliMonth }, setJalaliView] = useState(() => {
    const today = new Date();
    const [jy, jm] = gregorianToJalali(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    return { jalaliYear: jy, jalaliMonth: jm };
  });
  const isPersian = language === 'fa';
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
  useEffect(() => {
    if (isPersian) {
      const [gy, gm, gd] = jalaliToGregorian(jalaliYear, jalaliMonth, 1);
      setCalendarMonth(new Date(gy, gm - 1, gd));
    }
  }, [isPersian, jalaliYear, jalaliMonth]);


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

  const filteredGroupedShifts = useMemo(() => {
    if (!selectedDate) {
      return groupedShifts;
    }

    const selectedKey = format(selectedDate, 'yyyy-MM-dd');

    if (selectedKey && groupedShifts[selectedKey]) {
      return { [selectedKey]: groupedShifts[selectedKey] };
    }

    const fallbackShifts = shifts.filter((shift) => {
      const shiftKey = shift.shift_date.split('T')[0];
      return shiftKey === selectedKey;
    });

    if (fallbackShifts.length > 0) {
      return { [selectedKey]: fallbackShifts };
    }

    return {};
  }, [groupedShifts, selectedDate, shifts]);

  // Calculate estimated income in tomans
  const calculateEstimatedIncome = (shift: Shift) => {
    const start = parseInt(shift.start_time.split(':')[0]);
    const end = parseInt(shift.end_time.split(':')[0]);
    const hours = end > start ? end - start : (24 - start) + end;
    // hourly_wage is in rials, convert to tomans (divide by 10)
    const hourlyWageTomans = shift.hourly_wage / 10;
    return hours * hourlyWageTomans;
  };

  // Get distance (mock for now - you can add real distance calculation based on user location)
  const getDistance = (shift: Shift) => {
    // Mock distance - replace with real calculation using geolocation API
    // For now, using a consistent value based on shift ID for demo purposes
    return ((shift.id % 50) / 10 + 1.5).toFixed(2);
  };

  const getJalaliMonthLength = (year: number, month: number) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    const [gy, gm, gd] = jalaliToGregorian(year, month, 30);
    const [tjy, tjm] = gregorianToJalali(gy, gm, gd);
    return tjy === year && tjm === month ? 30 : 29;
  };

  const monthStartDate = useMemo(() => {
    if (isPersian) {
      const [gy, gm, gd] = jalaliToGregorian(jalaliYear, jalaliMonth, 1);
      return new Date(gy, gm - 1, gd);
    }
    return startOfMonth(calendarMonth);
  }, [isPersian, jalaliYear, jalaliMonth, calendarMonth]);

  const calendarDays = useMemo(() => {
    if (isPersian) {
      const length = getJalaliMonthLength(jalaliYear, jalaliMonth);
      return Array.from({ length }, (_, idx) => {
        const day = idx + 1;
        const [gy, gm, gd] = jalaliToGregorian(jalaliYear, jalaliMonth, day);
        return {
          date: new Date(gy, gm - 1, gd),
          displayDay: day,
        };
      });
    }

    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    return eachDayOfInterval({ start, end }).map((date) => ({
      date,
      displayDay: date.getDate(),
    }));
  }, [isPersian, jalaliYear, jalaliMonth, calendarMonth]);

  const firstDayOfWeek = getDay(monthStartDate);
  const persianFirstDay = firstDayOfWeek === 6 ? 0 : firstDayOfWeek + 1;
  const persianWeekDays = language === 'fa' 
    ? ['شنبه', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه']
    : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const persianMonthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const getCalendarMonthLabel = () => {
    if (isPersian) {
      return `${persianMonthNames[jalaliMonth - 1]} ${toPersianNum(jalaliYear.toString())}`;
    }
    return format(calendarMonth, 'MMMM yyyy');
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
    { value: 'رستوران و پذیرایی', label: language === 'fa' ? 'رستوران و پذیرایی' : 'Restaurant' },
    { value: 'رویدادها', label: language === 'fa' ? 'رویدادها' : 'Events' },
    { value: 'لجستیک', label: language === 'fa' ? 'لجستیک' : 'Logistics' },
    { value: 'خرده‌فروشی', label: language === 'fa' ? 'خرده‌فروشی' : 'Retail' },
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

  // Extract neighborhood from location (e.g., "ولنجک، تهران" -> "ولنجک" or "خیابان فرشته" -> "فرشته")
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

  return (
    <div className="min-h-screen bg-[#f9f9f9]" dir="rtl">
      <div className="flex gap-6 p-6 h-screen overflow-hidden">
        {/* Filters - Left side */}
        <div className="w-[337px] bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
          <div className="p-6 pt-6 flex flex-col gap-8">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  if (isPersian) {
                    setJalaliView((prev) => {
                      let month = prev.jalaliMonth - 1;
                      let year = prev.jalaliYear;
                      if (month < 1) {
                        month = 12;
                        year -= 1;
                      }
                      const [gy, gm, gd] = jalaliToGregorian(year, month, 1);
                      setCalendarMonth(new Date(gy, gm - 1, gd));
                      return { jalaliYear: year, jalaliMonth: month };
                    });
                  } else {
                    setCalendarMonth(subMonths(calendarMonth, 1));
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded-[4px] size-7 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-[#4A5565]" />
              </button>
              <h3 className="font-bold text-base text-gray-900">{getCalendarMonthLabel()}</h3>
              <button
                onClick={() => {
                  if (isPersian) {
                    setJalaliView((prev) => {
                      let month = prev.jalaliMonth + 1;
                      let year = prev.jalaliYear;
                      if (month > 12) {
                        month = 1;
                        year += 1;
                      }
                      const [gy, gm, gd] = jalaliToGregorian(year, month, 1);
                      setCalendarMonth(new Date(gy, gm - 1, gd));
                      return { jalaliYear: year, jalaliMonth: month };
                    });
                  } else {
                    setCalendarMonth(addMonths(calendarMonth, 1));
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded-[4px] size-7 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-[#4A5565]" />
              </button>
            </div>
            
            {/* Week days */}
            <div className="grid grid-cols-7 gap-0 mb-1">
              {persianWeekDays.map((day, idx) => (
                <div key={idx} className="text-center text-xs text-[#6a7282] font-normal py-1.5">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0">
              {Array.from({ length: persianFirstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-10"></div>
              ))}
              {calendarDays.map(({ date, displayDay }) => {
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const dayNumber = isPersian ? toPersianNum(displayDay.toString()) : displayDay;
                const isToday = isSameDay(date, new Date());
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`h-10 rounded-[4px] text-sm transition-colors flex items-center justify-center ${
                      isSelected 
                        ? 'bg-[rgba(26,37,162,0.55)] text-black' 
                        : isToday
                        ? 'bg-[rgba(60,224,0,0)] text-black'
                        : 'text-[#101828] hover:bg-gray-100'
                    }`}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Filters - Always Visible */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
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
                className="text-xs text-[#6750a4] font-normal hover:underline"
              >
                {language === 'fa' ? 'پاک کردن' : 'Clear'}
              </button>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-gray-900">{language === 'fa' ? 'فیلترها' : 'Filters'}</h3>
                <Filter className="w-5 h-5 text-[#6750A4]" />
              </div>
            </div>

            <div className="space-y-4">
              {/* Start Time */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2 opacity-70">
                  {language === 'fa' ? 'زمان شروع' : 'Start Time'}
                </label>
                <input
                  type="time"
                  value={filters.startTime}
                  onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
                  className="w-full h-[42px] px-4 py-2 bg-white border border-[#d1d5dc] rounded-[10px] text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Location - Basic Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2 opacity-70">
                  {language === 'fa' ? 'محل' : 'Location'}
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  placeholder={language === 'fa' ? 'تهران، منطقه ۱' : 'Tehran, District 1'}
                  className="w-full h-[42px] px-4 py-2 bg-white border border-[#d1d5dc] rounded-[10px] text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Distance */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-900 opacity-70">
                    {language === 'fa' ? 'فاصله' : 'Distance'}
                  </label>
                  <span className="text-xs text-gray-900 opacity-70">
                    {filters.distance} {language === 'fa' ? 'کیلومتر' : 'km'}
                  </span>
                </div>
                <div className="relative h-1">
                  <div className="absolute bg-gradient-to-l from-[#d1d5dc] via-[#8b5ce2] to-[#1a25a2] h-1 rounded-full w-full"></div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={filters.distance}
                    onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1a25a2] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1a25a2] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              {/* Employer */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2 opacity-70">
                  {language === 'fa' ? 'کارفرما' : 'Employer'}
                </label>
                <input
                  type="text"
                  value={filters.employer}
                  onChange={(e) => setFilters({ ...filters, employer: e.target.value })}
                  placeholder={language === 'fa' ? 'نام کارفرما' : 'Employer Name'}
                  className="w-full h-[42px] px-4 py-2 bg-white border border-[#d1d5dc] rounded-[10px] text-base text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Industry Type - Basic Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 opacity-70">
                  {language === 'fa' ? 'نوع صنعت' : 'Industry Type'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {industryTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFilters({ ...filters, industry: type.value })}
                      className={`px-4 py-2 rounded-[5px] text-base font-bold transition-colors ${
                        filters.industry === type.value
                          ? 'bg-[rgba(26,37,162,0.4)] text-gray-900 border-[1.5px] border-[#1a25a2] opacity-75'
                          : 'bg-[rgba(26,37,162,0.1)] text-gray-900'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Shifts List - Right side */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </div>
          ) : Object.keys(filteredGroupedShifts).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{t('shifts.noShiftsFound')}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(filteredGroupedShifts)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([dateKey, dateShifts]) => {
                  const date = new Date(dateKey);
                  return (
                    <div key={dateKey}>
                      <h2 className="text-xl font-bold mb-6 text-gray-800 text-right" dir="rtl">
                        {getPersianDateLabel(date)}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
                        {dateShifts.map((shift) => {
                          const estimatedIncome = calculateEstimatedIncome(shift);
                          const distance = getDistance(shift);
                          const hasLowApplicants = (shift.number_of_positions - shift.filled_positions) < 3;
                          
                          return (
                            <Link
                              key={shift.id}
                              href={`/shifts/${shift.id}`}
                              className="bg-white rounded-[20px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden hover:shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-shadow flex flex-col h-full"
                            >
                              <div className="relative">
                                <div className="w-full h-[200px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
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
                                  <div className="absolute top-3 right-3 bg-[rgba(255,255,255,0.9)] text-gray-900 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                                    <span>{language === 'fa' ? 'متقاضی کم' : 'Low Applicants'}</span>
                                    <div className="w-2 h-2 bg-[#1a25a2] rounded-full"></div>
                                  </div>
                                )}
                              </div>
                              <div className="p-4 flex flex-col justify-between flex-1 min-h-[160px]" dir="rtl">
                                {/* Title: Business Name - Neighborhood */}
                                <div>
                                  <h3 className="font-bold text-lg mb-2 text-gray-900 text-right">
                                    {shift.business_name || 'فروشگاه'} - {getNeighborhood(shift.location)}
                                  </h3>
                                  
                                  {/* Position with purple color and distance */}
                                  <div className="flex items-center gap-1.5 mb-3">
                                    <p className="text-[#1a25a2] text-base font-normal">{getRole(shift)}</p>
                                    <span className="text-[#1a25a2]">·</span>
                                    <span className="text-[#1a25a2] text-base font-normal">{formatPersianNumber(distance)} کیلومتر</span>
                                  </div>
                                  
                                  {/* Hourly Rate (right) and Time (left) */}
                                  <div className="flex items-center justify-between mb-3 opacity-70" dir="rtl">
                                    <div className="text-right">
                                      <span className="text-base text-gray-900">
                                        {language === 'fa' 
                                          ? `ت ${formatPersianNumber(Math.floor(shift.hourly_wage / 10).toLocaleString())}/ساعت`
                                          : `${Math.floor(shift.hourly_wage / 10).toLocaleString()} T / hour`}
                                      </span>
                                    </div>
                                    <div className="text-left">
                                      <span className="text-base text-gray-900">
                                        {language === 'fa' 
                                          ? `${formatPersianTime(shift.start_time)} - ${formatPersianTime(shift.end_time)}`
                                          : `${shift.start_time} - ${shift.end_time}`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Estimated Income at bottom */}
                                <div className="text-right opacity-60" dir="rtl">
                                  <p className="text-xs text-gray-900">
                                    {language === 'fa' ? `برآورد درامد  ${formatPersianCurrencyTomans(estimatedIncome).replace(' تومان', '')}` : `Estimated Income: ${formatPersianCurrencyTomans(estimatedIncome)}`}
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
      </div>
    </div>
  );
}

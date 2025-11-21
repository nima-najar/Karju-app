'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { shiftsAPI } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPersianDate, formatPersianCurrency, formatPersianCurrencyTomans, formatPersianNumber, gregorianToJalali, jalaliToGregorian, toPersianNum, formatPersianTime, getPersianIndustry, getJalaliMonthLength } from '@/lib/persianUtils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from 'date-fns';
import { Filter, ChevronLeft, ChevronRight, Map } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for map component to avoid SSR issues
const ShiftsMap = dynamic(() => import('@/components/ShiftsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-concrete rounded-lg">
      <div className="text-gray-500 dark:text-white">در حال بارگذاری نقشه...</div>
    </div>
  ),
});

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
  latitude?: number;
  longitude?: number;
}

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export default function ShiftsPage() {
  const { t, language } = useLanguage();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [showMap, setShowMap] = useState(true);
  const [selectedShiftId, setSelectedShiftId] = useState<number | undefined>();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    location: '',
    distance: 30,
    employer: '',
    industry: 'all',
  });

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser');
    }
  }, []);

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
      const loadedShifts = response.data.shifts || [];
      
      // Debug: Check coordinates
      const shiftsWithCoords = loadedShifts.filter((s: Shift) => s.latitude && s.longitude);
      console.log('Loaded shifts:', loadedShifts.length);
      console.log('Shifts with coordinates:', shiftsWithCoords.length);
      if (loadedShifts.length > 0) {
        console.log('Sample shift:', {
          id: loadedShifts[0].id,
          location: loadedShifts[0].location,
          lat: loadedShifts[0].latitude,
          lng: loadedShifts[0].longitude
        });
      }
      
      setShifts(loadedShifts);
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
    let filtered = groupedShifts;
    
    // Apply date filter
    if (selectedDate) {
      const selectedKey = format(selectedDate, 'yyyy-MM-dd');
      const selectedShifts = groupedShifts[selectedKey];
      if (!selectedShifts || selectedShifts.length === 0) {
        return {};
      }
      filtered = { [selectedKey]: selectedShifts };
    }
    
    // Apply distance filter if user location is available
    if (userLocation && filters.distance) {
      const filteredByDistance: { [key: string]: Shift[] } = {};
      Object.entries(filtered).forEach(([dateKey, dateShifts]) => {
        const shiftsWithinDistance = dateShifts.filter((shift) => {
          if (!shift.latitude || !shift.longitude) return false;
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            shift.latitude,
            shift.longitude
          );
          return distance <= filters.distance;
        });
        if (shiftsWithinDistance.length > 0) {
          filteredByDistance[dateKey] = shiftsWithinDistance;
        }
      });
      return filteredByDistance;
    }
    
    return filtered;
  }, [groupedShifts, selectedDate, userLocation, filters.distance]);

  // Calculate estimated income in tomans
  const calculateEstimatedIncome = (shift: Shift) => {
    const start = parseInt(shift.start_time.split(':')[0]);
    const end = parseInt(shift.end_time.split(':')[0]);
    const hours = end > start ? end - start : (24 - start) + end;
    // hourly_wage is in rials, convert to tomans (divide by 10)
    const hourlyWageTomans = shift.hourly_wage / 10;
    return hours * hourlyWageTomans;
  };

  // Get distance for a shift
  const getDistance = (shift: Shift): number | null => {
    if (!userLocation || !shift.latitude || !shift.longitude) {
      return null;
    }
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      shift.latitude,
      shift.longitude
    );
  };

  // Calendar helpers - Build calendar based on Persian dates
  // Get current Persian date from calendarMonth
  const [currentJy, currentJm, currentJd] = gregorianToJalali(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    calendarMonth.getDate()
  );
  
  // Get Persian month length
  const persianMonthLength = getJalaliMonthLength(currentJy, currentJm);
  
  // Build calendar days: for each Persian day (1 to monthLength), convert to Gregorian
  const calendarDays: Array<{ persianDay: number; gregorianDate: Date }> = [];
  for (let jd = 1; jd <= persianMonthLength; jd++) {
    const [gy, gm, gd] = jalaliToGregorian(currentJy, currentJm, jd);
    const gregorianDate = new Date(gy, gm - 1, gd);
    calendarDays.push({ persianDay: jd, gregorianDate });
  }
  
  // Get first day of month offset (Persian week starts on Saturday = 0)
  const firstDayGregorian = calendarDays[0]?.gregorianDate;
  const firstDayOfWeek = firstDayGregorian ? getDay(firstDayGregorian) : getDay(startOfMonth(calendarMonth));
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

  // Helper to change Persian month
  const changePersianMonth = (direction: 'next' | 'prev') => {
    const [jy, jm, jd] = gregorianToJalali(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      calendarMonth.getDate()
    );
    
    let newJm = jm;
    let newJy = jy;
    
    if (direction === 'next') {
      newJm += 1;
      if (newJm > 12) {
        newJm = 1;
        newJy += 1;
      }
    } else {
      newJm -= 1;
      if (newJm < 1) {
        newJm = 12;
        newJy -= 1;
      }
    }
    
    // Convert first day of new Persian month to Gregorian
    const [gy, gm, gd] = jalaliToGregorian(newJy, newJm, 1);
    setCalendarMonth(new Date(gy, gm - 1, gd));
  };

  const getPersianDateLabel = (date: Date) => {
    if (language === 'fa') {
      const [jy, jm, jd] = gregorianToJalali(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      const persianWeekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
      // Convert Gregorian day of week to Persian day of week
      // Gregorian: Sunday=0, Monday=1, ..., Saturday=6
      // Persian: Saturday=0, Sunday=1, ..., Friday=6
      const gregorianDay = date.getDay();
      const persianDayIndex = (gregorianDay + 1) % 7;
      const dayOfWeek = persianWeekDays[persianDayIndex];
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

  // Get all shifts for map (not filtered by date)
  const allShiftsForMap = useMemo(() => {
    let filtered = shifts.filter(shift => {
      if (filters.industry && filters.industry !== 'all' && shift.industry !== filters.industry) {
        return false;
      }
      return true;
    });
    
    // Apply distance filter if user location is available
    if (userLocation && filters.distance) {
      filtered = filtered.filter((shift) => {
        if (!shift.latitude || !shift.longitude) return false;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          shift.latitude,
          shift.longitude
        );
        return distance <= filters.distance;
      });
    }
    
    console.log('[ShiftsPage] allShiftsForMap:', {
      totalShifts: shifts.length,
      filteredShifts: filtered.length,
      withCoords: filtered.filter(s => s.latitude && s.longitude).length,
      userLocation: userLocation,
      distanceFilter: filters.distance,
      sample: filtered[0] ? {
        id: filtered[0].id,
        lat: filtered[0].latitude,
        lng: filtered[0].longitude
      } : null
    });
    
    return filtered;
  }, [shifts, filters.industry, userLocation, filters.distance]);

  return (
    <div className="min-h-screen bg-concrete dark:bg-ink pt-24" dir="rtl">
      <div className="flex gap-6 p-6 h-screen overflow-hidden">
        {/* Filters - Left side */}
        <div className="w-[337px] bg-white dark:bg-concrete-light border-l-2 border-ink dark:border-concrete flex-shrink-0 overflow-y-auto">
          <div className="p-6 pt-6 flex flex-col gap-8">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changePersianMonth('prev')}
                className="p-1 hover:bg-concrete-dark dark:hover:bg-concrete rounded-[4px] size-7 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-ink dark:text-ink" />
              </button>
              <h3 className="font-bold text-base text-ink dark:text-ink font-display">{getPersianMonthName(calendarMonth)}</h3>
              <button
                onClick={() => changePersianMonth('next')}
                className="p-1 hover:bg-concrete-dark dark:hover:bg-concrete rounded-[4px] size-7 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-ink dark:text-ink" />
              </button>
            </div>
            
            {/* Week days */}
            <div className="grid grid-cols-7 gap-0 mb-1">
              {persianWeekDays.map((day, idx) => (
                <div key={idx} className="text-center text-xs text-ink/70 dark:text-ink/80 font-bold py-1.5">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0">
              {Array.from({ length: persianFirstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-10"></div>
              ))}
              {calendarDays.map((dayInfo) => {
                const isSelected = selectedDate && isSameDay(dayInfo.gregorianDate, selectedDate);
                const dayNumber = language === 'fa' ? toPersianNum(dayInfo.persianDay.toString()) : dayInfo.persianDay;
                const isToday = isSameDay(dayInfo.gregorianDate, new Date());
                return (
                  <button
                    key={dayInfo.gregorianDate.toISOString()}
                    onClick={() => setSelectedDate(dayInfo.gregorianDate)}
                    className={`h-10 rounded-[4px] text-sm transition-colors flex items-center justify-center font-bold ${
                      isSelected 
                        ? 'bg-moss text-concrete shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e0ded9]' 
                        : isToday
                        ? 'bg-safety/20 dark:bg-safety/30 text-ink dark:text-ink border-2 border-safety'
                        : 'text-ink dark:text-ink hover:bg-concrete-dark dark:hover:bg-concrete'
                    }`}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Filters - Always Visible */}
          <div className="pt-6 border-t-2 border-ink/20 dark:border-ink/30">
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
                className="text-xs text-safety font-bold hover:underline"
              >
                {language === 'fa' ? 'پاک کردن' : 'Clear'}
              </button>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-ink dark:text-ink font-display">{language === 'fa' ? 'فیلترها' : 'Filters'}</h3>
                <Filter className="w-5 h-5 text-safety" />
              </div>
            </div>

            <div className="space-y-4">
              {/* Location - Basic Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-ink dark:text-ink mb-2 opacity-70 dark:opacity-100">
                  {language === 'fa' ? 'محل' : 'Location'}
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  placeholder={language === 'fa' ? 'تهران، منطقه ۱' : 'Tehran, District 1'}
                  className="w-full h-[42px] px-4 py-2 bg-white dark:bg-concrete-light border-2 border-ink dark:border-concrete rounded-[10px] text-base text-ink dark:text-ink focus:outline-none focus:ring-2 focus:ring-safety focus:border-safety font-body"
                />
              </div>

              {/* Distance */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-ink dark:text-ink opacity-70 dark:opacity-100">
                    {language === 'fa' ? 'فاصله' : 'Distance'}
                  </label>
                  <span className="text-xs text-ink dark:text-ink opacity-70 dark:opacity-100 font-bold">
                    {filters.distance} {language === 'fa' ? 'کیلومتر' : 'km'}
                  </span>
                </div>
                <div className="relative h-1">
                  <div className="absolute bg-gradient-to-l from-concrete-dark via-moss to-ink h-1 rounded-full w-full"></div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={filters.distance}
                    onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[2px_2px_0px_0px_#1a1a1a] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[2px_2px_0px_0px_#1a1a1a] [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              {/* Employer */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-ink dark:text-ink mb-2 opacity-70 dark:opacity-100">
                  {language === 'fa' ? 'کارفرما' : 'Employer'}
                </label>
                <input
                  type="text"
                  value={filters.employer}
                  onChange={(e) => setFilters({ ...filters, employer: e.target.value })}
                  placeholder={language === 'fa' ? 'نام کارفرما' : 'Employer Name'}
                  className="w-full h-[42px] px-4 py-2 bg-white dark:bg-concrete-light border-2 border-ink dark:border-concrete rounded-[10px] text-base text-ink/70 dark:text-ink focus:outline-none focus:ring-2 focus:ring-safety focus:border-safety font-body"
                />
              </div>

              {/* Industry Type - Basic Filter */}
              <div>
                <label className="block text-sm font-bold text-ink dark:text-ink mb-2 opacity-70 dark:opacity-100">
                  {language === 'fa' ? 'نوع صنعت' : 'Industry Type'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {industryTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFilters({ ...filters, industry: type.value })}
                      className={`px-4 py-2 rounded-lg text-base font-bold transition-all border-2 ${
                        filters.industry === type.value
                          ? 'bg-moss text-concrete border-ink dark:border-concrete shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e0ded9]'
                          : 'bg-concrete-dark dark:bg-concrete-light text-ink dark:text-ink border-ink dark:border-concrete hover:bg-concrete dark:hover:bg-concrete'
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

        {/* Main Content Area - Right side */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Toggle Map/List View */}
          <div className="flex items-center justify-end gap-2 bg-white dark:bg-concrete-light border-2 border-ink dark:border-concrete p-2 rounded-xl shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e0ded9]">
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold border-2 ${
                showMap 
                  ? 'bg-ink dark:bg-safety text-white dark:text-ink border-ink dark:border-safety shadow-[2px_2px_0px_0px_#ff5e00]' 
                  : 'bg-concrete-dark dark:bg-concrete text-ink dark:text-ink border-ink dark:border-concrete hover:bg-concrete dark:hover:bg-concrete-light'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>{language === 'fa' ? 'نقشه' : 'Map'}</span>
            </button>
          </div>

          {/* Map or List View */}
          {showMap ? (
            <div className="flex-1 bg-white dark:bg-concrete-light rounded-lg shadow-sm overflow-hidden relative" style={{ zIndex: 1 }}>
              <ShiftsMap 
                shifts={allShiftsForMap}
                selectedShiftId={selectedShiftId}
                onShiftClick={(id) => {
                  // Just update selected state, don't navigate
                  setSelectedShiftId(id);
                }}
                language={language}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ink dark:border-ink"></div>
              <p className="mt-4 text-ink dark:text-ink font-bold">{t('common.loading')}</p>
            </div>
          ) : Object.keys(filteredGroupedShifts).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ink dark:text-ink text-lg font-bold">{t('shifts.noShiftsFound')}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(filteredGroupedShifts)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([dateKey, dateShifts]) => {
                  const date = new Date(dateKey);
                  return (
                    <div key={dateKey}>
                      <h2 className="text-xl font-bold mb-6 text-ink dark:text-ink text-right font-display" dir="rtl">
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
                              id={`shift-${shift.id}`}
                              href={`/shifts/${shift.id}`}
                              className={`bg-white dark:bg-concrete-light rounded-[20px] border-2 border-ink dark:border-concrete shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e0ded9] overflow-hidden hover:shadow-[6px_6px_0px_0px_#1a1a1a] dark:hover:shadow-[6px_6px_0px_0px_#e0ded9] hover:-translate-y-1 transition-all ${
                                selectedShiftId === shift.id ? 'ring-2 ring-safety border-safety' : ''
                              }`}
                              onMouseEnter={() => setSelectedShiftId(shift.id)}
                              onMouseLeave={() => setSelectedShiftId(undefined)}
                            >
                              <div className="relative">
                                <div className="w-full h-[200px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
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
                                  <div className={`absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-6xl ${shift.image_url ? 'hidden' : ''}`}>
                                    🏢
                                  </div>
                                </div>
                                {hasLowApplicants && (
                                  <div className="absolute top-3 right-3 bg-white dark:bg-concrete-light border-2 border-ink dark:border-concrete text-ink dark:text-ink px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e0ded9]">
                                    <span>{language === 'fa' ? 'متقاضی کم' : 'Low Applicants'}</span>
                                    <div className="w-2 h-2 bg-safety rounded-full"></div>
                                  </div>
                                )}
                              </div>
                              <div className="p-4 h-[157px] flex flex-col justify-between" dir="rtl">
                                {/* Title: Business Name - Neighborhood */}
                                <div>
                                  <h3 className="font-bold text-lg mb-2 text-ink dark:text-ink text-right font-display">
                                    {shift.business_name || 'فروشگاه'} - {getNeighborhood(shift.location)}
                                  </h3>
                                  
                                  {/* Position with moss color and distance */}
                                  <div className="flex items-center gap-1.5 mb-3">
                                    <p className="text-moss dark:text-safety text-base font-bold">{getRole(shift)}</p>
                                    {distance !== null && (
                                      <>
                                        <span className="text-ink dark:text-ink">·</span>
                                        <span className="text-ink dark:text-ink text-base font-bold">
                                          {formatPersianNumber(distance.toFixed(1))} کیلومتر
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  
                                  {/* Hourly Rate (right) and Time (left) */}
                                  <div className="flex items-center justify-between mb-3 opacity-70 dark:opacity-100" dir="rtl">
                                    <div className="text-right">
                                      <span className="text-base text-ink dark:text-ink font-bold">
                                        {language === 'fa' 
                                          ? `ت ${formatPersianNumber(Math.floor(shift.hourly_wage / 10).toLocaleString())}/ساعت`
                                          : `${Math.floor(shift.hourly_wage / 10).toLocaleString()} T / hour`}
                                      </span>
                                    </div>
                                    <div className="text-left">
                                      <span className="text-base text-ink dark:text-ink font-bold">
                                        {language === 'fa' 
                                          ? `${formatPersianTime(shift.start_time)} - ${formatPersianTime(shift.end_time)}`
                                          : `${shift.start_time} - ${shift.end_time}`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Estimated Income at bottom */}
                                <div className="text-right opacity-60 dark:opacity-100" dir="rtl">
                                  <p className="text-xs text-ink dark:text-ink font-bold">
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
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { shiftsAPI, applicationsAPI } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPersianDate, formatPersianCurrency, formatPersianNumber, gregorianToJalali, toPersianNum } from '@/lib/persianUtils';
import { format } from 'date-fns';
import { MapPin, Star, Mail, XCircle, CheckCircle2 } from 'lucide-react';
import { getUser } from '@/lib/auth';

export default function ShiftDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const router = useRouter();
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
    
    // Apply to the selected shift
    try {
      await applicationsAPI.apply({
        shiftId: selectedShiftId || shift.id,
        applicationText: '',
      });
      alert(t('shifts.applicationSubmitted'));
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.message || t('shifts.applicationFailed'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">{t('shifts.shiftNotFound')}</p>
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

  return (
    <div className="min-h-screen bg-gray-50" style={{ direction: 'ltr' }}>
      <div className="flex gap-6 p-6">
        {/* Left Sidebar - Available Shifts */}
        <div className="w-80" style={{ order: 1 }}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'fa' ? 'شیفت‌های موجود' : 'Available Shifts'}
            </h3>
            <div className="space-y-3">
              {/* Current Shift */}
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedShiftId === shift.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedShiftId(shift.id)}
              >
                <div className="flex items-start gap-3">
                  {selectedShiftId === shift.id ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full mt-0.5 flex-shrink-0"></div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      {getPersianDateLabel(new Date(shift.shift_date))}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {language === 'fa' ? 'ساعات' : 'Hours'}: {shift.start_time} - {shift.end_time}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'fa' ? 'ساعت /' : 'Hour /'} {language === 'fa' 
                        ? formatPersianNumber(Math.floor(shift.hourly_wage / 10))
                        : Math.floor(shift.hourly_wage / 10).toLocaleString()} {language === 'fa' ? 'تومان' : 'Toman'}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {language === 'fa' ? 'درآمد کل' : 'Total Income'}: {formatIncomeTomans(calculateTotalIncome(shift))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Similar Shifts */}
              {similarShifts.map((similarShift) => (
                <div
                  key={similarShift.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedShiftId === similarShift.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedShiftId(similarShift.id)}
                >
                  <div className="flex items-start gap-3">
                    {selectedShiftId === similarShift.id ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full mt-0.5 flex-shrink-0"></div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">
                        {getPersianDateLabel(new Date(similarShift.shift_date))}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {language === 'fa' ? 'ساعات' : 'Hours'}: {similarShift.start_time} - {similarShift.end_time}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'fa' ? 'ساعت /' : 'Hour /'} {language === 'fa'
                          ? formatPersianNumber(Math.floor(similarShift.hourly_wage / 10))
                          : Math.floor(similarShift.hourly_wage / 10).toLocaleString()} {language === 'fa' ? 'تومان' : 'Toman'}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {language === 'fa' ? 'درآمد کل' : 'Total Income'}: {formatIncomeTomans(calculateTotalIncome(similarShift))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-md"
            >
              {language === 'fa' ? 'ادامه' : 'Continue'}
            </button>
          </div>
        </div>

        {/* Main Content - Right */}
        <div className="flex-1" style={{ order: 2 }}>
          {/* Main Image - First */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              {shift.image_url ? (
                <img
                  src={shift.image_url}
                  alt={shift.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-6xl">🏢</div>
              )}
            </div>
          </div>

          {/* Header with Company Name, Job Title, Distance, and Rating */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{shift.business_name || shift.title}</h1>
                <div className="flex items-center gap-4">
                  <p className="text-lg text-gray-700">{shift.title}</p>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">
                    {language === 'fa' ? formatPersianNumber(distance) : distance} {language === 'fa' ? 'کیلومتر' : 'km'}
                  </span>
                </div>
              </div>
              {shift.business_rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-lg font-semibold text-gray-900">
                    {parseFloat(shift.business_rating).toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Location - Under Shift Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  {shift.location}
                  {shift.city && `, ${shift.city}`}
                  {shift.province && `, ${shift.province}`}
                </p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'fa' ? 'توضیحات کار' : 'Job Description'}
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {displayDescription}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setExpandedDescription(!expandedDescription)}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                {expandedDescription 
                  ? (language === 'fa' ? 'کمتر' : 'Less')
                  : (language === 'fa' ? 'بیشتر' : 'More')}
              </button>
            )}
          </div>

          {/* Rules */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'fa' ? 'قوانین' : 'Rules'}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  {language === 'fa' 
                    ? 'این شرکت پرداخت ۱۴ روزه را تعیین کرده است.'
                    : 'This company has set a 14-day payment period.'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  {language === 'fa' 
                    ? `لغو کار باید پیش از ${formatPersianNumber(shift.cancellation_deadline_hours || 48)} ساعت قبل شیفت انجام بشه.`
                    : `Cancellation must be done ${shift.cancellation_deadline_hours || 48} hours before the shift.`}
                </p>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          {shift.required_skills && shift.required_skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'fa' ? 'مهارت‌های مورد نیاز' : 'Required Skills'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {shift.required_skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dress Code - Under Required Skills */}
          {dressCodeItems.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'fa' ? 'قوانین ظاهر و لباس' : 'Appearance and Dress Code Rules'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {dressCodeItems.map((item: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

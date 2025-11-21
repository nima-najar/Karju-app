'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  profileAPI,
  dashboardAPI,
} from '@/lib/api';
import { getUser, logout } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  formatPersianCurrency,
  formatPersianDate,
  gregorianToJalali,
  jalaliToGregorian,
  toPersianNum,
} from '@/lib/persianUtils';
import { format } from 'date-fns';
import {
  ArrowRight,
  Award,
  Clock,
  Coins,
  Edit,
  Settings,
  User,
  X,
} from 'lucide-react';

type AvailabilityMap = Record<string, { start: string; end: string }>;

const timeOptions = Array.from({ length: 24 * 2 }, (_, index) => {
  const totalMinutes = index * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
});

const formatDurationHours = (start: string, end: string): number => {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  let diff = endH * 60 + endM - (startH * 60 + startM);
  if (diff <= 0) {
    diff += 24 * 60;
  }
  return diff / 60;
};

const getTehranCurrentDate = () => {
  const nowUtc = new Date();

  // Convert UTC milliseconds to Tehran timezone by adding offset (UTC+3:30 or UTC+4:30 in daylight).
  const tehranOffsetHours = 3.5;
  const tehranMilliseconds =
    nowUtc.getTime() + tehranOffsetHours * 60 * 60 * 1000;

  const tehranDate = new Date(tehranMilliseconds);
  const year = tehranDate.getUTCFullYear();
  const month = tehranDate.getUTCMonth() + 1;
  const day = tehranDate.getUTCDate();

  return { year, month, day };
};

const jalaliMonthNamesFa = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

const jalaliMonthNamesEn = [
  'Farvardin',
  'Ordibehesht',
  'Khordad',
  'Tir',
  'Mordad',
  'Shahrivar',
  'Mehr',
  'Aban',
  'Azar',
  'Dey',
  'Bahman',
  'Esfand',
];

const jalaliWeekdaysFa = ['جمعه', 'پنج', 'چهار', 'سه', 'دو', 'یک', 'شنبه'];
const jalaliWeekdaysEn = ['Fri', 'Thu', 'Wed', 'Tue', 'Mon', 'Sun', 'Sat'];
const weekOrderByGregorianDay = [5, 4, 3, 2, 1, 0, 6];

type CalendarDay = {
  date: Date;
  jalaliYear: number;
  jalaliMonth: number;
  jalaliDay: number;
  isCurrentMonth: boolean;
};

const buildCalendarDays = (jalaliYear: number, jalaliMonth: number): CalendarDay[] => {
  const [gy, gm, gd] = jalaliToGregorian(jalaliYear, jalaliMonth, 1);
  const firstDay = new Date(gy, gm - 1, gd);
  const calendarStart = new Date(firstDay);

  while (weekOrderByGregorianDay[0] !== calendarStart.getDay()) {
    calendarStart.setDate(calendarStart.getDate() - 1);
  }

  const days: CalendarDay[] = [];
  for (let i = 0; i < 35; i += 1) {
    const current = new Date(calendarStart);
    current.setDate(calendarStart.getDate() + i);
    const [jy, jm, jd] = gregorianToJalali(
      current.getFullYear(),
      current.getMonth() + 1,
      current.getDate(),
    );

    days.push({
      date: current,
      jalaliYear: jy,
      jalaliMonth: jm,
      jalaliDay: jd,
      isCurrentMonth: jy === jalaliYear && jm === jalaliMonth,
    });
  }

  return days;
};

export default function ProfilePage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [availabilityMap, setAvailabilityMap] = useState<AvailabilityMap>({});
  const [availabilityModal, setAvailabilityModal] = useState<{
    day: CalendarDay;
    start: string;
    end: string;
  } | null>(null);

  const getAvailabilityKey = (day: CalendarDay) =>
    `${day.jalaliYear}-${day.jalaliMonth}-${day.jalaliDay}`;

  const openAvailabilityModal = (day: CalendarDay) => {
    const key = getAvailabilityKey(day);
    const existing = availabilityMap[key];
    setAvailabilityModal({
      day,
      start: existing?.start ?? '09:00',
      end: existing?.end ?? '17:00',
    });
  };

  const closeAvailabilityModal = () => setAvailabilityModal(null);

  const persistAvailability = async (nextMap: AvailabilityMap) => {
    if (!user || user.userType !== 'worker') {
      return;
    }

    await profileAPI.updateWorkerProfile({
      availabilityCalendar: nextMap,
    });
  };

  const saveAvailability = async () => {
    if (!availabilityModal) return;
    const key = getAvailabilityKey(availabilityModal.day);
    const previousMap = { ...availabilityMap };
    const nextMap: AvailabilityMap = {
      ...availabilityMap,
      [key]: { start: availabilityModal.start, end: availabilityModal.end },
    };

    setAvailabilityMap(nextMap);

    try {
      await persistAvailability(nextMap);
      closeAvailabilityModal();
    } catch (error) {
      console.error('Error saving availability:', error);
      alert(
        language === 'fa'
          ? 'ذخیره موجودیت با مشکل مواجه شد. لطفاً دوباره تلاش کنید.'
          : 'Failed to save availability. Please try again.',
      );
      setAvailabilityMap({ ...previousMap });
    }
  };

  const markUnavailable = async () => {
    if (!availabilityModal) return;
    const key = getAvailabilityKey(availabilityModal.day);
    const previousMap = { ...availabilityMap };
    const nextMap: AvailabilityMap = { ...availabilityMap };
    delete nextMap[key];

    setAvailabilityMap(nextMap);

    try {
      await persistAvailability(nextMap);
      closeAvailabilityModal();
    } catch (error) {
      console.error('Error removing availability:', error);
      alert(
        language === 'fa'
          ? 'حذف موجودیت با مشکل مواجه شد. لطفاً دوباره تلاش کنید.'
          : 'Failed to remove availability. Please try again.',
      );
      setAvailabilityMap({ ...previousMap });
    }
  };

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);

    const loadData = async () => {
      try {
        setLoading(true);

        if (currentUser.userType === 'worker') {
          const profileResponse = await profileAPI.getWorkerProfile(currentUser.id);
          setProfileData(profileResponse.data);

          const availabilityData =
            profileResponse.data?.profile?.availability_calendar;

          if (availabilityData) {
            try {
              setAvailabilityMap(
                typeof availabilityData === 'string'
                  ? JSON.parse(availabilityData)
                  : availabilityData,
              );
            } catch (parseError) {
              console.error('Failed to parse availability calendar:', parseError);
              setAvailabilityMap({});
            }
          } else {
            setAvailabilityMap({});
          }

          const dashboardResponse = await dashboardAPI.getWorkerDashboard();
          setDashboardData(dashboardResponse.data);
        } else {
          const dashboardResponse = await dashboardAPI.getBusinessDashboard();
          setDashboardData(dashboardResponse.data);
        }
      } catch (error) {
        console.error('Error loading profile page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todayJalali = useMemo(() => {
    const tehranDate = getTehranCurrentDate();
    const [jy, jm, jd] = gregorianToJalali(
      tehranDate.year,
      tehranDate.month,
      tehranDate.day,
    );
    return { jy, jm, jd };
  }, []);

  const [calendarState, setCalendarState] = useState(() => ({
    year: todayJalali.jy,
    month: todayJalali.jm,
  }));

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarState.year, calendarState.month),
    [calendarState.year, calendarState.month],
  );

  const highlightedDates = useMemo(() => {
    const set = new Set<string>();

    if (dashboardData?.upcomingShifts) {
      dashboardData.upcomingShifts.forEach((shift: any) => {
        const date = new Date(shift.shift_date);
        const [jy, jm, jd] = gregorianToJalali(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
        );
        set.add(`${jy}-${jm}-${jd}`);
      });
    }

    Object.keys(availabilityMap).forEach((key) => set.add(key));

    return set;
  }, [availabilityMap, dashboardData?.upcomingShifts]);

  const monthNames = language === 'fa' ? jalaliMonthNamesFa : jalaliMonthNamesEn;
  const weekdayNames = language === 'fa' ? jalaliWeekdaysFa : jalaliWeekdaysEn;

  const formatNumber = (value: number | string) =>
    language === 'fa' ? toPersianNum(value) : value.toString();

  const getDurationLabel = (value: number) => {
    const display = Number.isInteger(value) ? value.toString() : value.toFixed(1);
    if (language === 'fa') {
      return `${toPersianNum(display)} ساعت`;
    }
    return `${display} ${value === 1 ? 'hour' : 'hours'}`;
  };

  const handleNextMonth = () =>
    setCalendarState((prev) => {
      if (prev.month === 12) {
        return { month: 1, year: prev.year + 1 };
      }
      return { ...prev, month: prev.month + 1 };
    });

  const handlePreviousMonth = () =>
    setCalendarState((prev) => {
      if (prev.month === 1) {
        return { month: 12, year: prev.year - 1 };
      }
      return { ...prev, month: prev.month - 1 };
    });

  const handleResetToToday = () => {
    const tehranDate = getTehranCurrentDate();
    const [jy, jm] = gregorianToJalali(
      tehranDate.year,
      tehranDate.month,
      tehranDate.day,
    );
    setCalendarState({
      year: jy,
      month: jm,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-concrete flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ink" />
          <p className="text-ink font-bold mt-4">
            {language === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const profile = profileData?.profile || {};
  const incomeStats = dashboardData?.incomeStats || {};
  const attendanceRate =
    profile.attendance_rate ??
    incomeStats.attendance_rate ??
    dashboardData?.workerStats?.attendance_rate ??
    null;
  const averageRating =
    profile.average_rating ??
    dashboardData?.workerStats?.rating ??
    0;
  const completedShifts =
    incomeStats.total_shifts_completed ??
    dashboardData?.completedShifts?.length ??
    0;

  const totalEarnings = Number(incomeStats.total_earnings || 0);
  const monthEarnings =
    incomeStats.current_month_earnings ??
    incomeStats.currentMonth ??
    0;

  const phone =
    profile.phone_number ||
    profile.mobile_number ||
    profile.phone ||
    user.phone ||
    (language === 'fa' ? 'ثبت نشده' : 'Not provided');
  const memberSince =
    profile.created_at ||
    profileData?.created_at ||
    user.createdAt ||
    new Date().toISOString();
  const memberSinceDate = new Date(memberSince);
  const [memberSinceJy, memberSinceJm, memberSinceJd] = gregorianToJalali(
    memberSinceDate.getFullYear(),
    memberSinceDate.getMonth() + 1,
    memberSinceDate.getDate(),
  );

  const settingsItems = [
    {
      label: language === 'fa' ? 'گواهی من' : 'My Certificates',
      helper: language === 'fa' ? 'مدارک و فایل‌ها' : 'Documents & files',
      icon: Award,
      href: '/profile/certificates',
    },
    {
      label: language === 'fa' ? 'امور مالی من' : 'My Finances',
      helper: language === 'fa' ? 'پرداخت‌ها و درآمد' : 'Payments & earnings',
      icon: Coins,
      href: '/profile/finances',
    },
    {
      label: language === 'fa' ? 'ترجیحات' : 'Preferences',
      helper: language === 'fa' ? 'اعلان‌ها، ظاهر و حریم خصوصی' : 'Notifications, appearance, privacy',
      icon: Settings,
      href: '/profile/preferences',
    },
    {
      label: language === 'fa' ? 'اطلاعات شخصی' : 'Personal Info',
      helper: language === 'fa' ? 'مشاهده و ویرایش اطلاعات فردی' : 'View & edit personal details',
      icon: User,
      href: '/profile/personal-info',
    },
  ];

  const statsCards = [
    {
      value: language === 'fa'
        ? toPersianNum(completedShifts)
        : completedShifts.toLocaleString(),
      label: language === 'fa' ? 'شیفت‌های انجام شده' : 'Completed Shifts',
    },
    {
      value: language === 'fa'
        ? toPersianNum(Number(averageRating).toFixed(1))
        : Number(averageRating).toFixed(1),
      label: language === 'fa' ? 'میانگین امتیاز' : 'Average Rating',
    },
    {
      value:
        attendanceRate === null
          ? (language === 'fa' ? '۰٪' : '0%')
          : language === 'fa'
          ? `${toPersianNum(Math.round(attendanceRate <= 1 ? attendanceRate * 100 : attendanceRate))}%`
          : `${Math.round(attendanceRate <= 1 ? attendanceRate * 100 : attendanceRate)}%`,
      label: language === 'fa' ? 'نرخ حضور' : 'Attendance Rate',
    },
  ];

  const calendarRows: CalendarDay[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarRows.push(calendarDays.slice(i, i + 7));
  }

  if (user.userType !== 'worker') {
    return (
      <div
        className="min-h-screen bg-concrete pt-24"
        dir={language === 'fa' ? 'rtl' : 'ltr'}
      >
        <div className="max-w-3xl mx-auto px-8 py-16 space-y-6">
          <div className="bg-white border-2 border-ink rounded-[30px] shadow-[4px_4px_0px_0px_#1a1a1a] p-10 text-center">
            <h1 className="text-2xl font-bold text-ink mb-3 font-display">
              {language === 'fa' ? 'پروفایل کسب‌وکار' : 'Business Profile'}
            </h1>
            <p className="text-ink/70 font-body">
              {language === 'fa'
                ? 'نمای کامل پروفایل کسب‌وکار به‌زودی در دسترس قرار می‌گیرد. برای ویرایش اطلاعات از گزینه زیر استفاده کنید.'
                : 'A dedicated business profile experience is coming soon. Use the button below to manage your information.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/profile/edit"
                className="inline-flex items-center gap-2 rounded-xl bg-ink text-white border-2 border-ink px-5 py-3 text-sm font-bold hover:bg-safety hover:text-black hover:shadow-[4px_4px_0px_0px_#1a1a1a] transition-all"
              >
                <Edit className="w-4 h-4" />
                {language === 'fa' ? 'ویرایش پروفایل' : 'Edit Profile'}
              </Link>
              <Link
                href="/admin/shifts"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-ink px-5 py-3 text-sm font-bold text-ink hover:bg-concrete-dark transition-all"
              >
                <Coins className="w-4 h-4" />
                {language === 'fa' ? 'مدیریت شیفت‌ها' : 'Manage Shifts'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const modalDurationHours = availabilityModal
    ? formatDurationHours(availabilityModal.start, availabilityModal.end)
    : 0;

  const availabilityModalTitle = availabilityModal
    ? language === 'fa'
      ? `${toPersianNum(availabilityModal.day.jalaliDay)} ${
          jalaliMonthNamesFa[availabilityModal.day.jalaliMonth - 1]
        }`
      : format(availabilityModal.day.date, 'MMM dd, yyyy')
    : '';

  const modalDurationLabel = availabilityModal
    ? getDurationLabel(modalDurationHours)
    : '';

  return (
    <div
      className="min-h-screen bg-concrete dark:bg-ink text-ink dark:text-concrete pt-24"
      dir={language === 'fa' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-[1229px] mx-auto px-8 pt-6 pb-8 space-y-6">
        <div className="flex justify-end" dir="ltr">
          <div className="flex items-center gap-2 text-ink">
            <h1
              className={`text-lg font-bold font-display ${
                language === 'fa' ? 'text-right' : ''
              }`}
            >
              {language === 'fa' ? 'پروفایل' : 'Profile'}
            </h1>
            <button
              type="button"
              onClick={() => router.push('/shifts')}
              className="inline-flex items-center justify-center rounded-full size-8 border-2 border-ink hover:bg-concrete-dark transition-all"
              aria-label={language === 'fa' ? 'رفتن به شیفت‌ها' : 'Go to shifts'}
            >
              <ArrowRight className={`w-4 h-4 text-ink ${language === 'fa' ? '' : 'rotate-180'}`} />
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full max-w-[380px] bg-white border-2 border-ink rounded-[30px] shadow-[4px_4px_0px_0px_#1a1a1a] p-6 space-y-6">
          <div className="space-y-4">
            <div className="text-sm font-bold text-ink font-display">
              {language === 'fa' ? 'تنظیمات' : 'Settings'}
            </div>
            <div className="space-y-3">
              {settingsItems.map(({ icon: Icon, label, helper, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between h-[72px] rounded-[14px] px-4 border-2 border-transparent hover:border-ink hover:bg-concrete-dark transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-10 rounded-full bg-moss/20 border-2 border-ink flex items-center justify-center">
                      <Icon className="w-5 h-5 text-moss" />
                    </span>
                    <div className="text-sm">
                      <div className="font-bold text-ink">{label}</div>
                      <div className="text-xs text-ink/60">{helper}</div>
                    </div>
                  </div>
                  <span className={`text-ink/40 text-base font-bold ${language === 'fa' ? '' : 'rotate-180'}`}>
                    ‹
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-ink/20 pt-4 space-y-4">
            <div className="text-sm font-bold text-ink/70 font-display">
              {language === 'fa' ? 'اطلاعات حساب' : 'Account Information'}
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink/60 font-bold">
                  {language === 'fa' ? 'ایمیل' : 'Email'}
                </span>
                <span className="text-ink break-words font-bold">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink/60 font-bold">
                  {language === 'fa' ? 'تلفن' : 'Phone'}
                </span>
                <span className="text-ink font-bold">
                  {language === 'fa' ? toPersianNum(phone) : phone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink/60 font-bold">
                  {language === 'fa' ? 'عضویت از' : 'Member Since'}
                </span>
                <span className="text-ink font-bold">
                  {language === 'fa'
                    ? `${toPersianNum(memberSinceJd)} ${jalaliMonthNamesFa[memberSinceJm - 1]} ${toPersianNum(memberSinceJy)}`
                    : format(memberSinceDate, 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-ink/20 pt-4">
            <button
              type="button"
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="w-full text-left text-sm font-bold text-red-600 hover:text-red-700 hover:underline transition-colors"
            >
              {language === 'fa' ? 'خروج از حساب کاربری' : 'Log out'}
            </button>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <section className="bg-gradient-to-b from-ink to-moss border-2 border-ink rounded-[30px] text-concrete p-8 shadow-[4px_4px_0px_0px_#1a1a1a]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex-1">
                <div className="relative size-[120px] mb-6">
                  {profile.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt="Profile avatar"
                      className="size-full rounded-full object-cover border-4 border-white/30"
                    />
                  ) : (
                    <div className="size-full rounded-full border-4 border-white/30 flex items-center justify-center">
                      <User className="w-14 h-14 text-white/90" />
                    </div>
                  )}
                  <Link
                    href="/profile/edit"
                    className="absolute bottom-2 left-2 size-10 rounded-full bg-white dark:bg-concrete-dark border-2 border-ink dark:border-concrete text-ink dark:text-concrete flex items-center justify-center shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e0ded9] hover:bg-concrete-dark dark:hover:bg-concrete transition-all"
                    aria-label={language === 'fa' ? 'ویرایش تصویر' : 'Edit photo'}
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-white/80">
                    {profile.job_title ||
                      (language === 'fa' ? 'کارمند' : 'Worker')}
                  </p>
                  {profile.bio && (
                    <p className="text-white/80 max-w-md leading-7">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full lg:max-w-[600px] space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  {statsCards.map((card) => (
                    <div
                      key={card.label}
                      className="rounded-[20px] bg-white/20 border-2 border-concrete/30 px-4 py-4 text-center"
                    >
                      <div className="text-xl font-bold font-display">{card.value}</div>
                      <div className="text-xs text-concrete/90 font-bold">{card.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[20px] bg-white/20 border-2 border-concrete/30 px-4 py-4">
                    <div className="text-xs text-concrete/90 font-bold">
                      {language === 'fa' ? 'درآمد کل' : 'Total Earnings'}
                    </div>
                    <div className="text-lg font-bold mt-2 font-display">
                      {formatPersianCurrency(totalEarnings).replace(
                        language === 'fa' ? '' : ' ریال',
                        language === 'fa' ? '' : ' IRR',
                      )}
                    </div>
                  </div>
                  <div className="rounded-[20px] bg-white/20 border-2 border-concrete/30 px-4 py-4">
                    <div className="text-xs text-concrete/90 font-bold">
                      {language === 'fa' ? 'درآمد این ماه' : 'This Month'}
                    </div>
                    <div className="text-lg font-bold mt-2 font-display">
                      {formatPersianCurrency(monthEarnings).replace(
                        language === 'fa' ? '' : ' ریال',
                        language === 'fa' ? '' : ' IRR',
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {profile.skills.slice(0, 6).map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white/30 border border-concrete/50 px-3 py-1 text-xs font-bold text-concrete"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-concrete-light border-2 border-ink dark:border-concrete rounded-[30px] shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e0ded9] p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-ink dark:text-ink font-display">
                  {language === 'fa' ? 'موجودیت' : 'Availability'}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePreviousMonth}
                  className="inline-flex items-center justify-center rounded-xl border-2 border-ink dark:border-concrete px-3 py-2 text-sm font-bold text-ink dark:text-ink hover:bg-concrete-dark dark:hover:bg-concrete transition-all"
                  aria-label={language === 'fa' ? 'ماه قبل' : 'Previous month'}
                >
                  {language === 'fa' ? '‹' : '›'}
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="inline-flex items-center justify-center rounded-xl bg-concrete-dark dark:bg-concrete-light border-2 border-ink dark:border-concrete px-4 py-2 text-sm font-bold text-ink dark:text-ink hover:bg-concrete dark:hover:bg-concrete transition-all"
                  aria-label={language === 'fa' ? 'ماه بعد' : 'Next month'}
                >
                  {monthNames[(calendarState.month + 11) % 12]}
                </button>
                <div className="inline-flex items-center justify-center rounded-xl bg-concrete-dark dark:bg-concrete-light border-2 border-ink dark:border-concrete px-4 py-2 text-sm font-bold text-ink dark:text-ink">
                  {language === 'fa'
                    ? toPersianNum(calendarState.year)
                    : calendarState.year}
                </div>
                <button
                  type="button"
                  onClick={handleResetToToday}
                  className="inline-flex items-center justify-center rounded-xl border-2 border-ink dark:border-concrete px-4 py-2 text-sm font-bold text-ink dark:text-ink hover:bg-concrete-dark dark:hover:bg-concrete transition-all"
                >
                  {language === 'fa' ? 'امروز' : 'Today'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-ink/70 dark:text-ink/80 font-bold">
                {weekdayNames.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarRows.flat().map((day) => {
                  const key = `${day.jalaliYear}-${day.jalaliMonth}-${day.jalaliDay}`;
                  const isAvailableDay = Boolean(availabilityMap[key]);
                  const isHighlighted = isAvailableDay || highlightedDates.has(key);
                  const isToday =
                    day.jalaliYear === todayJalali.jy &&
                    day.jalaliMonth === todayJalali.jm &&
                    day.jalaliDay === todayJalali.jd;

                  const baseClasses =
                    'h-[42px] rounded-lg flex items-center justify-center text-sm transition-all font-bold border-2';

                  const stateClasses = isHighlighted
                    ? 'bg-moss text-concrete border-ink shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e0ded9]'
                    : isToday
                    ? 'border-2 border-safety text-ink dark:text-ink bg-concrete-dark dark:bg-concrete-light'
                    : day.isCurrentMonth
                    ? 'bg-white dark:bg-concrete-light text-ink dark:text-ink border-ink dark:border-concrete hover:bg-concrete-dark dark:hover:bg-concrete'
                    : 'bg-concrete dark:bg-concrete text-ink/40 dark:text-ink/50 border-ink/30 dark:border-concrete/30 opacity-60';

                  return (
                    <button
                      key={day.date.toISOString()}
                      type="button"
                      onClick={() => day.isCurrentMonth && openAvailabilityModal(day)}
                      className={`${baseClasses} ${stateClasses} ${
                        day.isCurrentMonth ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-safety' : 'cursor-default'
                      }`}
                      disabled={!day.isCurrentMonth}
                    >
                      {formatNumber(day.jalaliDay)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t-2 border-ink/20 dark:border-ink/30 pt-4 flex items-center justify-end gap-6 text-xs text-ink/70 dark:text-ink/80 font-bold">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-moss border border-ink" />
                <span>{language === 'fa' ? 'موجود' : 'Available'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-concrete-dark dark:bg-concrete-light border-2 border-ink dark:border-concrete" />
                <span>{language === 'fa' ? 'غیرموجود' : 'Unavailable'}</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    {availabilityModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div
          className="w-full max-w-md rounded-[28px] bg-white border-2 border-ink p-6 shadow-[8px_8px_0px_0px_#1a1a1a]"
          dir={language === 'fa' ? 'rtl' : 'ltr'}
        >
          <div className="flex items-start justify-between mb-4">
            <button
              type="button"
              onClick={closeAvailabilityModal}
              className="rounded-full border-2 border-ink p-2 text-ink hover:bg-concrete-dark transition-all"
              aria-label={language === 'fa' ? 'بستن' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center px-2">
              <h2 className="text-base font-bold text-ink font-display">
                {language === 'fa'
                  ? `انتخاب ساعات موجودیت برای ${availabilityModalTitle}`
                  : `Set availability for ${availabilityModalTitle}`}
              </h2>
              <p className="mt-1 text-sm text-ink/70 font-bold">
                {language === 'fa'
                  ? 'بازه زمانی موجودیت خود را مشخص کنید'
                  : 'Choose the time window you are available'}
              </p>
            </div>
            <div className="rounded-full bg-concrete-dark border-2 border-ink p-2 text-moss">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-bold text-ink">
                {language === 'fa' ? 'از ساعت:' : 'From'}
                <select
                  value={availabilityModal.start}
                  onChange={(event) =>
                    setAvailabilityModal((prev) =>
                      prev ? { ...prev, start: event.target.value } : prev,
                    )
                  }
                  className="h-12 rounded-xl border-2 border-ink dark:border-concrete bg-white dark:bg-concrete-dark px-3 text-ink dark:text-concrete focus:border-safety focus:outline-none focus:ring-2 focus:ring-safety font-body"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {language === 'fa' ? toPersianNum(time) : time}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-bold text-ink">
                {language === 'fa' ? 'تا ساعت:' : 'To'}
                <select
                  value={availabilityModal.end}
                  onChange={(event) =>
                    setAvailabilityModal((prev) =>
                      prev ? { ...prev, end: event.target.value } : prev,
                    )
                  }
                  className="h-12 rounded-xl border-2 border-ink dark:border-concrete bg-white dark:bg-concrete-dark px-3 text-ink dark:text-concrete focus:border-safety focus:outline-none focus:ring-2 focus:ring-safety font-body"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {language === 'fa' ? toPersianNum(time) : time}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-xl bg-concrete-dark dark:bg-concrete border-2 border-ink dark:border-concrete px-4 py-3 text-sm text-ink dark:text-concrete font-bold">
              {language === 'fa' ? 'مدت زمان: ' : 'Duration: '}
              <span className="font-display">
                {modalDurationLabel}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={markUnavailable}
                className="rounded-xl border-2 border-ink px-4 py-2 text-sm font-bold text-ink hover:bg-concrete-dark transition-all"
              >
                {language === 'fa' ? 'ناموجود' : 'Unavailable'}
              </button>
              <button
                type="button"
                onClick={closeAvailabilityModal}
                className="rounded-xl border-2 border-ink px-4 py-2 text-sm font-bold text-ink hover:bg-concrete-dark transition-all"
              >
                {language === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={saveAvailability}
                className="rounded-xl bg-moss text-concrete border-2 border-ink px-4 py-2 text-sm font-bold hover:shadow-[2px_2px_0px_0px_#1a1a1a] transition-all"
              >
                {language === 'fa' ? 'ذخیره' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}


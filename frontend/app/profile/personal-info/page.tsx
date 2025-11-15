'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, MapPin, Phone, User, UserCheck, UserCircle, Wallet, Languages, FileText, GraduationCap } from 'lucide-react';
import { profileAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { gregorianToJalali, toPersianNum } from '@/lib/persianUtils';

type DetailField = {
  label: string;
  value?: string | null;
  helper?: string;
};

type DetailSection = {
  title: string;
  description: string;
  icon: ReactNode;
  fields: DetailField[];
  highlight?: boolean;
  footer?: ReactNode;
};

const toDisplayValue = (value: string | null | undefined, language: 'fa' | 'en') => {
  if (!value) {
    return language === 'fa' ? 'تکمیل نشده' : 'Not provided';
  }
  return language === 'fa' ? toPersianNum(value) : value;
};

const formatDate = (isoDate: string | null | undefined, language: 'fa' | 'en') => {
  if (!isoDate) return language === 'fa' ? 'تکمیل نشده' : 'Not provided';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return language === 'fa' ? 'تکمیل نشده' : 'Not provided';
  if (language === 'fa') {
    const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    return `${toPersianNum(jd)} ${['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'][jm - 1]} ${toPersianNum(jy)}`;
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function PersonalInfoPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    if (currentUser.userType !== 'worker') {
      setLoading(false);
      return;
    }
    const loadProfile = async () => {
      try {
        const response = await profileAPI.getWorkerProfile(currentUser.id);
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to load personal info:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [router]);

  const profile = profileData?.profile || {};

  const memberSince = useMemo(() => {
    const date =
      user?.createdAt ||
      profile?.created_at ||
      profileData?.created_at ||
      null;
    return formatDate(date, language);
  }, [user, profile, profileData, language]);

  const lastUpdated = useMemo(() => {
    const date = profile?.updated_at || profileData?.updated_at || null;
    return formatDate(date, language);
  }, [profile, profileData, language]);

  const parsedLanguages = useMemo(() => {
    if (!profile?.languages) return [];
    let raw: any = profile.languages;
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw);
      } catch (error) {
        raw = [];
      }
    }
    if (!Array.isArray(raw)) return [];
    return raw
      .map((lang: any) => (typeof lang === 'string' ? { name: lang, level: '' } : lang))
      .filter((lang: any) => lang?.name)
      .map((lang: any) => ({
        name: String(lang.name),
        level: lang?.level ? String(lang.level) : '',
      }));
  }, [profile?.languages]);

  const parsedDocuments = useMemo(() => {
    if (!profile?.documents) return {};
    if (typeof profile.documents === 'string') {
      try {
        return JSON.parse(profile.documents);
      } catch (error) {
        return {};
      }
    }
    return profile.documents || {};
  }, [profile?.documents]);

const personalityTraitsList = useMemo(() => {
  if (!profile?.personality_traits) return [];
  return String(profile.personality_traits)
    .split(/[,،\n]/)
    .map((trait) => trait.trim())
    .filter(Boolean);
}, [profile?.personality_traits]);

  const languageLevelLabels: Record<string, { fa: string; en: string }> = {
    native: { fa: 'زبان مادری', en: 'Native' },
    advanced: { fa: 'پیشرفته', en: 'Advanced' },
    intermediate: { fa: 'متوسط', en: 'Intermediate' },
    basic: { fa: 'مبتدی', en: 'Basic' },
  };

  const documentCardDefinitions: Array<{ key: 'identity' | 'education' | 'military'; labelFa: string; labelEn: string; helperFa?: string; helperEn?: string }> = [
    {
      key: 'identity',
      labelFa: 'تصویر شناسنامه',
      labelEn: 'National ID document',
      helperFa: 'PNG, JPG یا PDF • حداکثر ۵ مگابایت',
      helperEn: 'PNG, JPG or PDF • up to 5 MB',
    },
    {
      key: 'education',
      labelFa: 'مدرک تحصیلی',
      labelEn: 'Educational certificate',
      helperFa: 'برای تأیید سوابق تحصیلی',
      helperEn: 'Verify your education history',
    },
    {
      key: 'military',
      labelFa: 'مدرک نظام وظیفه (در صورت نیاز)',
      labelEn: 'Military service document (if applicable)',
      helperFa: 'در صورت نیاز، معافیت یا کارت پایان خدمت را بارگذاری کنید',
      helperEn: 'Upload exemption or completion document if required',
    },
  ];

  const handleDocumentDownload = (doc: any) => {
    if (!doc?.data) return;
    const link = document.createElement('a');
    const href =
      typeof doc.data === 'string' && doc.data.startsWith('data:')
        ? doc.data
        : `data:${doc.mimeType || 'application/octet-stream'};base64,${doc.data}`;
    link.href = href;
    link.download = doc.fileName || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const militaryStatusLabels: Record<string, { fa: string; en: string }> = {
    exempt_permanent: { fa: 'معافیت دائم', en: 'Permanent exemption' },
    exempt_education: { fa: 'معافیت تحصیلی', en: 'Student exemption' },
    completed: { fa: 'پایان خدمت', en: 'Completed service' },
    serving: { fa: 'در حال خدمت', en: 'Currently serving' },
    not_applicable: { fa: 'نیازی نیست', en: 'Not applicable' },
  };

  const educationLevelLabels: Record<string, { fa: string; en: string }> = {
    diploma: { fa: 'دیپلم', en: 'Diploma' },
    associate: { fa: 'فوق دیپلم', en: 'Associate' },
    bachelor: { fa: 'کارشناسی', en: 'Bachelor' },
    master: { fa: 'کارشناسی ارشد', en: 'Master' },
    doctorate: { fa: 'دکتری', en: 'Doctorate' },
    other: { fa: 'سایر', en: 'Other' },
  };

  const aboutMeText = profile?.about_me || profile?.bio || '';

  const completionChecklist = useMemo(() => {
    const items = [
      { key: 'birth_date', value: profile?.birth_date },
      { key: 'national_id', value: profile?.national_id },
      { key: 'phone_number', value: profile?.phone_number },
      { key: 'address', value: profile?.address },
      { key: 'city', value: profile?.city },
      { key: 'province', value: profile?.province },
      { key: 'bank_account_holder', value: profile?.bank_account_holder },
      { key: 'bank_card_number', value: profile?.bank_card_number },
      { key: 'bank_iban', value: profile?.bank_iban },
      { key: 'education_level', value: profile?.education_level },
      { key: 'education_field', value: profile?.education_field },
      { key: 'education_institution', value: profile?.education_institution },
      { key: 'education_graduation_year', value: profile?.education_graduation_year },
      { key: 'languages', value: parsedLanguages.length > 0 },
      { key: 'documents_identity', value: Boolean(parsedDocuments?.identity?.data) },
      {
        key: 'documents_education',
        value: Boolean(parsedDocuments?.education?.data),
      },
      {
        key: 'documents_military',
        value:
          profile?.military_status === 'not_applicable'
            ? true
            : Boolean(parsedDocuments?.military?.data),
      },
      { key: 'about_me', value: aboutMeText && aboutMeText.trim().length > 0 },
    ];
    const completed = items.filter((item) => {
      if (typeof item.value === 'boolean') return item.value;
      return item.value !== null && item.value !== undefined && String(item.value).trim() !== '';
    }).length;
    return {
      completed,
      total: items.length,
    };
  }, [profile, parsedLanguages, parsedDocuments, aboutMeText]);

  const completionPercent = completionChecklist.total
    ? Math.round((completionChecklist.completed / completionChecklist.total) * 100)
    : 0;

  const verificationItems = useMemo(() => {
    const phoneStatus = profile?.phone_verified
      ? 'verified'
      : profile?.phone_number
      ? 'pending'
      : 'missing';

    const militaryValue = profile?.military_status || '';
    const militaryComplete =
      militaryValue && militaryValue !== 'not_applicable' ? true : militaryValue === 'not_applicable';

    const identityDocStatus = parsedDocuments?.identity?.data ? 'verified' : 'missing';
    const educationDocStatus = parsedDocuments?.education?.data ? 'verified' : 'missing';
    const militaryDocStatus =
      profile?.military_status === 'not_applicable'
        ? 'verified'
        : parsedDocuments?.military?.data
        ? 'verified'
        : 'missing';

    return [
      {
        key: 'national_id',
        labelFa: 'کد ملی',
        labelEn: 'National ID',
        status: profile?.national_id ? 'verified' : 'missing',
      },
      {
        key: 'phone_number',
        labelFa: 'شماره تماس',
        labelEn: 'Phone number',
        status: phoneStatus,
      },
      {
        key: 'identity_document',
        labelFa: 'مدرک شناسایی',
        labelEn: 'Identity document',
        status: identityDocStatus,
      },
      {
        key: 'education_document',
        labelFa: 'مدرک تحصیلی',
        labelEn: 'Education document',
        status: educationDocStatus,
      },
      {
        key: 'military_status',
        labelFa: 'وضعیت نظام وظیفه',
        labelEn: 'Military status',
        status: militaryComplete ? 'verified' : 'missing',
      },
      {
        key: 'military_document',
        labelFa: 'مدرک نظام وظیفه',
        labelEn: 'Military document',
        status: militaryDocStatus,
      },
    ];
  }, [
    profile?.national_id,
    profile?.phone_verified,
    profile?.phone_number,
    profile?.military_status,
    parsedDocuments?.identity?.data,
    parsedDocuments?.education?.data,
    parsedDocuments?.military?.data,
  ]);

  const pendingIdentityItems = verificationItems.filter((item) => item.status !== 'verified');

  const displayedName = `${toDisplayValue(user?.firstName, language)} ${toDisplayValue(user?.lastName, language)}`.trim();
  const displayedRole =
    profile?.job_title ||
    (language === 'fa' ? 'کاربر کارجو' : 'Worker');

  const identityFields: DetailField[] = [
    {
      label: language === 'fa' ? 'نام' : 'First name',
      value: toDisplayValue(user?.firstName, language),
    },
    {
      label: language === 'fa' ? 'نام خانوادگی' : 'Last name',
      value: toDisplayValue(user?.lastName, language),
    },
    {
      label: language === 'fa' ? 'تاریخ تولد' : 'Birth date',
      value: formatDate(profile?.birth_date || profile?.birthdate, language),
    },
    {
      label: language === 'fa' ? 'جنسیت' : 'Gender',
      value: profile?.gender
        ? language === 'fa'
          ? toPersianNum(profile.gender === 'female' ? 'مونث' : profile.gender === 'male' ? 'مذکر' : profile.gender)
          : profile.gender
        : language === 'fa'
        ? 'تعیین نشده'
        : 'Not specified',
    },
    {
      label: language === 'fa' ? 'کد ملی' : 'National ID',
      value: toDisplayValue(profile?.national_id, language),
    },
    {
      label: language === 'fa' ? 'وضعیت نظام وظیفه' : 'Military status',
      value: profile?.military_status
        ? (language === 'fa'
            ? militaryStatusLabels[profile.military_status]?.fa || profile.military_status
            : militaryStatusLabels[profile.military_status]?.en || profile.military_status)
        : language === 'fa'
        ? 'تعیین نشده'
        : 'Not set',
    },
  ];

  const contactFields: DetailField[] = [
    {
      label: language === 'fa' ? 'شماره تماس' : 'Phone number',
      value: toDisplayValue(
        profile?.phone_number ||
          profile?.mobile_number ||
          user?.phone,
        language,
      ),
    },
    {
      label: language === 'fa' ? 'ایمیل' : 'Email',
      value: toDisplayValue(user?.email, language),
    },
    {
      label: language === 'fa' ? 'آدرس' : 'Address',
      value: toDisplayValue(profile?.address, language),
    },
    {
      label: language === 'fa' ? 'شهر' : 'City',
      value: toDisplayValue(profile?.city, language),
    },
    {
      label: language === 'fa' ? 'استان' : 'Province',
      value: toDisplayValue(profile?.province, language),
    },
  ];

  const bankingFields: DetailField[] = [
    {
      label: language === 'fa' ? 'نام دارنده حساب' : 'Account holder',
      value: toDisplayValue(profile?.bank_account_holder, language),
    },
    {
      label: language === 'fa' ? 'شماره کارت' : 'Card number',
      value: toDisplayValue(profile?.bank_card_number, language),
    },
    {
      label: language === 'fa' ? 'شماره شبا' : 'IBAN',
      value: toDisplayValue(profile?.bank_iban, language),
    },
  ];

  const educationFields: DetailField[] = [
    {
      label: language === 'fa' ? 'سطح تحصیلات' : 'Education level',
      value: profile?.education_level
        ? language === 'fa'
          ? educationLevelLabels[profile.education_level]?.fa || profile.education_level
          : educationLevelLabels[profile.education_level]?.en || profile.education_level
        : language === 'fa'
        ? 'تکمیل نشده'
        : 'Not provided',
    },
    {
      label: language === 'fa' ? 'رشته تحصیلی' : 'Field of study',
      value: toDisplayValue(profile?.education_field, language),
    },
  {
    label: language === 'fa' ? 'محل تحصیل' : 'Institution',
    value: toDisplayValue(profile?.education_institution, language),
  },
  {
    label: language === 'fa' ? 'سال فارغ‌التحصیلی' : 'Graduation year',
    value: profile?.education_graduation_year
      ? language === 'fa'
        ? toPersianNum(String(profile.education_graduation_year))
        : String(profile.education_graduation_year)
      : language === 'fa'
      ? 'تکمیل نشده'
      : 'Not provided',
  },
    {
      label: language === 'fa' ? 'سابقه کاری (سال)' : 'Experience (years)',
      value:
        profile?.experience_years !== null && profile?.experience_years !== undefined
          ? language === 'fa'
            ? toPersianNum(String(profile.experience_years))
            : String(profile.experience_years)
          : language === 'fa'
          ? 'تکمیل نشده'
          : 'Not provided',
    },
  ];

  const sections: DetailSection[] = [
    {
      title: language === 'fa' ? 'اطلاعات هویتی' : 'Identity information',
      description:
        language === 'fa'
          ? 'مشخصات فردی و مدارک شناسایی ثبت شده'
          : 'Basic personal details and identity information',
      icon: <UserCircle className="w-5 h-5 text-[#1a25a2]" />,
      fields: identityFields,
      highlight: true,
    },
    {
      title: language === 'fa' ? 'اطلاعات تماس' : 'Contact information',
      description:
        language === 'fa'
          ? 'راه‌های ارتباطی و محل سکونت'
          : 'Communication details and location',
      icon: <Phone className="w-5 h-5 text-[#1a25a2]" />,
      fields: contactFields,
    },
    {
      title: language === 'fa' ? 'اطلاعات بانکی' : 'Bank details',
      description:
        language === 'fa'
          ? 'اطلاعات حساب برای واریز درآمد'
          : 'Bank account details used for payouts',
      icon: <Wallet className="w-5 h-5 text-[#1a25a2]" />,
      fields: bankingFields,
      footer: (
        <p className="text-xs text-gray-500">
          {language === 'fa'
            ? 'اطلاعات بانکی شما به صورت رمزنگاری شده ذخیره می‌شود و تنها برای واریز حقوق استفاده خواهد شد.'
            : 'Your banking details are encrypted and used only for salary payouts.'}
        </p>
      ),
    },
    {
      title: language === 'fa' ? 'اطلاعات تحصیلی' : 'Education',
      description:
        language === 'fa'
          ? 'آخرین مقطع تحصیلی و زمینه تخصصی شما'
          : 'Your latest degree and specialization',
      icon: <GraduationCap className="w-5 h-5 text-[#1a25a2]" />,
      fields: educationFields,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          <p className="text-primary-700 mt-4">
            {language === 'fa' ? 'در حال بارگذاری اطلاعات...' : 'Loading personal information...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.userType !== 'worker') {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="max-w-lg bg-white shadow rounded-2xl p-8 text-center space-y-4">
          <UserCheck className="w-12 h-12 mx-auto text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'fa' ? 'ویژگی در دست توسعه' : 'Feature coming soon'}
          </h2>
          <p className="text-sm text-gray-600">
            {language === 'fa'
              ? 'نمایه اطلاعات شخصی برای کسب و کارها به‌زودی فعال می‌شود.'
              : 'Personal info dashboard for businesses will be available soon.'}
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 transition"
          >
            {language === 'fa' ? 'بازگشت به پروفایل' : 'Back to profile'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f9f9f9] text-neutral-900"
      dir={language === 'fa' ? 'rtl' : 'ltr'}
    >
      <div className="bg-gradient-to-b from-[#5b21b6] to-[#1a25a2] text-white">
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
          <div className="flex items-center justify-between gap-6">
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
                  {language === 'fa' ? 'اطلاعات شخصی' : 'Personal information'}
                </h1>
                <p className="text-white/80">
                  {language === 'fa'
                    ? 'مروری بر جزئیات هویتی و تماس شما در پلتفرم'
                    : 'Overview of your identity and contact details on the platform'}
                </p>
              </div>
            </div>
            <Link
              href="/profile/edit#personal-info"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#1a25a2] px-5 py-2 text-sm font-medium shadow hover:bg-white/90 transition"
            >
              <User className="w-4 h-4" />
              {language === 'fa' ? 'ویرایش اطلاعات' : 'Edit info'}
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-[24px] border border-white/15 bg-white/10 backdrop-blur-sm p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/70">{displayedRole}</p>
                  <p className="text-2xl font-semibold text-white">{displayedName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/60">
                    {language === 'fa' ? 'درصد تکمیل پروفایل' : 'Profile completion'}
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {language === 'fa' ? toPersianNum(completionPercent) : completionPercent}%
                  </p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-[#00d4aa] rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, completionPercent))}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/70">
                <span>
                  {language === 'fa' ? 'عضویت از' : 'Member since'}: {memberSince}
                </span>
                <span>
                  {language === 'fa'
                    ? `آخرین به‌روزرسانی: ${lastUpdated}`
                    : `Last updated: ${lastUpdated}`}
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/5 backdrop-blur-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white">
                {language === 'fa' ? 'موارد نیاز به تکمیل' : 'Items requiring attention'}
              </h3>
              {pendingIdentityItems.length === 0 ? (
                <div className="rounded-[14px] border border-white/20 bg-white/10 px-4 py-3 text-xs text-white">
                  {language === 'fa'
                    ? 'تمام اطلاعات هویتی مورد نیاز تکمیل شده است.'
                    : 'All identity requirements are complete.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingIdentityItems.map((item) => {
                    const statusLabelFa =
                      item.status === 'pending'
                        ? 'در انتظار تأیید'
                        : item.status === 'missing'
                        ? 'نیاز به تکمیل'
                        : 'تأیید شده';
                    const statusLabelEn =
                      item.status === 'pending'
                        ? 'Pending verification'
                        : item.status === 'missing'
                        ? 'Needs completion'
                        : 'Verified';
                    const statusClass =
                      item.status === 'verified'
                        ? 'text-[#00d4aa]'
                        : item.status === 'pending'
                        ? 'text-[#ffb800]'
                        : 'text-red-200';
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-[14px] border border-white/10 bg-white/10 px-4 py-3 text-xs text-white"
                      >
                        <span>
                          {language === 'fa' ? item.labelFa : item.labelEn}
                        </span>
                        <span className={`font-semibold ${statusClass}`}>
                          {language === 'fa' ? statusLabelFa : statusLabelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {sections.map((section) => (
          <section
            key={section.title}
            className={`rounded-[20px] border ${
              section.highlight
                ? 'border-[#d9defa] bg-gradient-to-br from-[#f6f6ff] to-white shadow-[0px_18px_45px_-25px_rgba(26,37,162,0.35)]'
                : 'border-gray-100 bg-white shadow-[0px_12px_30px_-25px_rgba(26,37,162,0.25)]'
            } p-6 space-y-6`}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center rounded-full bg-[#f1f2ff] w-12 h-12">
                {section.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <div
                  key={field.label}
                  className="rounded-[16px] border border-gray-100 bg-gray-50/60 px-4 py-3"
                >
                  <p className="text-xs font-medium text-gray-500 mb-1">{field.label}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {field.value}
                  </p>
                  {field.helper && (
                    <p className="text-xs text-gray-400 mt-1">{field.helper}</p>
                  )}
                </div>
              ))}
            </div>
            {section.footer && (
              <div className="rounded-[16px] border border-gray-100 bg-gray-50/70 px-4 py-3 text-xs text-gray-500">
                {section.footer}
              </div>
            )}
          </section>
        ))}

        <section className="rounded-[20px] border border-gray-100 bg-white shadow-[0px_12px_30px_-25px_rgba(26,37,162,0.25)] p-6 space-y-6">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center rounded-full bg-[#f1f2ff] w-12 h-12">
              <Languages className="w-5 h-5 text-[#1a25a2]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'fa' ? 'زبان‌ها' : 'Languages'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'زبان‌هایی که در پروفایل خود ثبت کرده‌اید.'
                  : 'Languages you have listed on your profile.'}
              </p>
            </div>
          </div>
          {parsedLanguages.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-gray-200 bg-gray-50/70 px-4 py-6 text-sm text-gray-500 text-center">
              {language === 'fa'
                ? 'هنوز زبانی ثبت نشده است.'
                : 'No languages have been added yet.'}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {parsedLanguages.map((lang, index) => (
                <div
                  key={`${lang.name}-${index}`}
                  className="rounded-[16px] border border-gray-100 bg-gray-50/60 px-4 py-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {language === 'fa' ? toPersianNum(lang.name) : lang.name}
                    </span>
                    {lang.level && (
                      <span className="text-xs font-medium text-[#1a25a2]">
                        {language === 'fa'
                          ? languageLevelLabels[lang.level]?.fa || lang.level
                          : languageLevelLabels[lang.level]?.en || lang.level}
                      </span>
                    )}
                  </div>
                  {lang.level && (
                    <div className="h-1.5 rounded-full bg-white overflow-hidden">
                      <div
                        className="h-full bg-[#1a25a2] transition-all"
                        style={{
                          width:
                            lang.level === 'native'
                              ? '100%'
                              : lang.level === 'advanced'
                              ? '80%'
                              : lang.level === 'intermediate'
                              ? '60%'
                              : '35%',
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <Link
              href="/profile/edit#personal-info"
              className="inline-flex items-center gap-2 rounded-full border border-[#1a25a2] px-4 py-1.5 text-xs font-medium text-[#1a25a2] hover:bg-[#1a25a2]/5 transition"
            >
              {language === 'fa' ? 'مدیریت زبان‌ها' : 'Manage languages'}
            </Link>
          </div>
        </section>

        <section className="rounded-[20px] border border-gray-100 bg-white shadow-[0px_12px_30px_-25px_rgba(26,37,162,0.25)] p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center rounded-full bg-[#f1f2ff] w-12 h-12">
              <UserCircle className="w-5 h-5 text-[#1a25a2]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'fa' ? 'درباره من' : 'About me'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'متنی که در بخش معرفی شما نمایش داده می‌شود.'
                  : 'This text appears in your public profile summary.'}
              </p>
            </div>
          </div>
          <div className="rounded-[16px] border border-gray-100 bg-gray-50/60 px-4 py-4 text-sm leading-6 text-gray-700">
            {aboutMeText && aboutMeText.trim().length > 0 ? (
              <p className="whitespace-pre-line">
                {language === 'fa' ? toPersianNum(aboutMeText) : aboutMeText}
              </p>
            ) : (
              <span className="text-gray-500">
                {language === 'fa'
                  ? 'هنوز توضیحی برای معرفی خود ثبت نکرده‌اید.'
                  : 'You have not added an introduction yet.'}
              </span>
            )}
          </div>
          {personalityTraitsList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {personalityTraitsList.map((trait) => (
                <span
                  key={trait}
                  className="inline-flex items-center rounded-full bg-[#f3f4ff] px-3 py-1 text-xs font-medium text-[#1a25a2]"
                >
                  {language === 'fa' ? toPersianNum(trait) : trait}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[20px] border border-gray-100 bg-white shadow-[0px_12px_30px_-25px_rgba(26,37,162,0.25)] p-6 space-y-6">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center rounded-full bg-[#f1f2ff] w-12 h-12">
              <FileText className="w-5 h-5 text-[#1a25a2]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'fa' ? 'مدارک و اسناد' : 'Documents'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'وضعیت مدارک بارگذاری شده در پروفایل شما.'
                  : 'Status of the documents you have uploaded.'}
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {documentCardDefinitions.map((docDef) => {
              const doc = parsedDocuments[docDef.key];
              const isUploaded = Boolean(doc?.data);
              return (
                <div
                  key={docDef.key}
                  className={`rounded-[16px] border p-4 space-y-3 ${
                    isUploaded ? 'border-[#00d4aa]/40 bg-[#00d4aa]/5' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {language === 'fa' ? docDef.labelFa : docDef.labelEn}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {language === 'fa' ? docDef.helperFa : docDef.helperEn}
                      </p>
                    </div>
                    <span
                      className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-medium ${
                        isUploaded
                          ? 'bg-[#00d4aa]/20 text-[#0f766e]'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isUploaded
                        ? language === 'fa'
                          ? 'بارگذاری شده'
                          : 'Uploaded'
                        : language === 'fa'
                        ? 'تکمیل نشده'
                        : 'Not uploaded'}
                    </span>
                  </div>
                  {isUploaded ? (
                    <div className="space-y-2">
                      <div className="rounded-lg bg-white/80 border border-white px-3 py-2 text-xs text-gray-600">
                        <p className="font-medium text-gray-800">{doc?.fileName || 'document.pdf'}</p>
                        {doc?.uploadedAt && (
                          <p className="mt-1">
                            {language === 'fa'
                              ? `تاریخ بارگذاری: ${toPersianNum(
                                  new Date(doc.uploadedAt).toLocaleDateString('fa-IR'),
                                )}`
                              : `Uploaded: ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDocumentDownload(doc)}
                        className="inline-flex items-center rounded-full border border-[#1a25a2] px-3 py-1.5 text-xs font-medium text-[#1a25a2] hover:bg-[#1a25a2]/5 transition"
                      >
                        {language === 'fa' ? 'دانلود' : 'Download'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {language === 'fa'
                        ? 'هنوز مدرکی برای این بخش بارگذاری نشده است.'
                        : 'No document has been uploaded for this category.'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
            <span>
              {language === 'fa'
                ? 'برای افزودن یا به‌روزرسانی مدارک از صفحه ویرایش پروفایل اقدام کنید.'
                : 'Use the profile edit page to upload or update your documents.'}
            </span>
            <Link
              href="/profile/edit#personal-info"
              className="inline-flex items-center gap-2 rounded-full border border-[#1a25a2] px-4 py-1.5 font-medium text-[#1a25a2] hover:bg-[#1a25a2]/5 transition"
            >
              {language === 'fa' ? 'مدیریت مدارک' : 'Manage documents'}
            </Link>
          </div>
        </section>

        <aside className="rounded-[20px] border border-dashed border-[#d1d5dc] bg-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-[#f3f4ff] w-12 h-12 text-[#1a25a2]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {language === 'fa' ? 'اطلاعات شما کامل نیست' : 'Some details are missing'}
              </h3>
              <p className="text-xs text-gray-500">
                {language === 'fa'
                  ? 'برای دریافت سریع‌تر پرداخت‌ها، لطفاً اطلاعات شخصی و بانکی را تکمیل کنید.'
                  : 'Complete your personal and banking details to ensure timely payouts.'}
              </p>
            </div>
          </div>
          <Link
            href="/profile/edit#personal-info"
            className="inline-flex items-center justify-center rounded-full bg-[#1a25a2] px-5 py-2 text-sm font-medium text-white hover:bg-[#161c85] transition"
          >
            {language === 'fa' ? 'تکمیل اطلاعات' : 'Update details'}
          </Link>
        </aside>
      </div>
    </div>
  );
}



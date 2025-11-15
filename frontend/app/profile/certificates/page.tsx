'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { profileAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Download, Trash2, UploadCloud } from 'lucide-react';
import { gregorianToJalali, jalaliToGregorian, toPersianNum } from '@/lib/persianUtils';

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData: string;
  uploadedAt: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatFileSize = (bytes: number, language: 'fa' | 'en') => {
  if (bytes === 0) return language === 'fa' ? '۰ بایت' : '0 B';
  const units = language === 'fa'
    ? ['بایت', 'کیلوبایت', 'مگابایت']
    : ['B', 'KB', 'MB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, index);
  const formatted = index === 0 ? Math.round(size) : size.toFixed(2);
  if (language === 'fa') {
    return `${toPersianNum(formatted)} ${units[index]}`;
  }
  return `${formatted} ${units[index]}`;
};

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const convertPersianDigitsToEnglish = (value: string) =>
  value.replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)));

const padNumber = (value: number) => value.toString().padStart(2, '0');

const isJalaliLeapYear = (year: number) => {
  const mod = year - (year >= 0 ? 474 : 473);
  const cycle = ((mod % 2820) + 2820) % 2820 + 474;
  return (cycle * 682) % 2816 < 682;
};

const getJalaliMonthLength = (year: number, month: number) => {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isJalaliLeapYear(year) ? 30 : 29;
};

export default function CertificatesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<{ url: string; type: 'image' | 'pdf' } | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [jalaliSelection, setJalaliSelection] = useState<{ year: string; month: string; day: string }>({
    year: '',
    month: '',
    day: '',
  });

  const jalaliMonthsFa = useMemo(
    () => [
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
    ],
    [],
  );

  const currentJalaliYear = useMemo(() => {
    const now = new Date();
    const [jy] = gregorianToJalali(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
    );
    return jy;
  }, []);

  const jalaliYears = useMemo(() => {
    const years: number[] = [];
    const start = currentJalaliYear;
    const end = currentJalaliYear - 70;
    for (let year = start; year >= end; year -= 1) {
      years.push(year);
    }
    return years;
  }, [currentJalaliYear]);

  const maxJalaliDay = useMemo(() => {
    if (!jalaliSelection.year || !jalaliSelection.month) {
      return 31;
    }
    const yearNum = Number(jalaliSelection.year);
    const monthNum = Number(jalaliSelection.month);
    if (Number.isNaN(yearNum) || Number.isNaN(monthNum) || !yearNum || !monthNum) {
      return 31;
    }
    return getJalaliMonthLength(yearNum, monthNum);
  }, [jalaliSelection.year, jalaliSelection.month]);

  const jalaliDays = useMemo(() => {
    return Array.from({ length: maxJalaliDay }, (_, index) => index + 1);
  }, [maxJalaliDay]);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
  });

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (currentUser.userType !== 'worker') {
      router.push('/profile');
      return;
    }

    setUser(currentUser);
    loadCertificates(currentUser.id);
  }, []);

  const loadCertificates = async (userId: string) => {
    try {
      setLoading(true);
      const response = await profileAPI.getWorkerProfile(userId);
      const rawCertificates = response.data?.profile?.certificates;

      if (!rawCertificates) {
        setCertificates([]);
        return;
      }

      const parsed: Certificate[] = (() => {
        if (Array.isArray(rawCertificates)) return rawCertificates;
        if (typeof rawCertificates === 'string') {
          try {
            const asJson = JSON.parse(rawCertificates);
            return Array.isArray(asJson) ? asJson : [];
          } catch (error) {
            console.error('Failed to parse certificates JSON', error);
            return [];
          }
        }
        return [];
      })();

      const normalized = parsed.map((item) => ({
        ...item,
      }));

      setCertificates(normalized);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileValidation = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError(
        language === 'fa'
          ? 'فرمت فایل مجاز نیست. تنها PDF، JPG یا PNG قابل بارگذاری است.'
          : 'Unsupported file type. Only PDF, JPG, or PNG files are allowed.',
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(
        language === 'fa'
          ? 'حجم فایل باید کمتر از ۵ مگابایت باشد.'
          : 'File size must be under 5MB.',
      );
      return false;
    }

    setFileError(null);
    return true;
  };

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    if (!handleFileValidation(file)) {
      setSelectedFile(null);
      setFilePreview(null);
      setFileDataUrl(null);
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFileDataUrl(result);
      const previewType = file.type === 'application/pdf' ? 'pdf' : 'image';
      setFilePreview({ url: result, type: previewType });
    };
    reader.onerror = () => {
      setFileError(
        language === 'fa'
          ? 'خواندن فایل با خطا مواجه شد.'
          : 'Failed to read the selected file.',
      );
      setSelectedFile(null);
      setFilePreview(null);
      setFileDataUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const handleJalaliSelectChange = (field: 'year' | 'month' | 'day', value: string) => {
    setJalaliSelection((prev) => {
      let next = { ...prev, [field]: value };

      const yearNum = Number(next.year);
      const monthNum = Number(next.month);
      const dayNum = Number(next.day);

      if ((field === 'year' || field === 'month') && next.day) {
        if (!Number.isNaN(yearNum) && !Number.isNaN(monthNum) && yearNum && monthNum) {
          const maxDay = getJalaliMonthLength(yearNum, monthNum);
          if (Number(next.day) > maxDay) {
            next = { ...next, day: maxDay.toString() };
          }
        }
      }

      if (next.year && next.month && next.day) {
        const jy = Number(next.year);
        const jm = Number(next.month);
        const jd = Number(next.day);

        if (
          !Number.isNaN(jy) &&
          !Number.isNaN(jm) &&
          !Number.isNaN(jd) &&
          jy &&
          jm &&
          jd &&
          jm >= 1 &&
          jm <= 12 &&
          jd >= 1 &&
          jd <= getJalaliMonthLength(jy, jm)
        ) {
          try {
            const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
            const isoDate = `${gy}-${padNumber(gm)}-${padNumber(gd)}`;
            setFormData((prevForm) => ({ ...prevForm, issueDate: isoDate }));
          } catch (error) {
            console.error('Failed to convert Jalali date:', error);
            setFormData((prevForm) => ({ ...prevForm, issueDate: '' }));
          }
        } else {
          setFormData((prevForm) => ({ ...prevForm, issueDate: '' }));
        }
      } else {
        setFormData((prevForm) => ({ ...prevForm, issueDate: '' }));
      }

      return next;
    });
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      issueDate: '',
    });
    setSelectedFile(null);
    setFileError(null);
    setFilePreview(null);
    setFileDataUrl(null);
    setJalaliSelection({ year: '', month: '', day: '' });
  };

  const persistCertificates = async (nextCertificates: Certificate[]) => {
    if (!user) return;
    await profileAPI.updateWorkerProfile({
      certificates: nextCertificates,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setFileError(
        language === 'fa'
          ? 'لطفاً ابتدا فایل گواهینامه را بارگذاری کنید.'
          : 'Please upload the certificate file first.',
      );
      return;
    }

    if (!formData.title.trim() || !formData.issuer.trim() || !formData.issueDate.trim()) {
      setFileError(
        language === 'fa'
          ? 'لطفاً تمام فیلدها را تکمیل کنید.'
          : 'Please fill in all the fields.',
      );
      return;
    }

    if (!fileDataUrl) {
      setFileError(
        language === 'fa'
          ? 'پیش‌نمایش فایل آماده نیست. لطفاً دوباره تلاش کنید.'
          : 'File preview is not ready yet. Please try again.',
      );
      return;
    }

    setSaving(true);
    const previousCertificates = certificates;
    try {
      const newCertificate: Certificate = {
        id: generateId(),
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        issueDate: formData.issueDate,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileData: fileDataUrl,
        uploadedAt: new Date().toISOString(),
      };

      const nextCertificates = [newCertificate, ...previousCertificates];
      setCertificates(nextCertificates);
      await persistCertificates(nextCertificates);
      resetForm();
    } catch (error) {
      console.error('Failed to save certificate:', error);
      setFileError(
        language === 'fa'
          ? 'ذخیره گواهینامه با خطا مواجه شد. لطفاً دوباره تلاش کنید.'
          : 'Could not save the certificate. Please try again.',
      );
      setCertificates(previousCertificates);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (certificateId: string) => {
    if (!confirm(language === 'fa' ? 'آیا از حذف این گواهینامه مطمئن هستید؟' : 'Are you sure you want to delete this certificate?')) {
      return;
    }

    const previousCertificates = certificates;
    const nextCertificates = certificates.filter((item) => item.id !== certificateId);
    setCertificates(nextCertificates);

    try {
      await persistCertificates(nextCertificates);
    } catch (error) {
      console.error('Failed to delete certificate:', error);
      setFileError(
        language === 'fa'
          ? 'حذف گواهینامه ناموفق بود.'
          : 'Failed to delete the certificate.',
      );
      setCertificates(previousCertificates);
    }
  };

  const handleDownload = (certificate: Certificate) => {
    const link = document.createElement('a');
    link.href = certificate.fileData;
    const extension = certificate.fileName.split('.').pop() || 'cert';
    const localizedTitle = language === 'fa' ? certificate.title : certificate.title;
    link.download = `${localizedTitle}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCountLabel = useMemo(() => {
    const count = certificates.length;
    if (language === 'fa') {
      return `${toPersianNum(count)} ${count === 1 ? 'گواهینامه' : 'گواهینامه'}`;
    }
    return `${count} ${count === 1 ? 'certificate' : 'certificates'}`;
  }, [certificates.length, language]);

  useEffect(() => {
    if (language !== 'fa') {
      return;
    }

    if (!formData.issueDate) {
      setJalaliSelection({ year: '', month: '', day: '' });
      return;
    }

    const date = new Date(formData.issueDate);
    if (Number.isNaN(date.getTime())) {
      setJalaliSelection({ year: '', month: '', day: '' });
      return;
    }

    const [jy, jm, jd] = gregorianToJalali(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );

    setJalaliSelection({
      year: jy.toString(),
      month: jm.toString(),
      day: jd.toString(),
    });
  }, [formData.issueDate, language]);

  useEffect(() => {
    if (language !== 'fa') {
      setJalaliSelection({ year: '', month: '', day: '' });
    }
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          <p className="text-primary-700 mt-4">
            {language === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}
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
      <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-col gap-2">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
          >
            {language === 'fa' ? 'بازگشت به پروفایل' : 'Back to profile'}
          </Link>
          <h1 className="text-3xl font-bold">
            {language === 'fa' ? 'گواهینامه‌های من' : 'My Certificates'}
          </h1>
          <p className="text-neutral-500">
            {language === 'fa'
              ? 'گواهینامه‌های تایید شده شانس شما را برای پذیرش در شیفت‌های تخصصی افزایش می‌دهد.'
              : 'Verified certificates boost your chances of getting matched with specialized shifts.'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="space-y-6 lg:order-2">
            <div className="rounded-[16px] border border-gray-200 bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-8 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-full bg-[rgba(26,37,162,0.1)] p-3">
                    <Award className="w-6 h-6 text-[#4e57b7]" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {language === 'fa' ? 'لیست گواهینامه‌ها' : 'Certificate list'}
                    </h2>
                    <p className="text-sm text-neutral-500">
                      {totalCountLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {certificates.length === 0 ? (
                  <div className="rounded-[14px] border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                    <p className="text-neutral-500">
                      {language === 'fa'
                        ? 'هنوز گواهینامه‌ای ثبت نشده است.'
                        : 'No certificates have been added yet.'}
                    </p>
                  </div>
                ) : (
                  certificates.map((certificate) => {
                    const issueDate = new Date(certificate.issueDate);
                    const [jy, jm, jd] = gregorianToJalali(
                      issueDate.getFullYear(),
                      issueDate.getMonth() + 1,
                      issueDate.getDate(),
                    );
                    const displayDate = language === 'fa'
                      ? `${toPersianNum(jy)}-${toPersianNum(jm)}-${toPersianNum(jd)}`
                      : new Date(certificate.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        });

                    return (
                      <article
                        key={certificate.id}
                        className="rounded-[14px] border border-gray-200 bg-white px-6 py-5 shadow-sm"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center rounded-full bg-[rgba(26,37,162,0.12)] p-2">
                                <Award className="w-5 h-5 text-[#4e57b7]" />
                              </span>
                              <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-neutral-900">
                                  {certificate.title}
                                </h3>
                                <p className="text-sm text-neutral-500">
                                  {certificate.issuer}
                                </p>
                                <p className="text-xs text-neutral-400">
                                  {language === 'fa'
                                    ? `تاریخ صدور: ${displayDate}`
                                    : `Issued on ${displayDate}`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleDownload(certificate)}
                                className="inline-flex items-center justify-center rounded-full border border-gray-200 p-2 text-neutral-500 hover:bg-gray-100 transition-colors"
                                aria-label={language === 'fa' ? 'دانلود گواهینامه' : 'Download certificate'}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(certificate.id)}
                                className="inline-flex items-center justify-center rounded-full border border-gray-200 p-2 text-neutral-500 hover:bg-gray-100 transition-colors"
                                aria-label={language === 'fa' ? 'حذف گواهینامه' : 'Delete certificate'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-sm text-neutral-500">
                            <span>
                              {language === 'fa'
                                ? `حجم فایل: ${formatFileSize(certificate.fileSize, 'fa')}`
                                : `File size: ${formatFileSize(certificate.fileSize, 'en')}`}
                            </span>
                            <span>
                              {language === 'fa'
                                ? `نوع فایل: ${certificate.fileType}`
                                : `Type: ${certificate.fileType}`}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-[16px] bg-gradient-to-b from-[rgba(26,37,162,0.88)] to-[rgba(91,33,182,0.88)] p-8 text-white shadow-lg space-y-4">
              <h3 className="text-xl font-semibold">
                {language === 'fa' ? 'چرا گواهینامه اضافه کنم؟' : 'Why add certificates?'}
              </h3>
              <ul className="space-y-3 text-sm leading-6">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>
                    {language === 'fa'
                      ? 'شانس بیشتری برای پذیرش در شیفت‌ها'
                      : 'Increase your chances of getting selected for shifts'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>
                    {language === 'fa'
                      ? 'اعتماد بیشتر کارفرماها به مهارت‌های شما'
                      : 'Build employer trust in your skills'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>
                    {language === 'fa'
                      ? 'دسترسی به شیفت‌های تخصصی‌تر'
                      : 'Unlock access to specialized shifts'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>
                    {language === 'fa'
                      ? 'امکان دریافت حقوق بالاتر'
                      : 'Position yourself for higher pay'}
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="lg:order-1">
            <div className="rounded-[16px] border border-gray-200 bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">
                  {language === 'fa' ? 'افزودن گواهینامه جدید' : 'Add a new certificate'}
                </h2>
                <p className="text-sm text-neutral-500">
                  {language === 'fa'
                    ? 'فایل گواهینامه خود را بارگذاری کنید و اطلاعات آن را تکمیل نمایید.'
                    : 'Upload your certificate file and fill out its details.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className={[
                    'relative flex flex-col items-center justify-center rounded-[16px] border-2 border-dashed',
                    dragActive ? 'border-[#4e57b7] bg-[#f4f6ff]' : 'border-[#d1d5dc] bg-[#f3f3f5]',
                    'px-6 py-10 text-center transition-colors',
                  ].join(' ')}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="inline-flex items-center justify-center rounded-full bg-white p-4 shadow-md">
                      <UploadCloud className="w-8 h-8 text-[#4e57b7]" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        {language === 'fa'
                          ? 'فایل را اینجا بکشید و رها کنید'
                          : 'Drag & drop your file here'}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {language === 'fa'
                          ? 'یا روی دکمه زیر کلیک کنید'
                          : 'or click the button below'}
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-[#4e57b7] px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#3940a3] transition-colors">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        className="hidden"
                        onChange={(event) => handleFileSelect(event.target.files?.[0])}
                      />
                      <UploadCloud className="w-4 h-4" />
                      {language === 'fa' ? 'انتخاب فایل' : 'Choose file'}
                    </label>
                    {selectedFile && (
                      <div className="w-full space-y-4">
                        <div className="rounded-[12px] border border-gray-200 bg-white px-4 py-2 text-sm text-neutral-500 shadow-sm">
                          <p className="font-medium text-neutral-700">{selectedFile.name}</p>
                          <p>
                            {language === 'fa'
                              ? `حجم: ${formatFileSize(selectedFile.size, 'fa')}`
                              : `Size: ${formatFileSize(selectedFile.size, 'en')}`}
                          </p>
                        </div>
                        {filePreview && (
                          <div className="rounded-[14px] border border-gray-200 bg-white p-4 shadow-sm">
                            {filePreview.type === 'image' ? (
                              <img
                                src={filePreview.url}
                                alt={selectedFile.name}
                                className="mx-auto max-h-64 w-full rounded-[12px] object-contain"
                              />
                            ) : (
                              <div className="mx-auto w-full overflow-hidden rounded-[12px] border border-gray-200 bg-gray-50">
                                <iframe
                                  src={filePreview.url}
                                  title={selectedFile.name}
                                  className="h-64 w-full"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="mt-6 text-xs text-neutral-400">
                    {language === 'fa'
                      ? 'فرمت‌های مجاز: PDF, JPG, PNG (حداکثر ۵ مگابایت)'
                      : 'Allowed formats: PDF, JPG, PNG (max 5MB)'}
                  </p>
                </div>

                {fileError && (
                  <div className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {fileError}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-600">
                      {language === 'fa' ? 'نام گواهینامه' : 'Certificate name'}
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-[10px] border border-gray-200 bg-[#f3f3f5] px-4 py-3 text-sm focus:border-[#4e57b7] focus:outline-none focus:ring-2 focus:ring-[#4e57b733]"
                      placeholder={
                        language === 'fa'
                          ? 'مثال: گواهینامه خدمات مشتری'
                          : 'e.g. Customer Service Certification'
                      }
                      value={formData.title}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, title: event.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-600">
                      {language === 'fa' ? 'مؤسسه صادرکننده' : 'Issuing organization'}
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-[10px] border border-gray-200 bg-[#f3f3f5] px-4 py-3 text-sm focus:border-[#4e57b7] focus:outline-none focus:ring-2 focus:ring-[#4e57b733]"
                      placeholder={
                        language === 'fa'
                          ? 'مثال: مؤسسه آموزش فنی و حرفه‌ای'
                          : 'e.g. Technical and Vocational Institute'
                      }
                      value={formData.issuer}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, issuer: event.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-600">
                      {language === 'fa' ? 'تاریخ صدور' : 'Issue date'}
                    </label>
                    {language === 'fa' ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <select
                            className="rounded-[10px] border border-gray-200 bg-[#f3f3f5] px-3 py-3 text-sm focus:border-[#4e57b7] focus:outline-none focus:ring-2 focus:ring-[#4e57b733]"
                            value={jalaliSelection.year}
                            onChange={(event) =>
                              handleJalaliSelectChange('year', convertPersianDigitsToEnglish(event.target.value))
                            }
                          >
                            <option value="">{'سال'}</option>
                            {jalaliYears.map((year) => (
                              <option key={year} value={year.toString()}>
                                {toPersianNum(year)}
                              </option>
                            ))}
                          </select>

                          <select
                            className="rounded-[10px] border border-gray-200 bg-[#f3f3f5] px-3 py-3 text-sm focus:border-[#4e57b7] focus:outline-none focus:ring-2 focus:ring-[#4e57b733]"
                            value={jalaliSelection.month}
                            onChange={(event) =>
                              handleJalaliSelectChange('month', convertPersianDigitsToEnglish(event.target.value))
                            }
                          >
                            <option value="">{'ماه'}</option>
                            {jalaliMonthsFa.map((label, index) => (
                              <option key={label} value={(index + 1).toString()}>
                                {label}
                              </option>
                            ))}
                          </select>

                          <select
                            className="rounded-[10px] border border-gray-200 bg-[#f3f3f5] px-3 py-3 text-sm focus:border-[#4e57b7] focus:outline-none focus:ring-2 focus:ring-[#4e57b733]"
                            value={jalaliSelection.day}
                            onChange={(event) =>
                              handleJalaliSelectChange('day', convertPersianDigitsToEnglish(event.target.value))
                            }
                          >
                            <option value="">{'روز'}</option>
                            {jalaliDays.map((day) => (
                              <option key={day} value={day.toString()}>
                                {toPersianNum(padNumber(day))}
                              </option>
                            ))}
                          </select>
                        </div>
                        {formData.issueDate && (
                          <p className="text-xs text-neutral-400">
                            {new Date(formData.issueDate).toLocaleDateString('en-CA')}
                          </p>
                        )}
                      </div>
                    ) : (
                      <input
                        type="date"
                        className="w-full rounded-[10px] border border-gray-200 bg-[#f3f3f5] px-4 py-3 text-sm focus:border-[#4e57b7] focus:outline-none focus:ring-2 focus:ring-[#4e57b733]"
                        value={formData.issueDate}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, issueDate: event.target.value }))
                        }
                      />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-[10px] bg-[#4e57b7] px-4 py-3 text-white font-medium shadow-sm hover:bg-[#3b43a8] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? language === 'fa'
                      ? 'در حال ذخیره...'
                      : 'Saving...'
                    : language === 'fa'
                    ? 'ذخیره گواهینامه'
                    : 'Save certificate'}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


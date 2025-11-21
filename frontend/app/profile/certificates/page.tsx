'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { profileAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ArrowRight, Award, Download, Trash2, UploadCloud } from 'lucide-react';
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
  const isRTL = language === 'fa';
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
      <div className="min-h-screen bg-concrete flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ink" />
          <p className="text-ink font-bold mt-4 font-body">
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
      className="min-h-screen bg-concrete dark:bg-ink text-ink dark:text-concrete pt-28 pb-12"
      dir={language === 'fa' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-col gap-2">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
            <h1 className="text-4xl font-display text-ink">
              {language === 'fa' ? 'گواهینامه‌های من' : 'My Certificates'}
            </h1>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center w-14 h-14 rounded-full border-[3px] border-ink text-ink bg-white shadow-[3px_3px_0px_0px_#1a1a1a] hover:-translate-y-0.5 hover:bg-concrete-dark transition-all dark:bg-concrete-dark dark:text-concrete"
              aria-label={language === 'fa' ? 'بازگشت به پروفایل' : 'Back to profile'}
            >
              {isRTL ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
            </Link>
          </div>
          <p className="text-ink/70 font-body">
            {language === 'fa'
              ? 'گواهینامه‌های تایید شده شانس شما را برای پذیرش در شیفت‌های تخصصی افزایش می‌دهد.'
              : 'Verified certificates boost your chances of getting matched with specialized shifts.'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="space-y-6 lg:order-2">
            <div className="rounded-[2rem] border-2 border-ink bg-white dark:bg-concrete-dark dark:bg-concrete shadow-[4px_4px_0px_0px_#1a1a1a] p-8 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-full bg-moss/20 border-2 border-ink p-3">
                    <Award className="w-6 h-6 text-moss" />
                  </span>
                  <div>
                    <h2 className="text-xl font-display text-ink">
                      {language === 'fa' ? 'لیست گواهینامه‌ها' : 'Certificate list'}
                    </h2>
                    <p className="text-sm text-ink/70 font-body">
                      {totalCountLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {certificates.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-ink/30 bg-concrete-dark dark:bg-concrete p-6 text-center">
                    <p className="text-ink/70 font-body">
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
                        className="rounded-xl border-2 border-ink bg-white dark:bg-concrete-dark dark:bg-concrete px-6 py-5 shadow-[4px_4px_0px_0px_#1a1a1a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1a1a1a] transition-all"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center rounded-full bg-moss/20 border-2 border-ink p-2">
                                <Award className="w-5 h-5 text-moss" />
                              </span>
                              <div className="space-y-1">
                                <h3 className="text-lg font-display text-ink">
                                  {certificate.title}
                                </h3>
                                <p className="text-sm text-ink/70 font-body">
                                  {certificate.issuer}
                                </p>
                                <p className="text-xs text-ink/60 font-body">
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
                                className="inline-flex items-center justify-center rounded-full border-2 border-ink p-2 text-ink hover:bg-concrete-dark dark:bg-concrete transition-all"
                                aria-label={language === 'fa' ? 'دانلود گواهینامه' : 'Download certificate'}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(certificate.id)}
                                className="inline-flex items-center justify-center rounded-full border-2 border-ink p-2 text-safety hover:bg-safety/20 transition-all"
                                aria-label={language === 'fa' ? 'حذف گواهینامه' : 'Delete certificate'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 border-t-2 border-ink/20 pt-4 text-sm text-ink/70 font-body">
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

            <div className="rounded-[2rem] bg-gradient-to-b from-ink to-moss border-2 border-ink p-8 text-concrete shadow-[4px_4px_0px_0px_#1a1a1a] space-y-4">
              <h3 className="text-xl font-display">
                {language === 'fa' ? 'چرا گواهینامه اضافه کنم؟' : 'Why add certificates?'}
              </h3>
              <ul className="space-y-3 text-sm leading-6 font-body">
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
            <div className="rounded-[2rem] border-2 border-ink bg-white dark:bg-concrete-dark dark:bg-concrete shadow-[4px_4px_0px_0px_#1a1a1a] p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-display text-ink">
                  {language === 'fa' ? 'افزودن گواهینامه جدید' : 'Add a new certificate'}
                </h2>
                <p className="text-sm text-ink/70 font-body">
                  {language === 'fa'
                    ? 'فایل گواهینامه خود را بارگذاری کنید و اطلاعات آن را تکمیل نمایید.'
                    : 'Upload your certificate file and fill out its details.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className={[
                    'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed',
                    dragActive ? 'border-safety bg-safety/10' : 'border-ink/30 bg-concrete-dark dark:bg-concrete',
                    'px-6 py-10 text-center transition-colors',
                  ].join(' ')}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="inline-flex items-center justify-center rounded-full bg-white dark:bg-concrete-dark dark:bg-concrete border-2 border-ink p-4 shadow-[2px_2px_0px_0px_#1a1a1a]">
                      <UploadCloud className="w-8 h-8 text-moss" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-display text-ink">
                        {language === 'fa'
                          ? 'فایل را اینجا بکشید و رها کنید'
                          : 'Drag & drop your file here'}
                      </p>
                      <p className="text-sm text-ink/70 font-body">
                        {language === 'fa'
                          ? 'یا روی دکمه زیر کلیک کنید'
                          : 'or click the button below'}
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-moss text-concrete border-2 border-ink px-5 py-3 text-sm font-bold shadow-[2px_2px_0px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_0px_#1a1a1a] hover:-translate-y-1 transition-all">
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
                        <div className="rounded-xl border-2 border-ink bg-white dark:bg-concrete-dark dark:bg-concrete px-4 py-2 text-sm text-ink shadow-[2px_2px_0px_0px_#1a1a1a]">
                          <p className="font-bold text-ink font-body">{selectedFile.name}</p>
                          <p className="font-body">
                            {language === 'fa'
                              ? `حجم: ${formatFileSize(selectedFile.size, 'fa')}`
                              : `Size: ${formatFileSize(selectedFile.size, 'en')}`}
                          </p>
                        </div>
                        {filePreview && (
                          <div className="rounded-xl border-2 border-ink bg-white dark:bg-concrete-dark dark:bg-concrete p-4 shadow-[2px_2px_0px_0px_#1a1a1a]">
                            {filePreview.type === 'image' ? (
                              <img
                                src={filePreview.url}
                                alt={selectedFile.name}
                                className="mx-auto max-h-64 w-full rounded-lg object-contain"
                              />
                            ) : (
                              <div className="mx-auto w-full overflow-hidden rounded-lg border-2 border-ink bg-concrete-dark dark:bg-concrete">
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

                  <p className="mt-6 text-xs text-ink/60 font-body">
                    {language === 'fa'
                      ? 'فرمت‌های مجاز: PDF, JPG, PNG (حداکثر ۵ مگابایت)'
                      : 'Allowed formats: PDF, JPG, PNG (max 5MB)'}
                  </p>
                </div>

                {fileError && (
                  <div className="rounded-xl border-2 border-safety bg-safety/10 px-4 py-3 text-sm text-safety font-bold">
                    {fileError}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-ink font-body">
                      {language === 'fa' ? 'نام گواهینامه' : 'Certificate name'}
                    </label>
                    <input
                      type="text"
                      className="input-field"
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
                    <label className="block text-sm font-bold text-ink font-body">
                      {language === 'fa' ? 'مؤسسه صادرکننده' : 'Issuing organization'}
                    </label>
                    <input
                      type="text"
                      className="input-field"
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
                    <label className="block text-sm font-bold text-ink font-body">
                      {language === 'fa' ? 'تاریخ صدور' : 'Issue date'}
                    </label>
                    {language === 'fa' ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <select
                            className="input-field"
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
                            className="input-field"
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
                            className="input-field"
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
                          <p className="text-xs text-ink/60 font-body">
                            {new Date(formData.issueDate).toLocaleDateString('en-CA')}
                          </p>
                        )}
                      </div>
                    ) : (
                      <input
                        type="date"
                        className="input-field"
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
                  className="w-full btn-primary disabled:cursor-not-allowed disabled:opacity-60"
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


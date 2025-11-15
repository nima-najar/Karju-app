'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { profileAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Upload, User, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toPersianNum } from '@/lib/persianUtils';

export default function EditProfilePage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    skills: [],
    preferred_locations: [],
    languages: [],
    documents: {},
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [languageDraft, setLanguageDraft] = useState<{ name: string; level: string }>({ name: '', level: '' });

  const languagesState: Array<{ name: string; level?: string }> = Array.isArray(formData.languages)
    ? formData.languages
    : [];
  const documentsState: Record<string, any> = formData.documents || {};

  const documentDefinitions: Array<{ key: 'identity' | 'education' | 'military'; labelFa: string; labelEn: string; helperFa?: string; helperEn?: string }> = [
    {
      key: 'identity',
      labelFa: 'تصویر شناسنامه',
      labelEn: 'National ID document',
      helperFa: 'PNG, JPG یا PDF - حداکثر ۵ مگابایت',
      helperEn: 'PNG, JPG or PDF • up to 5 MB',
    },
    {
      key: 'education',
      labelFa: 'مدرک تحصیلی',
      labelEn: 'Educational certificate',
      helperFa: 'برای تأیید سوابق تحصیلی',
      helperEn: 'Used to verify your education',
    },
    {
      key: 'military',
      labelFa: 'مدرک نظام وظیفه (در صورت نیاز)',
      labelEn: 'Military service document (if applicable)',
      helperFa: 'در صورت نیاز، معافیت یا کارت پایان خدمت را بارگذاری کنید',
      helperEn: 'Upload exemption or completion certificate if needed',
    },
  ];

  const languageLevelOptions = [
    { value: 'native', labelFa: 'زبان مادری', labelEn: 'Native' },
    { value: 'advanced', labelFa: 'پیشرفته', labelEn: 'Advanced' },
    { value: 'intermediate', labelFa: 'متوسط', labelEn: 'Intermediate' },
    { value: 'basic', labelFa: 'مبتدی', labelEn: 'Basic' },
  ];

const militaryStatusOptions = [
  { value: 'not_applicable', labelFa: 'نیازی نیست', labelEn: 'Not applicable' },
  { value: 'exempt_permanent', labelFa: 'معافیت دائم', labelEn: 'Permanent exemption' },
  { value: 'exempt_education', labelFa: 'معافیت تحصیلی', labelEn: 'Student exemption' },
  { value: 'completed', labelFa: 'پایان خدمت', labelEn: 'Completed service' },
  { value: 'serving', labelFa: 'در حال خدمت', labelEn: 'Currently serving' },
];

  const getLanguageLevelLabel = (level: string) => {
    const option = languageLevelOptions.find((item) => item.value === level);
    if (!option) return '';
    return language === 'fa' ? option.labelFa : option.labelEn;
  };

  const handleLanguageDraftChange = (field: 'name' | 'level', value: string) => {
    setLanguageDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLanguage = () => {
    const name = languageDraft.name.trim();
    if (!name) return;

    setFormData((prev: any) => {
      const current = Array.isArray(prev.languages) ? prev.languages : [];
      const exists = current.some(
        (lang: any) => String(lang.name).toLowerCase() === name.toLowerCase(),
      );
      if (exists) {
        return {
          ...prev,
          languages: current.map((lang: any) =>
            String(lang.name).toLowerCase() === name.toLowerCase()
              ? { ...lang, level: languageDraft.level }
              : lang,
          ),
        };
      }
      return {
        ...prev,
        languages: [
          ...current,
          {
            name,
            level: languageDraft.level,
          },
        ],
      };
    });
    setLanguageDraft({ name: '', level: '' });
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData((prev: any) => {
      const current = Array.isArray(prev.languages) ? [...prev.languages] : [];
      current.splice(index, 1);
      return {
        ...prev,
        languages: current,
      };
    });
  };

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

  const handleDocumentChange = async (type: 'identity' | 'education' | 'military', fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      setFormData((prev: any) => ({
        ...prev,
        documents: {
          ...(prev.documents || {}),
          [type]: {
            fileName: file.name,
            mimeType: file.type,
            data: dataUrl,
            uploadedAt: new Date().toISOString(),
          },
        },
      }));
    } catch (error) {
      console.error('Failed to read document file', error);
    }
  };

  const handleDocumentRemove = (type: 'identity' | 'education' | 'military') => {
    setFormData((prev: any) => {
      const updated = { ...(prev.documents || {}) };
      delete updated[type];
      return {
        ...prev,
        documents: updated,
      };
    });
  };

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

  const calculateVerificationProgress = (payload: any, docs: Record<string, any>) => {
    const checklist = [
      payload.nationalId,
      payload.phoneNumber,
      payload.address,
      payload.city,
      payload.bankAccountHolder,
      payload.bankCardNumber,
      payload.bankIban,
      payload.educationLevel,
      payload.educationField,
      payload.educationInstitution,
      payload.educationGraduationYear,
      Array.isArray(payload.languages) && payload.languages.length > 0,
      payload.aboutMe && String(payload.aboutMe).trim().length > 0,
      docs.identity?.data,
      docs.education?.data,
      payload.militaryStatus === 'not_applicable' ? true : docs.military?.data,
    ];

    const total = checklist.length;
    const completed = checklist.filter((item) => {
      if (Array.isArray(item)) return item.length > 0;
      if (typeof item === 'boolean') return item;
      if (item === null || item === undefined) return false;
      return String(item).trim() !== '';
    }).length;

    return total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  };

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadProfile(currentUser);
  }, []);

  const loadProfile = async (currentUser?: any) => {
    try {
      const userToUse = currentUser || user;
      if (userToUse?.userType === 'worker') {
        const response = await profileAPI.getWorkerProfile(userToUse.id);
        const profile = response.data.profile || {};

        const parsedSkills = Array.isArray(profile.skills)
          ? profile.skills
          : typeof profile.skills === 'string'
          ? profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [];

        const parsedPreferred = Array.isArray(profile.preferred_locations)
          ? profile.preferred_locations
          : typeof profile.preferred_locations === 'string'
          ? profile.preferred_locations
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];

        let parsedLanguages: Array<{ name: string; level?: string }> = [];
        if (profile.languages) {
          try {
            parsedLanguages = Array.isArray(profile.languages)
              ? profile.languages
              : typeof profile.languages === 'string'
              ? JSON.parse(profile.languages)
              : [];
          } catch (error) {
            parsedLanguages = [];
          }
        }

        parsedLanguages = parsedLanguages
          .map((lang: any) => ({
            name: lang?.name ? String(lang.name) : String(lang).trim(),
            level: lang?.level ? String(lang.level) : '',
          }))
          .filter((lang) => lang.name);

        let parsedDocuments: Record<string, any> = {};
        if (profile.documents) {
          try {
            parsedDocuments =
              typeof profile.documents === 'string'
                ? JSON.parse(profile.documents)
                : profile.documents;
          } catch (error) {
            parsedDocuments = {};
          }
        }

        setFormData({
          ...profile,
          bio: profile.bio ?? profile.about_me ?? '',
          about_me: profile.about_me ?? profile.bio ?? '',
          skills: parsedSkills,
          preferred_locations: parsedPreferred,
          languages: parsedLanguages,
          documents: parsedDocuments || {},
        });
        if (profile.profile_picture_url) {
          setProfilePicture(profile.profile_picture_url);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePictureFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user?.userType === 'worker') {
        const skills = Array.isArray(formData.skills)
          ? formData.skills
          : typeof formData.skills === 'string'
          ? formData.skills
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];

        const preferredLocations = Array.isArray(formData.preferred_locations)
          ? formData.preferred_locations
          : typeof formData.preferred_locations === 'string'
          ? formData.preferred_locations
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];

        const aboutMeValue = formData.about_me ?? '';

        const submitData: any = {
          bio: aboutMeValue,
          skills,
          experienceYears:
            formData.experience_years !== undefined
              ? formData.experience_years
              : null,
          preferredLocations,
          birthDate: formData.birth_date || null,
          gender: formData.gender || null,
          nationalId: formData.national_id || null,
          phoneNumber: formData.phone_number || null,
          address: formData.address || null,
          city: formData.city || null,
          province: formData.province || null,
          bankAccountHolder: formData.bank_account_holder || null,
          bankCardNumber: formData.bank_card_number || null,
          bankIban: formData.bank_iban || null,
          militaryStatus: formData.military_status || null,
          educationLevel: formData.education_level || null,
          educationField: formData.education_field || null,
          educationInstitution: formData.education_institution || null,
          educationGraduationYear: formData.education_graduation_year || null,
          aboutMe: aboutMeValue,
          personalityTraits: formData.personality_traits || null,
          languages: languagesState,
        };

        if (formData.experience_years !== undefined) {
          submitData.experienceYears = Number.isNaN(Number(formData.experience_years))
            ? null
            : Number(formData.experience_years);
        }

        if (formData.phone_verified !== undefined) {
          submitData.phoneVerified = !!formData.phone_verified;
        }
        if (formData.availability_calendar) {
          submitData.availabilityCalendar = formData.availability_calendar;
        }
        if (formData.certificates) {
          submitData.certificates = formData.certificates;
        }

        const documentsPayload = Object.entries(documentsState).reduce(
          (acc: Record<string, any>, [key, value]) => {
            if (!value) return acc;
            const normalized =
              typeof value === 'string'
                ? {
                    fileName: `${key}.pdf`,
                    mimeType: '',
                    data: value,
                    uploadedAt: new Date().toISOString(),
                  }
                : {
                    fileName: value.fileName || `${key}.pdf`,
                    mimeType: value.mimeType || '',
                    data: value.data || '',
                    uploadedAt: value.uploadedAt || new Date().toISOString(),
                  };
            if (!normalized.data) {
              return acc;
            }
            acc[key] = normalized;
            return acc;
          },
          {}
        );

        submitData.documents = documentsPayload;

        if (profilePictureFile) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64String = reader.result as string;
              submitData.profilePictureUrl = base64String;
              submitData.verificationProgress = calculateVerificationProgress(submitData, documentsPayload);
              await profileAPI.updateWorkerProfile(submitData);
              setProfilePictureFile(null);
              router.push('/profile'); // Redirect to profile view page
            } catch (error: any) {
              alert(error.response?.data?.message || 'Failed to update profile');
              setSaving(false);
            }
          };
          reader.readAsDataURL(profilePictureFile);
          return;
        }
        
        if (profilePicture === null && formData.profile_picture_url) {
          submitData.profilePictureUrl = null;
        }
        
        submitData.verificationProgress = calculateVerificationProgress(submitData, documentsPayload);

        await profileAPI.updateWorkerProfile(submitData);
        router.push('/profile'); // Redirect to profile view page
      } else {
        await profileAPI.updateBusinessProfile(formData);
        router.push('/profile'); // Redirect to profile view page
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (user?.userType === 'worker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 py-8">
        <div id="personal-info" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8 text-white">{t('profile.editWorkerProfile')}</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {profilePicture ? (
                  <div className="relative">
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                    />
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title={language === 'fa' ? 'حذف تصویر' : 'Remove picture'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-primary-200">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="mt-4 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                  <Upload className="w-5 h-5" />
                  {language === 'fa'
                    ? profilePicture
                      ? 'تغییر تصویر'
                      : 'بارگذاری تصویر'
                    : profilePicture
                    ? 'Change Picture'
                    : 'Upload Picture'}
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-2">
                {language === 'fa' ? 'حداکثر حجم: ۵ مگابایت' : 'Max size: 5MB'}
              </p>
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'fa' ? 'درباره من' : 'About me'}
            </label>
            <textarea
              className="input-field rounded-2xl bg-white text-gray-900"
              rows={4}
              value={formData.about_me || ''}
              onChange={(e) => setFormData({ ...formData, about_me: e.target.value, bio: e.target.value })}
              placeholder={
                language === 'fa'
                  ? 'خودتان را معرفی کنید و به نقاط قوت حرفه‌ای اشاره کنید.'
                  : 'Introduce yourself and highlight your professional strengths.'
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              {language === 'fa'
                ? 'این متن در پروفایل عمومی شما نمایش داده می‌شود.'
                : 'This description appears on your public profile.'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'fa' ? 'ویژگی‌های شخصیتی' : 'Personality traits'}
            </label>
            <textarea
              className="input-field rounded-2xl bg-white text-gray-900"
              rows={2}
              value={formData.personality_traits || ''}
              onChange={(e) => setFormData({ ...formData, personality_traits: e.target.value })}
              placeholder={
                language === 'fa'
                  ? 'مثال: منظم، مسئولیت‌پذیر، علاقه‌مند به کار تیمی'
                  : 'Example: Detail-oriented, responsible, team player'
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              {language === 'fa'
                ? 'ویژگی‌ها را با ویرگول از هم جدا کنید.'
                : 'Separate traits with commas.'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'fa' ? 'مهارت‌ها (با ویرگول جدا کنید)' : 'Skills (comma-separated)'}
            </label>
            <input
              type="text"
              className="input-field rounded-2xl bg-white text-gray-900"
              value={formData.skills?.join(', ') || ''}
              onChange={(e) => setFormData({
                ...formData,
                skills: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean),
              })}
              placeholder="waiting, customer_service, event_planning"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'fa' ? 'مناطق مورد ترجیح (با ویرگول جدا کنید)' : 'Preferred locations (comma-separated)'}
            </label>
            <input
              type="text"
              className="input-field rounded-2xl bg-white text-gray-900"
              value={formData.preferred_locations?.join(', ') || ''}
              onChange={(e) => setFormData({
                ...formData,
                preferred_locations: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean),
              })}
              placeholder="Tehran, Shiraz, Isfahan"
            />
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'fa' ? 'اطلاعات شخصی' : 'Personal information'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'لطفاً اطلاعات هویتی خود را با دقت وارد کنید.'
                  : 'Please make sure your identity details are accurate.'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'نام' : 'First name'}
                </label>
                <input
                  type="text"
                  value={user?.firstName || ''}
                  disabled
                  className="input-field bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'نام خانوادگی' : 'Last name'}
                </label>
                <input
                  type="text"
                  value={user?.lastName || ''}
                  disabled
                  className="input-field bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'تاریخ تولد' : 'Birth date'}
                </label>
                <input
                  type="date"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.birth_date ? formData.birth_date.slice(0, 10) : ''}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'جنسیت' : 'Gender'}
                </label>
                <select
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">{language === 'fa' ? 'انتخاب کنید' : 'Select'}</option>
                  <option value="female">{language === 'fa' ? 'مونث' : 'Female'}</option>
                  <option value="male">{language === 'fa' ? 'مذکر' : 'Male'}</option>
                  <option value="other">{language === 'fa' ? 'سایر' : 'Other'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'کد ملی' : 'National ID'}
                </label>
                <input
                  type="text"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.national_id || ''}
                  onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'وضعیت نظام وظیفه (برای مردان)' : 'Military service status'}
                </label>
                <select
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.military_status || ''}
                  onChange={(e) => setFormData({ ...formData, military_status: e.target.value })}
                >
                  <option value="">{language === 'fa' ? 'انتخاب کنید' : 'Select'}</option>
              {militaryStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {language === 'fa' ? option.labelFa : option.labelEn}
                </option>
              ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'fa' ? 'اطلاعات تماس' : 'Contact information'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'این اطلاعات برای هماهنگی‌های مهم استفاده می‌شود.'
                  : 'These details help employers reach you quickly.'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'شماره تماس' : 'Phone number'}
                </label>
                <input
                  type="text"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.phone_number || ''}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'ایمیل' : 'Email'}
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'آدرس' : 'Address'}
                </label>
                <input
                  type="text"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'شهر' : 'City'}
                </label>
                <input
                  type="text"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'استان' : 'Province'}
                </label>
                <input
                  type="text"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.province || ''}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'fa' ? 'اطلاعات بانکی' : 'Banking details'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'برای تسویه حساب دقیق، اطلاعات حساب بانکی خود را وارد کنید.'
                  : 'These details are used to transfer your payouts.'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'نام دارنده حساب' : 'Account holder'}
                </label>
                <input
                  type="text"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.bank_account_holder || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bank_account_holder: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'شماره کارت' : 'Card number'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.bank_card_number || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bank_card_number: e.target.value.replace(/\s+/g, ''),
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'شماره شبا' : 'IBAN'}
                </label>
                <input
                  type="text"
                  className="input-field rounded-2xl bg-white text-gray-900 uppercase"
                  value={formData.bank_iban || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bank_iban: e.target.value.toUpperCase() })
                  }
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {language === 'fa'
                ? 'اطلاعات بانکی شما به صورت رمزنگاری شده ذخیره می‌شود و تنها برای واریز حقوق استفاده خواهد شد.'
                : 'Your banking details are encrypted and used only for payroll transfers.'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'fa' ? 'اطلاعات تحصیلی' : 'Education'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'آخرین مقطع تحصیلی و زمینه تخصصی خود را مشخص کنید.'
                  : 'Tell us about your latest degree and field of study.'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'سطح تحصیلات' : 'Education level'}
                </label>
                <select
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.education_level || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, education_level: e.target.value })
                  }
                >
                  <option value="">{language === 'fa' ? 'انتخاب کنید' : 'Select'}</option>
                  <option value="diploma">{language === 'fa' ? 'دیپلم' : 'Diploma'}</option>
                  <option value="associate">{language === 'fa' ? 'فوق دیپلم' : 'Associate'}</option>
                  <option value="bachelor">{language === 'fa' ? 'کارشناسی' : 'Bachelor'}</option>
                  <option value="master">{language === 'fa' ? 'کارشناسی ارشد' : 'Master'}</option>
                  <option value="doctorate">{language === 'fa' ? 'دکتری' : 'Doctorate'}</option>
                  <option value="other">{language === 'fa' ? 'سایر' : 'Other'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'رشته تحصیلی' : 'Field of study'}
                </label>
                <input
                  type="text"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.education_field || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, education_field: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'محل تحصیل' : 'Institution'}
                </label>
                <input
                  type="text"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.education_institution || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, education_institution: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'سال فارغ‌التحصیلی' : 'Graduation year'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.education_graduation_year || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, education_graduation_year: e.target.value })
                  }
                  placeholder={language === 'fa' ? 'مثال: ۱۴۰۱' : 'Example: 2023'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fa' ? 'سابقه کاری (سال)' : 'Years of experience'}
                </label>
                <input
                  type="number"
                  min={0}
                  className="input-field rounded-2xl bg-white text-gray-900"
                  value={formData.experience_years ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience_years: e.target.value === '' ? null : parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'fa' ? 'زبان‌ها' : 'Languages'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'زبان‌هایی که به آن مسلط هستید را وارد کنید.'
                  : 'Add the languages you speak and your proficiency level.'}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                className="input-field rounded-2xl bg-white text-gray-900 flex-1"
                placeholder={language === 'fa' ? 'نام زبان' : 'Language name'}
                value={languageDraft.name}
                onChange={(e) => handleLanguageDraftChange('name', e.target.value)}
              />
              <select
                className="input-field rounded-2xl bg-white text-gray-900 md:w-48"
                value={languageDraft.level}
                onChange={(e) => handleLanguageDraftChange('level', e.target.value)}
              >
                <option value="">
                  {language === 'fa' ? 'سطح' : 'Level'}
                </option>
                {languageLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {language === 'fa' ? option.labelFa : option.labelEn}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddLanguage}
                className="btn-primary whitespace-nowrap"
              >
                {language === 'fa' ? 'افزودن زبان' : 'Add language'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {languagesState.length === 0 ? (
                <span className="text-sm text-gray-500">
                  {language === 'fa'
                    ? 'هنوز زبانی اضافه نشده است.'
                    : 'No languages added yet.'}
                </span>
              ) : (
                languagesState.map((lang, index) => (
                  <span
                    key={`${lang.name}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#f3f4ff] text-[#1a25a2] px-3 py-1 text-sm"
                  >
                    <span>
                      {language === 'fa' ? toPersianNum(lang.name) : lang.name}
                      {lang.level ? ` • ${getLanguageLevelLabel(lang.level)}` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(index)}
                      className="text-xs text-[#1a25a2]/70 hover:text-[#1a25a2]"
                      aria-label={language === 'fa' ? 'حذف زبان' : 'Remove language'}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'fa' ? 'مدارک و اسناد' : 'Documents'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'fa'
                  ? 'مدارک شناسایی و تحصیلی مورد نیاز را بارگذاری کنید.'
                  : 'Upload your identity and educational documents.'}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {documentDefinitions.map((docDef) => {
                const doc = documentsState[docDef.key];
                const isUploaded = Boolean(doc?.data);
                const inputId = `document-${docDef.key}`;
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
                          ? 'بارگذاری نشده'
                          : 'Not uploaded'}
                      </span>
                    </div>

                    {isUploaded && (
                      <div className="rounded-2xl bg-white/70 border border-white/80 px-3 py-2 text-xs text-gray-600">
                        <p className="font-medium text-gray-800">{doc?.fileName || 'document'}</p>
                        {doc?.uploadedAt && (
                          <p className="mt-1">
                            {language === 'fa'
                              ? `تاریخ بارگذاری: ${toPersianNum(new Date(doc.uploadedAt).toLocaleDateString('fa-IR'))}`
                              : `Uploaded: ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        id={inputId}
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        className="hidden"
                        onChange={(e) => handleDocumentChange(docDef.key, e.target.files)}
                      />
                      <label
                        htmlFor={inputId}
                        className="inline-flex cursor-pointer items-center rounded-full bg-[#1a25a2] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#161c85] transition"
                      >
                        {isUploaded
                          ? language === 'fa'
                            ? 'جایگزینی فایل'
                            : 'Replace file'
                          : language === 'fa'
                          ? 'بارگذاری فایل'
                          : 'Upload file'}
                      </label>
                      {isUploaded && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDocumentDownload(doc)}
                            className="inline-flex items-center rounded-full border border-[#1a25a2] px-3 py-1.5 text-xs font-medium text-[#1a25a2] hover:bg-[#1a25a2]/5 transition"
                          >
                            {language === 'fa' ? 'دانلود' : 'Download'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDocumentRemove(docDef.key)}
                            className="inline-flex items-center rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                          >
                            {language === 'fa' ? 'حذف' : 'Remove'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="flex-1 btn-secondary py-3 rounded-full"
            >
              {language === 'fa' ? 'انصراف' : 'Cancel'}
            </button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-full">
              {saving ? (language === 'fa' ? 'در حال ذخیره...' : 'Saving...') : language === 'fa' ? 'ذخیره' : 'Save Profile'}
            </button>
          </div>
        </form>
        </div>
      </div>
    );
  }

  // Business profile form
  return (
    <div id="personal-info" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Business Profile</h1>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            className="input-field rounded-2xl bg-white text-gray-900"
            value={formData.businessName || ''}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type
          </label>
          <select
            className="input-field rounded-2xl bg-white text-gray-900"
            value={formData.businessType || ''}
            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
          >
            <option value="">Select type</option>
            <option value="رستوران و پذیرایی">رستوران و پذیرایی</option>
            <option value="رویدادها">رویدادها</option>
            <option value="لجستیک">لجستیک</option>
            <option value="خرده‌فروشی">خرده‌فروشی</option>
            <option value="سایر">سایر</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            className="input-field rounded-2xl bg-white text-gray-900"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              className="input-field rounded-2xl bg-white text-gray-900"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Province
            </label>
            <input
              type="text"
              className="input-field rounded-2xl bg-white text-gray-900"
              value={formData.province || ''}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            className="input-field rounded-2xl bg-white text-gray-900"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="flex-1 btn-secondary py-3"
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 btn-primary py-3">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}


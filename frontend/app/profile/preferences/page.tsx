'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Lightbulb, Loader2, Save, SunMedium, Globe2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { profileAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';

const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ');

type PreferencesState = {
  notifications: {
    instant: boolean;
    email: boolean;
    sms: boolean;
  };
  appearance: {
    darkMode: boolean;
  };
  language: 'fa' | 'en';
};

const defaultPreferences: PreferencesState = {
  notifications: {
    instant: true,
    email: true,
    sms: false,
  },
  appearance: {
    darkMode: false,
  },
  language: 'fa',
};

const toBoolean = (value: any, fallback: boolean): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return fallback;
};

const mergePreferences = (raw: any): PreferencesState => {
  const merged: PreferencesState = JSON.parse(JSON.stringify(defaultPreferences));

  if (!raw) {
    return merged;
  }

  let incoming = raw;
  if (typeof raw === 'string') {
    try {
      incoming = JSON.parse(raw);
    } catch (error) {
      console.warn('Failed to parse preferences JSON', error);
      return merged;
    }
  }

  if (incoming.notifications) {
    merged.notifications = {
      ...merged.notifications,
      ...incoming.notifications,
      instant: toBoolean(incoming.notifications.instant, merged.notifications.instant),
      email: toBoolean(incoming.notifications.email, merged.notifications.email),
      sms: toBoolean(incoming.notifications.sms, merged.notifications.sms),
    };
  }

  if (incoming.appearance) {
    merged.appearance = {
      ...merged.appearance,
      ...incoming.appearance,
      darkMode: toBoolean(incoming.appearance.darkMode, merged.appearance.darkMode),
    };
  }

  if (incoming.language && (incoming.language === 'fa' || incoming.language === 'en')) {
    merged.language = incoming.language;
  }

  return merged;
};

type PreferenceSwitchProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  language: 'fa' | 'en';
  disabled?: boolean;
  theme: PreferenceSwitchTheme;
};

type PreferenceSwitchTheme = {
  container: string;
  label: string;
  description: string;
  toggleOn: string;
  toggleOff: string;
  thumb: string;
  disabled: string;
};

function PreferenceSwitch({
  label,
  description,
  checked,
  onChange,
  language,
  disabled = false,
  theme,
}: PreferenceSwitchProps) {
  const isRTL = language === 'fa';
  const alignmentClass = checked
    ? isRTL
      ? 'justify-start'
      : 'justify-end'
    : isRTL
    ? 'justify-end'
    : 'justify-start';

  return (
    <div
      className={cx(
        'flex items-center justify-between gap-6 rounded-3xl px-5 py-4 transition',
        theme.container,
      )}
    >
      <div className="min-w-0">
        <p className={cx('font-medium', theme.label)}>{label}</p>
        {description ? (
          <p className={cx('mt-1 text-sm', theme.description)}>{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => (disabled ? undefined : onChange(!checked))}
        className={cx(
          'flex h-6 w-12 items-center rounded-full px-0.5 transition',
          alignmentClass,
          checked ? theme.toggleOn : theme.toggleOff,
          disabled ? theme.disabled : 'cursor-pointer',
        )}
        aria-pressed={checked}
        aria-label={label}
        disabled={disabled}
      >
        <span className={cx('h-5 w-5 rounded-full shadow transition-all', theme.thumb)} />
      </button>
    </div>
  );
}

export default function PreferencesPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesState>(defaultPreferences);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

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

    const loadPreferences = async () => {
      try {
        setLoading(true);
        const response = await profileAPI.getWorkerProfile(currentUser.id);
        const storedPreferences = response.data?.profile?.preferences;
        setPreferences(mergePreferences(storedPreferences));
        setDirty(false);
      } catch (error) {
        console.error('Failed to load preferences', error);
        setFeedback({
          type: 'error',
          message:
            language === 'fa'
              ? 'بارگذاری تنظیمات با مشکل روبه‌رو شد.'
              : 'Failed to load your preferences.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [language, router]);

  const isRTL = language === 'fa';
  const isDark = preferences.appearance.darkMode;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-karju-theme', isDark ? 'dark' : 'light');
      document.documentElement.style.setProperty('color-scheme', isDark ? 'dark' : 'light');
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('karju-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  const theme = useMemo(() => {
    if (isDark) {
      return {
        pageBg: 'bg-[#0b1220]',
        textPrimary: 'text-[#f8fafc]',
        textSecondary: 'text-[#9aa6c9]',
        summaryCard: 'bg-[#101b33] border border-white/10',
        summaryCardShadow: 'shadow-[0px_16px_36px_rgba(7,12,31,0.55)]',
        summaryIcon: 'bg-primary-500/20 text-primary-200',
        summaryHelper: 'text-[#9aa6c9]',
        summaryTextPrimary: 'text-[#f8fafc]',
        summaryTextSecondary: 'text-[#9aa6c9]',
        highlight: 'border border-primary-500/40 bg-primary-500/5',
        highlightText: 'text-primary-200',
        infoCard: 'bg-[#101b33] border border-white/10',
        infoShadow: 'shadow-[0px_20px_48px_rgba(7,12,31,0.55)]',
        buttonPrimary: 'bg-primary-500 hover:bg-primary-600 text-white',
        buttonDisabled: 'bg-primary-500/40 text-white/70 cursor-not-allowed',
        feedbackSuccess: 'bg-green-500/20 text-green-200',
        feedbackError: 'bg-red-500/20 text-red-200',
        switchContainer:
          'bg-[#17233e] border border-white/10 shadow-[0px_14px_36px_rgba(7,12,31,0.45)] hover:border-primary-400/40',
        switchLabel: 'text-[#f8fafc]',
        switchDescription: 'text-[#94a3c6]',
        toggleOn: 'bg-primary-500',
        toggleOff: 'bg-[#334155]',
        toggleThumb: 'bg-white',
        switchDisabled: 'opacity-50 cursor-not-allowed',
        sectionCard: 'bg-[#101b33] border border-white/10',
        sectionShadow: 'shadow-[0px_20px_48px_rgba(7,12,31,0.55)]',
        sectionTitle: 'text-[#f8fafc]',
        sectionSubtitle: 'text-[#9aa6c9]',
        iconBadge: 'bg-primary-500/15 text-primary-200',
        languageOptionActive: 'border-primary-400 bg-primary-500/15 text-primary-200',
        languageOption: 'border-white/10 bg-[#101b33] text-[#e2e8f0]',
        languageOptionHover: 'hover:border-primary-400/50',
      } as const;
    }

    return {
      pageBg: 'bg-[#f5f7ff]',
      textPrimary: 'text-neutral-900',
      textSecondary: 'text-neutral-600',
      summaryCard: 'bg-white border border-transparent',
      summaryCardShadow: 'shadow-[0px_16px_32px_rgba(15,23,42,0.06)]',
      summaryIcon: 'bg-primary-50 text-primary-600',
      summaryHelper: 'text-neutral-500',
      summaryTextPrimary: 'text-neutral-900',
      summaryTextSecondary: 'text-neutral-500',
      highlight: 'border border-dashed border-primary-200 bg-primary-50/60',
      highlightText: 'text-primary-700',
      infoCard: 'bg-white border border-transparent',
      infoShadow: 'shadow-[0px_18px_36px_rgba(15,23,42,0.08)]',
      buttonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white',
      buttonDisabled: 'bg-primary-200 text-white cursor-not-allowed',
      feedbackSuccess: 'bg-green-100 text-green-700',
      feedbackError: 'bg-red-100 text-red-600',
      switchContainer:
        'bg-white/70 border border-transparent shadow-[0px_12px_32px_rgba(15,23,42,0.04)] hover:border-primary-100',
      switchLabel: 'text-neutral-900',
      switchDescription: 'text-neutral-500',
      toggleOn: 'bg-primary-600',
      toggleOff: 'bg-neutral-300',
      toggleThumb: 'bg-white',
      switchDisabled: 'opacity-50 cursor-not-allowed',
      sectionCard: 'bg-white border border-transparent',
      sectionShadow: 'shadow-[0px_18px_36px_rgba(15,23,42,0.08)]',
      sectionTitle: 'text-neutral-900',
      sectionSubtitle: 'text-neutral-500',
      iconBadge: 'bg-primary-50 text-primary-600',
      languageOptionActive: 'border-primary-300 bg-primary-50/60 text-primary-700',
      languageOption: 'border-neutral-200 bg-white text-neutral-700',
      languageOptionHover: 'hover:border-primary-200',
    } as const;
  }, [isDark]);

  const switchTheme = useMemo<PreferenceSwitchTheme>(
    () => ({
      container: theme.switchContainer,
      label: theme.switchLabel,
      description: theme.switchDescription,
      toggleOn: theme.toggleOn,
      toggleOff: theme.toggleOff,
      thumb: theme.toggleThumb,
      disabled: theme.switchDisabled,
    }),
    [theme],
  );

  const handleToggleNotification = (key: keyof PreferencesState['notifications']) => (value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
    setDirty(true);
  };

  const handleThemeChange = (darkMode: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        darkMode,
      },
    }));
    setDirty(true);
  };

  const handleLanguageChange = (lang: 'fa' | 'en') => {
    setPreferences((prev) => ({
      ...prev,
      language: lang,
    }));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!user || user.userType !== 'worker' || saving || !dirty) {
      return;
    }

    try {
      setSaving(true);
      setFeedback(null);
      await profileAPI.updateWorkerProfile({
        preferences,
      });
      if (preferences.language !== language) {
        setLanguage(preferences.language);
      }
      setDirty(false);
      setFeedback({
        type: 'success',
        message:
          language === 'fa' ? 'تغییرات با موفقیت ذخیره شد.' : 'Your changes have been saved.',
      });
    } catch (error: any) {
      console.error('Failed to save preferences', error);
      const serverMessage =
        error?.response?.data?.message ??
        (language === 'fa'
          ? 'ذخیره تغییرات با مشکل مواجه شد. دوباره تلاش کنید.'
          : 'We could not save your changes. Please try again.');
      setFeedback({
        type: 'error',
        message: serverMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const notificationsSummary = useMemo(() => {
    const labelsFa = {
      instant: 'فوری',
      email: 'ایمیل',
      sms: 'پیامک',
    };
    const labelsEn = {
      instant: 'Instant',
      email: 'Email',
      sms: 'SMS',
    };

    const active: string[] = [];
    if (preferences.notifications.instant) {
      active.push(language === 'fa' ? labelsFa.instant : labelsEn.instant);
    }
    if (preferences.notifications.email) {
      active.push(language === 'fa' ? labelsFa.email : labelsEn.email);
    }
    if (preferences.notifications.sms) {
      active.push(language === 'fa' ? labelsFa.sms : labelsEn.sms);
    }

    if (active.length === 0) {
      return language === 'fa' ? 'غیرفعال' : 'Disabled';
    }

    return language === 'fa' ? active.join('، ') : active.join(', ');
  }, [language, preferences.notifications.email, preferences.notifications.instant, preferences.notifications.sms]);

  const appearanceSummary = preferences.appearance.darkMode
    ? language === 'fa'
      ? 'حالت تاریک'
      : 'Dark mode'
    : language === 'fa'
    ? 'قالب روشن'
    : 'Light mode';

  const languageSummary = preferences.language === 'fa' ? 'فارسی' : 'English';

  if (loading) {
    return (
      <div
        className={cx(
          'min-h-screen flex items-center justify-center transition-colors duration-300',
          theme.pageBg,
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex flex-col items-center gap-4 text-primary-500">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className={cx('text-sm font-medium', theme.textPrimary)}>
            {language === 'fa' ? 'در حال بارگذاری تنظیمات...' : 'Loading your preferences...'}
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
      <div
        className={cx(
          'min-h-screen flex items-center justify-center transition-colors duration-300',
          theme.pageBg,
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div
          className={cx(
            'max-w-xl rounded-3xl p-10 text-center',
            theme.sectionCard,
            theme.sectionShadow,
          )}
        >
          <h1 className={cx('text-2xl font-bold', theme.sectionTitle)}>
            {language === 'fa' ? 'به‌زودی' : 'Coming soon'}
          </h1>
          <p className={cx('mt-3', theme.sectionSubtitle)}>
            {language === 'fa'
              ? 'بخش ترجیحات برای حساب کارجو طراحی شده است.'
              : 'Preferences are currently available for worker accounts only.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cx(
        'min-h-screen py-10 transition-colors duration-300',
        theme.pageBg,
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className={cx('text-3xl font-bold', theme.textPrimary)}>
              {language === 'fa' ? 'تنظیمات و ترجیحات' : 'Settings & Preferences'}
            </h1>
            <p className={cx(theme.textSecondary)}>
              {language === 'fa'
                ? 'تنظیمات اعلان‌ها، ظاهر برنامه و حریم خصوصی خود را مدیریت کنید.'
                : 'Manage your notifications, app appearance, and privacy preferences.'}
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {feedback ? (
              <div
                className={cx(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
                  feedback.type === 'success' ? theme.feedbackSuccess : theme.feedbackError,
                )}
              >
                {feedback.message}
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty}
              className={cx(
                'inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-6 py-3 text-sm font-semibold transition',
                saving || !dirty ? theme.buttonDisabled : theme.buttonPrimary,
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {language === 'fa' ? 'در حال ذخیره...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {language === 'fa' ? 'ذخیره تغییرات' : 'Save changes'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <h2 className={cx('text-sm font-semibold', theme.summaryHelper)}>
              {language === 'fa' ? 'خلاصه تنظیمات' : 'Preferences summary'}
            </h2>

            <div className="space-y-3">
              <div className={cx('rounded-3xl p-5', theme.summaryCard, theme.summaryCardShadow)}>
                <div className="flex items-center gap-3">
                  <span className={cx('flex h-10 w-10 items-center justify-center rounded-2xl', theme.summaryIcon)}>
                    <Bell className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={cx('text-sm font-semibold', theme.summaryTextPrimary)}>
                      {language === 'fa' ? 'اعلان‌ها' : 'Notifications'}
                    </p>
                    <p className={cx('text-xs', theme.summaryTextSecondary)}>{notificationsSummary}</p>
                  </div>
                </div>
              </div>

              <div className={cx('rounded-3xl p-5', theme.summaryCard, theme.summaryCardShadow)}>
                <div className="flex items-center gap-3">
                  <span className={cx('flex h-10 w-10 items-center justify-center rounded-2xl', theme.summaryIcon)}>
                    <SunMedium className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={cx('text-sm font-semibold', theme.summaryTextPrimary)}>
                      {language === 'fa' ? 'ظاهر' : 'Appearance'}
                    </p>
                    <p className={cx('text-xs', theme.summaryTextSecondary)}>{appearanceSummary}</p>
                  </div>
                </div>
              </div>

              <div className={cx('rounded-3xl p-5', theme.summaryCard, theme.summaryCardShadow)}>
                <div className="flex items-center gap-3">
                  <span className={cx('flex h-10 w-10 items-center justify-center rounded-2xl', theme.summaryIcon)}>
                    <Globe2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={cx('text-sm font-semibold', theme.summaryTextPrimary)}>
                      {language === 'fa' ? 'زبان' : 'Language'}
                    </p>
                    <p className={cx('text-xs', theme.summaryTextSecondary)}>{languageSummary}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={cx('rounded-3xl p-5 transition-colors duration-300', theme.highlight)}>
              <div className="flex items-start gap-3">
                <span
                  className={cx(
                    'mt-1 flex h-8 w-8 items-center justify-center rounded-2xl',
                    isDark ? 'bg-primary-500/10 text-primary-200' : 'bg-white text-primary-600',
                  )}
                >
                  <Lightbulb className="h-4 w-4" />
                </span>
                <p className={cx('text-xs', theme.highlightText)}>
                  {language === 'fa'
                    ? 'تغییرات شما به صورت خودکار در همه دستگاه‌ها اعمال می‌شود.'
                    : 'Your changes will sync automatically across all devices.'}
                </p>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className={cx('rounded-3xl p-6 transition-colors duration-300', theme.sectionCard, theme.sectionShadow)}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className={cx('text-lg font-semibold', theme.sectionTitle)}>
                    {language === 'fa' ? 'اعلان‌ها' : 'Notifications'}
                  </h2>
                  <p className={cx('text-sm', theme.sectionSubtitle)}>
                    {language === 'fa'
                      ? 'مدیریت کنید چه زمانی و از چه طریقی اعلان دریافت کنید.'
                      : 'Choose how and when Karju keeps you updated.'}
                  </p>
                </div>
                <span className={cx('flex h-10 w-10 items-center justify-center rounded-2xl', theme.iconBadge)}>
                  <Bell className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <PreferenceSwitch
                  label={language === 'fa' ? 'اعلان‌های فوری' : 'Instant notifications'}
                  description={
                    language === 'fa'
                      ? 'دریافت اعلان‌های فوری در برنامه'
                      : 'Receive instant in-app notifications'
                  }
                  checked={preferences.notifications.instant}
                  onChange={handleToggleNotification('instant')}
                  language={language}
                  theme={switchTheme}
                />

                <PreferenceSwitch
                  label={language === 'fa' ? 'اعلان‌های ایمیل' : 'Email alerts'}
                  description={
                    language === 'fa'
                      ? 'ارسال اعلان‌ها به ایمیل ثبت‌شده شما'
                      : 'Send important updates to your email'
                  }
                  checked={preferences.notifications.email}
                  onChange={handleToggleNotification('email')}
                  language={language}
                  theme={switchTheme}
                />

                <PreferenceSwitch
                  label={language === 'fa' ? 'اعلان‌های پیامکی' : 'SMS notifications'}
                  description={
                    language === 'fa'
                      ? 'دریافت پیامک برای رویدادهای مهم'
                      : 'Get text messages for critical updates'
                  }
                  checked={preferences.notifications.sms}
                  onChange={handleToggleNotification('sms')}
                  language={language}
                  theme={switchTheme}
                />
              </div>
            </div>

            <div className={cx('rounded-3xl p-6 transition-colors duration-300', theme.sectionCard, theme.sectionShadow)}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className={cx('text-lg font-semibold', theme.sectionTitle)}>
                    {language === 'fa' ? 'ظاهر برنامه' : 'Appearance'}
                  </h2>
                  <p className={cx('text-sm', theme.sectionSubtitle)}>
                    {language === 'fa'
                      ? 'قالب مورد علاقه خود را برای استفاده از کارجو انتخاب کنید.'
                      : 'Pick the look and feel that fits you best.'}
                  </p>
                </div>
                <span className={cx('flex h-10 w-10 items-center justify-center rounded-2xl', theme.iconBadge)}>
                  <SunMedium className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleThemeChange(false)}
                  className={cx(
                    'flex items-center justify-between rounded-3xl border px-5 py-4 text-left transition',
                    !preferences.appearance.darkMode
                      ? theme.languageOptionActive
                      : cx(theme.languageOption, theme.languageOptionHover),
                  )}
                >
                  <div>
                    <p className={cx('font-semibold', theme.sectionTitle)}>
                      {language === 'fa' ? 'قالب روشن' : 'Light mode'}
                    </p>
                    <p className={cx('mt-1 text-sm', theme.sectionSubtitle)}>
                      {language === 'fa'
                        ? 'نمایش با پس‌زمینه روشن و المان‌های پررنگ'
                        : 'A bright interface with crisp contrast'}
                    </p>
                  </div>
                  <span
                    className={cx(
                      'ml-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
                      !preferences.appearance.darkMode
                        ? 'border-transparent bg-primary-600 text-white'
                        : isDark
                        ? 'border-white/15 text-[#94a3c6]'
                        : 'border-neutral-300 text-neutral-400',
                    )}
                  >
                    {!preferences.appearance.darkMode ? '✓' : ''}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange(true)}
                  className={cx(
                    'flex items-center justify-between rounded-3xl border px-5 py-4 text-left transition',
                    preferences.appearance.darkMode
                      ? theme.languageOptionActive
                      : cx(theme.languageOption, theme.languageOptionHover),
                  )}
                >
                  <div>
                    <p className={cx('font-semibold', theme.sectionTitle)}>
                      {language === 'fa' ? 'حالت تاریک' : 'Dark mode'}
                    </p>
                    <p className={cx('mt-1 text-sm', theme.sectionSubtitle)}>
                      {language === 'fa'
                        ? 'ایده‌آل برای محیط‌های کم‌نور و استفاده طولانی‌مدت'
                        : 'Perfect for low-light and evening shifts'}
                    </p>
                  </div>
                  <span
                    className={cx(
                      'ml-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
                      preferences.appearance.darkMode
                        ? 'border-transparent bg-primary-600 text-white'
                        : isDark
                        ? 'border-white/15 text-[#94a3c6]'
                        : 'border-neutral-300 text-neutral-400',
                    )}
                  >
                    {preferences.appearance.darkMode ? '✓' : ''}
                  </span>
                </button>
              </div>
            </div>

            <div className={cx('rounded-3xl p-6 transition-colors duration-300', theme.sectionCard, theme.sectionShadow)}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className={cx('text-lg font-semibold', theme.sectionTitle)}>
                    {language === 'fa' ? 'زبان' : 'Language'}
                  </h2>
                  <p className={cx('text-sm', theme.sectionSubtitle)}>
                    {language === 'fa'
                      ? 'زبان رابط کاربری را انتخاب کنید.'
                      : 'Pick the language you prefer to use in Karju.'}
                  </p>
                </div>
                <span className={cx('flex h-10 w-10 items-center justify-center rounded-2xl', theme.iconBadge)}>
                  <Globe2 className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('fa')}
                  className={cx(
                    'flex items-center justify-between rounded-3xl border px-5 py-4 transition text-left',
                    preferences.language === 'fa'
                      ? theme.languageOptionActive
                      : cx(theme.languageOption, theme.languageOptionHover),
                  )}
                >
                  <div>
                    <p className={cx('font-semibold', theme.sectionTitle)}>فارسی</p>
                    <p className={cx('mt-1 text-sm', theme.sectionSubtitle)}>
                      {language === 'fa'
                        ? 'برای تجربه کامل فارسی'
                        : 'Enjoy the full experience in Persian'}
                    </p>
                  </div>
                  <span
                    className={cx(
                      'ml-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
                      preferences.language === 'fa'
                        ? 'border-transparent bg-primary-600 text-white'
                        : isDark
                        ? 'border-white/15 text-[#94a3c6]'
                        : 'border-neutral-300 text-neutral-400',
                    )}
                  >
                    {preferences.language === 'fa' ? '✓' : ''}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={cx(
                    'flex items-center justify-between rounded-3xl border px-5 py-4 transition text-left',
                    preferences.language === 'en'
                      ? theme.languageOptionActive
                      : cx(theme.languageOption, theme.languageOptionHover),
                  )}
                >
                  <div>
                    <p className={cx('font-semibold', theme.sectionTitle)}>English</p>
                    <p className={cx('mt-1 text-sm', theme.sectionSubtitle)}>
                      {language === 'fa'
                        ? 'برای استفاده از نسخه انگلیسی کارجو'
                        : 'Switch to the English interface'}
                    </p>
                  </div>
                  <span
                    className={cx(
                      'ml-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
                      preferences.language === 'en'
                        ? 'border-transparent bg-primary-600 text-white'
                        : isDark
                        ? 'border-white/15 text-[#94a3c6]'
                        : 'border-neutral-300 text-neutral-400',
                    )}
                  >
                    {preferences.language === 'en' ? '✓' : ''}
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}



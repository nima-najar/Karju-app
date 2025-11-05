'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { shiftsAPI, applicationsAPI } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPersianDate, formatPersianCurrency, formatPersianNumber } from '@/lib/persianUtils';
import { format } from 'date-fns';
import { MapPin, Clock, Coins, Briefcase, Star } from 'lucide-react';
import { getUser } from '@/lib/auth';

export default function ShiftDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const [shift, setShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationText, setApplicationText] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
    loadShift();
  }, []);

  const loadShift = async () => {
    try {
      const response = await shiftsAPI.getById(params.id as string);
      setShift(response.data.shift);
    } catch (error) {
      console.error('Error loading shift:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user || user.userType !== 'worker') {
      router.push('/login');
      return;
    }

    setApplying(true);
    try {
      await applicationsAPI.apply({
        shiftId: shift.id,
        applicationText,
      });
      alert(t('shifts.applicationSubmitted'));
      loadShift(); // Reload to show application status
    } catch (error: any) {
      alert(error.response?.data?.message || t('shifts.applicationFailed'));
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">{t('shifts.shiftNotFound')}</p>
      </div>
    );
  }

  const canApply = user?.userType === 'worker' && !shift.userApplication && shift.status === 'open';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card mb-6">
        <h1 className="text-3xl font-bold mb-4">{shift.title}</h1>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-primary-600" />
            <div>
              <p className="font-medium">{shift.location}</p>
              <p className="text-sm text-gray-600">{shift.city}, {shift.province}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-primary-600" />
            <div>
              <p className="font-medium">
                {language === 'fa' 
                  ? formatPersianDate(new Date(shift.shift_date), 'EEEE, MMMM dd, yyyy')
                  : format(new Date(shift.shift_date), 'EEEE, MMMM dd, yyyy')}
              </p>
              <p className="text-sm text-gray-600">{shift.start_time} - {shift.end_time}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Coins className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-primary-600" />
            <div>
              <p className="font-medium">
                {language === 'fa' 
                  ? formatPersianCurrency(shift.hourly_wage || 0) + '/ساعت'
                  : `${shift.hourly_wage?.toLocaleString()} IRR/hour`}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'fa' 
                  ? `${t('shifts.platformFee')}: ${formatPersianCurrency(200000)} /ساعت`
                  : `${t('shifts.platformFee')}: 200,000 ${t('shifts.perHour')}`}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-primary-600" />
            <div>
              <p className="font-medium">{shift.business_name}</p>
              {shift.business_rating && (
                <p className="text-sm text-gray-600 flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1 rtl:mr-0 rtl:ml-1" />
                  {parseFloat(shift.business_rating).toFixed(1)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('shifts.description')}</h2>
          <p className="text-gray-700 whitespace-pre-line">{shift.description}</p>
        </div>

        {shift.required_skills && shift.required_skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{t('shifts.requiredSkills')}</h2>
            <div className="flex flex-wrap gap-2">
              {shift.required_skills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {shift.dress_code && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{t('shifts.dressCode')}</h2>
            <p className="text-gray-700">{shift.dress_code}</p>
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600">
            {t('shifts.cancellationDeadline')}: {language === 'fa' ? formatPersianNumber(shift.cancellation_deadline_hours) : shift.cancellation_deadline_hours} {t('shifts.hoursBeforeShift')}
          </p>
          <p className="text-sm text-gray-600">
            {t('shifts.positionsAvailable')}: {language === 'fa' ? formatPersianNumber(shift.filled_positions || 0) : (shift.filled_positions || 0)} / {language === 'fa' ? formatPersianNumber(shift.number_of_positions) : shift.number_of_positions}
          </p>
        </div>
      </div>

      {canApply && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">{t('shifts.applyForShift')}</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('shifts.applicationMessage')}
            </label>
            <textarea
              className="input-field bg-white text-gray-900"
              rows={4}
              placeholder={t('shifts.applicationPlaceholder')}
              value={applicationText}
              onChange={(e) => setApplicationText(e.target.value)}
            />
          </div>
          <button
            onClick={handleApply}
            disabled={applying}
            className="btn-primary"
          >
            {applying ? t('shifts.submitting') : t('shifts.submitApplication')}
          </button>
        </div>
      )}

      {shift.userApplication && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">{t('shifts.yourApplicationStatus')}</h2>
          <p className={`font-medium ${
            shift.userApplication.status === 'accepted' 
              ? 'text-green-600'
              : shift.userApplication.status === 'pending'
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}>
            {shift.userApplication.status === 'accepted' 
              ? t('shifts.accepted')
              : shift.userApplication.status === 'pending'
              ? t('shifts.pending')
              : shift.userApplication.status.charAt(0).toUpperCase() + shift.userApplication.status.slice(1)}
          </p>
          {shift.userApplication.application_text && (
            <p className="mt-2 text-gray-600">{shift.userApplication.application_text}</p>
          )}
        </div>
      )}
    </div>
  );
}




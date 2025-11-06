'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { profileAPI, dashboardAPI, ratingsAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPersianDate, formatPersianCurrency, formatPersianNumber } from '@/lib/persianUtils';
import { format } from 'date-fns';
import { 
  User, Edit, Briefcase, Clock, Coins, Calendar, 
  MapPin, Star, Award, TrendingUp, CheckCircle, XCircle
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileData, setProfileData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadAllData(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllData = async (currentUser: any) => {
    try {
      setLoading(true);
      
      // Load profile
      if (currentUser.userType === 'worker') {
        const profileResponse = await profileAPI.getWorkerProfile(currentUser.id);
        setProfileData(profileResponse.data);
        
        // Load dashboard data
        const dashboardResponse = await dashboardAPI.getWorkerDashboard();
        setDashboardData(dashboardResponse.data);
        
        // Load ratings
        const ratingsResponse = await ratingsAPI.getByUser(currentUser.id);
        setRatings(ratingsResponse.data.ratings || []);
      } else {
        const dashboardResponse = await dashboardAPI.getBusinessDashboard();
        setDashboardData(dashboardResponse.data);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (user?.userType === 'worker') {
    const profile = profileData?.profile || {};
    const completedShifts = dashboardData?.completedShifts || [];
    const upcomingShifts = dashboardData?.upcomingShifts || [];
    const pendingApplications = dashboardData?.pendingApplications || [];
    const incomeStats = dashboardData?.incomeStats || {};

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                {profile.profile_picture_url ? (
                  <img
                    src={profile.profile_picture_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-primary-200">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 mb-4">{user.email}</p>
                {profile.average_rating > 0 && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-semibold">
                      {parseFloat(profile.average_rating).toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      ({profile.total_ratings || 0} reviews)
                    </span>
                  </div>
                )}
                {profile.bio && (
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                )}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {profile.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-2 btn-primary"
                >
                  <Edit className="w-5 h-5" />
                  {t('profile.editProfile')}
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-xl mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('profile.dashboard')}
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'jobs'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('profile.jobsHistory')}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('profile.reviews')}
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'info'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('profile.profileInfo')}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('profile.dashboard')}</h2>
                
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="card">
                    <div className="flex items-center">
                      <Coins className="w-8 h-8 text-primary-600 mr-4 rtl:mr-0 rtl:ml-4" />
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.totalEarnings')}</p>
                        <p className="text-2xl font-bold">
                          {language === 'fa' 
                            ? formatPersianCurrency(parseInt(incomeStats.total_earnings || 0))
                            : `${parseInt(incomeStats.total_earnings || 0).toLocaleString()} IRR`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="flex items-center">
                      <Briefcase className="w-8 h-8 text-primary-600 mr-4 rtl:mr-0 rtl:ml-4" />
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.completedJobs')}</p>
                        <p className="text-2xl font-bold">
                          {incomeStats.total_shifts_completed || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="flex items-center">
                      <Calendar className="w-8 h-8 text-primary-600 mr-4 rtl:mr-0 rtl:ml-4" />
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.upcomingShifts')}</p>
                        <p className="text-2xl font-bold">
                          {upcomingShifts.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="flex items-center">
                      <Clock className="w-8 h-8 text-primary-600 mr-4 rtl:mr-0 rtl:ml-4" />
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.pendingApplications')}</p>
                        <p className="text-2xl font-bold">
                          {pendingApplications.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Shifts */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">{t('profile.upcomingShifts')}</h3>
                  {upcomingShifts.length === 0 ? (
                    <p className="text-gray-600">{t('profile.noUpcomingShifts')}</p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingShifts.map((shift: any) => (
                        <div key={shift.id} className="card border-l-4 border-primary-600 rtl:border-l-0 rtl:border-r-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">{shift.title}</h4>
                              <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <p className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {language === 'fa' 
                                    ? formatPersianDate(new Date(shift.shift_date), 'yyyy/mm/dd')
                                    : format(new Date(shift.shift_date), 'MMM dd, yyyy')} • {shift.start_time} - {shift.end_time}
                                </p>
                                <p className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {shift.location}, {shift.city}
                                </p>
                                <p className="flex items-center gap-2">
                                  <Briefcase className="w-4 h-4" />
                                  {shift.business_name}
                                </p>
                                <p className="flex items-center gap-2">
                                  <Coins className="w-4 h-4" />
                                  {language === 'fa' 
                                    ? formatPersianCurrency(parseInt(shift.hourly_wage || 0)) + '/ساعت'
                                    : `${parseInt(shift.hourly_wage)?.toLocaleString()} IRR/hour`}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              {t('profile.confirmed')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pending Applications */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('profile.pendingApplications')}</h3>
                  {pendingApplications.length === 0 ? (
                    <p className="text-gray-600">{t('profile.noPendingApplications')}</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingApplications.map((app: any) => (
                        <div key={app.id} className="card border-l-4 border-yellow-500 rtl:border-l-0 rtl:border-r-4">
                          <h4 className="font-semibold">{app.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {language === 'fa' 
                              ? formatPersianDate(new Date(app.shift_date), 'yyyy/mm/dd')
                              : format(new Date(app.shift_date), 'MMM dd, yyyy')} • {app.business_name}
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            {t('profile.pendingReview')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('profile.jobsHistory')}</h2>
                {completedShifts.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">{t('profile.noCompletedJobs')}</p>
                    <Link href="/shifts" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                      {t('profile.browseShifts')}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedShifts.map((shift: any) => (
                      <div key={shift.id} className="card border-l-4 border-green-500 rtl:border-l-0 rtl:border-r-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2">{shift.title}</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p className="flex items-center gap-2 mb-1">
                                  <Briefcase className="w-4 h-4" />
                                  <span className="font-medium">{shift.business_name}</span>
                                </p>
                                <p className="flex items-center gap-2 mb-1">
                                  <Calendar className="w-4 h-4" />
                                  {language === 'fa' 
                                    ? formatPersianDate(new Date(shift.shift_date), 'yyyy/mm/dd')
                                    : format(new Date(shift.shift_date), 'MMM dd, yyyy')} • {shift.start_time} - {shift.end_time}
                                </p>
                                <p className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {shift.location}, {shift.city}
                                </p>
                              </div>
                              <div>
                                <p className="flex items-center gap-2 mb-1">
                                  <Clock className="w-4 h-4" />
                                  {t('profile.hoursWorked')}: {language === 'fa' && shift.hours_worked ? formatPersianNumber(shift.hours_worked) : (shift.hours_worked || 'N/A')}
                                </p>
                                <p className="flex items-center gap-2 mb-1">
                                  <Coins className="w-4 h-4" />
                                  {t('profile.payment')}: {language === 'fa' 
                                    ? formatPersianCurrency(parseInt(shift.worker_payment || 0))
                                    : `${parseInt(shift.worker_payment || 0).toLocaleString()} IRR`}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {t('profile.completedOn')} {language === 'fa' 
                                    ? formatPersianDate(new Date(shift.shift_date), 'yyyy/mm/dd')
                                    : format(new Date(shift.shift_date), 'MMM dd, yyyy')}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 rtl:ml-0 rtl:mr-4">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {t('profile.completed')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('profile.reviews')}</h2>
                {ratings.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">{t('profile.noReviews')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ratings.map((rating: any) => (
                      <div key={rating.id} className="card">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < rating.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-semibold">{rating.rating}/5</span>
                            </div>
                            {rating.review_text && (
                              <p className="text-gray-700 mb-2">{rating.review_text}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              {t('profile.by')} {rating.rater_first_name} {rating.rater_last_name} • {format(new Date(rating.created_at), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'info' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('profile.profileInfo')}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('profile.personalDetails')}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.name')}</p>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.yearsOfExperience')}</p>
                        <p className="font-medium">{profile.experience_years || 0} {t('profile.years')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('profile.averageRating')}</p>
                        <p className="font-medium">
                          {profile.average_rating > 0 ? parseFloat(profile.average_rating).toFixed(1) : 'N/A'} 
                          {profile.total_ratings > 0 && ` (${profile.total_ratings} ${t('profile.reviews')})`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {profile.bio && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t('profile.bio')}</h3>
                      <p className="text-gray-700">{profile.bio}</p>
                    </div>
                  )}

                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t('profile.skills')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill: string, idx: number) => (
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

                  {profile.preferred_locations && profile.preferred_locations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t('profile.preferredLocations')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.preferred_locations.map((location: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                          >
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Business profile view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Business Profile</h1>
      <div className="card">
        <p className="text-gray-600">Business profile view coming soon...</p>
        <Link href="/profile/edit" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Edit Business Profile
        </Link>
      </div>
    </div>
  );
}

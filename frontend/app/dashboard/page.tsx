'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { format } from 'date-fns';
import { Briefcase, Clock, DollarSign, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const api = user?.userType === 'worker' ? dashboardAPI.getWorkerDashboard : dashboardAPI.getBusinessDashboard;
      const response = await api();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user?.userType === 'worker') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Worker Dashboard</h1>

        {/* Income Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">
                  {parseInt(dashboardData.incomeStats?.total_earnings || 0).toLocaleString()} IRR
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Shifts Completed</p>
                <p className="text-2xl font-bold">
                  {dashboardData.incomeStats?.total_shifts_completed || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Upcoming Shifts</p>
                <p className="text-2xl font-bold">
                  {dashboardData.upcomingShifts?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Shifts */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Shifts</h2>
          {dashboardData.upcomingShifts?.length === 0 ? (
            <p className="text-gray-600">No upcoming shifts</p>
          ) : (
            <div className="space-y-4">
              {dashboardData.upcomingShifts?.map((shift: any) => (
                <div key={shift.id} className="border-l-4 border-primary-600 pl-4 py-2">
                  <h3 className="font-semibold">{shift.title}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(shift.shift_date), 'MMM dd, yyyy')} • {shift.start_time} - {shift.end_time}
                  </p>
                  <p className="text-sm text-gray-600">{shift.business_name} • {shift.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Applications */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Applications</h2>
          {dashboardData.pendingApplications?.length === 0 ? (
            <p className="text-gray-600">No pending applications</p>
          ) : (
            <div className="space-y-4">
              {dashboardData.pendingApplications?.map((app: any) => (
                <div key={app.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h3 className="font-semibold">{app.title}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(app.shift_date), 'MMM dd, yyyy')} • {app.business_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Business Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Business Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600">Total Shifts</p>
          <p className="text-2xl font-bold">{dashboardData.stats?.total_shifts || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Applications</p>
          <p className="text-2xl font-bold">{dashboardData.stats?.total_applications || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Accepted</p>
          <p className="text-2xl font-bold">{dashboardData.stats?.accepted_applications || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Active Shifts</p>
          <p className="text-2xl font-bold">{dashboardData.activeShifts?.length || 0}</p>
        </div>
      </div>

      {/* Active Shifts */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Shifts</h2>
        {dashboardData.activeShifts?.length === 0 ? (
          <p className="text-gray-600">No active shifts</p>
        ) : (
          <div className="space-y-4">
            {dashboardData.activeShifts?.map((shift: any) => (
              <div key={shift.id} className="border-l-4 border-primary-600 pl-4 py-2">
                <h3 className="font-semibold">{shift.title}</h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(shift.shift_date), 'MMM dd, yyyy')} • {shift.start_time} - {shift.end_time}
                </p>
                <p className="text-sm text-gray-600">
                  {shift.filled_positions || 0} / {shift.number_of_positions} positions filled
                  {shift.pending_applications > 0 && (
                    <span className="ml-2 text-primary-600">
                      • {shift.pending_applications} pending applications
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Applications */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
        {dashboardData.recentApplications?.length === 0 ? (
          <p className="text-gray-600">No recent applications</p>
        ) : (
          <div className="space-y-4">
            {dashboardData.recentApplications?.map((app: any) => (
              <div key={app.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                <h3 className="font-semibold">{app.first_name} {app.last_name}</h3>
                <p className="text-sm text-gray-600">{app.title}</p>
                {app.average_rating > 0 && (
                  <p className="text-sm text-gray-600">
                    Rating: {parseFloat(app.average_rating).toFixed(1)} ({app.total_ratings} reviews)
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




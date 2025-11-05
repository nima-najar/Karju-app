'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { shiftsAPI } from '@/lib/api';
import { format } from 'date-fns';
import { MapPin, Clock, DollarSign, Filter } from 'lucide-react';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    industry: '',
    city: '',
    minWage: '',
    maxWage: '',
  });

  useEffect(() => {
    loadShifts();
  }, [filters]);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.industry) params.industry = filters.industry;
      if (filters.city) params.city = filters.city;
      if (filters.minWage) params.minWage = filters.minWage;
      if (filters.maxWage) params.maxWage = filters.maxWage;

      const response = await shiftsAPI.getAll(params);
      setShifts(response.data.shifts || []);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Available Shifts</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                className="input-field"
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              >
                <option value="">All Industries</option>
                <option value="hospitality">Hospitality</option>
                <option value="events">Events</option>
                <option value="logistics">Logistics</option>
                <option value="retail">Retail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                className="input-field"
                placeholder="Tehran, Shiraz..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Wage (IRR)</label>
              <input
                type="number"
                className="input-field"
                placeholder="500000"
                value={filters.minWage}
                onChange={(e) => setFilters({ ...filters, minWage: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Wage (IRR)</label>
              <input
                type="number"
                className="input-field"
                placeholder="1000000"
                value={filters.maxWage}
                onChange={(e) => setFilters({ ...filters, maxWage: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : shifts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No shifts found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {shifts.map((shift) => (
            <div key={shift.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{shift.title}</h3>
                  <p className="text-gray-600 mb-4">{shift.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                      <span>{shift.city}, {shift.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-2 text-primary-600" />
                      <span>
                        {format(new Date(shift.shift_date), 'MMM dd, yyyy')} {shift.start_time} - {shift.end_time}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                      <span>{shift.hourly_wage?.toLocaleString()} IRR/hour</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                      {shift.industry}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {shift.filled_positions || 0} / {shift.number_of_positions} positions filled
                    </span>
                  </div>
                </div>

                <div className="ml-6">
                  {shift.userApplication ? (
                    <span className={`px-4 py-2 rounded-lg font-medium ${
                      shift.userApplication.status === 'accepted' 
                        ? 'bg-green-100 text-green-800'
                        : shift.userApplication.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {shift.userApplication.status.charAt(0).toUpperCase() + shift.userApplication.status.slice(1)}
                    </span>
                  ) : (
                    <Link
                      href={`/shifts/${shift.id}`}
                      className="btn-primary"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




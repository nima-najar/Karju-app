'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { shiftsAPI, applicationsAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { format } from 'date-fns';
import { 
  Search, Filter, Edit, Trash2, Eye, Plus, X, 
  Calendar, MapPin, DollarSign, Users, Briefcase,
  CheckCircle, Clock, XCircle, AlertCircle
} from 'lucide-react';

export default function AdminShiftsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    industry: '',
    city: '',
    dateFrom: '',
    dateTo: '',
  });
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadShifts();
  }, []);

  useEffect(() => {
    loadShifts();
  }, [filters]);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const params: any = { all: true }; // Get all shifts, not just open ones
      
      if (filters.status) params.status = filters.status;
      if (filters.industry) params.industry = filters.industry;
      if (filters.city) params.city = filters.city;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const response = await shiftsAPI.getAll(params);
      let filteredShifts = response.data.shifts || [];

      // Apply search filter
      if (searchTerm) {
        filteredShifts = filteredShifts.filter((shift: any) =>
          shift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shift.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shift.city?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setShifts(filteredShifts);
    } catch (error) {
      console.error('Error loading shifts:', error);
      alert('Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (shift: any) => {
    setSelectedShift(shift);
    setEditForm({
      title: shift.title || '',
      description: shift.description || '',
      industry: shift.industry || '',
      location: shift.location || '',
      city: shift.city || '',
      province: shift.province || '',
      shift_date: shift.shift_date ? format(new Date(shift.shift_date), 'yyyy-MM-dd') : '',
      start_time: shift.start_time || '',
      end_time: shift.end_time || '',
      hourly_wage: shift.hourly_wage || '',
      number_of_positions: shift.number_of_positions || 1,
      required_skills: shift.required_skills?.join(', ') || '',
      dress_code: shift.dress_code || '',
      cancellation_deadline_hours: shift.cancellation_deadline_hours || 48,
      status: shift.status || 'open',
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData: any = {
        ...editForm,
        required_skills: editForm.required_skills
          ? editForm.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
      };

      await shiftsAPI.update(selectedShift.id, updateData);
      setShowEditModal(false);
      loadShifts();
      alert('Shift updated successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update shift');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await shiftsAPI.delete(selectedShift.id);
      setShowDeleteModal(false);
      loadShifts();
      alert('Shift deleted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete shift');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      open: 'bg-green-100 text-green-800',
      filled: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const icons: any = {
      open: CheckCircle,
      filled: Users,
      completed: CheckCircle,
      cancelled: XCircle,
    };

    const Icon = icons[status] || AlertCircle;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${styles[status] || styles.open}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      industry: '',
      city: '',
      dateFrom: '',
      dateTo: '',
    });
    setSearchTerm('');
  };

  if (loading && shifts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shift Management</h1>
        <p className="text-gray-600">Manage all shifts in the system</p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, business, or city..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadShifts()}
            />
          </div>
          <button
            onClick={loadShifts}
            className="btn-primary"
          >
            Search
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="input-field"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="filled">Filled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
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
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              className="input-field"
              placeholder="Filter by city"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              className="input-field"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              className="input-field"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>
        </div>

        {(filters.status || filters.industry || filters.city || filters.dateFrom || filters.dateTo || searchTerm) && (
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-600">Total Shifts</p>
          <p className="text-2xl font-bold">{shifts.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Open Shifts</p>
          <p className="text-2xl font-bold text-green-600">
            {shifts.filter((s: any) => s.status === 'open').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Filled Shifts</p>
          <p className="text-2xl font-bold text-blue-600">
            {shifts.filter((s: any) => s.status === 'filled').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Total Applications</p>
          <p className="text-2xl font-bold">
            {shifts.reduce((sum: number, s: any) => sum + (parseInt(s.total_applications) || 0), 0)}
          </p>
        </div>
      </div>

      {/* Shifts Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shift Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shifts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No shifts found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                shifts.map((shift: any) => (
                  <tr key={shift.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{shift.title}</div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {shift.city}, {shift.location}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <DollarSign className="w-4 h-4" />
                          {parseInt(shift.hourly_wage)?.toLocaleString()} IRR/hour
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{shift.business_name}</div>
                      <div className="text-sm text-gray-500">{shift.industry}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(shift.shift_date), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {shift.start_time} - {shift.end_time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{shift.filled_positions || 0}/{shift.number_of_positions}</span>
                        </div>
                        {shift.pending_applications > 0 && (
                          <div className="text-xs text-yellow-600 mt-1">
                            {shift.pending_applications} pending
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {shift.total_applications || 0} total
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(shift.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedShift(shift);
                            setShowDetailsModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-700 p-2"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(shift)}
                          className="text-blue-600 hover:text-blue-700 p-2"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedShift(shift);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit Shift</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                  <select
                    className="input-field"
                    value={editForm.industry}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                  >
                    <option value="hospitality">Hospitality</option>
                    <option value="events">Events</option>
                    <option value="logistics">Logistics</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.province}
                    onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shift Date *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={editForm.shift_date}
                    onChange={(e) => setEditForm({ ...editForm, shift_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                  <input
                    type="time"
                    className="input-field"
                    value={editForm.start_time}
                    onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                  <input
                    type="time"
                    className="input-field"
                    value={editForm.end_time}
                    onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Wage (IRR) *</label>
                  <input
                    type="number"
                    className="input-field"
                    value={editForm.hourly_wage}
                    onChange={(e) => setEditForm({ ...editForm, hourly_wage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Positions *</label>
                  <input
                    type="number"
                    className="input-field"
                    min="1"
                    value={editForm.number_of_positions}
                    onChange={(e) => setEditForm({ ...editForm, number_of_positions: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    className="input-field"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="open">Open</option>
                    <option value="filled">Filled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  className="input-field"
                  value={editForm.required_skills}
                  onChange={(e) => setEditForm({ ...editForm, required_skills: e.target.value })}
                  placeholder="waiting, customer_service, event_planning"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dress Code</label>
                <input
                  type="text"
                  className="input-field"
                  value={editForm.dress_code}
                  onChange={(e) => setEditForm({ ...editForm, dress_code: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Deadline (hours)</label>
                <input
                  type="number"
                  className="input-field"
                  value={editForm.cancellation_deadline_hours}
                  onChange={(e) => setEditForm({ ...editForm, cancellation_deadline_hours: e.target.value })}
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn-secondary"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Delete Shift</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the shift "{selectedShift.title}"? This action cannot be undone.
              </p>
              {selectedShift.filled_positions > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    This shift has {selectedShift.filled_positions} accepted application(s). 
                    You may want to cancel it instead of deleting.
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Shift Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedShift.title}</h3>
                <p className="text-gray-600">{selectedShift.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Business</p>
                  <p className="font-medium">{selectedShift.business_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="font-medium capitalize">{selectedShift.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedShift.location}, {selectedShift.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {format(new Date(selectedShift.shift_date), 'MMM dd, yyyy')} • {selectedShift.start_time} - {selectedShift.end_time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hourly Wage</p>
                  <p className="font-medium">{parseInt(selectedShift.hourly_wage)?.toLocaleString()} IRR</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Positions</p>
                  <p className="font-medium">{selectedShift.filled_positions || 0} / {selectedShift.number_of_positions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="font-medium">
                    {selectedShift.pending_applications || 0} pending, {selectedShift.total_applications || 0} total
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedShift.status)}</div>
                </div>
              </div>

              {selectedShift.required_skills && selectedShift.required_skills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedShift.required_skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedShift.dress_code && (
                <div>
                  <p className="text-sm text-gray-500">Dress Code</p>
                  <p className="font-medium">{selectedShift.dress_code}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


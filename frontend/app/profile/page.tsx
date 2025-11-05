'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { profileAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (user?.userType === 'worker') {
        const response = await profileAPI.getWorkerProfile(user.id);
        setFormData(response.data.profile || {});
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user?.userType === 'worker') {
        await profileAPI.updateWorkerProfile(formData);
      } else {
        await profileAPI.updateBusinessProfile(formData);
      }
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user?.userType === 'worker') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Worker Profile</h1>
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              className="input-field"
              rows={4}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell businesses about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.skills?.join(', ') || ''}
              onChange={(e) => setFormData({
                ...formData,
                skills: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean),
              })}
              placeholder="waiting, customer_service, event_planning"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                className="input-field"
                value={formData.experience_years || ''}
                onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Hourly Rate (IRR)
              </label>
              <input
                type="number"
                className="input-field"
                value={formData.hourly_rate_min || ''}
                onChange={(e) => setFormData({ ...formData, hourly_rate_min: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Hourly Rate (IRR)
            </label>
            <input
              type="number"
              className="input-field"
              value={formData.hourly_rate_max || ''}
              onChange={(e) => setFormData({ ...formData, hourly_rate_max: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Locations (comma-separated)
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.preferred_locations?.join(', ') || ''}
              onChange={(e) => setFormData({
                ...formData,
                preferred_locations: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean),
              })}
              placeholder="Tehran, Shiraz, Isfahan"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    );
  }

  // Business profile form
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Business Profile</h1>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            className="input-field"
            value={formData.businessName || ''}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type
          </label>
          <select
            className="input-field"
            value={formData.businessType || ''}
            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
          >
            <option value="">Select type</option>
            <option value="hospitality">Hospitality</option>
            <option value="events">Events</option>
            <option value="logistics">Logistics</option>
            <option value="retail">Retail</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            className="input-field"
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
              className="input-field"
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
              className="input-field"
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
            className="input-field"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}




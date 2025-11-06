'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { profileAPI } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Upload, User, X } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

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
        setFormData(profile);
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
        const submitData = { ...formData };
        
        if (profilePictureFile) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64String = reader.result as string;
              submitData.profilePictureUrl = base64String;
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Edit Worker Profile</h1>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 space-y-6">
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
                      title="Remove picture"
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
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Upload className="w-5 h-5" />
                  {profilePicture ? 'Change Picture' : 'Upload Picture'}
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-2">Max size: 5MB</p>
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              className="input-field bg-white text-gray-900"
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
              className="input-field bg-white text-gray-900"
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
              Years of Experience
            </label>
            <input
              type="number"
              className="input-field bg-white text-gray-900"
              value={formData.experience_years || ''}
              onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Locations (comma-separated)
            </label>
            <input
              type="text"
              className="input-field bg-white text-gray-900"
              value={formData.preferred_locations?.join(', ') || ''}
              onChange={(e) => setFormData({
                ...formData,
                preferred_locations: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean),
              })}
              placeholder="Tehran, Shiraz, Isfahan"
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
      </div>
    );
  }

  // Business profile form
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Business Profile</h1>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            className="input-field bg-white text-gray-900"
            value={formData.businessName || ''}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type
          </label>
          <select
            className="input-field bg-white text-gray-900"
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
            className="input-field bg-white text-gray-900"
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
              className="input-field bg-white text-gray-900"
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
              className="input-field bg-white text-gray-900"
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
            className="input-field bg-white text-gray-900"
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


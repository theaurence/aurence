"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    niche: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    followerCount: '',
    companyName: '',
    description: '',
    industry: '',
    budgetRange: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          // Populate form data
          setFormData({
            name: userData.name,
            email: userData.email,
            bio: userData.creatorProfile?.bio || '',
            niche: userData.creatorProfile?.niche || '',
            instagram: userData.creatorProfile?.socials ? JSON.parse(userData.creatorProfile.socials).instagram || '' : '',
            tiktok: userData.creatorProfile?.socials ? JSON.parse(userData.creatorProfile.socials).tiktok || '' : '',
            youtube: userData.creatorProfile?.socials ? JSON.parse(userData.creatorProfile.socials).youtube || '' : '',
            followerCount: userData.creatorProfile?.followerCount || '',
            companyName: userData.brandProfile?.companyName || '',
            description: userData.brandProfile?.description || '',
            industry: userData.brandProfile?.industry || '',
            budgetRange: userData.brandProfile?.budgetRange || '',
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (user.role === 'CREATOR') {
        const socials = {
          instagram: formData.instagram,
          tiktok: formData.tiktok,
          youtube: formData.youtube
        };

        const response = await fetch('/api/profile/creator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bio: formData.bio,
            niche: formData.niche,
            socials: JSON.stringify(socials),
            followerCount: parseInt(formData.followerCount),
          }),
        });

        if (response.ok) {
          setIsEditing(false);
          // Refresh user data
          const userResponse = await fetch('/api/profile');
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          }
        } else {
          alert('Failed to update profile');
        }
      } else {
        const response = await fetch('/api/profile/brand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: formData.companyName,
            description: formData.description,
            industry: formData.industry,
            budgetRange: formData.budgetRange,
          }),
        });

        if (response.ok) {
          setIsEditing(false);
          // Refresh user data
          const userResponse = await fetch('/api/profile');
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          }
        } else {
          alert('Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isCreator = user.role === 'CREATOR';
  const profile = isCreator ? user.creatorProfile : user.brandProfile;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold mb-4">My Profile</h1>
              <p className="text-lg text-gray-300">
                Manage your profile information and settings
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
            </div>

            {isCreator ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Niche</label>
                    <input
                      type="text"
                      name="niche"
                      value={formData.niche}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Follower Count</label>
                    <input
                      type="number"
                      name="followerCount"
                      value={formData.followerCount}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="@yourhandle"
                      className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">TikTok</label>
                    <input
                      type="text"
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleInputChange}
                      placeholder="@yourhandle"
                      className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">YouTube</label>
                    <input
                      type="text"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleInputChange}
                      placeholder="Channel name"
                      className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Range</label>
                    <input
                      type="text"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 border border-gray-700 text-white py-4 rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-white text-black py-4 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <div className="text-white">{user.name}</div>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <div className="text-white">{user.email}</div>
                </div>
                <div>
                  <span className="text-gray-400">Role:</span>
                  <div className="text-white">{user.role}</div>
                </div>
                <div>
                  <span className="text-gray-400">Member Since:</span>
                  <div className="text-white">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            {profile && (
              <div className="border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {isCreator ? 'Creator Profile' : 'Brand Profile'}
                </h2>
                <div className="space-y-4">
                  {isCreator ? (
                    <>
                      {profile.bio && (
                        <div>
                          <span className="text-gray-400">Bio:</span>
                          <div className="text-white">{profile.bio}</div>
                        </div>
                      )}
                      {profile.niche && (
                        <div>
                          <span className="text-gray-400">Niche:</span>
                          <div className="text-white">{profile.niche}</div>
                        </div>
                      )}
                      {profile.followerCount && (
                        <div>
                          <span className="text-gray-400">Follower Count:</span>
                          <div className="text-white">{profile.followerCount.toLocaleString()}</div>
                        </div>
                      )}
                      {profile.socials && (
                        <div>
                          <span className="text-gray-400">Social Media:</span>
                          <div className="text-white">
                            {Object.entries(JSON.parse(profile.socials)).map(([platform, handle]) => (
                              <div key={platform} className="capitalize">
                                {platform}: {handle}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-gray-400">Company Name:</span>
                        <div className="text-white">{profile.companyName}</div>
                      </div>
                      {profile.description && (
                        <div>
                          <span className="text-gray-400">Description:</span>
                          <div className="text-white">{profile.description}</div>
                        </div>
                      )}
                      {profile.industry && (
                        <div>
                          <span className="text-gray-400">Industry:</span>
                          <div className="text-white">{profile.industry}</div>
                        </div>
                      )}
                      {profile.budgetRange && (
                        <div>
                          <span className="text-gray-400">Budget Range:</span>
                          <div className="text-white">{profile.budgetRange}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

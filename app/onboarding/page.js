"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Creator form state
  const [creatorForm, setCreatorForm] = useState({
    bio: "",
    niche: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    followerCount: "",
    profilePicture: ""
  });

  // Brand form state
  const [brandForm, setBrandForm] = useState({
    companyName: "",
    description: "",
    industry: "",
    budgetRange: "",
    logo: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
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

  const handleCreatorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const socials = {
        instagram: creatorForm.instagram,
        tiktok: creatorForm.tiktok,
        youtube: creatorForm.youtube
      };

      const response = await fetch('/api/profile/creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: creatorForm.bio,
          niche: creatorForm.niche,
          socials: JSON.stringify(socials),
          followerCount: parseInt(creatorForm.followerCount),
          profilePicture: creatorForm.profilePicture
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error creating creator profile:', error);
      alert('Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/profile/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandForm),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error creating brand profile:', error);
      alert('Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4">Complete Your Profile</h1>
          <p className="text-gray-300 text-lg">
            {user.role === 'CREATOR' 
              ? 'Tell us about yourself so brands can find you'
              : 'Tell us about your company so creators can connect with you'
            }
          </p>
        </div>

        {user.role === 'CREATOR' ? (
          <form onSubmit={handleCreatorSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={creatorForm.bio}
                onChange={(e) => setCreatorForm({...creatorForm, bio: e.target.value})}
                placeholder="Tell us about yourself, your content style, and what makes you unique..."
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white h-24 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Niche/Category</label>
              <select
                value={creatorForm.niche}
                onChange={(e) => setCreatorForm({...creatorForm, niche: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              >
                <option value="">Select your niche</option>
                <option value="Lifestyle & Beauty">Lifestyle & Beauty</option>
                <option value="Fashion">Fashion</option>
                <option value="Fitness & Wellness">Fitness & Wellness</option>
                <option value="Food & Cooking">Food & Cooking</option>
                <option value="Travel">Travel</option>
                <option value="Technology">Technology</option>
                <option value="Gaming">Gaming</option>
                <option value="Education">Education</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Instagram Handle</label>
                <input
                  type="text"
                  value={creatorForm.instagram}
                  onChange={(e) => setCreatorForm({...creatorForm, instagram: e.target.value})}
                  placeholder="@yourhandle"
                  className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">TikTok Handle</label>
                <input
                  type="text"
                  value={creatorForm.tiktok}
                  onChange={(e) => setCreatorForm({...creatorForm, tiktok: e.target.value})}
                  placeholder="@yourhandle"
                  className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">YouTube Channel</label>
              <input
                type="text"
                value={creatorForm.youtube}
                onChange={(e) => setCreatorForm({...creatorForm, youtube: e.target.value})}
                placeholder="Your YouTube channel name"
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Total Follower Count</label>
              <input
                type="number"
                value={creatorForm.followerCount}
                onChange={(e) => setCreatorForm({...creatorForm, followerCount: e.target.value})}
                placeholder="50000"
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profile Picture URL</label>
              <input
                type="url"
                value={creatorForm.profilePicture}
                onChange={(e) => setCreatorForm({...creatorForm, profilePicture: e.target.value})}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black py-4 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 font-semibold text-lg"
            >
              {isSubmitting ? "Creating Profile..." : "Complete Profile"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleBrandSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                value={brandForm.companyName}
                onChange={(e) => setBrandForm({...brandForm, companyName: e.target.value})}
                placeholder="Your company name"
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company Description</label>
              <textarea
                value={brandForm.description}
                onChange={(e) => setBrandForm({...brandForm, description: e.target.value})}
                placeholder="Tell us about your company, products, and brand values..."
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white h-24 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <select
                value={brandForm.industry}
                onChange={(e) => setBrandForm({...brandForm, industry: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              >
                <option value="">Select your industry</option>
                <option value="Beauty & Skincare">Beauty & Skincare</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Technology">Technology</option>
                <option value="Travel & Tourism">Travel & Tourism</option>
                <option value="Fitness & Sports">Fitness & Sports</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Budget Range per Campaign</label>
              <select
                value={brandForm.budgetRange}
                onChange={(e) => setBrandForm({...brandForm, budgetRange: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              >
                <option value="">Select budget range</option>
                <option value="$100 - $500">$100 - $500</option>
                <option value="$500 - $1,000">$500 - $1,000</option>
                <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000+">$10,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company Logo URL</label>
              <input
                type="url"
                value={brandForm.logo}
                onChange={(e) => setBrandForm({...brandForm, logo: e.target.value})}
                placeholder="https://example.com/your-logo.png"
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black py-4 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 font-semibold text-lg"
            >
              {isSubmitting ? "Creating Profile..." : "Complete Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

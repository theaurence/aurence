"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    deadline: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const userData = await response.json();
          if (userData.role !== 'BRAND') {
            router.push('/dashboard');
            return;
          }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/campaigns/${data.campaign.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    } finally {
      setIsSubmitting(false);
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

  const categories = [
    'Beauty & Skincare',
    'Fashion & Apparel',
    'Health & Wellness',
    'Food & Beverage',
    'Technology',
    'Travel & Tourism',
    'Fitness & Sports',
    'Home & Garden',
    'Finance',
    'Education',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold mb-4">Post New Campaign</h1>
          <p className="text-lg text-gray-300">
            Create a new collaboration opportunity for creators
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Summer Skincare Launch"
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
              placeholder="Describe what you're looking for in this campaign. Include key requirements, deliverables, and any specific guidelines for creators."
              className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white h-32 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Budget ($)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="2500"
                min="1"
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Application Deadline (Optional)</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <p className="text-sm text-gray-400 mt-1">
              Leave empty if there's no specific deadline
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-gray-700 text-white py-4 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-white text-black py-4 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 font-semibold"
            >
              {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

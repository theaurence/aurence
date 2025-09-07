"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    budgetMin: '',
    budgetMax: '',
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns');
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filters.category && campaign.category !== filters.category) return false;
    if (filters.budgetMin && campaign.budget < parseInt(filters.budgetMin)) return false;
    if (filters.budgetMax && campaign.budget > parseInt(filters.budgetMax)) return false;
    return true;
  });

  const categories = [...new Set(campaigns.map(c => c.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold mb-4">Browse Campaigns</h1>
          <p className="text-lg text-gray-300">
            Discover collaboration opportunities that match your style and audience
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Min Budget</label>
              <input
                type="number"
                value={filters.budgetMin}
                onChange={(e) => setFilters({...filters, budgetMin: e.target.value})}
                placeholder="0"
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Budget</label>
              <input
                type="number"
                value={filters.budgetMax}
                onChange={(e) => setFilters({...filters, budgetMax: e.target.value})}
                placeholder="10000"
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No campaigns match your filters</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignCard({ campaign }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="border border-gray-800 rounded-xl p-6 hover:bg-white/5 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold">{campaign.title}</h3>
        <span className="text-lg font-bold text-green-400">${campaign.budget}</span>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{campaign.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Brand:</span>
          <span className="text-white">{campaign.brand.brandProfile?.companyName || campaign.brand.name}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Category:</span>
          <span className="text-white">{campaign.category}</span>
        </div>
        {campaign.deadline && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Deadline:</span>
            <span className="text-white">{formatDate(campaign.deadline)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Applications:</span>
          <span className="text-white">{campaign._count.applications}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/campaigns/${campaign.id}`}
          className="flex-1 bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition text-center font-medium"
        >
          View Details
        </Link>
        <Link
          href={`/campaigns/${campaign.id}/apply`}
          className="flex-1 border border-white text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition text-center font-medium"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}

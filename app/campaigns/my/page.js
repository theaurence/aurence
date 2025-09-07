"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyCampaignsPage() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch('/api/profile');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.role !== 'BRAND') {
            router.push('/dashboard');
            return;
          }
          setUser(userData);

          // Fetch user's campaigns
          const campaignsResponse = await fetch('/api/campaigns/my');
          if (campaignsResponse.ok) {
            const campaignsData = await campaignsResponse.json();
            setCampaigns(campaignsData);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: newStatus }
            : campaign
        ));
      } else {
        alert('Failed to update campaign status');
      }
    } catch (error) {
      console.error('Error updating campaign status:', error);
      alert('Failed to update campaign status');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-900 text-green-300';
      case 'CLOSED': return 'bg-gray-900 text-gray-300';
      case 'COMPLETED': return 'bg-blue-900 text-blue-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-semibold mb-4">My Campaigns</h1>
            <p className="text-lg text-gray-300">
              Manage your collaboration campaigns and track applications
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
          >
            Post New Campaign
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📢</div>
            <h2 className="text-2xl font-semibold mb-4">No campaigns yet</h2>
            <p className="text-gray-300 mb-8">
              Create your first campaign to start connecting with creators
            </p>
            <Link
              href="/campaigns/new"
              className="bg-white text-black px-8 py-4 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              Create Your First Campaign
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-800 rounded-xl p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{campaign.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{campaign.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">${campaign.budget}</div>
                    <div className="text-sm text-gray-400">{campaign._count.applications} applications</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <div className="text-white">{campaign.category}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <div className="text-white">{formatDate(campaign.createdAt)}</div>
                  </div>
                  {campaign.deadline && (
                    <div>
                      <span className="text-gray-400">Deadline:</span>
                      <div className="text-white">{formatDate(campaign.deadline)}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <div className="text-white">{campaign.status}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className="flex-1 bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition text-center font-medium"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/campaigns/${campaign.id}/applications`}
                    className="flex-1 border border-white text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition text-center font-medium"
                  >
                    View Applications ({campaign._count.applications})
                  </Link>
                  {campaign.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleStatusChange(campaign.id, 'CLOSED')}
                      className="border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition font-medium"
                    >
                      Close Campaign
                    </button>
                  )}
                  {campaign.status === 'CLOSED' && (
                    <button
                      onClick={() => handleStatusChange(campaign.id, 'ACTIVE')}
                      className="border border-green-600 text-green-300 py-2 px-4 rounded-lg hover:bg-green-900 transition font-medium"
                    >
                      Reopen Campaign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

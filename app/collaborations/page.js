"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CollaborationsPage() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my'); // 'my' for creators, 'received' for brands
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch('/api/profile');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);

          // Fetch applications based on user role
          if (userData.role === 'CREATOR') {
            const applicationsResponse = await fetch('/api/applications/my');
            if (applicationsResponse.ok) {
              const applicationsData = await applicationsResponse.json();
              setApplications(applicationsData);
            }
          } else {
            const applicationsResponse = await fetch('/api/applications/received');
            if (applicationsResponse.ok) {
              const applicationsData = await applicationsResponse.json();
              setApplications(applicationsData);
            }
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

  const handleApplicationAction = async (applicationId, action) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Update local state
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: action.toUpperCase() }
            : app
        ));
      } else {
        alert('Failed to update application');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
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

  const isCreator = user.role === 'CREATOR';
  const pendingApplications = applications.filter(app => app.status === 'PENDING');
  const acceptedApplications = applications.filter(app => app.status === 'ACCEPTED');
  const rejectedApplications = applications.filter(app => app.status === 'REJECTED');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-900 text-yellow-300';
      case 'ACCEPTED': return 'bg-green-900 text-green-300';
      case 'REJECTED': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold mb-4">
            {isCreator ? 'My Applications' : 'Applications Received'}
          </h1>
          <p className="text-lg text-gray-300">
            {isCreator 
              ? "Track your collaboration applications and their status"
              : "Review and manage applications from creators"
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold mb-2 text-yellow-400">{pendingApplications.length}</div>
            <div className="text-lg font-medium mb-1">Pending</div>
            <div className="text-sm text-gray-400">
              {isCreator ? 'Awaiting brand response' : 'Awaiting your review'}
            </div>
          </div>
          <div className="border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold mb-2 text-green-400">{acceptedApplications.length}</div>
            <div className="text-lg font-medium mb-1">Accepted</div>
            <div className="text-sm text-gray-400">
              {isCreator ? 'Applications accepted' : 'Applications you accepted'}
            </div>
          </div>
          <div className="border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold mb-2 text-red-400">{rejectedApplications.length}</div>
            <div className="text-lg font-medium mb-1">Rejected</div>
            <div className="text-sm text-gray-400">
              {isCreator ? 'Applications rejected' : 'Applications you rejected'}
            </div>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold mb-4">No applications yet</h2>
            <p className="text-gray-300 mb-8">
              {isCreator 
                ? "Start applying to campaigns to see your applications here"
                : "Create campaigns to start receiving applications from creators"
              }
            </p>
            <Link
              href={isCreator ? "/campaigns" : "/campaigns/new"}
              className="bg-white text-black px-8 py-4 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              {isCreator ? "Browse Campaigns" : "Create Campaign"}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application.id} className="border border-gray-800 rounded-xl p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        {isCreator ? application.campaign.title : application.creator.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      {isCreator 
                        ? `Brand: ${application.campaign.brand.brandProfile?.companyName || application.campaign.brand.name}`
                        : `Campaign: ${application.campaign.title}`
                      }
                    </p>
                    {application.message && (
                      <p className="text-gray-400 text-sm italic">"{application.message}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">${application.campaign.budget}</div>
                    <div className="text-sm text-gray-400">{formatDate(application.createdAt)}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/campaigns/${application.campaign.id}`}
                    className="flex-1 bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition text-center font-medium"
                  >
                    View Campaign
                  </Link>
                  {isCreator ? (
                    <Link
                      href={`/profile/${application.campaign.brand.id}`}
                      className="flex-1 border border-white text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition text-center font-medium"
                    >
                      View Brand Profile
                    </Link>
                  ) : (
                    <>
                      <Link
                        href={`/profile/${application.creator.id}`}
                        className="flex-1 border border-white text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition text-center font-medium"
                      >
                        View Creator Profile
                      </Link>
                      {application.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApplicationAction(application.id, 'accept')}
                            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleApplicationAction(application.id, 'reject')}
                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </>
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch('/api/profile');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);

          // Check if profile is complete
          const isProfileComplete = userData.role === 'CREATOR' 
            ? userData.creatorProfile?.isComplete 
            : userData.brandProfile?.isComplete;

          if (!isProfileComplete) {
            router.push('/onboarding');
            return;
          }

          // Fetch role-specific data
          if (userData.role === 'CREATOR') {
            const campaignsResponse = await fetch('/api/campaigns');
            if (campaignsResponse.ok) {
              const campaignsData = await campaignsResponse.json();
              setCampaigns(campaignsData.slice(0, 3)); // Show first 3 campaigns
            }

            const applicationsResponse = await fetch('/api/applications/my');
            if (applicationsResponse.ok) {
              const applicationsData = await applicationsResponse.json();
              setApplications(applicationsData);
            }
          } else {
            const campaignsResponse = await fetch('/api/campaigns/my');
            if (campaignsResponse.ok) {
              const campaignsData = await campaignsResponse.json();
              setCampaigns(campaignsData);
            }

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
        console.error('Error fetching dashboard data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-wide mb-4">
            Welcome back, {isCreator ? user.name : profile?.companyName} 👋
          </h1>
          <p className="text-lg text-gray-300">
            {isCreator 
              ? "Discover new opportunities and manage your collaborations"
              : "Manage your campaigns and connect with creators"
            }
          </p>
        </div>

        {isCreator ? (
          <CreatorDashboard campaigns={campaigns} applications={applications} />
        ) : (
          <BrandDashboard campaigns={campaigns} applications={applications} />
        )}
      </div>
    </div>
  );
}

function CreatorDashboard({ campaigns, applications }) {
  const stats = {
    applicationsSent: applications.length,
    applicationsAccepted: applications.filter(app => app.status === 'ACCEPTED').length,
    applicationsCompleted: applications.filter(app => app.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Applications Sent" 
          value={stats.applicationsSent}
          description="Total applications submitted"
        />
        <StatCard 
          title="Accepted" 
          value={stats.applicationsAccepted}
          description="Applications accepted by brands"
        />
        <StatCard 
          title="Completed" 
          value={stats.applicationsCompleted}
          description="Successfully completed collaborations"
        />
      </div>

      {/* Recommended Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recommended Campaigns</h2>
          <Link 
            href="/campaigns" 
            className="text-white hover:text-gray-300 font-medium"
          >
            Browse All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        {campaigns.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No campaigns available at the moment</p>
            <p className="text-sm">Check back later for new opportunities</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/campaigns"
          className="block border border-gray-800 rounded-xl p-6 hover:bg-white/5 transition-colors"
        >
          <div className="text-lg font-medium mb-2">Browse Campaigns</div>
          <div className="text-sm text-gray-400">Discover new collaboration opportunities</div>
        </Link>
        <Link 
          href="/collaborations"
          className="block border border-gray-800 rounded-xl p-6 hover:bg-white/5 transition-colors"
        >
          <div className="text-lg font-medium mb-2">My Applications</div>
          <div className="text-sm text-gray-400">Track your application status</div>
        </Link>
      </div>
    </div>
  );
}

function BrandDashboard({ campaigns, applications }) {
  const stats = {
    activeCampaigns: campaigns.filter(c => c.status === 'ACTIVE').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'PENDING').length,
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Campaigns" 
          value={stats.activeCampaigns}
          description="Currently running campaigns"
        />
        <StatCard 
          title="Total Applications" 
          value={stats.totalApplications}
          description="Applications received"
        />
        <StatCard 
          title="Pending Review" 
          value={stats.pendingApplications}
          description="Applications awaiting review"
        />
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recent Applications</h2>
          <Link 
            href="/collaborations" 
            className="text-white hover:text-gray-300 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-4">
          {applications.slice(0, 3).map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
        {applications.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No applications yet</p>
            <p className="text-sm">Create campaigns to start receiving applications</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/campaigns/new"
          className="block border border-gray-800 rounded-xl p-6 hover:bg-white/5 transition-colors"
        >
          <div className="text-lg font-medium mb-2">Post New Campaign</div>
          <div className="text-sm text-gray-400">Create a new collaboration opportunity</div>
        </Link>
        <Link 
          href="/campaigns/my"
          className="block border border-gray-800 rounded-xl p-6 hover:bg-white/5 transition-colors"
        >
          <div className="text-lg font-medium mb-2">My Campaigns</div>
          <div className="text-sm text-gray-400">Manage your existing campaigns</div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ title, value, description }) {
  return (
    <div className="border border-gray-800 rounded-xl p-6">
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-lg font-medium mb-1">{title}</div>
      <div className="text-sm text-gray-400">{description}</div>
    </div>
  );
}

function CampaignCard({ campaign }) {
  return (
    <div className="border border-gray-800 rounded-xl p-6 hover:bg-white/5 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium">{campaign.title}</h3>
        <span className="text-sm text-gray-400">${campaign.budget}</span>
      </div>
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{campaign.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {campaign.category}
        </span>
        <Link 
          href={`/campaigns/${campaign.id}`}
          className="text-white hover:text-gray-300 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

function ApplicationCard({ application }) {
  return (
    <div className="border border-gray-800 rounded-xl p-4 hover:bg-white/5 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{application.creator.name}</div>
        <span className={`text-xs px-2 py-1 rounded ${
          application.status === 'PENDING' ? 'bg-yellow-900 text-yellow-300' :
          application.status === 'ACCEPTED' ? 'bg-green-900 text-green-300' :
          'bg-red-900 text-red-300'
        }`}>
          {application.status}
        </span>
      </div>
      <p className="text-gray-300 text-sm mb-2">{application.campaign.title}</p>
      {application.message && (
        <p className="text-gray-400 text-xs line-clamp-2">{application.message}</p>
      )}
    </div>
  );
}

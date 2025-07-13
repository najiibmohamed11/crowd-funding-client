'use client'

import { useState, useEffect } from 'react';
import { CampaignCard } from '../components/campaignCard';
import Header from '../components/header';
import { BottomNavigation } from '../components/buttomNavigations';
import { contract } from '../client';
import { useReadContract } from 'thirdweb/react';
import SkeletonLoader from '../components/SkeletonLoader';

export default function LikedCampaigns() {
  const [likedCampaigns, setLikedCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: allCampaigns, isLoading: campaignsLoading, error } = useReadContract({
    contract,
    method:
    "function getOngoingCampaigns() view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive)[])",
    params: [],
  });

  useEffect(() => {
    const lovedCampaigns = JSON.parse(localStorage.getItem('lovedCampaigns') || '{}');
    const likedIds = Object.keys(lovedCampaigns).map(id => parseInt(id, 10));

    if (allCampaigns) {
      const filteredCampaigns = allCampaigns.filter((campaign: any) => likedIds.includes(Number(campaign.id)));
      const formattedCampaigns = filteredCampaigns.map((campaign) => ({
        ...campaign,
        target: Number(campaign.target),
        amountCollected: Number(campaign.amountCollected) / 1e18,
        deadline: Number(campaign.deadline)
      }));
      setLikedCampaigns(formattedCampaigns);
      setIsLoading(false);
    }
  }, [allCampaigns]);

  if (isLoading || campaignsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Error loading campaigns</h2>
        <p className="mt-2 text-gray-600">{error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col justify-around items-start mx-4 sm:mx-12 lg:mx-24 pb-16 ">
      <Header />
      <h1 className="font-bold my-5 text-lg sm:text-2xl">Your Liked Campaigns</h1>
      
      {likedCampaigns.length > 0 ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {likedCampaigns.map((campaign, index) => (
              <CampaignCard
                key={index}
                id={campaign.id}
                owner={campaign.owner}
                title={campaign.title}
                story={campaign.story}
                target={campaign.target}
                deadline={campaign.deadline}
                amountCollected={campaign.amountCollected}
                image={campaign.image}
                donators={campaign.donators}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 rounded-lg w-full">
          <h2 className="mt-4 text-xl font-semibold text-gray-800">No Liked Campaigns</h2>
          <p className="mt-2 text-gray-600">You haven't liked any campaigns yet.</p>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}

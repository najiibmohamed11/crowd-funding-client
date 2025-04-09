"use client";
import React from "react";
import { getContract } from "thirdweb";
import { client,contract } from "../client";
import { polygonAmoy } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { CampaignCard } from "./campaignCard";
import SkeletonLoader from "./SkeletonLoader";


const CampaignList = () => {
  const { data, isLoading, error } = useReadContract({
    contract,
    method:
    "function getOngoingCampaigns() view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive)[])",
    params: [],
  });

    

  

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      </div>
    );
  }


  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Error loading campaigns</h2>
        <p className="mt-2 text-gray-600">{error.message}</p>
      </div>
    </div>
  );

  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">No Active Campaigns</h2>
        <p className="mt-2 text-gray-600">There are currently no active campaigns.</p>
      </div>
    </div>
  );

  // Format campaign data before passing to CampaignCard
  const formattedCampaigns = data.map((campaign) => ({
    ...campaign,
    target: Number(campaign.target), // Convert target from bigint to number
    amountCollected: Number(campaign.amountCollected) / 1e18, // Convert and normalize amountCollected
    deadline: Number(campaign.deadline) // Convert deadline from bigint to number
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {formattedCampaigns.map((campaign, index) => (
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
  );
};

export default CampaignList;


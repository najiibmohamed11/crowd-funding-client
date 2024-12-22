// CampaignList.tsx
"use client";
import React from "react";
import { getContract } from "thirdweb";
import { client } from "../client";
import { polygonAmoy } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { CampaignCard } from "./campaignCard";

const contract = getContract({
  client,
  address: "0x794cA73827f7A848d4972C445012AD7BA1376B88",
  chain: polygonAmoy,
});

const CampaignList = () => {
  const { data, isLoading, error } = useReadContract({
    contract,
    method:
      "function getCampaigns() view returns ((address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment)[] donators)[])",
    params: [],
  });

  if (isLoading) return <div className="text-center py-10">Loading campaigns...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading campaigns: {error.message}</div>;
  if (!data || data.length === 0) return <div className="text-center py-10">No campaigns are currently active.</div>;

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
            id={index.toString()}
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

'use client'

import { FaRegCirclePause } from 'react-icons/fa6'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Web3Avatar from "@/app/components/web3Avatar"
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react"
import { contract} from '@/app/client'
import { getContract, prepareContractCall } from 'thirdweb'
import { polygonAmoy } from 'thirdweb/chains'

export function Profile() {
  const account = useActiveAccount()
  const {mutate:sendTransaction,error,isPending:isLoading,isSuccess,data:response,failureReason}=useSendTransaction()


  const { data, isPending } = useReadContract({
    contract: contract,
    method:
    "function getUserOngoingCampaigns(address _user) view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive)[])",
    params: [account?.address],
  });

  if (isPending) {
    return <div>Loading...</div>
  }

  if (!data || data.length === 0) {
    return <div></div>
  }
  const lastCampaign = data[data.length - 1];
  console.log('last compaign ',lastCampaign.owner);
  console.log('owner',account?.address);
  console.log('failureReason',failureReason);


  // Function to calculate percentage
  const percentageCalculator = (amountCollected: number, target: number) => {
    if (!target || target <= 0) return 0; // Avoid division by zero
    const collectedAmount = amountCollected / 1e18;
    return ((collectedAmount / target) * 100).toFixed(2); // Limit to 2 decimals
  };
  const lastCampaignId=data.length-1;
  console.log(lastCampaignId);


  const progress = Number(percentageCalculator(Number(lastCampaign.amountCollected), Number(lastCampaign.target)));
  const paus=()=>{
    const transaction = prepareContractCall({
      contract,
      method: "function pauseCampaign(uint256 _id)",
      params: [BigInt(lastCampaignId)],
    });
    sendTransaction(transaction);
    console.log('error',error)
    console.log(isSuccess)
  }
  return (
    <Card className="w-full max-w-md p-6 bg-transparent backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-6">Your Profile</h2>

      {/* Account Information */}
      <div className="flex items-center gap-3 mb-8">
        <Web3Avatar address={account?.address} />
        <div>
          <div className="font-medium">
            {account?.address ? `${account.address.slice(0, 6)}....${account.address.slice(-4)}` : 'Not connected'}
          </div>
          <div className="text-gray-500">Digital Artist</div>
        </div>
      </div>

      {/* Campaign Collection Status */}
      <h3 className="font-medium mb-6">last campaign  colections</h3>

      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          {/* Circular Progress Background */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#f1f1f1"
              strokeWidth="8"
            />
            {/* Dynamic Progress Circle */}
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#ff6b6b"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Current status:</span>
          <span className="text-red-500 font-medium">$ {(Number(lastCampaign.amountCollected) / 1e18).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">You need:</span>
          <span className="font-medium">$ {Number(lastCampaign.target).toFixed(2)}</span>
        </div>
      </div>

      {/* Stop Collecting Button */}
      <Button
      onClick={paus}
        variant="outline"
        className="w-full h-16 flex items-center rounded-2xl justify-center gap-2 text-red-500 bg-transparent"
      >
        <FaRegCirclePause className="h-5 w-5" />
        Stop collecting
      </Button>
    </Card>
  );
}

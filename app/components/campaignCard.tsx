// CampaignCard.tsx
import Link from "next/link";
import React from "react";
import Web3Avatar from "./web3Avatar";
import NFTAvatar from "./nft-avatar";

interface Donator {
  amount: bigint;
  comment: string;
  donator: string;
}

interface CampaignProps {
  id: string;
  owner: string;
  title: string;
  story: string;
  target: number; // Changed from bigint to number
  deadline: number; // Changed from bigint to number
  amountCollected: number; // Changed from bigint to number
  image: string;
  donators: readonly Donator[];
}

export const CampaignCard: React.FC<CampaignProps> = ({
  id,
  owner,
  title,
  story,
  target,
  deadline,
  amountCollected,
  image,
  donators,
}) => {
  return (
    <Link href={`campaign/${id}`} className="block h-full">
      <div className="bg-white shadow-md rounded-lg overflow-hidden h-full flex flex-col transition-transform duration-300 hover:scale-105">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4 flex-grow">
          <h3 className="font-title text-neutral-950 text-xl font-semibold mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 mb-4 line-clamp-3">{story}</p>
          <div className="flex justify-between text-sm text-neutral-950">
            <div>
              <p className="font-bold">{amountCollected}</p>
              <p className="text-neutral-600">Raised of {target}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{donators.length}</p>
              <p className="text-neutral-600">Total backers</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center">
            {/* <Web3Avatar address={owner} size="md" /> */}
            <NFTAvatar
              address={owner}
              size="md"
              style="pixel-art" // or "bottts", "avataaars", etc.
            />

            <p className="ml-2 text-sm text-neutral-950">
              by{" "}
              <span className="font-semibold">
                {owner.slice(0, 6)}...{owner.slice(-4)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

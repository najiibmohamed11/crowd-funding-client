"use client";

'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FaEthereum } from 'react-icons/fa';
import {
  Share2,
  MessageCircle,
  EclipseIcon as Ethereum,
  Sun,
  Moon,
  Rocket,
} from 'lucide-react';
import { BsRocketTakeoffFill } from 'react-icons/bs';

import { DonationModal } from '@/app/components/donationModal';
import { EvcDonationModal } from '@/app/components/evcDonationModal';
import DonatorsModal from './donatorsModal';
import { ShareModal } from './shareModal';
import { useParams } from 'next/navigation';
import Web3Avatar from './web3Avatar';
import { useActiveAccount } from 'thirdweb/react';
import { SiPolygon, SiLandrover } from 'react-icons/si';
import { Heart } from 'lucide-react';

interface Donator {
  amount: bigint;
  comment: string;
  donator: string;
  date: string;
}

interface CampaignCardProp {
  owner: string;
  title: string;
  target: Number;
  amountCollected: Number;
  deadline: Number;
  donators: readonly Donator[];
}

const CampaignInfoCard: React.FC<CampaignCardProp> = ({
  owner,
  title,
  target,
  amountCollected,
  donators,
  deadline,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEvcModalOpen, setIsEvcModalOpen] = useState(false);
  const [isDonateListOpen, setIsDonateListOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const params = useParams();
  const account = useActiveAccount();
  const id = Number(params.id);

  useEffect(() => {
    const lovedCampaigns = JSON.parse(localStorage.getItem('lovedCampaigns') || '{}');
    if (lovedCampaigns[id]) {
      setIsLoved(true);
    }
  }, [id]);

  const handleLove = () => {
    const lovedCampaigns = JSON.parse(localStorage.getItem('lovedCampaigns') || '{}');
    if (isLoved) {
      delete lovedCampaigns[id];//removes the propert and 
    } else {
      lovedCampaigns[id] = true;
    }
    localStorage.setItem('lovedCampaigns', JSON.stringify(lovedCampaigns));
    setIsLoved(!isLoved);
  };

  const handleDonate = async (amount: string, comment: string) => {
     window.location.reload();
    // Add a small delay to allow the transaction to be processed
    // setTimeout(() => {
    //   window.location.reload();
    // }, 2500); // 2.5 seconds delay after the success message
  };

  const campaignUrl = `${window.location.origin}/campaign/${id}`;

  const RisedAmountPercantageCalculation = () => {
    return (Number(amountCollected) / Number(target)) * 100;
  };

  const IsThoOwnerHer = owner == account?.address;

  return (
    <Card className="overflow-hidden bg-background border">
      <CardContent className="p-3 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-4 sm:mb-6 break-words">
          {title}
        </h1>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-0">
              <span className="text-2xl sm:text-3xl font-semibold text-foreground flex items-center">
                {amountCollected.toString()} 
                <span className="text-base sm:text-lg ml-1">POL</span>
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                raised of {target.toString()} POL goal
              </span>
            </div>
            <div className="relative mt-3">
              <Progress
                value={RisedAmountPercantageCalculation()}
                className="h-2"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  left: `${Math.min(RisedAmountPercantageCalculation(), 97)}%`,
                  transform: `translate(-50%, -50%)`,
                }}
              >
                <BsRocketTakeoffFill
                  className="h-3 w-3 sm:h-4 sm:w-4 text-primary"
                  style={{ transform: 'rotate(45deg)' }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
            <span>{donators.length} backers</span>
            <span>{deadline.toString()} days left</span>
          </div>
          <div className="flex flex-row gap-2 sm:gap-3">
            <Button
              size="lg"
              className={`flex-1 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:text-white ${
                IsThoOwnerHer ? 'cursor-not-allowed opacity-70' : ''
              } `}
              disabled={IsThoOwnerHer}
              onClick={() => setIsModalOpen(true)}
            >
              <SiPolygon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">
                {IsThoOwnerHer
                  ? "You can't donate to yourself"
                  : 'Donate with Polygon'}
              </span>
            </Button>
            <Button
              size="lg"
              className={`flex-1 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:text-white ${
                IsThoOwnerHer ? 'cursor-not-allowed opacity-70' : ''
              } `}
              disabled={IsThoOwnerHer}
              onClick={() => setIsEvcModalOpen(true)}
            >
              <span className="mr-2 font-bold text-xs sm:text-sm">EVC</span>
              <span className="text-xs sm:text-sm">
                {IsThoOwnerHer
                  ? "You can't donate to yourself"
                  : 'Donate with EVC'}
              </span>
            </Button>

            <Button
              onClick={() => setIsShareModalOpen(true)}
              size="icon"
              variant="outline"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button onClick={handleLove} size="icon" variant="outline">
              <Heart
                className={`h-4 w-4 transition-colors duration-300 ${
                  isLoved ? 'text-red-500 fill-red-500' : 'text-muted-foreground'
                }`}
              />
            </Button>
          </div>
        </div>
        {donators.length > 0 ? (
          <div>
            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              {donators.slice(-3).map((donator, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 sm:gap-4 border-b last:border-b-0 pb-3 sm:pb-4 last:pb-0"
                >
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <Web3Avatar address={donator.donator} size="md" />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm font-medium text-foreground break-all">
                        {`${donator.donator.slice(
                          0,
                          6
                        )}...${donator.donator.slice(-4)}`}
                      </p>

                      <Badge
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-500 text-blue-800 dark:text-white text-xs whitespace-nowrap"
                      >
                        {Number(donator.amount) / 1e18} POL
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground break-words">
                      {donator.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <Button
                onClick={() => setIsDonateListOpen(true)}
                variant="outline"
                className="w-full sm:w-auto bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-sm py-2 sm:py-3"
              >
                <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Show More
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center flex justify-center items-center mt-4"></div>
        )}
      </CardContent>
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDonate={handleDonate}
      />
      <EvcDonationModal
        isOpen={isEvcModalOpen}
        onClose={() => setIsEvcModalOpen(false)}
        onDonate={handleDonate}
      />
      <DonatorsModal
        donators={donators}
        onClose={() => setIsDonateListOpen(false)}
        isOpen={isDonateListOpen}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        campaignUrl={campaignUrl}
      />
    </Card>
  );
};

export default CampaignInfoCard;


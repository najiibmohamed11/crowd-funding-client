"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FaEthereum } from "react-icons/fa";
import {
  Share2,
  MessageCircle,
  EclipseIcon as Ethereum,
  Sun,
  Moon,
  Rocket,
} from "lucide-react";
import { BsRocketTakeoffFill } from "react-icons/bs";

import { DonationModal } from "@/app/components/donationModal";
import { EvcDonationModal } from "@/app/components/evcDonationModal";
import  DonatorsModal  from "./donatorsModal";
import { ShareModal } from "./shareModal";
import { useParams } from "next/navigation";
import Web3Avatar from "./web3Avatar";
import { useActiveAccount } from "thirdweb/react";
import { SiPolygon } from "react-icons/si";

interface Donator {
  amount: bigint;
  comment: string;
  donator: string;
}
interface CampaignCardProp {
  owner: string;
  title: string;
  target: Number; // Convert target from bigint to number
  amountCollected: Number; // Convert and normalize amountCollected
  deadline: Number; // Convert deadline from bigint to number
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
  const params = useParams();
  const account = useActiveAccount()
  const id = Number(params.id);
  const handleDonate = async (amount: string, comment: string) => {
    // Refresh campaign data after successful donation
    try {
      // You can add your data refresh logic here
      // For example, refetch campaign data or update local state
      console.log(`Donation successful: ${amount} with comment: ${comment}`);
      // Force a re-render or refetch data
      window.location.reload(); // Temporary solution - you might want to implement a more elegant refresh
    } catch (error) {
      console.error("Error refreshing campaign data:", error);
    }
  };

  const campaignUrl = `${window.location.origin}/campaign/${id}`;

  const RisedAmountPercantageCalculation = () => {
    return (Number(amountCollected) / Number(target)) * 100;
  };
  const IsThoOwnerHer=owner==account?.address;
  return (
    <Card className="overflow-hidden bg-background border">
      <CardContent className="p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-6">
          {title}
        </h1>
        <div className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-semibold text-foreground">
                {amountCollected.toString()} MATIC
              </span>
              <span className="text-sm text-muted-foreground">
                raised of {target.toString()} MATIC goal
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
                  className="h-4 w-4 text-primary  "
                  style={{ transform: "rotate(45deg)" }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{donators.length} backers</span>
            <span>{deadline.toString()} days left</span>
          </div>
          <div className="flex gap-3">
            <Button
              size="lg"
              className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:text-white  ${
                IsThoOwnerHer ? "cursor-not-allowed " : ""
              } `}
              disabled={IsThoOwnerHer}
              onClick={() => setIsModalOpen(true)}
            >
              <SiPolygon className="mr-2 h-4 w-4" />
              {IsThoOwnerHer
                ? "you can't donet to you'r selfe"
                : "Donate with Polygon"}
            </Button>
            <Button
              size="lg"
              className={`flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:text-white  ${
                IsThoOwnerHer ? "cursor-not-allowed " : ""
              } `}
              disabled={IsThoOwnerHer}
              onClick={() => setIsEvcModalOpen(true)}
            >
              <span className="mr-2 font-bold">EVC</span>
              {IsThoOwnerHer
                ? "you can't donet to you'r selfe"
                : "Donate with EVC"}
            </Button>
            <Button
              onClick={() => setIsShareModalOpen(true)}
              size="lg"
              variant="outline"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {donators.length > 0 ? (
          <div>
            <div className="mt-8 space-y-4">
              {donators.slice(-3).map((donator, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 border-b last:border-b-0 pb-4 last:pb-0"
                >
                  <Avatar>
                    <Web3Avatar address={donator.donator} size="md" />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {donator.donator}
                      </p>

                      <Badge
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-500 text-blue-800 dark:text-white"
                      >
                        {Number(donator.amount) / 1e18} MATIC
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {donator.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
        
              <div className="mt-6 text-center">
                <Button
                  onClick={() => setIsDonateListOpen(true)}
                  variant="outline"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Show More
                </Button>
              </div>
  
          </div>
        ) : (
          <div className="text-center flex justify-center items-center mt-4">
     
          </div>
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

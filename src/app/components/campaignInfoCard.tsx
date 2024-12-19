'use client'

import { useState } from 'react'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Share2, MessageCircle, EclipseIcon as Ethereum, Sun, Moon } from 'lucide-react'
import { DonationModal } from '@/app/components/donationModal'
import { DonatorsModal } from './donatorsModal'
import { ShareModal } from './shareModal'
import { useParams } from 'next/navigation'

interface Donator {
  amount: bigint;
  comment: string;
  donator: string;
}
interface CampaignCardProp {
  title: string;
  target: Number; // Convert target from bigint to number
  amountCollected: Number; // Convert and normalize amountCollected
  deadline: Number; // Convert deadline from bigint to number
  donators: Donator[];
}
const CampaignInfoCard: React.FC<CampaignCardProp> = ({
  title,
  target,
  amountCollected,
  donators,
  deadline,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDonateListOpen, setIsDonateListOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const params=useParams()
  const id =Number(params.id);
  const handleDonate = (amount: string, comment: string) => {
    console.log(`Donating ${amount} ETH with comment: ${comment}`);
  };
  const DonatorsList = [
    {
      name: "Alice Johnson",
      amount: 0.5,
      comment: "Love this project!",
      date: new Date(2023, 5, 20),
    },
    {
      name: "Bob Smith",
      amount: 0.25,
      comment: "Can't wait to see the final product!",
      date: new Date(2023, 5, 18),
    },
    {
      name: "Carol White",
      amount: 0.75,
      comment: "This is exactly what our schools need.",
      date: new Date(2023, 5, 15),
    },
  ];

  const campaignUrl = `${window.location.origin}/campaign/${id}`;

  const RisedAmountPercantageCalculation=()=>{
    return (amountCollected/target)*100
  }
  return (
    <Card className="overflow-hidden bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white shadow-xl dark:shadow-2xl">
      <CardContent className="p-8">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600 lg:text-5xl">
          {title}
        </h1>
        <div className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-400 dark:to-blue-500">
                {amountCollected} pol
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                raised of {target}ETH goal
              </span>
            </div>
            <Progress
              value={RisedAmountPercantageCalculation()}
              className="mt-2 h-3 rounded-full bg-gray-200 dark:bg-gray-700"
            />
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
            <span>173 backers</span>
            <span>15 days left</span>
          </div>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-700 hover:scale-105"
              onClick={() => setIsModalOpen(true)}
            >
              <Ethereum className="mr-2 h-5 w-5" />
              Back this project
            </Button>
            <Button
              onClick={() => setIsShareModalOpen(true)}
              size="lg"
              variant="outline"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        { donators.length>0?
        <div>
          <div className="mt-10 space-y-4">
            {donators.map((donator, index) => (
              <div
                key={index}
                className="flex items-start gap-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0"
              >
                {/* <Avatar>
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${donator.name}`}
                  />
                  <AvatarFallback>{donator.donator}</AvatarFallback>
                </Avatar> */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-gray-300">
                      {donator.donator}
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 dark:bg-blue-500 text-blue-800 dark:text-white"
                    >
                      {Number(donator.amount) / 1e18} pol
                    </Badge>
                  </div>
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
          :<div></div>}
      </CardContent>
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDonate={handleDonate}
      />
      <DonatorsModal
        donators={DonatorsList}
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

export default CampaignInfoCard


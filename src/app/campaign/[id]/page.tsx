'use client'

import { useState } from 'react'
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, MessageCircle } from 'lucide-react'
import Header from '@/app/components/header'
import CampaignInfoCard from '@/app/components/campaignInfoCard'
import { client } from '@/app/client'
import { getContract, readContract } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { useReadContract } from 'thirdweb/react'
import { useParams } from 'next/navigation'


const contract = getContract({
  client,
  address: "0x794cA73827f7A848d4972C445012AD7BA1376B88",
  chain: polygonAmoy,
});
export default function CampaignDetails() {
  const params=useParams()
  const id =Number(params.id);

  const { data, isLoading, error } = useReadContract({
    contract,
    method:
      "function getCampaigns() view returns ((address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment)[] donators)[])",
    params: [],
  });
  if (isLoading) return <div className="text-center py-10">Loading campaigns...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading campaigns: {error.message}</div>;
  if (!data) return <div className="text-center py-10">No data available.</div>;
  
  const campaign = data[id];
  if (!campaign) return <div className="text-center py-10">Campaign not found.</div>;

  const formattedCampaigns = {
    titile:campaign.title,
    target: Number(campaign.target), // Convert target from bigint to number
    amountCollected: Number(campaign.amountCollected) / 1e18, // Convert and normalize amountCollected
    deadline: Number(campaign.deadline), // Convert deadline from bigint to number
    donators: [...campaign.donators], // Convert readonly array to mutable array
  }
  return (
    <div className="flex flex-col justify-around items-start mx-4 sm:mx-12 lg:mx-24 pb-16">
    <Header/>
    <div className="min-h-screen ">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {/* Hero Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Section */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl lg:aspect-square">
            <Image
              src={campaign.image}
              alt="Campaign hero image"
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>

          {/* Campaign Info Card */}
          <CampaignInfoCard  title={formattedCampaigns.titile} target={formattedCampaigns.target} amountCollected={formattedCampaigns.amountCollected} deadline={formattedCampaigns.deadline} donators={formattedCampaigns.donators}/>
      
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
              <TabsTrigger value="about" className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">About</TabsTrigger>
              <TabsTrigger value="updates" className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Updates</TabsTrigger>
              <TabsTrigger value="comments" className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About this project</h2>
                    <p className="text-gray-600">
                   {campaign.story}
                    </p>
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Creator</h3>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Campaign Creator</p>
                          <p className="text-sm text-gray-600">First time creator</p>
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="updates" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800">New</Badge>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Production Update #1</h3>
                    <p className="mt-2 text-gray-600">
                      We're excited to announce that production has begun on the first batch of learning boxes. Our team has been working tirelessly to ensure that each box meets our high standards for quality and sustainability. We can't wait to get these into your hands!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-200 last:border-0">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">Backer #{i}</p>
                            <span className="text-sm text-gray-500">1 day ago</span>
                          </div>
                          <p className="mt-1 text-gray-600">
                            Really excited about this project! The eco-friendly approach is exactly what we need in educational tools. Can't wait to see the final product!
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Add Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </div>
  )
}


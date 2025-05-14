"use client";

import { useState } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, MessageCircle } from "lucide-react";
import Header from "@/app/components/header";
import CampaignInfoCard from "@/app/components/campaignInfoCard";
import { contract } from "@/app/client";
import { useReadContract } from "thirdweb/react";
import { useParams } from "next/navigation";
import Web3Avatar from "@/app/components/web3Avatar";



export default function CampaignDetails() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, error } = useReadContract({
    contract,
    method:
    "function getOngoingCampaigns() view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive)[])",
    params: [],
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-10">Loading campaigns...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-10 text-red-500">
          Error loading campaigns: {error.message}
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-10">No data available.</div>
      </div>
    );


  const campaign = data.find((campaign:any)=> Number(campaign.id)==id);
  if (!campaign)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-10">Campaign not found.</div>
      </div>
    );

  const formattedCampaigns = {
    title: campaign.title,
    target: Number(campaign.target),
    amountCollected: Number(campaign.amountCollected) / 1e18,
    deadline: Number(campaign.deadline),
    donators: [...campaign.donators??[]],
  };
  const now=new Date();
  const expireDate=new Date(formattedCampaigns.deadline*1000 );
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
  const daysLeft = Math.ceil((expireDate - now) / oneDay);


  return (
    <div className="flex flex-col justify-around items-start mx-4 sm:mx-12 lg:mx-24 pb-16">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image Container */}
          <div className="relative w-full h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={campaign.image}
              alt="Campaign hero image"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Campaign Info Card - Now full height */}
          <div className="lg:h-[600px] flex flex-col">
            <CampaignInfoCard
              title={formattedCampaigns.title}
              target={formattedCampaigns.target}
              amountCollected={formattedCampaigns.amountCollected}
              deadline={daysLeft}
              donators={formattedCampaigns.donators}
              owner={campaign.owner}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About this project</h2>
              <p className="text-gray-600">{campaign.story}</p>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Creator</h3>
                <div className="flex items-center gap-3">
                  <Web3Avatar address={campaign.owner} size="md" />
                  <div>
                    <p className="font-medium">{campaign.owner}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

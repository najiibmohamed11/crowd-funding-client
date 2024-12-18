"use client";


import { CampaignCard } from "./components/campaignCard";
import { BottomNavigations } from "./components/buttomNavigations";
import Header from "./components/header";

export default function Home() {
  return (
    <div className="flex flex-col justify-around items-start mx-4 sm:mx-12 lg:mx-24 pb-16">
      <Header />
      <h1 className="font-bold my-5 text-lg sm:text-2xl">Popular Campaigns</h1>
      
      {/* Responsive Grid for Campaign Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        <CampaignCard />
        <CampaignCard />
        <CampaignCard />
        <CampaignCard />
        <CampaignCard />
        <CampaignCard />
      </div>

      <BottomNavigations />
    </div>
  );
}

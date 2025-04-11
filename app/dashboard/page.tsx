"use client"

import { PlusCircle, Wallet } from "lucide-react"
import { Overview } from "./components/overview"
import { Earnings } from "./components/earnings"
import { Statistics } from "./components/statistics"
import { Profile } from "./components/profile"
import { MobileApp } from "./components/mobile-app"
import ConnectWallet from "../components/ConnectWallet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useActiveAccount, useReadContract } from "thirdweb/react"
import { getContract } from "thirdweb"
import { polygonAmoy } from "thirdweb/chains"
import { client ,contract} from '@/app/client'
import Link from "next/link"


export type Donator = {
  donator: string
  amount: bigint
  comment: string
  date: string
}

export type Campaign = {
  owner: string
  title: string
  story: string
  target: bigint
  deadline: bigint
  amountCollected: bigint
  image: string
  donators: Donator[]
  isActive: boolean
}



export default function DashboardPage() {
  const account = useActiveAccount()
  const [campaignData, setCampaignData] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { data, isPending} = useReadContract({
    contract: contract,
    method:
    "function getUserCampaigns(address _user) view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive)[])",
    params: [account?.address??''],
  })

  useEffect(() => {
    if (data) {
      setCampaignData(data)
      setIsLoading(false)
    } else if (!isPending) {
      setIsLoading(false)
    }
  }, [data, isPending])

  // Handle wallet not connected state
  if (account?.address == null) {
    return (
      <main className="h-[80vh] flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold">Connect Your Wallet</h1>
          <p className="text-muted-foreground">Connect your wallet to view your dashboard and manage your campaigns</p>
          <ConnectWallet />
        </Card>
      </main>
    )
  }

  // Handle no campaigns state
  if (!isLoading && (!campaignData || campaignData.length === 0)) {
    return (
      <main className="h-[80vh] flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Create Your First Campaign</h1>
          <p className="text-muted-foreground">Start your fundraising journey by creating your first campaign</p>
          <Link href='/dashboard/create-campaign'>
          <Button className="w-full" size="lg">
            Create Campaign
          </Button>
          </Link>
        </Card>
      </main>
    )
  }

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <main className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </main>
    )
  }

  // Show full dashboard when everything is ready
  return (
    <main className="container mx-auto px-4">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-medium">Dashboard</h1>
          <div className="flex items-center gap-4">
            <ConnectWallet />
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8 py-8">
          <div className="space-y-8">
            <div className="grid md:grid-cols-[200px_1fr] gap-8">
              <Overview campaigns={campaignData} />
              <Earnings campaignData={campaignData} />
            </div>
            <Statistics campaignData={campaignData} />
          </div>
          <div className="space-y-8">
            <Profile />
            <MobileApp />
          </div>
        </div>
      </div>
    </main>
  )
}


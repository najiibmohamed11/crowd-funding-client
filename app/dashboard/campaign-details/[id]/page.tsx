"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Target, Users, Wallet, PauseCircle, PlayCircle, Heart, ArrowLeft, Copy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { readContract } from "thirdweb"
import { contract } from "@/app/client"
import Web3Avatar from "@/app/components/web3Avatar"

export default function CampaignDetails() {
  const params = useParams()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        // Replace 'contract' with your actual contract reference
        // You might need to import or initialize it from your contract config
        
        const data = await readContract({
          contract,
          method: "function getCampaign(uint256 _campaignId) view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive))",
          params: [campaignId],
        });
        
        setCampaign(data)
        setIsPaused(!data.isActive)
      } catch (error) {
        console.error("Failed to fetch campaign details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignDetails()
  }, [campaignId])

  const copyToClipboard = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const togglePauseResume = async () => {
    // This would connect to your contract function in a real implementation
    // Here you would call your contract's function to toggle the campaign status
    // For example:
    // await writeContract({
    //   contract,
    //   method: "toggleCampaignStatus",
    //   params: [campaignId]
    // });
    
    setIsPaused(!isPaused)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Calculate campaign metrics
  const target = Number(campaign.target)
  const raised = Number(campaign.amountCollected) / 1e18
  const progress = (raised / target) * 100
  const backers = campaign.donators.length

  // Calculate time remaining
  const deadline = Number(campaign.deadline) * 1000
  const now = Date.now()
  const timeRemaining = deadline - now
  const daysRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60 * 24)))

  // Format owner address
  const formattedOwnerAddress = `${campaign.owner.slice(0, 6)}...${campaign.owner.slice(-4)}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column - Campaign Image and Actions */}
          <div className="md:col-span-2 space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg">
              {/* Campaign Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className={`${isPaused ? "bg-amber-500" : "bg-green-500"} text-white px-3 py-1`}>
                  {isPaused ? "Paused" : "Active"}
                </Badge>
              </div>

              {/* Campaign Image */}
              <div className="relative w-full h-[400px]">
                <Image
                  src={campaign.image || "/placeholder.svg?height=400&width=800"}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Campaign Title and Description */}
              <div className="p-6 space-y-4">
                <h1 className="text-3xl font-bold text-slate-900">{campaign.title}</h1>

                {/* Creator Info */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <AvatarFallback className="text-xs font-mono bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                      {campaign.owner.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-slate-600">
                    Created by <span className="font-mono">{formattedOwnerAddress}</span>
                  </div>
                </div>

                {/* Campaign Story */}
                <div className="prose prose-slate max-w-none mt-6">
                  <p className="text-slate-700 leading-relaxed">{campaign.story}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Campaign Stats and Actions */}
          <div className="space-y-6">
            {/* Campaign Stats Card */}
            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-6 space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-3xl font-bold text-slate-900">{raised.toFixed(2)}</span>
                      <span className="text-sm text-slate-500 ml-1">POL</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-slate-500">of {target} POL goal</span>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{progress.toFixed(1)}% Complete</span>
                    <span>{target - raised > 0 ? `${(target - raised).toFixed(2)} POL to go` : "Goal reached!"}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Backers</span>
                    </div>
                    <p className="text-xl font-semibold">{backers}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">Days Left</span>
                    </div>
                    <p className="text-xl font-semibold">{daysRemaining}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <Target className="h-4 w-4" />
                      <span className="text-xs">Target</span>
                    </div>
                    <p className="text-xl font-semibold">
                      {target} <span className="text-xs text-slate-500">POL</span>
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <Wallet className="h-4 w-4" />
                      <span className="text-xs">Deadline</span>
                    </div>
                    <p className="text-sm font-semibold">{new Date(deadline).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
 

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:text-white"
                    onClick={togglePauseResume}
                  >
                    {isPaused ? (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4 text-green-500" />
                        Resume Campaign
                      </>
                    ) : (
                      <>
                        <PauseCircle className="mr-2 h-4 w-4 text-amber-500" />
                        Pause Campaign
                      </>
                    )}
                  </Button>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-200 text-slate-800 hover:bg-slate-50"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        "Copied!"
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Share
                        </>
                      )}
                    </Button>

                    <Button variant="outline" className="flex-1 border-slate-200 text-slate-800 hover:bg-slate-50">
                      <Heart className="mr-2 h-4 w-4 text-rose-500" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donators Section */}
            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <Tabs defaultValue="donators">
                  <TabsList className="w-full bg-slate-100">
                    <TabsTrigger value="donators" className="flex-1">
                      Donators
                    </TabsTrigger>
                    <TabsTrigger value="updates" className="flex-1">
                      Updates
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="donators" className="mt-4 space-y-4">
                  {campaign.donators.length > 0 ? (
          <div>
            <div className="mt-8 space-y-4">
              {campaign.donators.map((donator, index) => (
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
                        {`${donator.donator.slice(0, 6)}...${donator.donator.slice(-4)}`}
                      </p>

                      <Badge
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-500 text-blue-800 dark:text-white"
                      >
                        {Number(donator.amount) / 1e18} pol
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {donator.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
      
          </div>
        ) :  (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No donators yet</h3>
                        <p className="text-sm text-slate-500 mt-1">Be the first to support this campaign!</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="updates" className="mt-4">
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-slate-900">No updates yet</h3>
                      <p className="text-sm text-slate-500 mt-1">Check back later for campaign updates</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
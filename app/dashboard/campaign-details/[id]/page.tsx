"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Target, Users, Wallet, PauseCircle, PlayCircle, Heart, ArrowLeft, Copy, Edit2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { prepareContractCall, readContract } from "thirdweb"
import { contract } from "@/app/client"
import Web3Avatar from "@/app/components/web3Avatar"
import { useActiveAccount, useSendTransaction } from "thirdweb/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Donator {
  donator: string;
  amount: bigint;
  comment: string;
  date: string;
}

interface Campaign {
  id: bigint;
  owner: string;
  title: string;
  story: string;
  target: bigint;
  deadline: bigint;
  amountCollected: bigint;
  image: string;
  donators: readonly Donator[];
  isActive: boolean;
}

export default function CampaignDetails() {
  const params = useParams()
  const campaignId = params.id as string
  const account = useActiveAccount()
  const {
    mutate: sendTransaction,
    error,
    isPending: isTransactionPending,
    isSuccess,
    data: response,
    failureReason,
  } = useSendTransaction()

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingStory, setIsEditingStory] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newStory, setNewStory] = useState("")

  const fetchCampaignDetails = async () => {
    try {
      const data = await readContract({
        contract,
        method: "function getCampaign(uint256 _campaignId) view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive))",
        params: [BigInt(campaignId)],
      });
      
      setCampaign(data as Campaign)
      setIsPaused(data.isActive)
    } catch (error) {
      console.error("Failed to fetch campaign details:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaignDetails()
  }, [campaignId])

  useEffect(() => {
    if (isSuccess) {
      fetchCampaignDetails()
    }
  }, [isSuccess])

  const copyToClipboard = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const togglePauseResume = async () => {
    try {
      const transaction = await prepareContractCall({
        contract,
        method: "function toggleCampaignState(uint256 _campaignId)",
        params: [BigInt(campaignId)],
      });
      await sendTransaction(transaction);
    } catch (error) {
      console.error("Failed to toggle campaign state:", error);
      toast.error("Failed to toggle campaign state");
    }
  };

  const updateCampaignTitle = async () => {
    if (!newTitle.trim()) {
      toast.error("Title cannot be empty")
      return
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "function updateCampaignTitle(uint256 _campaignId, string _newTitle)",
        params: [BigInt(campaignId), newTitle],
      })

      await sendTransaction(transaction)
      toast.success("Campaign title updated successfully")
      setIsEditingTitle(false)
    } catch (error) {
      console.error("Failed to update title:", error)
      toast.error("Failed to update title")
    }
  }

  const updateCampaignStory = async () => {
    if (!newStory.trim()) {
      toast.error("Story cannot be empty")
      return
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "function updateCampaignStory(uint256 _campaignId, string _newStory)",
        params: [BigInt(campaignId), newStory],
      })

      await sendTransaction(transaction)
      toast.success("Campaign story updated successfully")
      setIsEditingStory(false)
    } catch (error) {
      console.error("Failed to update story:", error)
      toast.error("Failed to update story")
    }
  }

  // Add handlers for opening edit modals
  const handleOpenTitleEdit = () => {
    if (campaign) {
      setNewTitle(campaign.title)
      setIsEditingTitle(true)
    }
  }

  const handleOpenStoryEdit = () => {
    if (campaign) {
      setNewStory(campaign.story)
      setIsEditingStory(true)
    }
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
  const oneDay = 24 * 60 * 60 * 1000 // milliseconds in one day
  const daysRemaining = Math.ceil((timeRemaining / oneDay))

  // Format owner address
  const formattedOwnerAddress = `${campaign.owner.slice(0, 6)}...${campaign.owner.slice(-4)}`

  return (
    <>
      {isTransactionPending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-lg font-medium">Processing Transaction...</p>
            <p className="text-sm text-slate-500">Please wait while we update the blockchain</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center text-xs sm:text-sm text-slate-600 hover:text-primary mb-3 sm:mb-4 md:mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Back to Dashboard
          </Link>

          <div className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-3">
            {/* Left Column - Campaign Image and Actions */}
            <div className="md:col-span-2 space-y-4 sm:space-y-6">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-lg">
                {/* Campaign Status Badge */}
                <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-10">
                  {deadline==0&&<Badge className={`${!campaign.isActive ? "bg-amber-500" : "bg-green-500"} text-white px-2 py-1 text-xs sm:text-sm`}>
                    {!campaign.isActive ? "Paused" : "Active"}
                  </Badge>}
                </div>

                {/* Campaign Image */}
                <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] md:aspect-[16/9]">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Campaign Title and Description */}
                <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-slate-900 break-words">{campaign.title}</h1>
                    {account?.address === campaign.owner && (
                      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleOpenTitleEdit}>
                            <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Campaign Title</DialogTitle>
                            <DialogDescription>
                              Update your campaign title. This will be visible to all users.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Input
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              placeholder="Enter new title"
                              className="w-full"
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditingTitle(false)}>
                              Cancel
                            </Button>
                            <Button onClick={updateCampaignTitle} disabled={isTransactionPending}>
                              {isTransactionPending ? "Updating..." : "Update Title"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 bg-primary/10">
                      <AvatarFallback className="text-[10px] sm:text-xs font-mono bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                        {campaign.owner.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs sm:text-sm text-slate-600 break-all">
                      Created by <span className="font-mono">{formattedOwnerAddress}</span>
                    </div>
                  </div>

                  {/* Campaign Story */}
                  <div className="prose prose-slate max-w-none mt-4 sm:mt-6 relative">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-base sm:text-lg md:text-xl font-semibold">Campaign Story</h2>
                      {account?.address === campaign.owner && (
                        <Dialog open={isEditingStory} onOpenChange={setIsEditingStory}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleOpenStoryEdit}>
                              <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Campaign Story</DialogTitle>
                              <DialogDescription>
                                Update your campaign story. This will be visible to all users.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Textarea
                                value={newStory}
                                onChange={(e) => setNewStory(e.target.value)}
                                placeholder="Enter new story"
                                className="w-full min-h-[200px]"
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditingStory(false)}>
                                Cancel
                              </Button>
                              <Button onClick={updateCampaignStory} disabled={isTransactionPending}>
                                {isTransactionPending ? "Updating..." : "Update Story"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed break-words">{campaign.story}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Campaign Stats and Actions */}
            <div className="space-y-4 sm:space-y-6">
              {/* Campaign Stats Card */}
              <Card className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <div className="flex items-baseline">
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">{raised.toFixed(2)}</span>
                        <span className="text-xs sm:text-sm text-slate-500 ml-1">POL</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs sm:text-sm text-slate-500">of {target} POL goal</span>
                      </div>
                    </div>
                    <Progress value={progress} className="h-1.5 sm:h-2" />
                    <div className="flex justify-between text-xs text-slate-500 flex-wrap gap-2">
                      <span>{progress.toFixed(1)}% Complete</span>
                      <span>{target - raised > 0 ? `${(target - raised).toFixed(2)} POL to go` : "Goal reached!"}</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center space-x-2 text-slate-500 mb-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs">Backers</span>
                      </div>
                      <p className="text-lg sm:text-xl font-semibold">{backers}</p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center space-x-2 text-slate-500 mb-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs">Days Left</span>
                      </div>
                      <p className="text-lg sm:text-xl font-semibold">{daysRemaining<=0?0:daysRemaining}</p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center space-x-2 text-slate-500 mb-1">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs">Target</span>
                      </div>
                      <p className="text-lg sm:text-xl font-semibold">
                        {target} <span className="text-xs text-slate-500">POL</span>
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center space-x-2 text-slate-500 mb-1">
                        <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs">Deadline</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold">{new Date(deadline).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {daysRemaining>0 && (
                    <div className="space-y-2 sm:space-y-3">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full py-2 sm:py-3 text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:text-white"
                        onClick={togglePauseResume}
                        disabled={isTransactionPending}
                      >
                        {isTransactionPending ? (
                          "Processing..."
                        ) : isPaused ? (
                          <>
                            <PauseCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                            Pause Campaign
                          </>
                        ) : (
                          <>
                            <PlayCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                            Resume Campaign
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Donators Section */}
              <Card className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <Tabs defaultValue="donators">
                    <TabsList className="w-full bg-slate-100">
                      <TabsTrigger value="donators" className="flex-1 text-xs sm:text-sm">
                        Donators
                      </TabsTrigger>
                      <TabsTrigger value="updates" className="flex-1 text-xs sm:text-sm">
                        Updates
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="donators" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                      {campaign.donators.length > 0 ? (
                        <div>
                          <div className="mt-3 sm:mt-4 md:mt-6 space-y-3 sm:space-y-4">
                            {campaign.donators.map((donator: Donator, index: number) => (
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
                                      {`${donator.donator.slice(0, 6)}...${donator.donator.slice(-4)}`}
                                    </p>
                                    <Badge
                                      variant="secondary"
                                      className="bg-blue-100 dark:bg-blue-500 text-blue-800 dark:text-white text-xs whitespace-nowrap"
                                    >
                                      {Number(donator.amount) / 1e18} pol
                                    </Badge>
                                  </div>
                                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground break-words">
                                    {donator.comment}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <Users className="h-8 w-8 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                          <h3 className="text-base sm:text-lg font-medium text-slate-900">No donators yet</h3>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1">Share to more people in order to get donators</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="updates" className="mt-3 sm:mt-4">
                      <div className="text-center py-6 sm:py-8">
                        <h3 className="text-base sm:text-lg font-medium text-slate-900">No updates yet</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">Check back later for campaign updates</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
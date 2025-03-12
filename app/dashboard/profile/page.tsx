'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Copy,
  ChevronRight,
  Wallet,
  Users,
  Coins,
  TrendingUp,
  PlusCircle,
} from "lucide-react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import ConnectWallet from "@/app/components/ConnectWallet";
import { contract } from "@/app/client";
import Link from "next/link";
import { SiPolygon } from "react-icons/si";

const MotionCard = motion(Card);

export default function ModernAnonymousCreatorProfile() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [pastCampaigns, setPastCampaigns] = useState([]);
  const [isLoadingPast, setIsLoadingPast] = useState(true);
  const account = useActiveAccount();

  // Fetch active campaigns for the current user
  const { data: activeCampaigns, isPending: isPendingActive } = useReadContract(
    {
      contract: contract,
      method:
        "function getUserOngoingCampaigns(address _user) view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive)[])",
      params: [account?.address ?? ""],
    }
  );

  // Fetch all expired campaigns
  const { data: allExpiredCampaigns, isPending: isPendingExpired } =
    useReadContract({
      contract,
      method:
        "function getExpiredCampaigns() view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive)[])",
      params: [],
      enabled: !!account?.address,
    });

  // Filter expired campaigns for current user
  useEffect(() => {
    if (allExpiredCampaigns && account?.address) {
      const userExpiredCampaigns = allExpiredCampaigns.filter(
        (campaign) =>
          campaign.owner.toLowerCase() === account.address.toLowerCase()
      );
      setPastCampaigns(userExpiredCampaigns);
      setIsLoadingPast(false);
    }
  }, [allExpiredCampaigns, account?.address]);

  const walletAddress = account?.address ?? "please log in";

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  if (account?.address == null) {
    return (
      <main className="h-[80vh] flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Connect your wallet to view your dashboard and manage your campaigns
          </p>
          <ConnectWallet />
        </Card>
      </main>
    );
  }

  // Show loading state while fetching active campaigns
  if (isPendingActive) {
    return (
      <main className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </main>
    );
  }

  // // Handle case when no active campaigns exist
  if (!activeCampaigns || activeCampaigns.length === 0) {
    return (
      <main className="h-[80vh] flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Create Your First Campaign</h1>
          <p className="text-muted-foreground">
            Start your fundraising journey by creating your first campaign
          </p>
          <Link href="/dashboard/create-campaign">
            <Button className="w-full" size="lg">
              Create Campaign
            </Button>
          </Link>
        </Card>
      </main>
    );
  }

  // Combine all donators from active campaigns

  const allDonators = activeCampaigns.flatMap((campaign) => campaign.donators);

  // Add donators from past campaigns if available
  if (pastCampaigns && pastCampaigns.length > 0) {
    pastCampaigns.forEach((campaign) => {
      if (campaign.donators && campaign.donators.length > 0) {
        allDonators.push(...campaign.donators);
      }
    });
  }

  // Calculate total amount raised
  const getTotalRaised = () => {
    let total = 0;
    allDonators.forEach((donator) => {
      total += Number(donator.amount) / 1e18;
    });
    return total.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 overflow-hidden shadow-lg"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-white/50 bg-white shadow-xl">
              <AvatarFallback className="text-2xl font-mono bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                {walletAddress.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-3 bg-white/90 rounded-full px-6 py-3 text-slate-900 shadow-lg"
              >
                <Wallet className="h-5 w-5 text-purple-600" />
                <code className="text-sm font-mono">
                  {walletAddress.slice(0, 7)}...{walletAddress.slice(-4)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={copyAddress}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </motion.div>
              {copiedAddress && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-white mt-2 bg-black/50 rounded-full px-3 py-1 inline-block"
                >
                  Address copied!
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column - Stats */}
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border-none text-slate-900 h-fit shadow-lg rounded-xl overflow-hidden"
          >
            <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 pb-8">
              <CardTitle className="text-2xl font-bold">
                Creator Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6 -mt-4">
              {[
                {
                  icon: Users,
                  label: "Campaigns",
                  value:
                    (activeCampaigns?.length || 0) +
                    (pastCampaigns?.length || 0),
                },
                {
                  icon: Users,
                  label: "Backers",
                  value: allDonators.length,
                },
                {
                  icon: SiPolygon,
                  label: "Raised",
                  value: `${getTotalRaised()} POL`,
                },
                {
                  icon: TrendingUp,
                  label: "Success Rate",
                  value:
                    pastCampaigns.length > 0
                      ? `${Math.round(
                          (pastCampaigns.filter(
                            (c) =>
                              Number(c.amountCollected) / 1e18 >=
                              Number(c.target)
                          ).length /
                            pastCampaigns.length) *
                            100
                        )}%`
                      : "N/A",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center"
                >
                  <stat.icon className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </motion.div>
              ))}
            </CardContent>
          </MotionCard>

          {/* Right Column - Campaigns */}
          <div className="md:col-span-2">
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white border-none text-slate-900 shadow-lg rounded-xl overflow-hidden"
            >
              <CardContent className="p-6">
                <Tabs defaultValue="active" className="space-y-6">
                  <TabsList className="bg-slate-100 text-slate-900 p-1 rounded-lg">
                    <TabsTrigger
                      value="active"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Active Campaigns
                    </TabsTrigger>
                    <TabsTrigger
                      value="past"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Past Campaigns
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="space-y-6">
                    {activeCampaigns
                      .filter((campaign) => campaign.isActive)
                      .map((campaign, i) => {
                        // Calculate values from data
                        const target = Number(campaign.target);
                        const raised = Number(campaign.amountCollected) / 1e18; // Convert from wei to ETH/POL
                        const backers = campaign.donators.length;
                        const progress = (raised / target) * 100;

                        return (
                          <MotionCard
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                            className="bg-white border-slate-200 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl overflow-hidden"
                          >
                            <CardHeader>
                              <CardTitle>{campaign.title}</CardTitle>
                              <CardDescription className="text-slate-500">
                                {raised.toFixed(2)} POL raised of {target} POL
                                goal
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Progress
                                value={progress > 100 ? 100 : progress}
                                className="h-2 bg-slate-100"
                              />
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-slate-500">
                                  {backers} backers
                                </p>
                                <p className="text-sm text-slate-500">
                                  {new Date(
                                    Number(campaign.deadline) * 1000
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Link
                                href={`/campaign/${campaign.title
                                  .replace(/\s+/g, "-")
                                  .toLowerCase()}`}
                                className="w-full"
                              >
                                <Link href={`campaign-details/${campaign.id}`}>
                                  <Button
                                    variant="outline"
                                    className="w-full bg-white border-slate-200 text-slate-900 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300"
                                  >
                                    View Campaign
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </Link>
                              </Link>
                            </CardFooter>
                          </MotionCard>
                        );
                      })}
                    {activeCampaigns.filter((campaign) => campaign.isActive)
                      .length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-slate-500">
                          No active campaigns found.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-6">
                    {isLoadingPast ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <>
                        {pastCampaigns.map((campaign, i) => {
                          // Calculate values from data
                          const target = Number(campaign.target);
                          const raised =
                            Number(campaign.amountCollected) / 1e18;
                          const backers = campaign.donators.length;
                          const progress = (raised / target) * 100;
                          const isSuccessful = raised >= target;

                          return (
                            <MotionCard
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.5 + i * 0.1,
                              }}
                              className="bg-white border-slate-200 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl overflow-hidden"
                            >
                              <CardHeader>
                                <div className="flex justify-between items-center">
                                  <CardTitle>{campaign.title}</CardTitle>
                                  {isSuccessful && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                      Goal Reached
                                    </span>
                                  )}
                                </div>
                                <CardDescription className="text-slate-500">
                                  {raised.toFixed(1)} POL raised of {target} POL
                                  goal
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Progress
                                  value={progress > 100 ? 100 : progress}
                                  className={`h-2 ${
                                    isSuccessful
                                      ? "bg-green-100"
                                      : "bg-slate-100"
                                  }`}
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <p className="text-sm text-slate-500">
                                    {backers} backers
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    Ended:{" "}
                                    {new Date(
                                      Number(campaign.deadline) * 1000
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Link
                                  href={`/campaign/${campaign.title
                                    .replace(/\s+/g, "-")
                                    .toLowerCase()}`}
                                  className="w-full"
                                >
                                  <Button
                                    variant="outline"
                                    className="w-full bg-white border-slate-200 text-slate-900 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300"
                                  >
                                    View Results
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </Link>
                              </CardFooter>
                            </MotionCard>
                          );
                        })}
                        {pastCampaigns.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-slate-500">
                              No past campaigns found.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </MotionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
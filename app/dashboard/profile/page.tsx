'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Copy, ChevronRight, Wallet, Users, Coins, TrendingUp } from 'lucide-react'

const MotionCard = motion(Card)

export default function ModernAnonymousCreatorProfile() {
  const [copiedAddress, setCopiedAddress] = useState(false)
  const walletAddress = '0x1234...5678'

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  text-slate-900 p-4 md:p-8">
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
                <code className="text-sm font-mono">{walletAddress}</code>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={copyAddress}>
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
              <CardTitle className="text-2xl font-bold">Creator Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6 -mt-4">
              {[
                { icon: Users, label: "Campaigns", value: "12" },
                { icon: Users, label: "Backers", value: "1.2K" },
                { icon: Coins, label: "Raised", value: "345 ETH" },
                { icon: TrendingUp, label: "Success", value: "98%" },
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
                    <TabsTrigger value="active" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Active Campaigns</TabsTrigger>
                    <TabsTrigger value="past" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Past Campaigns</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="space-y-6">
                    {[
                      { title: "Campaign #1", goal: 100, raised: 75, backers: 450 },
                      { title: "Campaign #2", goal: 200, raised: 150, backers: 800 },
                      { title: "Campaign #3", goal: 150, raised: 50, backers: 300 },
                    ].map((campaign, i) => (
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
                            {campaign.raised} ETH raised of {campaign.goal} ETH goal
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2 bg-slate-100" />
                          <p className="text-sm mt-2 text-slate-500">{campaign.backers} backers</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full bg-white border-slate-200 text-slate-900 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300">
                            View Campaign
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardFooter>
                      </MotionCard>
                    ))}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-6">
                    {[
                      { title: "Campaign #4", goal: 50, raised: 65, backers: 300 },
                      { title: "Campaign #5", goal: 300, raised: 320, backers: 1500 },
                    ].map((campaign, i) => (
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
                            {campaign.raised} ETH raised of {campaign.goal} ETH goal
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2 bg-slate-100" />
                          <p className="text-sm mt-2 text-slate-500">{campaign.backers} backers</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full bg-white border-slate-200 text-slate-900 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300">
                            View Results
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardFooter>
                      </MotionCard>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </MotionCard>
          </div>
        </div>
      </div>
    </div>
  )
}


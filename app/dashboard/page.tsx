import { BellIcon, Share2Icon } from 'lucide-react'
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { Overview } from './components/overview'
import { Earnings } from './components/earnings'
import { TopDonators } from './components/top-donators'
import { Statistics } from './components/statistics'
import { Profile } from './components/profile'
import { MobileApp } from './components/mobile-app'
import ConnectWallet from "../components/ConnectWallet";

export default function DashboardPage() {
  return (
    <main className="">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-medium">Dashboard</h1>
          <div className="flex items-center gap-4">
            <ConnectWallet />
          </div>
        </header>

        <div className="grid grid-cols-[1fr_300px] gap-8 py-8">
          <div className="space-y-8">
            <div className="grid grid-cols-[200px_1fr] gap-8">
              <Overview />
              <Earnings />
            </div>
            <TopDonators />
            <Statistics />
          </div>
          <div className="space-y-8">
            <Profile />
            <MobileApp />
          </div>
        </div>
      </div>
    </main>
  );
}


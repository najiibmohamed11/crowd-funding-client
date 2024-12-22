import { BellIcon, Share2Icon } from 'lucide-react'
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { Overview } from './components/overview'
import { Earnings } from './components/earnings'
import { TopDonators } from './components/top-donators'
import { Statistics } from './components/statistics'
import { Profile } from './components/profile'
import { MobileApp } from './components/mobile-app'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-red-50">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto">
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-medium">Dashboard</h1>
              <div className="flex items-center gap-4">
                <BellIcon className="w-5 h-5 text-gray-600" />
                <Share2Icon className="w-5 h-5 text-gray-600" />
              </div>
            </header>

            <div className="grid grid-cols-[1fr_300px] gap-8">
              <div className="space-y-8">
                <div className="grid grid-cols-[300px_1fr] gap-8">
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
      </div>
    </div>
  )
}


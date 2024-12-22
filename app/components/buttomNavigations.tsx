'use client'

import { useState } from 'react'
import { HomeIcon as House, Search, Bell, Telescope } from 'lucide-react'

export function BottomNavigation() {
  const [activeTab, setActiveTab] = useState('home')

  const tabs = [
    { id: 'home', label: 'Home', icon: House },
    { id: 'explore', label: 'Explore', icon: Telescope },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <nav className="bg-black rounded-full shadow-lg py-2 px-3">
        <div className="relative flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors"
                style={{
                  backgroundColor: isActive ? 'white' : 'transparent',
                  color: isActive ? 'black' : 'white',
                }}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}


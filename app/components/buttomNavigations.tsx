'use client'

import { useEffect, useState } from 'react'
import { HomeIcon as House, Telescope, Heart } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function BottomNavigation() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(pathname)

  useEffect(() => {
    if (pathname === '/') {
      setActiveTab('home')
    } else if (pathname === '/liked') {
      setActiveTab('liked')
    } else {
      setActiveTab('')
    }
  }, [pathname])

  const tabs = [
    { id: 'home', href: '/', label: 'Home', icon: House },
    { id: 'explore', href: '#', label: 'Explore', icon: Telescope },
    { id: 'liked', href: '/liked', label: 'Liked', icon: Heart },
  ]

  function SearchModelTriger() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
  }

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <nav className="bg-black rounded-full shadow-lg py-2 px-3">
        <div className="relative flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            if (tab.id === 'explore') {
              return (
                <button
                  key={tab.id}
                  onClick={SearchModelTriger}
                  className="relative flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors text-white"
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              )
            }

            return (
              <Link href={tab.href} key={tab.id}>
                <div
                  className="relative flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color: isActive ? 'black' : 'white',
                  }}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

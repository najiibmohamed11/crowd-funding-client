'use client'

import { usePathname } from 'next/navigation'
import { LayoutGrid, FileText, BarChart3, Users, Settings } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

export function DashboardSidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', icon: LayoutGrid },
    { href: '/dashboard/create-campaign', icon: FileText },
    { href: '/dashboard/analytics', icon: BarChart3 }, // Changed empty href to a valid one
    { href: '/dashboard/profile', icon: Users },
    { href: '/dashboard/settings', icon: Settings }, // Changed empty href to a valid one
  ]

  return (
    <aside className="w-[80px] min-h-screen bg-transparent flex flex-col items-center py-8">
      <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center text-xl font-semibold mb-8">
        S
      </div>
      <nav className="flex flex-col gap-12 py-6">
        {links.map(({ href, icon: Icon }) => (
          <Link 
            key={href} 
            href={href}
            className={clsx(
              'w-10 h-10 flex items-center justify-center rounded-lg transition-colors',
              pathname === href ? 'bg-red-50' : 'hover:bg-gray-100'
            )}
          >
            <Icon className={clsx('w-5 h-5', pathname === href ? 'text-red-500' : 'text-gray-400')} />
          </Link>
        ))}
      </nav>
    </aside>
  )
}

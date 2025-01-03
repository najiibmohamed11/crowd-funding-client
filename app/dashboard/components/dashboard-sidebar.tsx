import { LayoutGrid, FileText, BarChart3, Users, Settings } from 'lucide-react'
import Link from 'next/link'

export function DashboardSidebar() {
  return (
    <aside className="w-[80px] min-h-screen bg-transparent flex flex-col items-center py-8 ">
      <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center text-xl font-semibold mb-8">
        S
      </div>
      <nav className="flex flex-col gap-12 py-6">
        <Link href='/dashboard'  className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50">
          <LayoutGrid className="w-5 h-5 text-red-500" />
        </Link >
        <Link href='/dashboard/create-campaign' className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <FileText className="w-5 h-5 text-gray-400" />
        </Link >
        <Link href='' className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </Link >
        <Link href='/dashboard/profile' className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <Users className="w-5 h-5 text-gray-400" />
        </Link >
        <Link href='' className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <Settings className="w-5 h-5 text-gray-400" />
        </Link >
      </nav>
    </aside>
  )
}


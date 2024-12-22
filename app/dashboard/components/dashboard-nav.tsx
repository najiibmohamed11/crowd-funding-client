import { LayoutGrid, FileText, BarChart3, Settings, Users } from 'lucide-react'

export function DashboardNav() {
  return (
    <div className="w-[80px] border-r bg-white min-h-screen p-4 flex flex-col items-center gap-8">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
        S
      </div>
      <nav className="flex flex-col items-center gap-4">
        <button className="p-3 rounded-lg bg-primary/5 text-primary">
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-lg hover:bg-gray-100">
          <FileText className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-3 rounded-lg hover:bg-gray-100">
          <BarChart3 className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-3 rounded-lg hover:bg-gray-100">
          <Users className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-3 rounded-lg hover:bg-gray-100">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </nav>
    </div>
  )
}


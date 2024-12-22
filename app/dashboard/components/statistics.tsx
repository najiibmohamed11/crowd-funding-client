import { Home, FileText, Users } from 'lucide-react'

export function Statistics() {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Your statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5" />
            <span className="text-gray-500">Total incomes</span>
          </div>
          <div className="text-2xl font-medium text-red-500">$ 46 646.86</div>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5" />
            <span className="text-gray-500">Total spend</span>
          </div>
          <div className="text-2xl font-medium text-blue-500">$ 21 453.34</div>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5" />
            <span className="text-gray-500">Total donators</span>
          </div>
          <div className="text-2xl font-medium text-purple-500">1 453</div>
        </div>
      </div>
    </div>
  )
}


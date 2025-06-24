
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="w-80 h-10 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-20 h-10 rounded-lg" />
          <Skeleton className="w-24 h-10 rounded-lg" />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Image */}
          <div className="space-y-4">
            <Skeleton className="w-full h-96 rounded-2xl" />
          </div>

          {/* Right Side - Campaign Details */}
          <div className="space-y-6">
            {/* Title */}
            <Skeleton className="w-3/4 h-8 rounded" />

            {/* Amount and Progress */}
            <div className="space-y-3">
              <Skeleton className="w-48 h-12 rounded" />
              <Skeleton className="w-full h-2 rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="w-20 h-4 rounded" />
                <Skeleton className="w-20 h-4 rounded" />
              </div>
            </div>

            {/* Donation Buttons */}
            <div className="flex gap-3">
              <Skeleton className="flex-1 h-12 rounded-lg" />
              <Skeleton className="flex-1 h-12 rounded-lg" />
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>

            {/* Backers List */}
            <div className="space-y-4">
              {/* Backer 1 */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-64 h-4 rounded" />
                    <Skeleton className="w-20 h-3 rounded" />
                  </div>
                </div>
                <Skeleton className="w-16 h-6 rounded" />
              </div>

              {/* Backer 2 */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-64 h-4 rounded" />
                    <Skeleton className="w-24 h-3 rounded" />
                  </div>
                </div>
                <Skeleton className="w-20 h-6 rounded" />
              </div>

              {/* Show More Button */}
              <div className="flex justify-center pt-4">
                <Skeleton className="w-32 h-10 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

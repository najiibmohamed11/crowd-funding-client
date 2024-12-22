export function Overview() {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Overview</h2>
        <div className="space-y-4">
          <div className="bg-[#7C5CFC] rounded-2xl p-6 text-white">
            <p className="text-lg mb-4">Last donation</p>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold">$16</span>
              <img
                src="/placeholder.svg"
                alt="Donation hand"
                className="w-16 h-16 rounded-lg"
              />
            </div>
          </div>
          <div className="bg-[#4318FF] rounded-2xl p-6 text-white">
            <p className="text-lg mb-4">New donators</p>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold">+23</span>
              <img
                src="/placeholder.svg"
                alt="New donator"
                className="w-16 h-16 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  
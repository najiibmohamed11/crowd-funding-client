export function Profile() {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-xl font-medium mb-6">Your profile</h2>
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/placeholder.svg"
            alt="Jessica Wilkinson"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="font-medium">Jessica Wilkinson</div>
            <div className="text-gray-500">Digital Artist</div>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-4">Your collection status</h3>
          <div className="relative h-2 bg-gray-100 rounded-full mb-4">
            <div
              className="absolute top-0 left-0 h-full bg-red-400 rounded-full"
              style={{ width: "60%" }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Current status:</span>
              <span className="text-red-500">$ 46 646.86</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">You need:</span>
              <span>$ 100 000.00</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  
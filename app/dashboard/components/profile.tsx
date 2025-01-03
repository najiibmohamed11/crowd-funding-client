'use client'
import Web3Avatar from "@/app/components/web3Avatar"
import { useActiveAccount } from "thirdweb/react"

export function Profile() {
  const account=useActiveAccount()
    return (
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-xl font-medium mb-6">Your profile</h2>
        <div className="flex items-center gap-3 mb-8">
        <Web3Avatar address={account?.address}/>
          <div>
            <div className="font-medium">{account?.address.slice(0,6)}....{account?.address.slice(-4)}</div>
            <div className="text-gray-500">creator</div>
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
  
  
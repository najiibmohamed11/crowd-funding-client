import Web3Avatar from '@/app/components/web3Avatar';
import { Mail, Gift, Heart, X, MoreHorizontal } from 'lucide-react'
import { SiPolygon } from 'react-icons/si';
export function TopDonators({ donators }) {
  const top3Donators=donators.sort((a,b)=>(Number(b.amount) / 1e18)-(Number(a.amount) / 1e18)).slice(0,3)

  return (
    <div className="rounded-2xl p-6">
      <h2 className="text-xl font-medium mb-6">Top 3 Donators</h2>
      <div className="space-y-6">
        {top3Donators.map((donator,index) => {
          const date = new Date(donator.date).toLocaleDateString('en-GB'); // Format as DD/MM/YYYY

          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
              <Web3Avatar address={donator.donator} /> {/* Use Web3Avatar for the avatar */}
                <div>
                  <div className="font-medium flex items-center gap-1">
                    {donator.donator.slice(0, 6)}...{donator.donator.slice(-4)}
                  </div>
                  <div className="text-gray-500 flex items-center gap-1">
                    <SiPolygon/> {Number(donator.amount) / 1e18}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-gray-500">{date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

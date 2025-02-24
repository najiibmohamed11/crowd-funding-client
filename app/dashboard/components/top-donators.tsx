import { Mail, Gift, Heart, X, MoreHorizontal } from 'lucide-react'

const donators = [
  {
    name: "Adam Smith",
    amount: "2 453.43",
    date: "08.05.2020",
    crown: true,
  },
  {
    name: "Joshua Jackson",
    amount: "2 248.53",
    date: "07.05.2020",
  },
  {
    name: "Elizabeth Windsor",
    amount: "2 047.09",
    date: "06.09.2019",
  },
  {
    name: "Jennifer Aniston",
    amount: "1 999.23",
    date: "01.11.2020",
  },
]

export function TopDonators() {
  return (
    <div className=" rounded-2xl p-6">
      <h2 className="text-xl font-medium mb-6">Top 10 donators</h2>
      <div className="space-y-6">
        {donators.map((donator) => (
          <div key={donator.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/placeholder.svg"
                alt={donator.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium flex items-center gap-1">
                  {donator.name} {donator.crown && "👑"}
                </div>
                <div className="text-gray-500">$ {donator.amount}</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-gray-500">{donator.date}</span>
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Gift className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


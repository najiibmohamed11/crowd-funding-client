"use client"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TopDonators } from "./top-donators"

export function Earnings({campaignData}) {

  const AllCampaignsDontaors=campaignData.flatMap((campaign)=>campaign.donators);
  console.log(AllCampaignsDontaors);
  const getLastSevenDaysData = () => {
    if (!AllCampaignsDontaors) return []
    
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    const dailyDonations = new Array(7).fill(0).map((_, index) => {
      const date = new Date(now.getTime() - index * 24 * 60 * 60 * 1000)
      return {
        date: days[date.getDay()],
        fullDate: date.toISOString().split('T')[0],
        value: 0
      }
    }).reverse()

    AllCampaignsDontaors.forEach(donation => {
      const donationDate = new Date(donation.date)
      if (donationDate >= sevenDaysAgo) {
        const dateStr = donationDate.toISOString().split('T')[0]
        const dayData = dailyDonations.find(d => d.fullDate === dateStr)
        if (dayData) {
          dayData.value += Number(donation.amount) / 1e18
        }
      }
    })

    return dailyDonations
  }

  const chartData = getLastSevenDaysData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Earnings</h2>
      </div>
        <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
  <LineChart 
    data={chartData} 
  >
    <XAxis
      dataKey="date"
      axisLine={false}
      tickLine={false}
      tick={{ fill: "#888" }}
      padding={{ left: 15, }} // Adds padding to the X-axis
    />
    <YAxis
      axisLine={false}
      tickLine={false}
      tick={{ fill: "#888" }}
      padding={{bottom:20 }} // Adds padding to the X-axis
    />
    <Line
      type="monotone"
      dataKey="value"
      stroke="#FF6B6B"
      strokeWidth={5}
      dot={false}
    />
  </LineChart>
</ResponsiveContainer>

        </div>
  <TopDonators donators={AllCampaignsDontaors} />
    
    </div>
  )
}
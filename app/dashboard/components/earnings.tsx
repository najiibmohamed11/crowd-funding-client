"use client"

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", value: 200 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 250 },
  { name: "Thu", value: 180 },
  { name: "Fri", value: 300 },
  { name: "Sat", value: 350 },
  { name: "Sun", value: 400 },
]

export function Earnings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Earnings</h2>
        <div className="flex gap-4 text-sm">
          <button className="font-medium">WEEK</button>
          <button className="text-gray-500">MONTH</button>
          <button className="text-gray-500">YEAR</button>
        </div>
      </div>
      <div className=" rounded-2xl p-6">
        {/* <div className="mb-4">
          <div className="text-2xl font-medium">$ 233</div>
          <div className="text-sm text-gray-500">12.03.20</div>
        </div> */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888" }}
                domain={[100, 500]}
                ticks={[100, 200, 300, 400, 500]}
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
      </div>
    </div>
  )
}


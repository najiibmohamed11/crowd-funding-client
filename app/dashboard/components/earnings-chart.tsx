'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', value: 200 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 250 },
  { name: 'Thu', value: 280 },
  { name: 'Fri', value: 220 },
  { name: 'Sat', value: 300 },
  { name: 'Sun', value: 350 },
]

export function EarningsChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-normal">Earnings</CardTitle>
        <Tabs defaultValue="week">
          <TabsList className="grid w-full grid-cols-3 lg:w-[200px]">
            <TabsTrigger value="week">WEEK</TabsTrigger>
            <TabsTrigger value="month">MONTH</TabsTrigger>
            <TabsTrigger value="year">YEAR</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ff6b6b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


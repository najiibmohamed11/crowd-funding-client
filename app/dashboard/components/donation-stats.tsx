import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function DonationStats() {
  return (
    <>
      <Card className="bg-primary">
        <CardContent className="p-6">
          <div className="text-primary-foreground">
            <p className="text-sm opacity-80">Last donation</p>
            <div className="flex items-end justify-between mt-2">
              <div className="text-4xl font-bold">$16</div>
              <Image
                src="/placeholder.svg"
                alt="Donation hand"
                width={60}
                height={60}
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-600">
        <CardContent className="p-6">
          <div className="text-white">
            <p className="text-sm opacity-80">New donators</p>
            <div className="flex items-end justify-between mt-2">
              <div className="text-4xl font-bold">+23</div>
              <Image
                src="/placeholder.svg"
                alt="New donators"
                width={60}
                height={60}
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}


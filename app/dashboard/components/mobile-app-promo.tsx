import { Button } from "@/components/ui/button"
import Image from "next/image"

export function MobileAppPromo() {
  return (
    <div className="bg-[#ff6b6b] rounded-lg p-6 text-white relative overflow-hidden">
      <div className="max-w-[160px]">
        <h3 className="font-semibold text-xl mb-4">Do you have our mobile app?</h3>
        <Button variant="secondary" className="bg-white text-black hover:bg-gray-100">
          Download
        </Button>
      </div>
      <div className="absolute bottom-0 right-0">
        <Image
          src="/placeholder.svg"
          alt="Mobile app"
          width={150}
          height={150}
          className="object-contain"
        />
      </div>
    </div>
  )
}


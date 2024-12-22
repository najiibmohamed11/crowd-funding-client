'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
interface Donator {
  amount: bigint;
  comment: string;
  donator: string;
}

interface DonatorsModalProps {
  isOpen: boolean
  onClose: () => void
  donators: Donator[]
}


export function DonatorsModal({ isOpen, onClose, donators }: DonatorsModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-none shadow-xl dark:shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600">
            All Donators
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {donators.map((donator, index) => (
              <div
                key={index}
                className="flex items-start gap-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0"
              >
                <Avatar>
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${donator.name}`}
                  />
                  <AvatarFallback>
                    {donator.donator}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-gray-300">{donator.donator}</p>
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-500 text-blue-800 dark:text-white">
                      {donator.amount} ETH
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{donator.comment}</p>
          
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}


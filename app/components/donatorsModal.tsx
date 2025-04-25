"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Web3Avatar from "./web3Avatar";

interface Donator {
  donator: string;
  amount: bigint;
  comment: string;
  date: string;
}

interface DonatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  donators: readonly Donator[];
}

const DonatorsModal: React.FC<DonatorsModalProps> = ({
  isOpen,
  onClose,
  donators,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>All Backers</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {donators.map((donator, index) => (
            <div
              key={index}
              className="flex items-start gap-4 border-b last:border-b-0 pb-4 last:pb-0"
            >
              <Avatar>
                <Web3Avatar address={donator.donator} size="md" />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {donator.donator}
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-500 text-blue-800 dark:text-white"
                  >
                    {Number(donator.amount) / 1e18} MATIC
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {donator.comment}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(donator.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonatorsModal;

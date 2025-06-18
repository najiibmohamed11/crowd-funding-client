'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { getContract, prepareContractCall } from "thirdweb"
import { contract } from "../client"
import { polygonAmoy } from "thirdweb/chains"
import { useSendTransaction } from "thirdweb/react"
import { useParams } from 'next/navigation'
import { parseEther } from "ethers"
import { SiPolygon } from 'react-icons/si'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from 'next/image'
import { donation } from '../server/actions'

interface EvcDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonate: (amount: string, comment: string) => void;
}

export function EvcDonationModal({
  isOpen,
  onClose,
  onDonate,
}: EvcDonationModalProps) {
  const [evcAmount, setEvcAmount] = useState("");
  const [maticAmount, setMaticAmount] = useState("");
  const [comment, setComment] = useState("");
  const [maticPrice, setMaticPrice] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    mutate: sendTransaction,
    failureReason,
    isSuccess,
    isPending,
  } = useSendTransaction();
  const params = useParams();
  const id = BigInt(params.id as string);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd"
    )
      .then((response) => response.json())
      .then((data) => setMaticPrice(data["matic-network"].usd))
      .catch((error) => {
        console.error("Error fetching MATIC price:", error);
        setMaticPrice(0.286);
      });
  }, []);

  const now = new Date().toString();

  useEffect(() => {
    if (evcAmount && maticPrice) {
      const maticValue = parseFloat(evcAmount) / maticPrice;
      setMaticAmount(maticValue.toString());
    } else {
      setMaticAmount("");
    }
  }, [evcAmount, maticPrice]);

  const validateInput = () => {
    if (!evcAmount || isNaN(parseFloat(evcAmount))) {
      setError("Please enter a valid EVC amount");
      return false;
    }
    if (parseFloat(evcAmount) <= 0) {
      setError("Donation amount must be greater than 0");
      return false;
    }
    setError(null);
    return true;
  };

  const handleDonate = async() => {
    if (!validateInput()) return;

    try {
      setIsLoading(true);
      setError(null);
      const currentDate = new Date().toLocaleDateString();
      const amountInWei = parseEther(evcAmount).toString();
      
      const data = await donation(
        id,
        "0x1F8574A00d7eF5354735aE1D212E54A9538A04bD",
        amountInWei,
        comment,
        currentDate,
        "su1"
      );

      if (data.success) {
        setSuccess(true);
        onDonate(evcAmount, comment);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setEvcAmount("");
          setComment("");
          setError(null);
        }, 2000);
      } else {
        setError(data.error || "Failed to process donation");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to prepare transaction. Please try again.";
      setError(errorMessage);
      console.error("Transaction preparation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const parseErrorMessage = (error: any) => {
    if (!error) return null;

    const errorMessage = error.message || error.toString();

    if (errorMessage.includes("insufficient funds")) {
      return "Insufficient funds in your wallet. Please add more EVC to your wallet to complete this donation.";
    }

    if (errorMessage.includes("user rejected")) {
      return "Transaction was rejected. Please try again.";
    }

    if (errorMessage.includes("connect wallet")) {
      return "Please connect your wallet to make a donation.";
    }

    if (errorMessage.includes("execution reverted")) {
      return "Transaction failed. Please check your wallet balance and try again.";
    }

    return "An error occurred. Please try again.";
  };

  useEffect(() => {
    if (failureReason) {
      const userFriendlyError = parseErrorMessage(failureReason);
      setError(userFriendlyError);
    }
  }, [failureReason]);

  useEffect(() => {
    if (isSuccess) {
      setSuccess(true);
      onDonate(evcAmount, comment);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEvcAmount("");
        setComment("");
        setError(null);
      }, 2000);
    }
  }, [isSuccess, onClose, evcAmount, comment, onDonate]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] min-w-[425px] bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-none shadow-xl dark:shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            Back this project
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Support the project with EVC
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4 w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="break-words">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 w-full bg-green-50 dark:bg-green-900/20">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your donation has been sent successfully.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 py-4">
          <div className="relative">
            <Input
              id="evcAmount"
              value={evcAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setEvcAmount(value);
                }
              }}
              placeholder="0.00"
              className="pl-12 pr-20 py-6 text-2xl font-bold bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Image src="/evc.svg" alt="EVC" width={24} height={24} />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-xl font-semibold text-gray-400 dark:text-gray-500">
                EVC
              </span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right text-lg font-medium text-gray-600 dark:text-gray-400"
          >
            ≈ {maticAmount} MATIC
          </motion.div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between items-center">
              <span>Gas Fee:</span>
              <span>≈ {(parseFloat(evcAmount || "0") * 0.05).toFixed(2)} EVC</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Campaign Creator Receives:</span>
              <span>≈ {(parseFloat(evcAmount || "0") * 0.95).toFixed(2)} EVC</span>
            </div>
          </div>
          <Textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none h-24"
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleDonate}
            className="w-full py-6 text-lg font-bold text-white transition-all duration-300 ease-in-out transform hover:scale-105"
            disabled={isLoading || !evcAmount}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Donate with EVC"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
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
import { SiPolygon } from 'react-icons/si' // Using SiPolygon from react-icons
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonate: (amount: string, comment: string) => void;
}

export function DonationModal({
  isOpen,
  onClose,
  onDonate,
}: DonationModalProps) {
  const [maticAmount, setMaticAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
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
    if (maticAmount && maticPrice) {
      const usd = parseFloat(maticAmount) * maticPrice;
      setUsdAmount(usd.toString());
    } else {
      setUsdAmount("");
    }
  }, [maticAmount, maticPrice]);

  const validateInput = () => {
    if (!maticAmount || isNaN(parseFloat(maticAmount))) {
      setError("Please enter a valid MATIC amount");
      return false;
    }
    if (parseFloat(maticAmount) <= 0) {
      setError("Donation amount must be greater than 0");
      return false;
    }
    setError(null);
    return true;
  };

  const handleDonate = async () => {
    if (!validateInput()) return;

    try {
      const transaction = prepareContractCall({
        contract,
        method:
          "function donate(uint256 _campaignId, string _comment, string _date) payable",
        params: [id, comment, now],
        value: parseEther(maticAmount.toString()),
      });
        sendTransaction(transaction);

    } catch (err) {
      setError("Failed to prepare transaction. Please try again.");
      console.error("Transaction preparation error:", err);
    }
  };

  const parseErrorMessage = (error: any) => {
    if (!error) return null;

    const errorMessage = error.message || error.toString();

    if (errorMessage.includes("insufficient funds")) {
      return "Insufficient funds in your wallet. Please add more MATIC to your wallet to complete this donation.";
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
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setMaticAmount("");
        setComment("");
        setError(null);
      }, 2000);
    }
  }, [isSuccess, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] min-w-[425px] bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-none shadow-xl dark:shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            Back this project
          </DialogTitle>
          
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
              id="maticAmount"
              value={maticAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setMaticAmount(value);
                }
              }}
              placeholder="0.00"
              className="pl-12 pr-20 py-6 text-2xl font-bold bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isPending}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SiPolygon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-xl font-semibold text-gray-400 dark:text-gray-500">
                MATIC
              </span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right text-lg font-medium text-gray-600 dark:text-gray-400"
          >
            ≈ ${usdAmount} USD
          </motion.div>
          <Textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none h-24"
            disabled={isPending}
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleDonate}
            className="w-full py-6 text-lg font-bold text-white transition-all duration-300 ease-in-out transform hover:scale-105"
            disabled={isPending || !maticAmount}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Donate with Polygon"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
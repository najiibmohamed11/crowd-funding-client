'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { EclipseIcon as Ethereum } from 'lucide-react'
import { getContract, prepareContractCall } from "thirdweb"
import { client } from "../client"
import { polygonAmoy } from "thirdweb/chains"
import { useSendTransaction } from "thirdweb/react"
import { useParams } from 'next/navigation'
import {  parseEther } from "ethers"; // Import ethers for handling ETH values
import { FaEthereum } from 'react-icons/fa'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  onDonate: (amount: string, comment: string) => void
}

const contract = getContract({
  client,
  address: "0xF0925dCe1A9FDC060ff8b9abD9fb8eE8E7D4765c",
  chain: polygonAmoy,
});
export function DonationModal({ isOpen, onClose, onDonate }: DonationModalProps) {
  const [ethAmount, setEthAmount] = useState('')
  const [usdAmount, setUsdAmount] = useState('')
  const [comment, setComment] = useState('')
  const [ethPrice, setEthPrice] = useState(0)
  const {mutate:sendTransaction,failureReason,error,isError,isPending}=useSendTransaction()
  const params=useParams()
  const id =BigInt(params.id as string );
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then(response => response.json())
      .then(data => setEthPrice(data.ethereum.usd))
  }, [])
  const now = new Date().toString()
  
  if(error){
    console.log('feiler reson',failureReason)
    console.log('error',error)
  }
  useEffect(() => {
    if (ethAmount && ethPrice) {
      const usd = parseFloat(ethAmount) * ethPrice
      setUsdAmount(usd.toFixed(2))
    } else {
      setUsdAmount('')
    }
  }, [ethAmount, ethPrice])

  const handleDonate = () => {
    // onDonate(ethAmount, comment)
    // onClose()

    const transaction = prepareContractCall({
      contract,
      method:
        "function donate(uint256 _id, string _comment, string _date) payable",
      params: [id, comment, now],
      value: parseEther(ethAmount.toString()),
    });
    sendTransaction(transaction);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-none shadow-xl dark:shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold  ">
            Back this project
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Support the Powered Kits Learning Boxes project with Ethereum.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="relative">
            <Input
              id="ethAmount"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              placeholder="0.00"
              className="pl-12 pr-20 py-6 text-2xl font-bold bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaEthereum className="h-6 w-6 " />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-xl font-semibold text-gray-400 dark:text-gray-500">ETH</span>
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
          />
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleDonate} 
            className="w-full py-6 text-lg font-bold text-white  transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isPending?"sending":"Donate with polygon"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


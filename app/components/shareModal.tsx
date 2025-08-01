'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react'
import { useState } from "react"
import toast from "react-hot-toast"
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { TfiLinkedin } from "react-icons/tfi";

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  campaignUrl: string
}

export function ShareModal({ isOpen, onClose, campaignUrl }: ShareModalProps) {
  const [isCopied, setIsCopied] = useState(false)

  const shareUrl = encodeURIComponent(campaignUrl)
  const shareTitle = encodeURIComponent("Check out this  fundraising campaign!")

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')
  }

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`, '_blank')
  }

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`, '_blank')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(campaignUrl)
      .then(() => {
        setIsCopied(true)
        toast.success("Link copied to clipboard!")
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch((err) => console.error('Failed to copy: ', err))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-none shadow-xl dark:shadow-2xl rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600">
            Share Campaign
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Social Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={shareFacebook}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg transition duration-300"
            >
          
              <FaFacebookF  className="mr-2 h-5 w-5"/>

              Facebook
            </Button>
            <Button
              onClick={shareTwitter}
              className="flex-1 bg-black  hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-300"
            >
              <FaXTwitter className="mr-2 h-5 w-5"  />

              Twitter
            </Button>
            <Button
              onClick={shareLinkedIn}
              className="flex-1 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-semibold rounded-lg transition duration-300"
            >
              <TfiLinkedin className="mr-2 h-5 w-5" />
              LinkedIn
            </Button>
          </div>

          {/* Copy Link Section */}
          <div className="flex items-center space-x-2">
            <Input
              value={campaignUrl}
              readOnly
              className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-white font-semibold rounded-lg transition duration-300"
            >
              {isCopied ? <Check className="h-5 w-5 text-green-500" /> : <Link2 className="h-5 w-5" />}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
